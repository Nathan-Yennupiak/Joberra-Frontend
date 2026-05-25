import { InputHTMLAttributes, forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
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
            type={props.type === 'password' && showPassword ? 'text' : props.type}
            className={`
              flex h-10 w-full rounded-none border-2 border-slate-200 bg-white px-3 py-2 text-sm 
              placeholder:text-slate-400 transition-colors
              focus:outline-none focus:border-primary-600 focus:ring-0
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-500 focus:border-red-600' : ''}
              ${props.type === 'password' ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />
          {props.type === 'password' && (
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff size={16} aria-label="Hide password" />
              ) : (
                <Eye size={16} aria-label="Show password" />
              )}
            </button>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
