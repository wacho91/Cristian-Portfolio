import { cn } from '@/shared/lib/cn';

interface SectionTitleProps {
  overline: string;
  title: string;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionTitle({
  overline,
  title,
  description,
  className,
  align = 'left',
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' && 'items-center text-center',
        className
      )}
    >
      <span className="font-mono text-xs uppercase tracking-widest text-cyan-400">
        {overline}
      </span>
      <h2 className="text-4xl font-bold tracking-tight text-slate-50 md:text-5xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            'max-w-2xl text-lg leading-relaxed text-slate-400',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
