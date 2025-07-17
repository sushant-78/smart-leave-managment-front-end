import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify(
      process.env.VITE_API_BASE_URL || "http://localhost:5000/api"
    ),
    "import.meta.env.VITE_APP_NAME": JSON.stringify(
      process.env.VITE_APP_NAME || "Smart Leave Management"
    ),
  },
});
