import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: ['oneorbit-1.onrender.com'], // ✅ correct syntax
    },
    plugins: [react()],
    define: {
      // ✅ Define process.env safely for use in React
      'process.env': {
        API_KEY: JSON.stringify(env.GEMINI_API_KEY),
        GEMINI_API_KEY: JSON.stringify(env.GEMINI_API_KEY),
      },
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'), // ✅ usually better to point to src
      },
    },
  };
});
