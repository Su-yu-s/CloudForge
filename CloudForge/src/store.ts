/**
 * 全局状态与工作流 —— 逐条对齐 main_window.cpp 的行为：
 * busy 状态机、控件启停矩阵、AI 三态按钮、文案原文、事件时序。
 */
import { reactive, computed } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import { open, save } from "@tauri-apps/plugin-dialog";
import { CloudViewer } from "./viewer";
import type { AiResult, DetectData } from "./types";
import { AI_PROFILES, OPEN_FILTERS, SHAPE_NAMES_EN } from "./types";

/* ---------------- localStorage 持久化（对齐 QSettings 键） ---------------- */

interface Settings {
  profile: string;
  gridSize: string; // 0.02 / 0.01
  inputUnit: string; // m / cm / mm
  upAxis: string;
  lastLoadDir: string;
  lastSaveDir: string;
  outputRoot: string;
  wslDistribution: string;
  wslRoot: string;
  venvRoot: string;
}

const DEFAULTS: Settings = {
  profile: "scannet200-instances",
  gridSize: "0.02",
  inputUnit: "m",
  upAxis: "auto",
  lastLoadDir: "",
  lastSaveDir: "",
  outputRoot: "E:/C++/Point/CloudForge/outputs",
  wslDistribution: "Ubuntu",
  wslRoot: "/mnt/e/C++/Point/CloudForge",
  venvRoot: "/opt/cloudforge-venv",
};

function loadSettings(): Settings {
  try {
    return { ...DEFAULTS, ...JSON.parse(localStorage.getItem("cloudforge/settings") ?? "{}") };
  } catch {
    return { ...DEFAULTS };
  }
}

/* ---------------- 状态 ---------------- */

export const store = reactive({
  settings: loadSettings(),

  busy: false,
  busyMessage: "",

  // 点云
  hasCloud: false,
  pointCount: 0,
  hasCad: false,
  cadTriangleCount: 0,
  cadWireframe: false,
  sourceName: "",
  sourcePath: "",
  streamDownsampled: false,
  cloudVersion: 0, // 每次主云替换 +1，供 viewer 判断"同一场景"

  // 加载进度
  loadProgress: { active: false, phase: "", percent: 0, doneMb: 0, totalMb: 0 },

  // 视图模式 0原始 1语义 2实例 3几何
  viewMode: 0,

  // AI
  aiRunning: false,
  aiHasRun: false, // 运行过一次后按钮变"重新运行"（对齐 Qt 三态）
  aiResult: null as AiResult | null,
  aiProfileName: "",
  aiProgress: { phase: "", progress: 0 },
  aiDiagnostics: [] as string[],
  lastAiOutputDir: "",

  // 精拟合档位（0=拟合平面 1=多种几何面；原版不持久化）
  fitPreset: 0,

  // 选中与精拟合
  selectedAiIndex: -1,
  refinements: {} as Record<number, DetectData>,
  measuring: false,

  // 展示
  status: "就绪 · 打开点云后选择模型运行",
  pointCountLabel: "0 个实例",
  sceneLabel: "打开点云 · 选择模型 · 运行识别",
  searchQuery: "",
  searchFocused: false,
  wasCleared: false,
});

/* ---------------- 非响应式单例 ---------------- */

let viewer: CloudViewer | null = null;
let cloudCache: Float32Array | null = null; // 当前主云（最新 cloudVersion）
let cadCache: Float32Array | null = null; // STL 全部三角面，独立于点云与 AI 数据
let logs: { time: string; level: "info" | "ok" | "warn" | "error"; text: string }[] = [];
let logVersion = 0;
const logListeners = new Set<() => void>();

export function initViewer(el: HTMLElement) {
  viewer?.dispose();
  viewer = new CloudViewer(el);
  if (store.hasCad && cadCache) {
    viewer.setCadMesh(cadCache, store.cloudVersion);
    viewer.setCadWireframe(store.cadWireframe);
  }
  if (import.meta.env.TAURI_ENV_PLATFORM === undefined && !("__TAURI_INTERNALS__" in window)) {
    return; // 纯浏览器预览：无 Tauri IPC，仅渲染外壳
  }
  if (!store.hasCad) void refreshCloud().catch(() => {});
  wireEvents();
}

export function getLogs() {
  return logs;
}
export function subscribeLogs(fn: () => void) {
  logListeners.add(fn);
  return () => logListeners.delete(fn);
}
export function getLogVersion() {
  return logVersion;
}

function log(level: "info" | "ok" | "warn" | "error", text: string) {
  const time = new Date().toLocaleTimeString("zh-CN", { hour12: false });
  logs.push({ time, level, text });
  if (logs.length > 500) logs.splice(0, logs.length - 500);
  logVersion++;
  logListeners.forEach((fn) => fn());
  // 对齐原版 logWarning/logError：同时推状态栏（消息唯一可见出口）
  if (level === "warn" || level === "error") {
    store.status = text;
  }
}

export function updateStatus(s: string) {
  store.status = s;
}

export function persistSettings() {
  localStorage.setItem("cloudforge/settings", JSON.stringify(store.settings));
}

/** 复刻 setBusy(false) 强制"就绪"，成功文案在其后再刷 */
function setBusy(busy: boolean, message = "") {
  store.busy = busy;
  store.busyMessage = message;
  if (!busy) updateStatus("就绪");
}

/* ---------------- 点云数据搬运 ---------------- */

async function refreshCloud(): Promise<Float32Array | null> {
  const version = store.cloudVersion;
  const buf = (await invoke("take_cloud")) as ArrayBuffer;
  if (version !== store.cloudVersion) return null; // 旧读请求不能覆盖后来打开的 CAD/点云缓存
  if (!buf || buf.byteLength === 0) {
    cloudCache = null;
    return null;
  }
  cloudCache = new Float32Array(buf);
  return cloudCache;
}

/** 按下标集合抽点（形状内点/实例点/剩余点着色用） */
function gather(indices: ArrayLike<number>): Float32Array {
  if (!cloudCache) return new Float32Array(0);
  const out = new Float32Array(indices.length * 3);
  for (let i = 0; i < indices.length; i++) {
    const s = indices[i] * 3;
    out[i * 3] = cloudCache[s];
    out[i * 3 + 1] = cloudCache[s + 1];
    out[i * 3 + 2] = cloudCache[s + 2];
  }
  return out;
}

export function gatherPoints(indices: ArrayLike<number>): Float32Array {
  return gather(indices);
}

export function fitToCloud() {
  viewer?.fitToCloud();
}

export function setCadWireframe(enabled: boolean) {
  if (store.busy || !store.hasCad) return;
  store.cadWireframe = enabled;
  viewer?.setCadWireframe(enabled);
}

/* ---------------- AI 实例显示形状 ---------------- */

function aiDisplayClouds(): Float32Array[] {
  const inst = store.aiResult?.instances ?? [];
  return inst.map((it) => gather(it.pointPositions));
}

/* ---------------- 工作流 ---------------- */

let dialogOpen = false; // 原生对话框挂起期间屏蔽其它动作（模拟 Qt 模态）
let pendingCloudSource: { path: string; name: string } | null = null;

/// 命令行/自动化入口：按路径直接加载（不开文件对话框）
export async function loadPointCloudFromPath(file: string): Promise<void> {
  if (store.busy) return;
  store.settings.lastLoadDir = file.replace(/[\\/][^\\/]+$/, "");
  persistSettings();
  if (/\.stl$/i.test(file)) {
    await loadCadMesh(file);
    return;
  }
  pendingCloudSource = {
    path: file,
    name: file.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, "") ?? "",
  };
  log("info", `正在加载: ${file.split(/[\\/]/).pop()}`);
  setBusy(true, "读取点云…");
  store.loadProgress = { active: true, phase: "", percent: 0, doneMb: 0, totalMb: 0 };
  try {
    await invoke("start_load", { path: file });
  } catch (e) {
    // start_load 返回 Err 时不会有 load://done 事件，必须自行复位
    pendingCloudSource = null;
    if (!store.hasCad) store.sourcePath = "";
    store.loadProgress.active = false;
    setBusy(false);
    log("error", String(e));
  }
}

async function loadCadMesh(file: string): Promise<void> {
  log("info", `正在加载 CAD 网格: ${file.split(/[\\/]/).pop()}`);
  setBusy(true, "读取 CAD 网格…");
  store.loadProgress = { active: true, phase: "STL", percent: 0, doneMb: 0, totalMb: 0 };
  let triangles: Float32Array;
  try {
    const buffer = await invoke<ArrayBuffer>("load_cad_mesh", { path: file });
    if (!(buffer instanceof ArrayBuffer) || !buffer.byteLength || buffer.byteLength % 36 !== 0) {
      throw new Error("STL 未返回完整的三角形网格");
    }
    triangles = new Float32Array(buffer);
    // Viewer 先构建新几何，再替换场景；读取/构建失败时保留原有模型与元数据。
    viewer?.setCadMesh(triangles, store.cloudVersion + 1);
  } catch (error) {
    store.loadProgress.active = false;
    setBusy(false);
    log("error", `CAD 加载失败: ${String(error)}`);
    return;
  }

  resetAnalysisState();
  store.hasCad = true;
  store.cadTriangleCount = triangles.length / 9;
  store.cadWireframe = false;
  viewer?.setCadWireframe(false);
  cadCache = triangles;
  cloudCache = null;
  store.hasCloud = false;
  store.pointCount = 0;
  store.streamDownsampled = false;
  store.sourcePath = file;
  store.sourceName = file.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, "") ?? "";
  store.wasCleared = false;
  store.cloudVersion++;
  store.aiHasRun = false;
  store.aiProgress = { phase: "", progress: 0 };
  store.aiDiagnostics = [];
  store.lastAiOutputDir = "";
  store.viewMode = 0;
  store.pointCountLabel = `${store.cadTriangleCount.toLocaleString()} 个三角面`;
  store.sceneLabel = "CAD 实体预览 · 滚轮缩放 · 左键旋转 · 右键平移";
  store.loadProgress.active = false;
  // 旧点云不能留给 AI/精拟合入口；CAD 缓存只用于预览，不作为识别输入。
  try {
    await invoke("clear_cloud");
  } catch (error) {
    log("warn", `CAD 已载入，旧点云后台清理失败: ${String(error)}`);
  }
  setBusy(false);
  updateStatus(`CAD 加载完成 · ${store.cadTriangleCount.toLocaleString()} 个三角面 · 保持文件单位与坐标`);
  log("ok", `CAD 网格加载完成: ${store.cadTriangleCount.toLocaleString()} 个三角面`);
}

export async function loadPointCloud() {
  if (store.busy || dialogOpen) return;
  dialogOpen = true;
  let file: string | null = null;
  try {
    file = await open({
      title: "加载点云或 CAD 网格",
      defaultPath: store.settings.lastLoadDir || undefined,
      filters: [
        OPEN_FILTERS,
        { name: "PCD", extensions: ["pcd"] },
        { name: "PLY", extensions: ["ply"] },
        { name: "NuScenes BIN", extensions: ["bin"] },
        { name: "TXT", extensions: ["txt"] },
        { name: "CAD STL 网格", extensions: ["stl"] },
        { name: "OBJ", extensions: ["obj"] },
        { name: "所有文件", extensions: ["*"] },
      ],
    });
  } finally {
    dialogOpen = false;
  }
  if (!file || typeof file !== "string") return;
  await loadPointCloudFromPath(file);
}

async function onLoadDone(p: { ok: boolean; count: number; streamDownsampled: boolean; sourceBytes: number; error?: string }) {
  store.loadProgress.active = false;
  if (!p.ok) {
    // 保留已有画面；点云后端已清空来源时禁用 AI，当前 CAD 的来源仍保留。
    pendingCloudSource = null;
    if (!store.hasCad) store.sourcePath = "";
    setBusy(false);
    updateStatus("加载失败");
    log("error", p.error ?? "加载失败");
    return;
  }
  await refreshCloud();
  resetAnalysisState();
  if (pendingCloudSource) {
    store.sourcePath = pendingCloudSource.path;
    store.sourceName = pendingCloudSource.name;
    pendingCloudSource = null;
  }
  store.hasCloud = true;
  clearCadState();
  store.pointCount = p.count;
  store.streamDownsampled = p.streamDownsampled;
  store.wasCleared = false;
  store.cloudVersion++;
  store.selectedAiIndex = -1;
  store.viewMode = 0;
  viewer?.setPointCloud(cloudCache ?? new Float32Array(0), store.cloudVersion);
  store.sceneLabel = "原始视图 · 请选择模型运行识别";
  store.pointCountLabel = "0 个实例";
  setBusy(false);
  log("ok", `加载完成: ${p.count} 个点`);
  if (p.streamDownsampled && p.sourceBytes > 0) {
    log("info", `大 TXT 流式加载（原文件约 ${(p.sourceBytes / 1048576).toFixed(1)} MB → 目标约 90 万点，实际 ${p.count} 点）`);
  }
}

export async function generateDemo() {
  if (store.busy || dialogOpen) return;
  log("info", "正在生成合成点云...");
  setBusy(true, "生成点云…");
  try {
    const info = (await invoke("generate_demo")) as { count: number; sourceName: string };
    resetAnalysisState();
    await refreshCloud();
    store.hasCloud = true;
    clearCadState();
    store.pointCount = info.count;
    store.sourceName = info.sourceName;
    store.sourcePath = "";
    store.wasCleared = false;
    store.cloudVersion++;
    store.selectedAiIndex = -1;
    store.viewMode = 0;
    viewer?.setPointCloud(cloudCache ?? new Float32Array(0), store.cloudVersion);
    store.sceneLabel = "原始视图 · 请选择模型运行识别";
    store.pointCountLabel = "0 个实例";
    setBusy(false);
    log("ok", `生成完成: ${info.count} 个点`);
  } catch (e) {
    setBusy(false);
    log("error", String(e));
  }
}

export async function savePointCloud() {
  if (store.busy || dialogOpen) return;
  if (!store.hasCloud) {
    log("warn", "没有可保存的点云");
    return;
  }
  const path = await save({
    title: "保存点云",
    defaultPath: store.settings.lastSaveDir ? `${store.settings.lastSaveDir}/cloud.pcd` : "cloud.pcd",
    filters: [{ name: "PCD 文件", extensions: ["pcd"] }],
  });
  if (!path) return;
  // 原版语义：后缀不是 .pcd（不区分大小写）就补上
  const p = /\.pcd$/i.test(path) ? path : path + ".pcd";
  store.settings.lastSaveDir = p.replace(/[\\/][^\\/]+$/, "");
  persistSettings();
  try {
    await invoke("save_cloud_pcd", { path: p });
    log("ok", `已保存: ${p}`);
  } catch (e) {
    log("error", `保存失败: ${e}`);
  }
}

function resetAnalysisState() {
  store.aiResult = null;
  store.aiProfileName = "";
  store.refinements = {};
  store.selectedAiIndex = -1;
  store.searchQuery = "";
}

function clearCadState() {
  store.hasCad = false;
  store.cadTriangleCount = 0;
  store.cadWireframe = false;
  cadCache = null;
}

export async function startAi() {
  if (store.aiRunning) {
    log("warn", "正在取消 CloudForge 推理…");
    await invoke("ai_cancel");
    return;
  }
  if (store.busy || !store.hasCloud) {
    log("warn", "请先加载带真实 RGB 的 PLY 或 PCD 点云");
    return;
  }
  if (!selectedProfileAcceptsSuffix()) {
    log(
      "warn",
      store.settings.profile === "nuscenes-semantic"
        ? "NuScenes 室外语义模型只接受 float32 N×5 的 .bin 点云"
        : "所选室内模型只接受带真实 RGB 的 PLY/PCD 点云",
    );
    return;
  }
  resetAnalysisState();
  viewer?.setPointCloud(cloudCache ?? new Float32Array(0), store.cloudVersion);
  store.viewMode = 0;
  store.pointCountLabel = "识别中";
  store.aiHasRun = true;
  setBusy(true, "启动 CloudForge…");
  store.aiRunning = true; // 主按钮保持可用，变为"取消 AI"
  store.aiDiagnostics = [];
  log("info", `启动 CloudForge [${currentProfile()?.label}]: ${store.sourcePath} → ${store.settings.outputRoot}`);
  try {
    await invoke("ai_start", {
      config: {
        profile: store.settings.profile,
        gridSize: Number(store.settings.gridSize),
        inputUnit: store.settings.inputUnit,
        upAxis: store.settings.upAxis,
        wslDistribution: store.settings.wslDistribution,
        wslRoot: store.settings.wslRoot,
        venvRoot: store.settings.venvRoot,
        outputRoot: store.settings.outputRoot,
      },
    });
  } catch (e) {
    store.aiRunning = false;
    setBusy(false);
    updateStatus(String(e).split("\n")[0]);
    log("error", String(e));
  }
}

function selectedProfileAcceptsSuffix(): boolean {
  const path = store.sourcePath.toLowerCase();
  if (store.settings.profile === "nuscenes-semantic") return path.endsWith(".bin");
  return path.endsWith(".ply") || path.endsWith(".pcd");
}

export function currentProfile() {
  return AI_PROFILES.find((p) => p.id === store.settings.profile) ?? AI_PROFILES[0];
}

function onAiDone(p: { ok: boolean; outputDir?: string; error?: string; result?: AiResult; profileName?: string }) {
  store.aiRunning = false;
  store.lastAiOutputDir = p.outputDir ?? store.lastAiOutputDir;
  if (!p.ok) {
    setBusy(false);
    store.pointCountLabel = "无识别结果";
    log("error", p.error ?? "AI 识别失败");
    updateStatus((p.error ?? "AI 识别失败").split("\n")[0]);
    return;
  }
  const result = p.result!;
  store.aiResult = result;
  store.aiProfileName = p.profileName ?? "";
  // 主云切换为标注云
  const version = store.cloudVersion;
  const displayedResult = store.aiResult;
  refreshCloud().then(() => {
    if (store.hasCad || store.aiResult !== displayedResult || version !== store.cloudVersion) return;
    store.cloudVersion++;
    viewer?.setZUpView();
    showAiResults();
  });
  setBusy(false);
  const noun = result.task === "instance_segmentation" ? "实例" : "语义类别";
  log("ok", `AI 识别完成: ${result.instances.length} 个${noun}，${result.validPoints} 个有效点，耗时 ${result.elapsedSeconds.toFixed(1)} 秒`);
  if (result.invalidPoints > 0) log("info", `已保留原始点索引映射；过滤无效点 ${result.invalidPoints} 个`);
  updateStatus(
    result.task === "instance_segmentation"
      ? "AI 识别完成；请选择实例后执行 RANSAC 精拟合"
      : "语义识别完成；精拟合独立对象需使用实例模型",
  );
}

function showAiResults() {
  const result = store.aiResult;
  if (!result) return;
  store.viewMode = result.task === "semantic_segmentation" ? 1 : 2;
  viewer?.showDetectionResults(aiDisplayClouds(), null, cloudCache ?? new Float32Array(0), store.cloudVersion);
  store.sceneLabel = `识别结果 · ${result.validPoints} 个有效点`;
  store.pointCountLabel =
    result.task === "semantic_segmentation"
      ? `${result.instances.length} 个语义类别`
      : `${result.instances.length} 个 AI 实例`;
}

export function setViewMode(mode: number) {
  if (store.busy || store.hasCad) return;
  const result = store.aiResult;
  if (mode === 0) {
    store.viewMode = 0;
    viewer?.setPointCloud(cloudCache ?? new Float32Array(0), store.cloudVersion);
  } else if (mode === 1 || mode === 2) {
    if (!result) return;
    store.viewMode = mode;
    showAiResults();
    viewer?.showAllShapes();
    if (store.selectedAiIndex >= 0) viewer?.setHighlightIndex(store.selectedAiIndex);
  } else if (mode === 3) {
    showSelectedGeometry();
  }
}

function showSelectedGeometry() {
  const ref = store.refinements[store.selectedAiIndex];
  if (!ref) return;
  store.viewMode = 3;
  viewer?.showDetectionResults(
    ref.shapes.map((s) => gather(s.inlierIndices)),
    gather(ref.remainingIndices),
    cloudCache ?? new Float32Array(0),
    store.cloudVersion,
  );
  store.sceneLabel = "几何视图 · 仅显示选中对象的拟合结果";
}

export function selectInstance(i: number) {
  if (store.busy) return;
  const result = store.aiResult;
  if (!result || i < 0 || i >= result.instances.length) return;
  store.selectedAiIndex = i;
  if (store.viewMode === 0 || store.viewMode === 3) {
    viewer?.showDetectionResults(aiDisplayClouds(), null, cloudCache ?? new Float32Array(0), store.cloudVersion);
    store.viewMode = result.task === "semantic_segmentation" ? 1 : 2;
  }
  viewer?.showAllShapes();
  viewer?.setHighlightIndex(i);
  store.sceneLabel = "选中对象高亮 · 其余点云淡显";
  updateStatus(
    result.task === "instance_segmentation"
      ? "已选中实例；精拟合只处理此对象内的点"
      : "已选中语义类别；该区域可能包含多个物体",
  );
}

export async function measure() {
  if (store.busy || store.hasCad) return;
  const result = store.aiResult;
  const i = store.selectedAiIndex;
  if (!result || result.task !== "instance_segmentation" || i < 0 || i >= result.instances.length) {
    log("warn", "请先运行实例模型，并在右侧选中一个 CloudForge 对象");
    return;
  }
  const instance = result.instances[i];
  if (instance.pointPositions.length < 50) {
    log("warn", "该对象少于 50 点，无法可靠拟合");
    return;
  }
  const presetIndex = store.fitPreset;
  setBusy(true, "精拟合选中对象…");
  const t0 = performance.now();
  try {
    const data = (await invoke("refine_instance", {
      indices: instance.pointPositions,
      hint: presetIndex === 0 ? 0 : -1,
      preset: presetIndex,
    })) as DetectData;
    store.refinements[i] = data;
    showSelectedGeometry();
    setBusy(false);
    const secs = ((performance.now() - t0) / 1000).toFixed(1);
    updateStatus(`选中对象精拟合完成 · ${data.shapes.length} 个几何面 · ${secs} 秒`);
    log("ok", `精拟合完成: ${data.shapes.length} 个几何面`);
  } catch (e) {
    setBusy(false);
    log("error", String(e));
  } finally {
    store.measuring = false;
  }
}

export function clearAll() {
  if (store.busy) return;
  resetAnalysisState();
  store.wasCleared = true;
  store.aiHasRun = false;
  store.fitPreset = 0;
  store.hasCloud = false;
  clearCadState();
  pendingCloudSource = null;
  store.pointCount = 0;
  store.sourceName = "";
  store.sourcePath = "";
  store.cloudVersion++;
  cloudCache = null;
  viewer?.clear();
  store.viewMode = 0;
  store.sceneLabel = "打开点云 · 选择模型 · 运行识别";
  store.pointCountLabel = "0 个对象";
  store.searchQuery = "";
  void invoke("clear_cloud");
  log("info", "已清除所有数据");
  updateStatus("就绪");
}

export async function exportResults() {
  if (store.busy || dialogOpen || store.hasCad) return;
  if (Object.keys(store.refinements).length === 0) {
    log("warn", "请先选择一个 CloudForge 实例并完成精拟合");
    return;
  }
  const result = store.aiResult;
  if (!result) return;
  dialogOpen = true;
  let path: string | null = null;
  try {
    path = await save({
      title: "导出对象与精拟合结果",
      defaultPath: store.settings.lastLoadDir ? `${store.settings.lastLoadDir}/object_measurements.json` : "object_measurements.json",
      filters: [{ name: "对象测量", extensions: ["json"] }],
    });
  } finally {
    dialogOpen = false;
  }
  if (!path) return;
  try {
    const objects = Object.entries(store.refinements).map(([idx, ref]) => {
      const inst = result.instances[Number(idx)];
      // inlierIndices 是标注云全云下标；pointPositions[k] ↔ sourceIndices[k]
      const posToSrc = new Map<number, number>();
      inst.pointPositions.forEach((p, k) => posToSrc.set(p, inst.sourceIndices[k] ?? -1));
      return {
        instance_id: inst.instanceId,
        semantic_id: inst.semanticId,
        class_name: inst.className,
        confidence: inst.confidence,
        point_count: inst.pointCount,
        geometry: ref.shapes.map((s) => {
          const sourceIndices = s.inlierIndices.map((p) => {
            const src = posToSrc.get(p);
            if (src === undefined || src < 0) throw new Error("source index map");
            return src;
          });
          return {
            type: SHAPE_EN(s.type),
            coefficients: s.coefficients,
            rmse_m: s.rmse,
            source_indices: sourceIndices,
          };
        }),
      };
    });
    const payload = {
      schema_version: 1,
      cloudforge_output: store.lastAiOutputDir,
      coordinate_frame: "CloudForge normalized Z-up",
      unit: "m",
      input_up_axis: result.selectedUpAxis,
      objects,
    };
    await invoke("write_text_file", { path, content: JSON.stringify(payload, null, 2) });
    updateStatus(`已导出对象、几何参数及原始点索引：${path}`);
    log("ok", `已导出: ${path}`);
  } catch (e) {
    log("error", "导出失败，请检查目录权限");
    void e;
  }
}

function SHAPE_EN(t: number) {
  return SHAPE_NAMES_EN[t] ?? "Unknown";
}

/** 实例显示名（Rust 侧 localizer 已生成 classNameCN） */
export function localizeName(inst: { classNameCN: string }): string {
  return inst.classNameCN;
}

/* ---------------- 控件启停矩阵（复刻 updateControlStates） ---------------- */

export const ui = computed(() => {
  const s = store;
  const idle = !s.busy;
  const hasAi = !!s.aiResult;
  const task = s.aiResult?.task ?? "";
  const hasAiSelection =
    task === "instance_segmentation" && s.selectedAiIndex >= 0 && !!s.aiResult && s.selectedAiIndex < s.aiResult.instances.length;
  const profile = currentProfile();
  const hasAiInput = s.hasCloud && !!s.sourcePath && selectedProfileAcceptsSuffix();
  const hasRefinements = Object.keys(s.refinements).length > 0;
  return {
    idle,
    hasCloud: s.hasCloud,
    hasCad: s.hasCad,
    canSave: idle && s.hasCloud,
    canMeasure: idle && !s.hasCad && hasAiSelection && !s.measuring,
    canClear: idle && (s.hasCloud || s.hasCad),
    canExport: idle && !s.hasCad && hasRefinements,
    canGenerate: idle,
    canLoad: idle,
    canSearch: idle,
    aiProfileEnabled: idle && !s.hasCad,
    aiParamsEnabled: idle && !s.hasCad && !profile.nuscenes,
    aiButtonEnabled: s.aiRunning || (idle && hasAiInput),
    aiButtonLabel: s.aiRunning ? "取消 AI" : s.aiHasRun ? "重新运行" : "运行识别",
    seg: {
      raw: idle && s.hasCloud,
      semantic: idle && task === "semantic_segmentation" && hasAi && s.aiResult!.instances.length > 0,
      instance: idle && task === "instance_segmentation" && hasAi && s.aiResult!.instances.length > 0,
      geometry: idle && hasAiSelection && s.refinements[s.selectedAiIndex] !== undefined,
    },
  };
});

/* ---------------- 事件接线 ---------------- */

let wired = false;
function wireEvents() {
  if (wired) return;
  wired = true;

  listen<{ phase: string; percent: number; doneMb: number; totalMb: number }>("load://progress", (e) => {
    store.loadProgress = { active: true, ...e.payload };
    const msg = `读取点云… ${Math.round(e.payload.percent)}% (${Math.round(e.payload.doneMb)} / ${Math.round(e.payload.totalMb)} MB) · ${e.payload.phase}`;
    store.busyMessage = msg;
    updateStatus(msg);
  });

  listen<{ ok: boolean; count: number; streamDownsampled: boolean; sourceBytes: number; error?: string }>("load://done", (e) => {
    void onLoadDone(e.payload);
  });

  listen<{ phase: string; progress: number }>("ai://progress", (e) => {
    store.aiProgress = e.payload;
    const msg = `AI 识别 · ${e.payload.phase} · ${Math.round(e.payload.progress * 100)}%`;
    store.busyMessage = msg;
    updateStatus(msg);
  });

  listen<{ line: string }>("ai://log", (e) => {
    log("info", `CloudForge: ${e.payload.line}`);
  });

  listen<{ ok: boolean; outputDir?: string; error?: string; result?: AiResult; profileName?: string }>("ai://done", (e) => {
    onAiDone(e.payload);
  });
}
