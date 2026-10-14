<script setup lang="ts">
import { store } from "../store";
</script>

<template>
  <footer class="statusbar">
    <span class="text num">{{ store.status }}</span>
  </footer>
</template>

<style scoped>
.statusbar {
  height: 28px;
  flex: none;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-top: 1px solid var(--hairline);
  background: rgba(255, 255, 255, 0.8);
}

.text {
  font-size: 12px;
  color: var(--ink-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
