import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
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