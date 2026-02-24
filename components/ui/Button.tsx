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
  const baseStyles = 'rounded-full font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 touch-manipulation inline-flex items-center justify-center';

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm min-h-[36px]',
    md: 'px-4 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base min-h-[44px]',
    lg: 'px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg min-h-[52px]',
  };

  const variantStyles = {
    primary: disabled
      ? 'bg-pepe-sand text-muted cursor-not-allowed'
      : 'bg-pepe-red text-white hover:bg-pepe-red-hover active:bg-pepe-red-active focus:ring-pepe-red shadow-warm hover:shadow-warm-lg',
    secondary: disabled
      ? 'bg-pepe-sand text-muted cursor-not-allowed'
      : 'bg-pepe-dark text-white hover:bg-pepe-charcoal active:bg-pepe-dark-active focus:ring-pepe-dark shadow-warm hover:shadow-warm-lg',
    outline: disabled
      ? 'border-2 border-pepe-sand text-muted cursor-not-allowed'
      : 'border-2 border-pepe-red text-pepe-red hover:bg-pepe-red hover:text-white focus:ring-pepe-red',
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
