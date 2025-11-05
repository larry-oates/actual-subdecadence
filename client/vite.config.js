import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/postcss";

// https://vitejs.dev/config/
export default defineConfig({
  envDir: "../",
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        ws: true,
      },
    },
    hmr: {
      clientPort: 443,
    },
    allowedHosts: ["freeze-den-beginner-ins.trycloudflare.com"],
  },
});
