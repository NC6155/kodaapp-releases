// Astro standalone lee HOST y PORT al importar su punto de entrada.
process.env.HOST = "127.0.0.1";
process.env.PORT = process.env.KODA_BACKEND_PORT || "4321";
await import("../dist/server/entry.mjs");
