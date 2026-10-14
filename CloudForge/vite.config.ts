import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// Tauri 前端：固定端口、禁止浏览器自动打开
export default defineConfig({
  plugins: [vue()],
  clearScreen: false,
  server: {
    port: 5183,
    strictPort: true,
  },
  build: {
    target: "es2022",
    chunkSizeWarningLimit: 2000,
  },
});
