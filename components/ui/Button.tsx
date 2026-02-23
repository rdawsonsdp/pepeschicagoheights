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
      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
      : 'bg-[#D4782F] text-white hover:bg-[#c06a25] active:bg-[#b0601f] focus:ring-[#D4782F] shadow-md hover:shadow-lg',
    secondary: disabled
      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
      : 'bg-[#C8102E] text-white hover:bg-[#a80d26] active:bg-[#900b20] focus:ring-[#C8102E] shadow-md hover:shadow-lg',
    outline: disabled
      ? 'border-2 border-gray-300 text-gray-500 cursor-not-allowed'
      : 'border-2 border-[#D4782F] text-[#D4782F] hover:bg-[#D4782F] hover:text-white focus:ring-[#D4782F]',
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
