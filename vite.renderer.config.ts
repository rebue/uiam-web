import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config
export default defineConfig({
    // 项目根目录(index.html所在的目录)
    root: resolve(__dirname, 'src', 'renderer'),
    plugins: [vue()],
});
