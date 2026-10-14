<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { store, ui, initViewer, loadPointCloud, loadPointCloudFromPath, generateDemo, setViewMode, setCadWireframe, fitToCloud } from "./store";
import TitleBar from "./components/TitleBar.vue";
import SidePanel from "./components/SidePanel.vue";
import Inspector from "./components/Inspector.vue";
import StatusBar from "./components/StatusBar.vue";

const viewerEl = ref<HTMLElement | null>(null);

onMounted(() => {
  if (viewerEl.value) initViewer(viewerEl.value);
  // 命令行打开：`cloudforge.exe <点云或 STL 文件>`（AGH 预览用）
  void invoke<string | null>("get_launch_file")
    .then((lf) => {
      if (lf) void loadPointCloudFromPath(lf);
    })
    .catch(() => undefined);
});

// 精拟合快捷键（原版唯一入口在右侧按钮；Ctrl+R 语义不符，不另设）
const segs = computed(() => [
  { id: 0, label: "原始", enabled: ui.value.seg.raw },
  { id: 1, label: "语义", enabled: ui.value.seg.semantic },
  { id: 2, label: "实例", enabled: ui.value.seg.instance },
  { id: 3, label: "几何", enabled: ui.value.seg.geometry },
]);

const busyOverlay = computed(() => store.busy && (store.busyMessage !== "" || store.measuring));
</script>

<template>
  <div class="window">
    <!-- L0 环境光斑 -->
    <div class="ambient" aria-hidden="true"><i></i><i></i><i></i></div>

    <div class="chrome">
      <TitleBar />

      <div class="workspace">
        <SidePanel />

        <section class="center-pane">
          <div class="view-tools">
            <div v-if="store.hasCad" class="seg" role="group" aria-label="CAD 显示模式">
              <button :class="{ active: !store.cadWireframe }" :aria-pressed="!store.cadWireframe" :disabled="store.busy" @click="setCadWireframe(false)">实体</button>
              <button :class="{ active: store.cadWireframe }" :aria-pressed="store.cadWireframe" :disabled="store.busy" @click="setCadWireframe(true)">线框</button>
            </div>
            <div v-else class="seg" role="tablist" aria-label="视图模式">
              <button
                v-for="s in segs"
                :key="s.id"
                :class="{ active: store.viewMode === s.id }"
                :disabled="!s.enabled"
                @click="s.enabled && setViewMode(s.id)"
              >
                {{ s.label }}
              </button>
            </div>
            <span class="spacer"></span>
            <button class="btn-icon tool" title="回到全景" aria-label="回到全景" @click="fitToCloud">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 9V5a2 2 0 0 1 2-2h4M15 3h4a2 2 0 0 1 2 2v4M21 15v4a2 2 0 0 1-2 2h-4M9 21H5a2 2 0 0 1-2-2v-4" />
              </svg>
            </button>
          </div>

          <div class="viewer-wrap glass">
            <div ref="viewerEl" class="viewer-canvas"></div>

            <!-- 任务 HUD（复刻 viewer 顶部状态条） -->
            <div v-if="busyOverlay" class="task-hud" role="status">
              <span class="hud-text">{{ store.busyMessage }}</span>
              <div class="hud-meter meter"></div>
            </div>

            <!-- 空态指引 -->
            <div v-if="!store.hasCloud && !store.hasCad && !store.busy" class="empty-hint">
              <div class="empty-ring">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2 3 7l9 5 9-5-9-5Z" /><path d="m3 12 9 5 9-5" /><path d="m3 17 9 5 9-5" />
                </svg>
              </div>
              <p class="empty-title">尚未打开文件</p>
              <p class="empty-sub">支持 PCD / PLY / TXT / STL / OBJ / NuScenes BIN</p>
              <div class="empty-actions">
                <button class="btn" @click="loadPointCloud">打开点云</button>
                <button class="btn" @click="generateDemo">生成合成场景</button>
              </div>
            </div>
          </div>

          <p class="scene-label num">{{ store.sceneLabel }}</p>
        </section>

        <Inspector />
      </div>

      <StatusBar />
    </div>
  </div>
</template>

<style scoped>
.chrome {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.workspace {
  flex: 1;
  display: flex;
  min-height: 0;
  padding: 0 14px;
  gap: 12px;
}

.center-pane {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 13px 0;
}

.view-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-tools .tool {
  border: 1px solid var(--hairline);
  background: var(--glass-2);
}

.spacer {
  flex: 1;
}

.viewer-wrap {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  position: relative;
  border-radius: var(--r-lg);
}

.viewer-canvas {
  position: absolute;
  inset: 0;
}

/* 任务 HUD：复刻 Qt viewerStatusBar（顶部悬浮卡 + 不定进度条） */
.task-hud {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 12px;
  height: 34px;
  padding: 0 12px;
  max-width: 70%;
  background: rgba(255, 255, 255, 0.85);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  backdrop-filter: blur(20px) saturate(160%);
  border: 1px solid var(--hairline);
  border-radius: var(--r-sm);
  box-shadow: var(--shadow-soft);
  z-index: 5;
}

.hud-text {
  font-size: 12px;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hud-meter {
  width: 72px;
  flex: none;
}

/* 空态 */
.empty-hint {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  z-index: 4;
  pointer-events: none;
}

.empty-ring {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ink-3);
  background: var(--glass-2);
  border: 1px solid var(--hairline);
  box-shadow: inset 0 1px 0 var(--glass-hi);
  margin-bottom: 10px;
}

.empty-ring svg {
  width: 40px;
  height: 40px;
}

.empty-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--ink-2);
}

.empty-sub {
  font-size: 12px;
  color: var(--ink-3);
}

.empty-actions {
  margin-top: 12px;
  display: flex;
  gap: 8px;
  pointer-events: auto;
}

.scene-label {
  font-size: 12px;
  color: var(--ink-2);
  padding: 0 4px;
}
</style>
