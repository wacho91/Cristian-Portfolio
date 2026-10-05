import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function Card({ children, className, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        'relative rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm',
        'shadow-card transition-all duration-300',
        'hover:border-slate-700 hover:bg-slate-900/80',
        glow && 'hover:shadow-glow-cyan hover:border-cyan-500/40',
        className
      )}
    >
      {children}
    </div>
  );
}
