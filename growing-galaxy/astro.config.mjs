import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

const dominio = new URL(process.env.KODA_PUBLIC_ORIGIN || 'https://localhost:8443');
export default defineConfig({
  security: { allowedDomains: [{ hostname: dominio.hostname, protocol: dominio.protocol.slice(0, -1), ...(dominio.port && {port: dominio.port}) }] },
  output: 'server',
  adapter: node({
    mode: 'standalone',
    bodySizeLimit: 30 * 1024 * 1024,
  }),
  // Configuración de seguridad para permitir las solicitudes en la IP elástica de AWS
  security: {
    checkOrigin: true,

    allowedDomains: [
      {
        hostname: "32.201.144.64", //IP elástica de AWS
        protocol: "https",
      },
    ],
  },
});