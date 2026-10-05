import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg ' +
  'transition-all duration-200 ease-out ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ' +
  'disabled:opacity-40 disabled:pointer-events-none select-none';

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-cyan-500 to-violet-500 text-slate-950 font-semibold ' +
    'hover:from-cyan-400 hover:to-violet-400 hover:shadow-glow-dual ' +
    'active:from-cyan-600 active:to-violet-600',
  secondary:
    'bg-slate-800 text-slate-100 border border-slate-700 ' +
    'hover:bg-slate-700 hover:border-slate-600 hover:text-white',
  ghost:
    'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-cyan-300',
  danger:
    'bg-rose-500/10 text-rose-300 border border-rose-500/40 ' +
    'hover:bg-rose-500/20 hover:border-rose-400 hover:text-rose-200',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-13 px-7 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(base, variants[variant], sizes[size], className)}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
);
Button.displayName = 'Button';
