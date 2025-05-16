import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // Use relative paths for production builds
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Don't try other ports if 5173 is taken
  },
});
