/**
 * 点云渲染器 —— 逐条复刻 Qt PointCloudViewerWidget 契约（见 spec/viewer.md）：
 * - 点云用 GL_POINTS；CAD 用完整三角网格与光照，不转换成顶点采样
 * - trackball 相机（arcball 四元数左乘、中/右键平移、滚轮 0.9/1.1 缩放）
 * - 取景：center = 质心（均值），distance = span×1.5
 * - 调色板 objectColor(i%7)；选中形状 depthTest=false 最后绘制
 * - 上限 85 万点抽稀到约 75 万
 */
import * as THREE from "three";

export const PALETTE = [
  "#e85d5d", "#5e6ad2", "#29a9a0", "#b05ac8", "#db8e2f", "#35a66f", "#74859b",
] as const;

const COLORS = {
  bg: 0xf7f7f8,          // 画布背景 #F7F7F8
  base: 0x56606e,        // 原始视图整云
  detectBg: 0xb2b8c2,    // 检测视图底云
  remaining: 0x808996,   // 剩余点
};

const SIZE = { bg: 2, base: 3, shape: 3, highlighted: 4, remaining: 2 };

const VERT = /* glsl */ `
  uniform float uPointSize;
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = uPointSize;
  }
`;

const FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform float uBrightness;
  uniform float uAlpha;
  void main() {
    vec2 d = gl_PointCoord - 0.5;
    float r2 = dot(d, d);
    if (r2 > 0.25) discard;
    float alpha = 1.0 - smoothstep(0.08, 0.25, r2);
    vec3 col = pow(clamp(uColor * uBrightness, 0.0, 1.0), vec3(0.88));
    gl_FragColor = vec4(col, alpha * uAlpha);
  }
`;

interface Cloud {
  points: THREE.Points;
  material: THREE.ShaderMaterial;
}

interface CadMesh {
  mesh: THREE.Mesh<THREE.BufferGeometry, THREE.MeshStandardMaterial>;
  edges: THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial> | null;
}

// EdgesGeometry 需要按坐标建立邻接表，只对适量网格生成轮廓。
const MAX_CAD_EDGE_FACES = 75000;

/** 原始 sRGB 分量（0-1），不做色彩空间转换 —— shader 逐行复刻 Qt GLSL，直接输出 */
function raw(hex: number): THREE.Color {
  const c = new THREE.Color();
  c.setRGB(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);
  return c;
}

function hexOf(style: string): number {
  return parseInt(style.slice(1), 16);
}

function makeMaterial(color: number, size: number, alpha: number, brightness = 1.0): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: raw(color) },
      uPointSize: { value: size },
      uBrightness: { value: brightness },
      uAlpha: { value: alpha },
    },
    vertexShader: VERT,
    fragmentShader: FRAG,
    transparent: true,
    depthWrite: true,
    depthTest: true,
  });
}

/** >85 万点时按步长抽稀到约 75 万（复刻 viewer 上传逻辑） */
function decimate(src: Float32Array): Float32Array {
  const n = src.length / 3;
  if (n <= 850000) return src;
  const step = Math.max(1, Math.floor(n / 750000));
  const out = new Float32Array(Math.ceil(n / step) * 3);
  let j = 0;
  for (let i = 0; i < n; i += step) {
    out[j++] = src[i * 3];
    out[j++] = src[i * 3 + 1];
    out[j++] = src[i * 3 + 2];
  }
  return out.subarray(0, j);
}

function makeCloud(data: Float32Array, material: THREE.ShaderMaterial, renderOrder: number): Cloud {
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(data, 3));
  geometry.computeBoundingSphere();
  const points = new THREE.Points(geometry, material);
  points.renderOrder = renderOrder;
  points.frustumCulled = false;
  return { points, material };
}

export class CloudViewer {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private base: Cloud | null = null;
  private bg: Cloud | null = null;
  private shapes: Cloud[] = [];
  private remaining: Cloud | null = null;
  private visible: boolean[] = [];
  private baseData: Float32Array | null = null;
  private baseSceneId = 0;
  private cad: CadMesh | null = null;
  private cadWireframe = false;

  private center = new THREE.Vector3();
  private span = 1;
  private distance = 1.5;
  private q = new THREE.Quaternion();
  private highlight = -1;
  private solo = false;

  private raf = 0;
  private ro: ResizeObserver;
  private dragging: 0 | 1 | 2 = 0; // 1=左键旋转 2=中/右键平移
  private lastX = 0;
  private lastY = 0;
  private el: HTMLElement;
  private disposed = false;

  constructor(container: HTMLElement) {
    this.el = container;
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setClearColor(COLORS.bg, 1);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(this.renderer.domElement);
    Object.assign(this.renderer.domElement.style, { width: "100%", height: "100%", display: "block" });

    this.camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
    this.scene.background = new THREE.Color(COLORS.bg);
    const ambient = new THREE.HemisphereLight(0xffffff, 0x64727f, 1.2);
    ambient.position.set(0, 0, 1);
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(-3, -4, 7);
    const fill = new THREE.DirectionalLight(0xffffff, 0.6);
    fill.position.set(4, 1, 3);
    this.scene.add(ambient, key, fill);

    const dom = this.renderer.domElement;
    dom.addEventListener("contextmenu", (e) => e.preventDefault());
    dom.addEventListener("pointerdown", this.onDown);
    window.addEventListener("pointermove", this.onMove);
    window.addEventListener("pointerup", this.onUp);
    dom.addEventListener("wheel", this.onWheel, { passive: false });

    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(container);
    this.resize();

    const loop = () => {
      if (this.disposed) return;
      this.raf = requestAnimationFrame(loop);
      this.render();
    };
    loop();
  }

  /* ---------------- 渲染 ---------------- */

  private render() {
    this.camera.position.copy(new THREE.Vector3(0, 0, this.distance).applyQuaternion(this.q).add(this.center));
    this.camera.up.copy(new THREE.Vector3(0, 1, 0).applyQuaternion(this.q));
    this.camera.lookAt(this.center);
    this.renderer.render(this.scene, this.camera);
  }

  private resize() {
    const w = this.el.clientWidth || 1;
    const h = this.el.clientHeight || 1;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.raf);
    this.ro.disconnect();
    window.removeEventListener("pointermove", this.onMove);
    window.removeEventListener("pointerup", this.onUp);
    this.clear();
    this.renderer.dispose();
    this.renderer.domElement.remove();
  }

  /* ---------------- 取景与相机 ---------------- */

  /** center=质心（均值）、span=采样包围盒最大边（≤5000 采样）、distance=span*1.5 */
  private frame(data: Float32Array) {
    const n = data.length / 3;
    if (n === 0) return;
    let cx = 0, cy = 0, cz = 0;
    for (let i = 0; i < n; i++) {
      cx += data[i * 3]; cy += data[i * 3 + 1]; cz += data[i * 3 + 2];
    }
    cx /= n; cy /= n; cz /= n;
    const stride = Math.max(1, Math.floor(n / 5000));
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0; i < n; i += stride) {
      const x = data[i * 3], y = data[i * 3 + 1], z = data[i * 3 + 2];
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
    }
    this.center.set(cx, cy, cz);
    this.span = Math.max(maxX - minX, maxY - minY, maxZ - minZ, 1e-4);
    this.distance = this.span * 1.5;
    this.camera.near = this.span * 0.001;
    this.camera.far = this.span * 20;
    this.camera.updateProjectionMatrix();
  }

  fitToCloud() {
    if (this.cad) {
      this.setZUpView();
      this.frameCad(this.cad.mesh.geometry.boundingBox!);
    } else if (this.baseData && this.baseData.length) {
      this.frame(this.baseData);
    } else {
      this.distance = this.span * 1.5;
    }
  }

  /** 完整包围盒按当前画布比例取景；仅打开新 CAD 或手动全景时执行。 */
  private frameCad(bounds: THREE.Box3) {
    bounds.getCenter(this.center);
    const size = bounds.getSize(new THREE.Vector3());
    this.span = Math.max(size.x, size.y, size.z, 1e-4);
    const tanV = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const tanH = tanV * this.camera.aspect;
    const inverse = this.q.clone().invert();
    const corner = new THREE.Vector3();
    let distance = 0;
    for (let i = 0; i < 8; i++) {
      corner.set(
        i & 1 ? bounds.max.x : bounds.min.x,
        i & 2 ? bounds.max.y : bounds.min.y,
        i & 4 ? bounds.max.z : bounds.min.z,
      ).sub(this.center).applyQuaternion(inverse);
      distance = Math.max(distance, corner.z + Math.abs(corner.x) / tanH, corner.z + Math.abs(corner.y) / tanV);
    }
    this.distance = Math.max(distance + this.span * 0.12, this.span * 0.25);
    this.camera.near = this.span * 0.001;
    this.camera.far = Math.max(this.span * 40, this.distance + this.span * 5);
    this.camera.updateProjectionMatrix();
  }

  /** Z-up 等距视角：Z 轴对准 (-4,-6,4) 方向（QQuaternion::fromDirection 语义） */
  setZUpView() {
    const dir = new THREE.Vector3(-4, -6, 4).normalize();
    const zBasis = dir.clone();
    const upHint = new THREE.Vector3(0, 0, 1);
    const xBasis = upHint.cross(zBasis).normalize();
    const yBasis = zBasis.clone().cross(xBasis);
    const m = new THREE.Matrix4().makeBasis(xBasis, yBasis, zBasis);
    this.q.setFromRotationMatrix(m);
  }

  /* ---------------- 视图状态机（复刻公有接口） ---------------- */

  /** 原始视图：整云单色。sceneId 由调用方传入（点云数据变更时才递增） */
  setPointCloud(data: Float32Array, sceneId: number) {
    this.clear();
    this.baseData = data;
    this.baseSceneId = sceneId;
    this.frame(data);
    this.base = makeCloud(decimate(data), makeMaterial(COLORS.base, SIZE.base, 1.0), 1);
    this.scene.add(this.base.points);
  }

  /** f32 XYZ 非索引三角形；保持全部面及文件坐标、单位。构建失败不清旧场景。 */
  setCadMesh(data: Float32Array, sceneId: number) {
    if (!data.length || data.length % 9 !== 0 || data.length > 9000000) {
      throw new Error("CAD 网格为空、三角形数据不完整或超过 100 万个面");
    }
    for (const value of data) {
      if (!Number.isFinite(value)) throw new Error("CAD 网格包含无效坐标");
    }
    const geometry = new THREE.BufferGeometry();
    let material: THREE.MeshStandardMaterial | null = null;
    let edges: CadMesh["edges"] = null;
    try {
      geometry.setAttribute("position", new THREE.BufferAttribute(data, 3));
      geometry.computeVertexNormals();
      geometry.computeBoundingBox();
      geometry.computeBoundingSphere();
      material = new THREE.MeshStandardMaterial({
        color: 0x429866,
        roughness: 0.72,
        metalness: 0.05,
        side: THREE.DoubleSide,
        flatShading: true,
        wireframe: this.cadWireframe,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      });
      if (data.length / 9 <= MAX_CAD_EDGE_FACES) {
        const edgeGeometry = new THREE.EdgesGeometry(geometry, 25);
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x2b6345, transparent: true, opacity: 0.6 });
        edges = new THREE.LineSegments(edgeGeometry, edgeMaterial);
        edges.visible = !this.cadWireframe;
      }
      const mesh = new THREE.Mesh(geometry, material);
      const newScene = !this.cad || sceneId !== this.baseSceneId;
      this.clear();
      this.cad = { mesh, edges };
      this.baseSceneId = sceneId;
      this.scene.add(mesh);
      if (edges) this.scene.add(edges);
      if (newScene) {
        this.setZUpView();
        this.frameCad(geometry.boundingBox!);
      }
    } catch (error) {
      geometry.dispose();
      material?.dispose();
      edges?.geometry.dispose();
      edges?.material.dispose();
      throw error;
    }
  }

  setCadWireframe(enabled: boolean) {
    this.cadWireframe = enabled;
    if (!this.cad) return;
    this.cad.mesh.material.wireframe = enabled;
    if (this.cad.edges) this.cad.edges.visible = !enabled;
  }

  /**
   * 检测/AI 视图：底云淡显 + 形状内点按调色板着色。
   * sceneId 仅决定"是否重建底云并重新取景"（新场景）；
   * 形状集与 remaining 每次调用都全量重建（对齐 Qt showDetectionResults）。
   */
  showDetectionResults(shapeClouds: Float32Array[], remaining: Float32Array | null, baseCloud: Float32Array, sceneId: number) {
    this.killCad();
    const newScene = sceneId !== this.baseSceneId;
    // 原始视图 base 一律弃用（回到原始视图走 setPointCloud 重建）
    this.killBase();
    if (newScene) {
      this.baseData = baseCloud;
      this.frame(baseCloud);
      const bg = makeCloud(decimate(baseCloud), makeMaterial(COLORS.detectBg, SIZE.bg, 0.45), 0);
      bg.material.depthWrite = false;
      this.bg = bg;
      this.scene.add(bg.points);
    }
    // 形状集全量重建
    for (const s of this.shapes) this.killCloud(s);
    this.shapes = [];
    this.visible = [];
    if (this.remaining) {
      this.killCloud(this.remaining);
      this.remaining = null;
    }
    for (const c of shapeClouds) {
      const idx = this.shapes.length;
      const cloud = makeCloud(decimate(c), makeMaterial(hexOf(PALETTE[idx % 7]), SIZE.shape, 0.94), 2 + idx);
      this.shapes.push(cloud);
      this.visible.push(true);
      this.scene.add(cloud.points);
    }
    if (remaining && remaining.length) {
      this.remaining = makeCloud(
        decimate(remaining),
        makeMaterial(COLORS.remaining, SIZE.remaining, 0.85, 0.88),
        1000,
      );
      this.scene.add(this.remaining.points);
    }
    this.baseSceneId = sceneId;
    this.highlight = -1;
    this.solo = false;
    this.applySelection();
  }

  private killBase() {
    if (this.base) {
      this.killCloud(this.base);
      this.base = null;
    }
    if (this.bg) {
      this.killCloud(this.bg);
      this.bg = null;
    }
  }

  private killCloud(c: Cloud) {
    this.scene.remove(c.points);
    c.points.geometry.dispose();
    c.material.dispose();
  }

  private killCad() {
    if (!this.cad) return;
    this.scene.remove(this.cad.mesh);
    this.cad.mesh.geometry.dispose();
    this.cad.mesh.material.dispose();
    if (this.cad.edges) {
      this.scene.remove(this.cad.edges);
      this.cad.edges.geometry.dispose();
      this.cad.edges.material.dispose();
    }
    this.cad = null;
  }

  setShapeVisible(i: number, v: boolean) {
    if (i < 0 || i >= this.shapes.length) return;
    this.visible[i] = v;
    this.shapes[i].points.visible = v;
    const visCount = this.visible.filter(Boolean).length;
    if (visCount === 1) {
      this.solo = true;
      this.highlight = this.visible.indexOf(true);
      this.applySelection();
    }
  }

  setRemainingVisible(v: boolean) {
    if (this.remaining) this.remaining.points.visible = v;
  }

  setHighlightIndex(i: number) {
    this.highlight = i >= 0 && i < this.shapes.length ? i : -1;
    this.applySelection();
  }

  showAllShapes() {
    for (let i = 0; i < this.shapes.length; i++) {
      this.visible[i] = true;
      this.shapes[i].points.visible = true;
    }
    this.setRemainingVisible(true);
    this.highlight = -1;
    this.solo = false;
    this.applySelection();
  }

  highlightIndex() {
    return this.highlight;
  }

  /** 选中态的透明度/点大小/深度测试（复刻 paintGL 绘制规则） */
  private applySelection() {
    const hasSel = this.highlight >= 0;
    if (this.bg) this.bg.material.uniforms.uAlpha.value = hasSel ? 0.18 : 0.45;
    for (let i = 0; i < this.shapes.length; i++) {
      const m = this.shapes[i].material;
      const selected = i === this.highlight;
      m.uniforms.uAlpha.value = selected ? 1.0 : hasSel ? 0.18 : 0.94;
      m.uniforms.uPointSize.value = selected ? SIZE.highlighted : SIZE.shape;
      m.depthTest = !selected;
      // 绘制顺序（spec §4）：底云 → 形状（选中最后）→ remaining 最后
      this.shapes[i].points.renderOrder = selected ? 900 : 2 + i;
    }
  }

  clear() {
    this.killCad();
    this.killBase();
    for (const s of this.shapes) this.killCloud(s);
    if (this.remaining) this.killCloud(this.remaining);
    this.base = null;
    this.bg = null;
    this.shapes = [];
    this.visible = [];
    this.remaining = null;
    this.baseData = null;
    this.highlight = -1;
    this.solo = false;
  }

  /** 场景 id（供调用方判断"同一场景"） */
  get sceneId() {
    return this.baseSceneId;
  }

  /* ---------------- 交互：arcball trackball ---------------- */

  private onDown = (e: PointerEvent) => {
    this.dragging = e.button === 0 ? 1 : 2;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  };

  private onMove = (e: PointerEvent) => {
    if (!this.dragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    const prevX = this.lastX;
    const prevY = this.lastY;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    if (this.dragging === 1) {
      // arcball：屏幕坐标 → 球面，四元数左乘（屏幕空间旋转）
      const rect = this.renderer.domElement.getBoundingClientRect();
      const v1 = this.ballPoint((e.clientX - rect.left) / rect.width, (e.clientY - rect.top) / rect.height);
      const v0 = this.ballPoint((prevX - rect.left) / rect.width, (prevY - rect.top) / rect.height);
      const dot = v0.dot(v1);
      if (dot < 0.9999) {
        const axis = new THREE.Vector3().crossVectors(v0, v1).normalize();
        const dq = new THREE.Quaternion().setFromAxisAngle(axis, Math.acos(Math.min(1, Math.max(-1, dot))));
        this.q.premultiply(dq);
      }
    } else {
      // 平移：世界单位/像素 = span/width*2；center += q*(s*dx, -s*dy, 0)
      const s = (this.span / (this.el.clientWidth || 1)) * 2;
      const pan = new THREE.Vector3(s * dx, -s * dy, 0).applyQuaternion(this.q);
      this.center.add(pan);
    }
  };

  private ballPoint(nx: number, ny: number): THREE.Vector3 {
    const x = Math.min(1, Math.max(-1, 2 * nx - 1));
    const y = Math.min(1, Math.max(-1, 1 - 2 * ny));
    const z2 = Math.max(0, 1 - x * x - y * y);
    const v = new THREE.Vector3(x, y, Math.sqrt(z2));
    return v.normalize();
  }

  private onUp = () => {
    this.dragging = 0;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.distance *= e.deltaY > 0 ? 0.9 : 1.1;
    this.distance = Math.min(this.span * 30, Math.max(this.span * 0.1, this.distance));
  };
}
