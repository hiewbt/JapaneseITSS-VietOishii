import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { // Bất kỳ yêu cầu nào bắt đầu bằng /api sẽ được proxy đến server
        target: 'https://dinoz.duckdns.org', // URL của backend server
        changeOrigin: true, // Cho phép thay đổi origin để khớp với server
        secure: false, // Nếu server sử dụng HTTPS với chứng chỉ tự ký
        rewrite: (path) => path.replace(/^\/api/, ''), // Bỏ tiền tố /api nếu cần
      },
    },
  },
});
