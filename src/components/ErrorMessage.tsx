import { AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import type { ReactNode } from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  children?: ReactNode;
}

export function ErrorMessage({ message, onRetry, children }: ErrorMessageProps) {
  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <Alert variant="destructive" className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>An error occurred</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
      
      <div className="flex flex-col items-center gap-4">
        {onRetry && (
          <Button onClick={onRetry} variant="default">
            Try Again
          </Button>
        )}
        {children}
      </div>
    </div>
  );
}
