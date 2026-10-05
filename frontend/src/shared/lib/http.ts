import { env } from '@/shared/config/env';

export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string,
    public readonly payload?: unknown
  ) {
    super(detail);
    this.name = 'HttpError';
  }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeoutMs?: number;
}

/**
 * Wrapper de fetch con baseURL, JSON, timeout y manejo de errores uniforme.
 */
export async function http<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, timeoutMs = env.apiTimeout, headers, ...rest } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${env.apiUrl}${path}`, {
      ...rest,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });

    const text = await response.text();
    const data = text ? safeJsonParse(text) : null;

    if (!response.ok) {
      const detail =
        (data && typeof data === 'object' && 'detail' in data
          ? String((data as { detail: unknown }).detail)
          : null) ?? `Error HTTP ${response.status}`;
      throw new HttpError(response.status, detail, data);
    }

    return data as T;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HttpError(408, 'La petición excedió el tiempo de espera.');
    }
    throw new HttpError(0, 'No se pudo conectar con el servidor.');
  } finally {
    clearTimeout(timer);
  }
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
