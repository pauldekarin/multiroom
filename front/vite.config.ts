import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import vitePluginSvgr from "vite-plugin-svgr";
// https://vite.dev/config/
export default defineConfig({
    server: {
        // host: "192.168.1.180"
        host: '127.0.0.1',
        // host: '10.132.112.125',
    },
    plugins: [react(), tailwindcss(), vitePluginSvgr()]
})
