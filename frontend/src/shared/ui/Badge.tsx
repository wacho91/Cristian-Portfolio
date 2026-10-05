import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'accent';

const badgeVariants: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-300 border-slate-700',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  accent: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
};

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1',
        'font-mono text-xs uppercase tracking-wider',
        badgeVariants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
