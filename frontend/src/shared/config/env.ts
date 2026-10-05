/**
 * Configuración de entorno tipada y validada en runtime.
 */
const rawApiUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
const rawTimeout = import.meta.env.VITE_API_TIMEOUT;

export const env = {
  apiUrl: rawApiUrl.replace(/\/$/, ''),
  apiTimeout: rawTimeout ? Number(rawTimeout) : 15000,
  siteName: import.meta.env.VITE_SITE_NAME ?? 'Cristian-Portfolio',
} as const;
