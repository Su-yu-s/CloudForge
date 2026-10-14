/** 前后端共享类型（与 src-tauri serde 序列化字段一一对应） */

export interface DetectStats {
  loadedPoints: number;
  detectPoints: number;
  inlierSum: number;
  remainingPoints: number;
  progressivePasses: number;
  refinedShapes: number;
  medianRmse: number;
  medianNoiseSigma: number;
}

export interface ShapeData {
  type: number;
  inlierCount: number;
  inlierIndices: number[];
  coefficients: number[];
  rmse: number;
  robustSigma: number;
  softScore: number;
  description: string;
}

export interface DetectData {
  shapes: ShapeData[];
  remainingIndices: number[];
  stats: DetectStats;
}

export interface AiInstance {
  instanceId: number;
  semanticId: number;
  className: string;
  /** 中文显示名（Rust localizer 生成） */
  classNameCN: string;
  confidence: number;
  pointCount: number;
  bboxMin: [number, number, number];
  bboxMax: [number, number, number];
  pointPositions: number[];
  sourceIndices: number[];
}

export interface AiResult {
  task: string;
  configPath: string;
  selectedUpAxis: string;
  inputPoints: number;
  validPoints: number;
  invalidPoints: number;
  elapsedSeconds: number;
  instances: AiInstance[];
}

/** 形状类型中文名（对齐原版 kShapeCategories） */
export const SHAPE_NAMES_CN: Record<number, string> = {
  0: "平面",
  1: "球体",
  2: "圆柱体",
  3: "圆锥体",
  4: "圆环",
  5: "三维圆",
  6: "三维椭圆",
  7: "法向平面",
  8: "正交平面",
  9: "直线",
};

export const SHAPE_NAMES_EN: Record<number, string> = {
  0: "Plane",
  1: "Sphere",
  2: "Cylinder",
  3: "Cone",
  4: "Torus",
  5: "Circle3D",
  6: "Ellipse3D",
  7: "NormalPlane",
  8: "PerpPlane",
  9: "Line",
};

export interface AiProfile {
  id: string;
  label: string;
  nuscenes: boolean;
}

export const AI_PROFILES: AiProfile[] = [
  { id: "scannet200-instances", label: "ScanNet200 · 室内实例", nuscenes: false },
  { id: "scannet-instances", label: "ScanNet · 室内实例", nuscenes: false },
  { id: "scannet-semantic", label: "ScanNet · 室内语义", nuscenes: false },
  { id: "structured3d-semantic", label: "Structured3D · 室内语义", nuscenes: false },
  { id: "nuscenes-semantic", label: "NuScenes · 室外语义", nuscenes: true },
];

export const OPEN_FILTERS = {
  extensions: ["pcd", "ply", "txt", "stl", "obj", "bin"],
  name: "点云 / CAD STL 网格",
};
