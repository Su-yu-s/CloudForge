// 云铸面板 · three.js 视口（点云场景 + CAD 场景）
//
// three r180 由 hackathon/tools/viewer/three 搬入 client/vendor/：
//   · AGH 的 import map 只放行 8 个裸标识符（react/antd/@agnes/*），裸 'three' 解析不了
//   · 资产快照只收集**以 '.' 开头**的相对引用（daemon/src/packages/client-modules.ts:780 硬过滤）
//   · CSP 无 'wasm-unsafe-eval'、/plugins 只服务 .js/.mjs/.css/.map → 不用 Draco/Basis/glTF
//
// 视觉与交互契约逐条对齐 src/viewer.ts（Qt PointCloudViewerWidget 的浏览器复刻）：
//   底云 0x56606e / 检测底云 0xb2b8c2 / remaining 0x808996
//   形状色 PALETTE[i%7]；选中 alpha1.0+size4+depthTest=false+renderOrder900，未选 alpha0.18
//   绘制顺序 底云0 → 形状2+i → remaining1000
//   取景 center=质心、span=最大边、distance=span*1.5、near=span*0.001、far=span*20
//   缩放夹取 [span*0.1, span*30]，每格 ×0.9/×1.1
//   降采样 >850,000 点抽稀到 ~750,000（196k 场景用不到，保险）
//   数据是 Z-up（PLY/PCD 保留原采集坐标系 centered=false），故 camera.up = (0,0,1)

import * as THREE from './vendor/three.module.js'
import { OrbitControls } from './vendor/addons/controls/OrbitControls.js'

export const PALETTE = ['#e85d5d', '#5e6ad2', '#29a9a0', '#b05ac8', '#db8e2f', '#35a66f', '#74859b']
const COLORS = { bg: 0xfbfbfc, base: 0x56606e, detectBg: 0xb2b8c2, remaining: 0x808996, overlay: 0x7c3aed, mesh: 0x16a34a }
const SIZE = { base: 3, shape: 3, highlighted: 4, remaining: 2 }
const DECIMATE_AT = 850000
const DECIMATE_TO = 750000

let dotTexture = null
function getDotTexture() {
  if (dotTexture) return dotTexture
  const c = document.createElement('canvas')
  c.width = c.height = 32
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(16, 16, 1, 16, 16, 15)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.45, 'rgba(255,255,255,0.95)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 32, 32)
  dotTexture = new THREE.CanvasTexture(c)
  return dotTexture
}

function decimate(positions, count) {
  if (count <= DECIMATE_AT) return positions
  const step = Math.floor(count / DECIMATE_TO)
  const n = Math.floor(count / step)
  const out = new Float32Array(n * 3)
  for (let i = 0; i < n; i++) {
    const s = (i * step) * 3
    out[i * 3] = positions[s]
    out[i * 3 + 1] = positions[s + 1]
    out[i * 3 + 2] = positions[s + 2]
  }
  return out
}

/** 视口公用骨架：renderer / scene / camera(Z-up) / controls / ResizeObserver / 渲染循环 */
function createStage(container, { onPick } = {}) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, preserveDrawingBuffer: false })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(COLORS.bg, 1)
  container.appendChild(renderer.domElement)
  // 用 class 而不是 inline style：宿主 CSP 的 style-src 不含 'unsafe-inline'，
  // style 属性会被拦（web-server/src/server.ts:291/611）
  renderer.domElement.classList.add('cf-canvas')

  const scene = new THREE.Scene()
  // Lambert 之类的材质需要光；点云用 PointsMaterial 不受影响，但共用一个场景
  scene.add(new THREE.AmbientLight(0xffffff, 1.35))
  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(1.2, -1.6, 1.4)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xffffff, 0.55)
  fill.position.set(-1.4, 1.1, -0.8)
  scene.add(fill)
  const camera = new THREE.PerspectiveCamera(50, 1, 0.01, 100)
  camera.up.set(0, 0, 1) // 数据是 Z-up
  camera.position.set(3, -4, 2.6)

  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.12
  controls.rotateSpeed = 0.9

  const state = { disposed: false, visible: true, width: 0, height: 0 }
  const resize = () => {
    const w = container.clientWidth
    const hgt = container.clientHeight
    if (!w || !hgt) return false // 面板折叠/隐藏时跳过，避免把 canvas 撑成 0
    state.width = w
    state.height = hgt
    camera.aspect = w / hgt
    camera.updateProjectionMatrix()
    renderer.setSize(w, hgt, false)
    return true
  }
  const ro = new ResizeObserver(resize)
  ro.observe(container)
  resize()

  const loop = () => {
    if (state.disposed) return
    if (state.visible) {
      controls.update()
      renderer.render(scene, camera)
    }
    renderer.setAnimationLoop(loop)
  }
  renderer.setAnimationLoop(loop)

  let bounds = null
  // 取景用的点采样（Float32Array，xyz 三元组）。装的是**真实点**而不是包围盒：
  // 房间扫描是「壳」不是实心体，包围盒的投影轮廓远大于实际点云，按盒子取景会
  // 只填满视口三分之一。mesh 视口没有点云，传 null 即退化为按包围盒取景。
  let boundsPoints = null
  const setBounds = (b, pts) => {
    bounds = b
    boundsPoints = pts ?? null
  }
  const fit = (b) => {
    const bb = b ?? bounds
    if (!bb) return
    const box = new THREE.Box3(
      new THREE.Vector3(bb.min[0], bb.min[1], bb.min[2]),
      new THREE.Vector3(bb.max[0], bb.max[1], bb.max[2]),
    )
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const span = Math.max(size.x, size.y, size.z, 1e-3)

    // 固定的 3/4 观察方向（左上前方）。Z-up，所以 y 分量取负＝从上方看下来。
    const dir = new THREE.Vector3(-0.58, -0.52, 0.63).normalize()

    // 原来这里用启发式常数 span*1.48 放置相机，**不考虑视口宽高比**：
    // 面板是「宽而矮」的停靠列，纵向 fov 富余、横向吃紧，结果模型缩成中间一小团、
    // 四周大片空白。这里改成把包围盒 8 个角投到 NDC，反解出正好装下的距离——
    // 宽高比、fov、模型朝向全都自动纳入。迭代 6 次足够收敛（每步按当前占幅比例缩放）。
    const corners = []
    for (const x of [box.min.x, box.max.x])
      for (const y of [box.min.y, box.max.y])
        for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z))

    const FILL = 0.86 // 占半幅的比例，留 ~14% 呼吸空间
    let dist = span * 2
    const v = new THREE.Vector3()
    for (let iter = 0; iter < 8; iter++) {
      camera.position.copy(center).addScaledVector(dir, dist)
      // ⚠ 必须先 lookAt 再投影：project() 走 camera.matrixWorld，而矩阵是由
      // position + **quaternion** 构成的。只挪 position 而不设朝向，相机仍是默认的
      // 「沿 -Z 俯视」，模型却被摆在斜侧方 → 每轮都算出偏大的距离，
      // 几轮放大后相机退到极远，画面上就是「视口全白」。
      // （原先的启发式版本没这个问题，是因为紧接着的 controls.update() 会顺带 lookAt。）
      camera.lookAt(center)
      // 近裁剪面保持足够近，滚轮放大后仍能看到点云；远端覆盖允许的缩放范围。
      camera.near = span * 0.001
      camera.far = Math.max(span * 40, dist + span * 3)
      camera.updateMatrixWorld(true)
      camera.updateProjectionMatrix()
      // 角点轮廓：包围盒在斜视下的投影，作为无点云时的兜底（mesh 视口走这条）
      let mc = 0
      for (const c of corners) {
        v.copy(c).project(camera)
        if (!Number.isFinite(v.x) || !Number.isFinite(v.y)) continue
        mc = Math.max(mc, Math.abs(v.x), Math.abs(v.y))
      }
      // 真实点云轮廓：优先用它。包围盒的 8 个角对「壳状」点云（房间扫描）
      // 会明显外扩，只按角点取景会让模型只占视口三分之一。
      // 25 万点全投影太贵，按步长抽 ~2 万点足够代表轮廓。
      let mp = 0
      if (boundsPoints && boundsPoints.length >= 9) {
        const total = Math.floor(boundsPoints.length / 3)
        const stride = Math.max(1, Math.ceil(total / 20000))
        for (let i = 0; i < total; i += stride) {
          const j = i * 3
          v.set(boundsPoints[j], boundsPoints[j + 1], boundsPoints[j + 2]).project(camera)
          if (!Number.isFinite(v.x) || !Number.isFinite(v.y)) continue
          const ax = Math.abs(v.x)
          const ay = Math.abs(v.y)
          if (ax > mp) mp = ax
          if (ay > mp) mp = ay
        }
      }
      // 有真实点就以它为准（角点溢出是预期的，壳状物体本就不填满盒子）；
      // 否则退回角点。
      const m = mp > 0 ? mp : mc
      if (!(m > 0)) break
      const next = Math.min(span * 20, Math.max(span * 0.2, dist * (m / FILL)))
      if (Math.abs(next - dist) / dist < 0.004) { dist = next; break }
      dist = next
    }
    camera.position.copy(center).addScaledVector(dir, dist)
    camera.lookAt(center)

    controls.target.copy(center)
    controls.minDistance = span * 0.05
    controls.maxDistance = span * 30
    camera.updateProjectionMatrix()
    controls.update()
  }

  /** 相机对准某个包围盒（明确要求聚焦形状时调用） */
  const focus = (box) => {
    if (!box) return
    const size = new THREE.Vector3(box.max[0] - box.min[0], box.max[1] - box.min[1], box.max[2] - box.min[2])
    const center = new THREE.Vector3(
      (box.min[0] + box.max[0]) / 2,
      (box.min[1] + box.max[1]) / 2,
      (box.min[2] + box.max[2]) / 2,
    )
    const span = Math.max(size.x, size.y, size.z, 1e-3)
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target).normalize()
    if (dir.lengthSq() < 1e-6) dir.set(-0.5, -1, 0.45).normalize()
    const dist = span * 2.6
    camera.position.copy(center).addScaledVector(dir, dist)
    controls.target.copy(center)
    controls.minDistance = span * 0.05
    controls.maxDistance = span * 30
    camera.updateProjectionMatrix()
    controls.update()
  }

  /** 沿给定法向做正视（验证页点"墙面 A"看平面度用） */
  const faceNormal = (n, at, span) => {
    const center = new THREE.Vector3(...at)
    const dir = new THREE.Vector3(...n).normalize().multiplyScalar(-1)
    camera.position.copy(center).addScaledVector(dir, (span ?? 1) * 2.2)
    controls.target.copy(center)
    controls.update()
  }

  if (onPick) {
    const ray = new THREE.Raycaster()
    const ndc = new THREE.Vector2()
    const canvas = renderer.domElement
    let pickGesture = null
    const moved = (ev, gesture) => (ev.clientX - gesture.x) ** 2 + (ev.clientY - gesture.y) ** 2 > 25
    canvas.addEventListener('pointerdown', (ev) => {
      // OrbitControls 的拖拽结束也可能产生 click，只允许单指/左键的短点击拾取。
      pickGesture = ev.isPrimary && ev.button === 0 && ev.buttons === 1
        ? { pointerId: ev.pointerId, x: ev.clientX, y: ev.clientY, dragged: false, ended: false }
        : null
    })
    canvas.addEventListener('pointermove', (ev) => {
      if (pickGesture?.pointerId !== ev.pointerId || pickGesture.ended) return
      if (moved(ev, pickGesture) || ev.buttons !== 1) pickGesture.dragged = true
    })
    canvas.addEventListener('pointerup', (ev) => {
      if (pickGesture?.pointerId !== ev.pointerId) return
      pickGesture.dragged ||= moved(ev, pickGesture) || ev.button !== 0
      pickGesture.ended = true
    })
    canvas.addEventListener('pointercancel', () => { pickGesture = null })
    canvas.addEventListener('wheel', () => { pickGesture = null }, { passive: true })
    renderer.domElement.addEventListener('click', (ev) => {
      const gesture = pickGesture
      pickGesture = null
      if (!gesture?.ended || gesture.dragged || ev.button !== 0 || !state.visible || !state.width) return
      const r = renderer.domElement.getBoundingClientRect()
      ndc.x = ((ev.clientX - r.left) / r.width) * 2 - 1
      ndc.y = -((ev.clientY - r.top) / r.height) * 2 + 1
      ray.setFromCamera(ndc, camera)
      onPick(ray, ev)
    })
  }

  const dispose = () => {
    state.disposed = true
    renderer.setAnimationLoop(null)
    ro.disconnect()
    controls.dispose()
    renderer.dispose()
    if (renderer.domElement.parentNode === container) container.removeChild(renderer.domElement)
  }

  return {
    renderer, scene, camera, controls,
    resize, fit, focus, faceNormal, setBounds, dispose,
    set visible(v) {
      state.visible = v
    },
    get visible() {
      return state.visible
    },
    get size() {
      return { w: state.width, h: state.height }
    },
  }
}

function pointsMaterial({ color, size, opacity, depthTest = true }) {
  return new THREE.PointsMaterial({
    // ⚠ color 必须显式传进去。之前它被解构出来却没写进构造参数，于是所有点材质
    // 都是 three 的默认白色——43 个基元的调色板从来没生效过，整个点云是一片惨白，
    // 「按基元着色」这个核心信息在视口里是缺失的。
    color: new THREE.Color(color),
    size,
    sizeAttenuation: false,
    map: getDotTexture(),
    alphaTest: 0.04,
    transparent: true,
    opacity,
    depthTest,
    depthWrite: depthTest,
    vertexColors: false,
  })
}

function toPoints(positions, material, renderOrder) {
  // 防御：BufferAttribute(array, 3) 要求长度能被 3 整除，否则 three 的 count 变成小数，
  // 越界读到 undefined 会让 computeBoundingSphere 报 NaN 半径
  const whole = Math.floor(positions.length / 3) * 3
  const src = whole === positions.length ? positions : positions.subarray(0, whole)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(decimate(src, src.length / 3), 3))
  const p = new THREE.Points(geo, material)
  p.renderOrder = renderOrder
  p.frustumCulled = false
  return p
}

// ---------------------------------------------------------------- 点云视口

export function createCloudViewer(container, { onPickShape } = {}) {
  const stage = createStage(container, { onPick: onPickShape ? (ray, ev) => onPickShape(ray, ev, api) : null })

  const group = new THREE.Group()
  stage.scene.add(group)

  let basePoints = null
  let remainingPoints = null
  const shapes = [] // { id, points, material, prim }
  const overlayGroup = new THREE.Group()
  group.add(overlayGroup)
  const unitGeo = {
    box: new THREE.BoxGeometry(1, 1, 1),
    cylinder: new THREE.CylinderGeometry(0.5, 0.5, 1, 32, 1, true),
    sphere: new THREE.SphereGeometry(0.5, 24, 16),
  }

  let mode = 'detect'
  let highlighted = null
  // 几何叠加默认**关闭**。43 个面片每个 0.06 透明度，累积覆盖
  // 1-(0.94^43) ≈ 93%——一屏紫色糊状色块把点云本体完全盖住。
  // 点云才是主体，叠加是"按需"的信息层，需要时点工具条上的「几何叠加」打开。
  let overlayOn = false

  const api = {
    stage,
    setBounds(b, pts) {
      stage.setBounds(b, pts)
    },
    fit() {
      stage.fit()
    },
    setBase(positions, bbox) {
      if (basePoints) {
        group.remove(basePoints)
        basePoints.geometry.dispose()
      }
      basePoints = toPoints(positions, pointsMaterial({ color: COLORS.base, size: SIZE.base, opacity: 1 }), 0)
      group.add(basePoints)
      // 把点云本体交给 fit() 做取景依据（不复制，直接引用同一个缓冲）
      stage.setBounds(bbox, positions)
      api.applyMode()
    },
    setRemaining(positions) {
      if (remainingPoints) {
        group.remove(remainingPoints)
        remainingPoints.geometry.dispose()
      }
      if (!positions || positions.length === 0) {
        remainingPoints = null
      } else {
        remainingPoints = toPoints(positions, pointsMaterial({ color: COLORS.remaining, size: SIZE.remaining, opacity: 0.9 }), 1000)
        group.add(remainingPoints)
      }
      api.applyMode()
    },
    /** 入参 [{ prim, positions }]；prim 由 geometry.js 构造 */
    setShapes(list) {
      for (const s of shapes) {
        group.remove(s.points)
        s.points.geometry.dispose()
        s.material.dispose()
      }
      shapes.length = 0
      for (const { prim, positions } of list ?? []) {
        if (!positions || positions.length === 0) continue
        const material = pointsMaterial({
          color: new THREE.Color(PALETTE[prim.id % PALETTE.length]).getHex(),
          size: SIZE.shape,
          opacity: 1,
        })
        const points = toPoints(positions, material, 2 + prim.id)
        group.add(points)
        shapes.push({ id: prim.id, points, material, prim })
      }
      api.buildOverlay(list ?? [])
      api.applyMode()
    },
    setMode(m) {
      mode = m
      api.applyMode()
    },
    setOverlayVisible(v) {
      overlayOn = v
      overlayGroup.visible = v
    },
    get mode() {
      return mode
    },
    highlight(id) {
      highlighted = id
      api.applyMode()
    },
    get highlighted() {
      return highlighted
    },
    applyMode() {
      const showBase = mode !== 'inliers' && mode !== 'remaining'
      if (basePoints) {
        basePoints.visible = showBase
        // 检测模式底云压暗成"背景层"，但要还能看清轮廓，否则叠加网格会盖住整片点云
        basePoints.material.opacity = mode === 'detect' ? 0.45 : 1
      }
      if (remainingPoints) remainingPoints.visible = mode === 'remaining' || mode === 'detect'
      const showShapes = mode !== 'raw' && mode !== 'remaining'
      for (const s of shapes) {
        s.points.visible = showShapes
        if (!showShapes) continue
        if (highlighted === null) {
          s.material.opacity = 1
          s.material.size = SIZE.shape
          s.material.depthTest = true
          s.points.renderOrder = 2 + s.id
        } else if (highlighted === s.id) {
          s.material.opacity = 1
          s.material.size = SIZE.highlighted
          s.material.depthTest = false
          s.points.renderOrder = 900
        } else {
          s.material.opacity = 0.18
          s.material.size = SIZE.shape
          s.material.depthTest = true
          s.points.renderOrder = 2 + s.id
        }
      }
      // 叠加网格：未选中时极淡（只提示结构），选中时才把该基元显出来。
      // ⚠ 两个分支都必须写 visible：原来只有 `if (overlayOn)` 一个分支，
      // 于是「关闭叠加」时这段被整段跳过，网格保持着构造时的 visible=true ——
      // 按钮显示已关闭，43 个紫色面片却还挂在画面上。
      for (const m of overlayGroup.children) {
        if (!overlayOn) {
          m.visible = false
          continue
        }
        const id = m.userData.shapeId
        const active = highlighted !== null && id === highlighted
        m.visible = highlighted === null ? m.userData.unit !== 'frustum' : active
        m.material.opacity = active ? 0.34 : m.userData.unit === 'bbox' ? 0.05 : 0.06
        m.renderOrder = active ? 950 : 500 + id
      }
    },
    /** 几何网格叠加：把 coefficients 变成半透明实体，直接看见"检测找到了什么" */
    buildOverlay(list) {
      while (overlayGroup.children.length) {
        const c = overlayGroup.children.pop()
        c.geometry?.dispose?.()
        c.material?.dispose?.()
      }
      for (const { prim } of list ?? []) {
        const geo = prim.unit === 'frustum' ? new THREE.CylinderGeometry(prim.radii[1], prim.radii[0], 1, 32, 1, true) : unitGeo[prim.unit]
        if (!geo) continue
        const mesh = new THREE.Mesh(
          geo,
          new THREE.MeshBasicMaterial({
            color: COLORS.overlay,
            transparent: true,
            opacity: prim.unit === 'bbox' ? 0.06 : 0.14,
            side: THREE.DoubleSide,
            depthWrite: false,
          }),
        )
        mesh.position.fromArray(prim.position)
        mesh.quaternion.fromArray(prim.quaternion)
        mesh.scale.fromArray(prim.scale)
        mesh.renderOrder = 500 + prim.id
        mesh.userData.shapeId = prim.id
        mesh.userData.unit = prim.unit
        overlayGroup.add(mesh)
      }
      overlayGroup.visible = overlayOn
    },
    focusShape(id) {
      const s = shapes.find((x) => x.id === id)
      if (!s) return
      s.points.geometry.computeBoundingBox()
      const bb = s.points.geometry.boundingBox
      stage.focus({ min: [bb.min.x, bb.min.y, bb.min.z], max: [bb.max.x, bb.max.y, bb.max.z] })
    },
    faceShape(id) {
      const s = shapes.find((x) => x.id === id)
      if (!s) return
      const c = s.prim.coefficients
      if (s.prim.type === 'Plane' && c.length >= 4) {
        const bb = s.points.geometry.boundingBox
        const span = Math.max(bb.max.x - bb.min.x, bb.max.y - bb.min.y, bb.max.z - bb.min.z)
        stage.faceNormal([c[0], c[1], c[2]], [(bb.min.x + bb.max.x) / 2, (bb.min.y + bb.max.y) / 2, (bb.min.z + bb.max.z) / 2], span)
      }
    },
    pickShapeId(ray) {
      // 叠加网格优先（更贴近用户"点形状"的直觉）
      const hits = ray.intersectObjects(overlayGroup.visible ? overlayGroup.children.filter((m) => m.visible) : [], false)
      if (hits.length) return hits[0].object.userData.shapeId ?? null
      const visibleShapes = shapes.filter((s) => s.points.visible)
      if (!visibleShapes.length) return null
      const hit = ray.intersectObjects(visibleShapes.map((s) => s.points), false)
      if (hit.length) {
        const found = hit[0].object
        return visibleShapes.find((s) => s.points === found)?.id ?? null
      }
      return null
    },
    dispose() {
      stage.dispose()
    },
  }

  api.applyMode()
  return api
}

// ---------------------------------------------------------------- CAD 视口

export function createMeshViewer(container) {
  const stage = createStage(container)
  const group = new THREE.Group()
  stage.scene.add(group)
  let mesh = null
  let wire = null
  let cloudOverlay = null
  let wireOn = false

  const clear = (obj) => {
    if (!obj) return
    group.remove(obj)
    obj.geometry?.dispose?.()
    if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose())
    else obj.material?.dispose?.()
  }

  return {
    stage,
    set visible(v) { stage.visible = v },
    get visible() { return stage.visible },
    setMesh(positions, triCount, bbox) {
      clear(mesh)
      clear(wire)
      if (!positions || triCount === 0) {
        mesh = null
        wire = null
        return
      }
      const geo = new THREE.BufferGeometry()
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      geo.computeVertexNormals()
      stage.setBounds(bbox)
      mesh = new THREE.Mesh(
        geo,
        new THREE.MeshLambertMaterial({ color: COLORS.mesh, transparent: true, opacity: 0.55, side: THREE.DoubleSide }),
      )
      mesh.renderOrder = 2
      group.add(mesh)
      // 线框只在大网格时才生成，避免小件白线糊屏
      if (triCount <= 20000) {
        wire = new THREE.LineSegments(
          new THREE.WireframeGeometry(geo),
          new THREE.LineBasicMaterial({ color: COLORS.mesh, transparent: true, opacity: 0.5 }),
        )
        wire.renderOrder = 3
        wire.visible = wireOn
        group.add(wire)
      }
    },
    setWireframe(v) {
      wireOn = v
      if (wire) wire.visible = v
    },
    /** 叠加实测点云：CAD 与点云的偏差对比是评审最直观的一屏 */
    setCloudOverlay(positions) {
      clear(cloudOverlay)
      if (!positions || positions.length === 0) {
        cloudOverlay = null
        return
      }
      cloudOverlay = toPoints(positions, pointsMaterial({ color: COLORS.base, size: 2, opacity: 0.55 }), 1)
      group.add(cloudOverlay)
    },
    fit() {
      stage.fit()
    },
    dispose() {
      stage.dispose()
    },
  }
}
