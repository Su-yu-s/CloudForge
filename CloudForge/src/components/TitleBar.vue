<script setup lang="ts">
import { computed } from "vue";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { store, ui, exportResults, startAi } from "../store";

const isTauri = "__TAURI_INTERNALS__" in window;
// 浏览器预览时不存在 Tauri IPC，不调用（内部会读 __TAURI_INTERNALS__.metadata）
const win = isTauri ? getCurrentWindow() : null;

const breadcrumb = computed(() => {
  const file = store.sourceName || "尚未打开文件";
  return `CloudForge  /  ${file}`;
});

const aiTooltip = computed(() =>
  store.settings.profile === "nuscenes-semantic"
    ? "使用 NuScenes 室外语义权重；输入必须为 float32 N×5 的 .bin"
    : "使用所选室内分割模型权重（第三方模型，见 hackathon/declaration.md）；输入必须为带真实 RGB 的 .ply 或 .pcd",
);

function focusSearch() {
  window.dispatchEvent(new CustomEvent("cloudforge:focus-search"));
}
</script>

<template>
  <header class="titlebar" data-tauri-drag-region>
    <div class="brand" data-tauri-drag-region>
      <span class="mark" aria-hidden="true">CF</span>
      <span class="name">CloudForge</span>
    </div>

    <span class="breadcrumb num" data-tauri-drag-region>{{ breadcrumb }}</span>

    <span class="spacer" data-tauri-drag-region></span>

    <button v-if="!store.hasCad" class="btn ghost" :disabled="!ui.canSearch" @click="focusSearch">
      搜索 <kbd>Ctrl K</kbd>
    </button>
    <button v-if="!store.hasCad" class="btn" :disabled="!ui.canExport" @click="exportResults">导出</button>
    <button v-if="!store.hasCad" class="btn btn-primary ai-btn" :disabled="!ui.aiButtonEnabled" :title="aiTooltip" @click="startAi">
      <svg v-if="!store.aiRunning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="6 3 20 12 6 21 6 3" />
      </svg>
      {{ ui.aiButtonLabel }}
    </button>

    <div v-if="win" class="win-controls">
      <button class="btn-icon" aria-label="最小化" @click="win.minimize()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 12h14" /></svg>
      </button>
      <button class="btn-icon" aria-label="最大化/还原" @click="win.toggleMaximize()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="5" width="14" height="14" rx="2" /></svg>
      </button>
      <button class="btn-icon danger" aria-label="关闭" @click="win.close()">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>
  </header>
</template>

<style scoped>
.titlebar {
  height: 48px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 7px;
  padding-right: 4px;
  border-bottom: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.8);
}

.brand {
  width: 212px;
  flex: none;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-left: 16px;
}

.mark {
  width: 24px;
  height: 24px;
  border-radius: 7px;
  background: var(--accent);
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.name {
  font-size: 13px;
  font-weight: 600;
}

.breadcrumb {
  min-width: 0;
  flex: 1;
  font-size: 12px;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.spacer {
  flex: 0 1 8px;
}

.btn.ghost {
  border-color: transparent;
  background: transparent;
}

.btn.ghost kbd {
  font: inherit;
  font-size: 10px;
  color: var(--ink-3);
  border: 1px solid var(--hairline);
  border-radius: 4px;
  padding: 0 4px;
  margin-left: 2px;
}

.ai-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.ai-btn svg {
  width: 13px;
  height: 13px;
}

.win-controls {
  display: flex;
  margin-left: 6px;
}
</style>
