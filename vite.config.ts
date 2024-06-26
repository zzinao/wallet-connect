import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@utils', replacement: path.resolve(__dirname, 'src/utils') },
      { find: '@store', replacement: path.resolve(__dirname, 'src/store') },
      { find: '@hooks', replacement: path.resolve(__dirname, 'src/hooks') },
      { find: '@context', replacement: path.resolve(__dirname, 'src/context') },
      { find: '@components', replacement: path.resolve(__dirname, 'src/components') },
    ],
  },
});
