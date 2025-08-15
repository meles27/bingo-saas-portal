import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
// import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
    // mkcert({
    //   hosts: ['localhost', '127.0.0.1', '10.14.26.244', 'gc-family.com', 'gc-family.example.com', '10.14.26.244']
    // })
  ],
  server: {
    host: 'beza-burger.localhost.test'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
