export function Spinner({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-block w-8 h-8 border-4 border-white/20 border-t-[#ec1d24] rounded-full animate-spin ${className}`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Spinner className="w-12 h-12" />
    </div>
  );
}
