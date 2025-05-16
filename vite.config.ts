import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/Ajanta-Hotel/", // Set base to the repository name for GitHub Pages
  plugins: [react()],
});
