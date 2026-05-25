import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={`
              flex h-10 w-full rounded-none border-2 border-slate-200 bg-white px-3 py-2 text-sm 
              placeholder:text-slate-400 transition-colors
              focus:outline-none focus:border-primary-600 focus:ring-0
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-500 focus:border-red-600' : ''}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
