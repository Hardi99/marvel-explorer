import { clsx } from 'clsx';
import type { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: Props) {
  return (
    <button
      className={clsx(
        // min-h-[44px] : cible tactile conforme (WCAG 2.5.8) sur toutes les tailles.
        'inline-flex items-center justify-center min-h-[44px] font-semibold transition-all duration-200 rounded cursor-pointer',
        {
          // #d81a20 : rouge Marvel assombri pour un contraste AA (≥4.5:1) du texte blanc.
          'bg-[#d81a20] text-white hover:bg-[#b3141a] active:scale-95': variant === 'primary',
          'border border-white text-white hover:bg-black hover:text-[#ec1d24]': variant === 'outline',
          'text-white/70 hover:text-white': variant === 'ghost',
        },
        {
          'px-3 py-1.5 text-sm': size === 'sm',
          'px-5 py-2.5 text-base': size === 'md',
          'px-8 py-3.5 text-lg': size === 'lg',
        },
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
