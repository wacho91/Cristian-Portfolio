/**
 * Capa de servicios API — endpoints exactos del backend FastAPI.
 *
 * Contrato (docs/arquitectura.md §5):
 *   GET  /api/health
 *   POST /api/contact
 */
import { http } from '@/shared/lib/http';

/* ─────────────────────────── Tipos de contrato ─────────────────────────── */

export interface HealthResponse {
  status: string;
  service: string;
  timestamp: string;
}

export interface ContactMessageCreate {
  name: string;
  email: string;
  subject?: string | null;
  message: string;
}

export interface ContactMessageResponse {
  success: boolean;
  message: string;
  id: string;
  received_at: string;
}

export interface ErrorResponse {
  detail: string;
  code?: string | null;
  request_id?: string | null;
}

/* ─────────────────────────── Endpoints ─────────────────────────── */

export const api = {
  /** GET /api/health — estado del servicio. */
  health(): Promise<HealthResponse> {
    return http<HealthResponse>('/api/health', { method: 'GET' });
  },

  /** POST /api/contact — envía el mensaje del formulario. */
  createContactMessage(payload: ContactMessageCreate): Promise<ContactMessageResponse> {
    return http<ContactMessageResponse>('/api/contact', {
      method: 'POST',
      body: payload,
    });
  },
} as const;
