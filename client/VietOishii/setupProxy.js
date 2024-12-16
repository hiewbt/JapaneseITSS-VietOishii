import { createProxyMiddleware } from 'http-proxy-middleware';


export default function setupProxy(app) {
    app.use(
      '/api',
      createProxyMiddleware({
        target: 'https://dinoz.duckdns.org',
        changeOrigin: true,
        secure: false,
        headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      },
      })
    );
  }