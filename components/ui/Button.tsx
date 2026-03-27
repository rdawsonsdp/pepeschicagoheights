import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-oswald font-bold tracking-wide transition-all duration-200 focus:outline-none touch-manipulation inline-flex items-center justify-center';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[52px]',
  };

  const variantStyles = {
    primary: disabled
      ? 'bg-pepe-sand text-muted cursor-not-allowed'
      : 'bg-[#E88A00] text-white shadow-[0_4px_0_0_#b86e00] hover:shadow-[0_2px_0_0_#b86e00] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]',
    secondary: disabled
      ? 'bg-pepe-sand text-muted cursor-not-allowed'
      : 'bg-pepe-dark text-white hover:bg-pepe-charcoal active:bg-pepe-dark-active shadow-[0_4px_0_0_#111] hover:shadow-[0_2px_0_0_#111] hover:translate-y-[2px] active:shadow-none active:translate-y-[4px]',
    outline: disabled
      ? 'border-2 border-pepe-sand text-muted cursor-not-allowed'
      : 'border-2 border-pepe-dark text-pepe-dark hover:bg-pepe-dark hover:text-white',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      aria-disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
