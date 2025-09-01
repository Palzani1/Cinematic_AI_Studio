import React from 'react';
import { FriendlyError } from '../types';

interface ErrorMessageProps {
  error: FriendlyError | null;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div
      className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative shadow-md"
      role="alert"
    >
      <h3 className="font-bold text-lg mb-2">{error.title}</h3>
      
      <div className="mb-4">
        <p className="text-sm font-semibold text-red-200 mb-1">How to fix this:</p>
        <pre className="whitespace-pre-wrap text-sm text-red-200 font-sans">{error.remedy}</pre>
      </div>

      <details className="text-xs">
        <summary className="cursor-pointer text-red-300 hover:text-red-100">
          Show technical details
        </summary>
        <p className="mt-2 p-2 bg-black/30 rounded font-mono break-all">
          {error.technicalMessage}
        </p>
      </details>
    </div>
  );
};

export default ErrorMessage;