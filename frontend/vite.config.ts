import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

  server: {
    proxy: {
      "/api/": process.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000",
    },
  },
  
  define: {
    __API_URL__: JSON.stringify(process.env.VITE_REACT_APP_BACKEND_BASEURL || "http://localhost:5000"),
  }, 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
