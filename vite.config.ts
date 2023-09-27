import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '')
            },
        },
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'),
            pages: path.resolve(__dirname, 'src/pages'),
            components: path.resolve(__dirname, 'src/components'),
            modules: path.resolve(__dirname, 'src/modules'),
            types: path.resolve(__dirname, 'src/types'),
            utils: path.resolve(__dirname, 'src/utils'),
            configs: path.resolve(__dirname, 'src/configs'),
            routers: path.resolve(__dirname, 'src/routers'),
            assets: path.resolve(__dirname, 'src/assets'),
            styles: path.resolve(__dirname, 'src/styles'),
            layouts: path.resolve(__dirname, 'src/layouts'),
            hooks: path.resolve(__dirname, 'src/hooks'),
            api: path.resolve(__dirname, 'src/api'),
        },
    },
    plugins: [react(), svgr()],

})
