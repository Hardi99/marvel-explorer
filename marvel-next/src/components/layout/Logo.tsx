export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span
      className={`bg-marvel text-white font-display leading-none tracking-[-0.5px] ${
        size === 'md' ? 'text-[30px] px-2.5 pt-1.5 pb-1' : 'text-xl px-2 pt-1 pb-0.5'
      }`}
    >
      MARVEL
    </span>
  );
}
