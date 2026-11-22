import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const dominio = new URL(process.env.KODA_PUBLIC_ORIGIN || 'https://localhost:8443');
export default defineConfig({
  security: { allowedDomains: [{ hostname: dominio.hostname, protocol: dominio.protocol.slice(0, -1), ...(dominio.port && {port: dominio.port}) }] },
  output: 'server',
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 6 * 1024 * 1024,
  }),
});