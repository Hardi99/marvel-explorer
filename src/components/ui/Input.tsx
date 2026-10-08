import { clsx } from 'clsx';
import type { InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-base font-bold uppercase tracking-[1px] text-neutral-300">
          {label}
        </label>
      )}
      <input
        id={id}
        className={clsx(
          'bg-white/5 border-2 border-white/30 px-4 py-2.5 text-lg text-white placeholder:text-white/30',
          'focus:outline-none focus:border-marvel transition-colors',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
