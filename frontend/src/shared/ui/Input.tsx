import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label
            htmlFor={inputId}
            className="font-mono text-xs uppercase tracking-wider text-slate-400"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-lg bg-slate-900/60 px-4 text-sm text-slate-100',
            'border border-slate-800 placeholder:text-slate-500',
            'transition-all duration-200',
            'focus:outline-none focus:border-cyan-500/60 focus:ring-2 focus:ring-cyan-500/20 focus:bg-slate-900',
            'hover:border-slate-700',
            error && 'border-rose-500/60 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="font-mono text-xs text-rose-400">{error}</p>
        ) : hint ? (
          <p className="font-mono text-xs text-slate-500">{hint}</p>
        ) : null}
      </div>
    );
  }
);
Input.displayName = 'Input';
