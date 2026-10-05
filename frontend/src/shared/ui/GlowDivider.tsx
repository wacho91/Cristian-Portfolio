import { cn } from '@/shared/lib/cn';

export function GlowDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative h-px w-full', className)}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-violet-500/30 to-transparent blur-sm" />
    </div>
  );
}
