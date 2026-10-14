<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { store, ui, selectInstance, measure, localizeName } from "../store";
import { SHAPE_NAMES_CN, type AiInstance } from "../types";
import { PALETTE } from "../viewer";

const searchEl = ref<HTMLInputElement | null>(null);

onMounted(() => {
  window.addEventListener("cloudforge:focus-search", () => searchEl.value?.focus());
  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      searchEl.value?.focus();
    }
  });
});

const instances = computed(() => store.aiResult?.instances ?? []);

const filtered = computed(() => {
  const q = store.searchQuery.trim().toLowerCase();
  const list = instances.value.map((inst, index) => ({ inst, index }));
  if (!q) return list;
  // 原版按第 0 列文本过滤（含 "#instanceId"），再加英文类名兜底
  return list.filter(({ inst }) => {
    const col0 =
      store.aiResult?.task === "semantic_segmentation"
        ? localizeName(inst)
        : `${localizeName(inst)} #${inst.instanceId}`;
    return col0.toLowerCase().includes(q) || inst.className.toLowerCase().includes(q);
  });
});

/** 树行两行文本（复刻 populateAiResultsTree 格式） */
function rowTitle(inst: AiInstance): string {
  return store.aiResult?.task === "semantic_segmentation"
    ? localizeName(inst)
    : `${localizeName(inst)} #${inst.instanceId}`;
}

function rowSub(inst: AiInstance): string {
  if (store.aiResult?.task === "semantic_segmentation") {
    return `类别区域 · ${inst.pointCount} 点`;
  }
  return `${inst.pointCount} 点${inst.confidence < 0.5 ? " · 需核对" : ""}`;
}

function rowConf(inst: AiInstance): string {
  return `${(inst.confidence * 100).toFixed(1)}%`;
}

/* ---------------- 详情区（复刻 updateObjectDetails 全部文案） ---------------- */

const selected = computed(() => {
  const r = store.aiResult;
  if (!r || store.selectedAiIndex < 0 || store.selectedAiIndex >= r.instances.length) return null;
  return r.instances[store.selectedAiIndex];
});

const selectionTitle = computed(() => {
  if (!selected.value) return "未选择对象";
  const inst = selected.value;
  return store.aiResult?.task === "semantic_segmentation"
    ? localizeName(inst)
    : `${localizeName(inst)} #${inst.instanceId}`;
});

const detailLine = computed(() => {
  if (!selected.value) return "";
  const inst = selected.value;
  const conf = (inst.confidence * 100).toFixed(1);
  const task = store.aiResult?.task;
  const note =
    task === "semantic_segmentation"
      ? "类别区域，可能包含多个物体"
      : inst.confidence < 0.5
        ? "低置信度 · 需核对类别"
        : "已识别";
  return `AI 置信度 ${conf}% · ${note}`;
});

const measurement = computed(() => {
  if (!selected.value) {
    return store.wasCleared ? "选择识别结果后显示三轴包围盒尺寸" : "选择实例后显示点数与包围盒";
  }
  const inst = selected.value;
  const dx = (inst.bboxMax[0] - inst.bboxMin[0]) * 1000;
  const dy = (inst.bboxMax[1] - inst.bboxMin[1]) * 1000;
  const dz = (inst.bboxMax[2] - inst.bboxMin[2]) * 1000;
  const axis = store.aiResult?.selectedUpAxis || "Z";
  return `实例点数    ${inst.pointCount.toLocaleString("zh-CN")}\n\n包围盒 X    ${dx.toFixed(1)} mm\n包围盒 Y    ${dy.toFixed(1)} mm\n包围盒 Z    ${dz.toFixed(1)} mm\n\n坐标方向    ${axis} → Z-up`;
});

/** 同类形状序号（kShapeCategories 分组计数） */
const geometryLines = computed(() => {
  const ref = store.refinements[store.selectedAiIndex];
  const inst = selected.value;
  if (!ref || !inst) return null;
  if (ref.shapes.length === 0) return { coverage: 0, lines: [], empty: true };
  const counters: Record<number, number> = {};
  const lines = ref.shapes.map((s) => {
    counters[s.type] = (counters[s.type] ?? 0) + 1;
    const seq = counters[s.type];
    return `${SHAPE_NAMES_CN[s.type] ?? "未知"} ${seq} · ${s.inlierCount.toLocaleString("zh-CN")} 点 · RMSE ${(s.rmse * 1000).toFixed(2)} mm`;
  });
  const covered = new Set<number>();
  for (const s of ref.shapes) for (const i of s.inlierIndices) covered.add(i);
  const coverage = ((covered.size / Math.max(1, inst.pointCount)) * 100).toFixed(1);
  return { coverage, lines, empty: false };
});

const geometryText = computed(() => {
  const ref = store.refinements[store.selectedAiIndex];
  if (!selected.value) return "尚未精拟合";
  if (!ref) {
    return store.aiResult?.task === "semantic_segmentation"
      ? "请切换实例模型以测量独立对象"
      : "尚未精拟合\n仅处理本对象内的点";
  }
  const g = geometryLines.value!;
  if (g.empty) return "未找到可靠几何面；原始对象已保留";
  return `本对象覆盖率 ${g.coverage}%\n${g.lines.join("\n")}\n\n包围盒为粗测；拟合残差不代表尺寸真值误差`;
});

function onPresetChange(e: Event) {
  store.fitPreset = Number((e.target as HTMLSelectElement).value);
}
</script>

<template>
  <aside class="inspector">
    <div class="header">
      <h2>{{ store.hasCad ? "模型信息" : "识别结果" }}</h2>
      <span class="count num">{{ store.hasCad ? `${store.cadTriangleCount.toLocaleString("zh-CN")} 个三角面` : store.pointCountLabel }}</span>
    </div>

    <div v-if="store.hasCad" class="scroll">
      <div class="details">
        <h3 class="sel-title">{{ store.sourceName }}</h3>
        <p class="detail-line num">STL 表面网格</p>
        <p class="eyebrow">显示方式</p>
        <p class="measurement">{{ store.cadWireframe ? "线框" : "实体表面与轮廓" }}</p>
        <p class="eyebrow">查看模型</p>
        <p class="measurement">滚轮：放大、缩小<br />左键拖动：旋转<br />右键或中键拖动：平移</p>
        <p class="geometry">点击上方“回到全景”恢复完整模型视图。</p>
      </div>
    </div>
    <div v-else class="scroll">
      <input
        ref="searchEl"
        v-model="store.searchQuery"
        type="search"
        placeholder="搜索实例…"
        :disabled="!ui.canSearch"
      />

      <ul class="result-list" role="listbox" aria-label="识别结果列表">
        <li
          v-for="{ inst, index } in filtered"
          :key="index"
          role="option"
          :aria-selected="store.selectedAiIndex === index"
          :class="{ selected: store.selectedAiIndex === index }"
          @click="selectInstance(index)"
        >
          <span class="swatch" :style="{ background: PALETTE[index % 7] }" aria-hidden="true"></span>
          <span class="row-text">
            <span class="row-title">{{ rowTitle(inst) }}</span>
            <span class="row-sub num">{{ rowSub(inst) }}</span>
          </span>
          <span class="conf num">{{ rowConf(inst) }}</span>
        </li>
        <li v-if="filtered.length === 0" class="list-empty">
          {{ store.aiResult ? "没有匹配的实例" : "运行识别后在此查看结果" }}
        </li>
      </ul>

      <div class="details">
        <h3 class="sel-title">{{ selectionTitle }}</h3>
        <p class="detail-line num">{{ detailLine }}</p>

        <p class="eyebrow">CLOUDFORGE 粗测</p>
        <p class="measurement num">{{ measurement }}</p>

        <p class="eyebrow">几何精拟合 <span class="eyebrow-tag">RANSAC</span></p>
        <p class="geometry num">{{ geometryText }}</p>

        <div class="measure-row">
          <select :value="store.fitPreset" :disabled="!ui.canMeasure" aria-label="拟合档位" @change="onPresetChange">
            <option :value="0">拟合平面</option>
            <option :value="1">拟合多种几何面</option>
          </select>
          <button class="btn btn-primary" :disabled="!ui.canMeasure" @click="measure">精拟合选中实例</button>
        </div>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.inspector {
  width: 328px;
  flex: none;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.header {
  height: 46px;
  flex: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.header h2 {
  font-size: 13px;
  font-weight: 600;
}

.count {
  font-size: 12px;
  color: var(--ink-3);
}

.scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 4px 16px;
}

.result-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 2px;
  max-height: 380px;
  min-height: 120px;
  overflow-y: auto;
  background: var(--glass-2);
  border: 1px solid var(--hairline);
  border-radius: var(--r-md);
  padding: 4px;
}

.result-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: var(--r-sm);
  cursor: pointer;
  transition: background 0.2s var(--ease);
  min-height: 48px;
}

.result-list li:hover {
  background: rgba(29, 29, 31, 0.05);
}

.result-list li.selected {
  background: rgba(29, 29, 31, 0.08);
}

.swatch {
  width: 8px;
  height: 8px;
  flex: none;
  border-radius: 50%;
  box-shadow: 0 0 6px currentColor;
}

.row-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.row-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--ink);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.row-sub {
  font-size: 12px;
  color: var(--ink-3);
}

.conf {
  font-size: 12px;
  color: var(--ink-2);
}

.list-empty {
  color: var(--ink-3);
  font-size: 12px;
  text-align: center;
  cursor: default;
}

.details {
  border-top: 1px solid var(--hairline);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sel-title {
  font-size: 17px;
  font-weight: 600;
}

.detail-line {
  font-size: 12px;
  color: var(--ink-2);
  min-height: 1em;
}

.eyebrow {
  font-size: 12px;
  font-weight: 600;
  color: var(--ink-3);
  letter-spacing: 0.06em;
  display: flex;
  justify-content: space-between;
  margin-top: 4px;
}

.eyebrow-tag {
  font-weight: 500;
}

.measurement {
  font-size: 12px;
  color: var(--ink-2);
  white-space: pre-line;
  line-height: 1.8;
}

.geometry {
  font-size: 12px;
  color: var(--ink-2);
  white-space: pre-line;
  line-height: 1.7;
  background: var(--shade);
  border: 1px solid var(--hairline);
  border-radius: var(--r-sm);
  padding: 11px 12px;
  min-height: 52px;
}

.measure-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.measure-row select {
  width: 100%;
}
</style>
