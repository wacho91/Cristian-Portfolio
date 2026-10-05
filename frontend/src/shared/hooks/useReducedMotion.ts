import { useMediaQuery } from './useMediaQuery';

/** Detecta la preferencia del usuario por reducir movimiento. */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
