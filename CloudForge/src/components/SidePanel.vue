<script setup lang="ts">
import { ref } from "vue";
import { store, ui, loadPointCloud, savePointCloud, generateDemo, clearAll, fitToCloud, persistSettings, updateStatus } from "../store";
import { AI_PROFILES } from "../types";

const collapsed = ref(false);
const profileEl = ref<HTMLSelectElement | null>(null);

function toggleCollapse() {
  collapsed.value = !collapsed.value;
}

function navAI() {
  collapsed.value = false;
  profileEl.value?.focus();
}

function navMeasurements() {
  const n = Object.keys(store.refinements).length;
  updateStatus(`当前已精拟合 ${n} 个对象`);
}

function set<K extends keyof typeof store.settings>(key: K, value: (typeof store.settings)[K]) {
  store.settings[key] = value;
  persistSettings();
}
</script>

<template>
  <aside class="side" :class="{ collapsed }">
    <template v-if="!collapsed">
      <p class="panel-title">
        <span class="dot" aria-hidden="true"></span>
        {{ store.hasCad ? "CAD 预览" : "点云实验室" }}
      </p>

      <p class="section-title">工作区</p>
      <nav class="nav">
        <button class="btn nav-btn" @click="fitToCloud">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>
          概览
        </button>
        <button class="btn nav-btn" :disabled="!ui.canLoad" @click="loadPointCloud">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg>
          {{ store.hasCad ? "打开文件" : "点云文件" }}
        </button>
        <button v-if="!store.hasCad" class="btn nav-btn" @click="navAI">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8V4H8"/><rect x="4" y="8" width="16" height="12" rx="2"/><path d="M2 14h2M20 14h2M15 13v2M9 13v2"/></svg>
          AI 识别任务
        </button>
        <button v-if="!store.hasCad" class="btn nav-btn" @click="navMeasurements">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m7 14 4-4 3 3 5-6"/></svg>
          测量记录
        </button>
      </nav>

      <p class="section-title">{{ store.hasCad ? "CAD 模型" : "点云数据" }}</p>
      <p class="cloud-info num">
        <template v-if="store.hasCad"><span class="info-dot ok" aria-hidden="true">●</span> {{ store.sourceName }}<br /><span class="indent">{{ store.cadTriangleCount.toLocaleString("zh-CN") }} 个三角面</span></template>
        <template v-else-if="store.hasCloud"><span class="info-dot ok" aria-hidden="true">●</span> {{ store.sourceName || "合成测试点云" }}<br /><span class="indent">{{ store.pointCount.toLocaleString("zh-CN") }} 个点</span></template>
        <template v-else><span class="info-dot" aria-hidden="true">●</span> 尚未加载文件</template>
      </p>
      <div class="row">
        <button class="btn" :disabled="!ui.canLoad" @click="loadPointCloud">{{ store.hasCad ? "打开文件" : "打开点云" }}</button>
        <button v-if="!store.hasCad" class="btn" :disabled="!ui.canSave" @click="savePointCloud">保存</button>
      </div>

      <p v-if="!store.hasCad" class="section-title">识别设置</p>
      <div v-if="!store.hasCad" class="settings">
        <select ref="profileEl" :value="store.settings.profile" :disabled="!ui.aiProfileEnabled" aria-label="AI 模型" @change="set('profile', ($event.target as HTMLSelectElement).value)">
          <option v-for="p in AI_PROFILES" :key="p.id" :value="p.id">{{ p.label }}</option>
        </select>
        <select :value="store.settings.gridSize" :disabled="!ui.aiParamsEnabled" title="更密采样保留细节，但更耗显存与时间；不保证类别识别更准确" aria-label="采样精度" @change="set('gridSize', ($event.target as HTMLSelectElement).value)">
          <option value="0.02">标准 · 20 mm 采样</option>
          <option value="0.01">细节 · 10 mm 采样</option>
        </select>
        <select :value="store.settings.inputUnit" :disabled="!ui.aiParamsEnabled" aria-label="输入单位" @change="set('inputUnit', ($event.target as HTMLSelectElement).value)">
          <option value="m">输入单位 · 米</option>
          <option value="cm">输入单位 · 厘米</option>
          <option value="mm">输入单位 · 毫米</option>
        </select>
        <select :value="store.settings.upAxis" :disabled="!ui.aiParamsEnabled" aria-label="向上方向" @change="set('upAxis', ($event.target as HTMLSelectElement).value)">
          <option value="auto">向上方向 · 自动</option>
          <option value="z">向上方向 · z</option>
          <option value="-z">-z</option>
          <option value="y">y</option>
          <option value="-y">-y</option>
          <option value="x">x</option>
          <option value="-x">-x</option>
        </select>
      </div>
      <button class="btn clear-btn" :disabled="!ui.canClear" @click="clearAll">清空工作区</button>
      <button class="btn ghost hidden-btn" :disabled="!ui.canGenerate" @click="generateDemo">生成合成场景</button>

      <span class="stretch"></span>

      <p class="env num"><span class="ok-dot" aria-hidden="true">●</span> 本地处理<br /><span class="indent">{{ store.hasCad ? "CloudForge · CAD 网格" : "CloudForge · RANSAC" }}</span></p>
    </template>

    <button class="btn-icon collapse" :aria-label="collapsed ? '展开侧栏' : '折叠侧栏'" @click="toggleCollapse">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></svg>
    </button>
  </aside>
</template>

<style scoped>
.side {
  width: 220px;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: 12px 0 10px;
  transition: width 0.2s var(--ease);
}

.side.collapsed {
  width: 58px;
  align-items: center;
}

.panel-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  padding: 8px 9px;
}

.panel-title .dot {
  width: 8px;
  height: 8px;
  border-radius: 3px;
  background: var(--accent);
}

.section-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--ink-3);
  letter-spacing: 0.08em;
  padding: 8px 9px 4px;
  text-transform: uppercase;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  text-align: left;
  border-color: transparent;
  background: transparent;
  justify-content: flex-start;
  padding: 7px 9px;
}

.nav-btn svg {
  width: 15px;
  height: 15px;
  flex: none;
  color: var(--ink-3);
}

.cloud-info {
  padding: 4px 9px 6px;
  font-size: 12px;
  color: var(--ink-2);
  line-height: 1.7;
}

.info-dot {
  color: var(--ink-3);
}

.info-dot.ok {
  color: var(--ok);
}

.indent {
  padding-left: 14px;
}

.row {
  display: flex;
  gap: 6px;
  padding: 0 9px;
}

.row .btn {
  flex: 1;
  padding: 7px 8px;
}

.settings {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 0 9px;
}

.clear-btn {
  margin: 10px 9px 0;
}

.hidden-btn {
  display: none;
}

.stretch {
  flex: 1;
}

.env {
  padding: 4px 9px 8px;
  font-size: 11px;
  color: #16785f;
  line-height: 1.7;
}

.ok-dot {
  color: var(--ok);
}

.collapse {
  align-self: flex-start;
  margin-left: 9px;
}

.side.collapsed .collapse {
  align-self: center;
  margin-left: 0;
}
</style>
