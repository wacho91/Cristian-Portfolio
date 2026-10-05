export type Status = 'idle' | 'loading' | 'success' | 'error';

export interface ApiError {
  status: number;
  detail: string;
}
