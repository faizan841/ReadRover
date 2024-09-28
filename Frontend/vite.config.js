import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_REACT_APP_BASE_URL": JSON.stringify(
      process.env.VITE_REACT_APP_BASE_URL
    ),
  },
});
