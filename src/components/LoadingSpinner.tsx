import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Laddar...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
      <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" aria-hidden="true" />
      <p className="text-slate-600" role="status" aria-live="polite">{message}</p>
    </div>
  );
}
