import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  isLoading = false,
  children,
  ...props 
}, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "btn",
        {
          "btn-primary": variant === 'primary',
          "btn-secondary": variant === 'secondary',
          "btn-danger": variant === 'danger',
          "bg-transparent text-slate-600 hover:bg-slate-100": variant === 'ghost',
          "px-2 py-1 text-sm": size === 'sm',
          "px-4 py-2": size === 'md',
          "px-6 py-3 text-lg": size === 'lg',
        },
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
