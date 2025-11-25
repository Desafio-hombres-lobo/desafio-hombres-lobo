import { defineConfig } from "vite";

export default defineConfig({
  server: {
    // Escuchar en todas las IPs (necesario para Docker)
    host: "0.0.0.0",
    port: 5173,
    // Si el puerto está ocupado, falla en vez de cambiarlo (para no volverte loco)
    strictPort: true,

    // Configuración del Hot Module Replacement (HMR)
    hmr: {
      // Fuerza al navegador a conectarse al puerto que tienes expuesto en Docker
      clientPort: 5173,
      // A veces ayuda forzar el host
      host: "localhost",
    },

    // Configuración de "Vigilancia" de archivos
    watch: {
      // OBLIGATORIO EN DOCKER/WINDOWS:
      // En vez de esperar a que el SO avise, revisa los archivos manualmente
      usePolling: true,
      // Revisa cambios cada 100ms (más rápido = más consumo de CPU, pero más reactivo)
      interval: 100,
    },
  },
});
