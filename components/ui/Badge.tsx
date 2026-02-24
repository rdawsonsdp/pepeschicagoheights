import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'appetizers' | 'entrees' | 'sides' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-pepe-red/10 text-pepe-charcoal border border-pepe-red/30',
    appetizers: 'bg-pepe-red/10 text-pepe-red border border-pepe-red/30',
    entrees: 'bg-pepe-green/10 text-pepe-green border border-pepe-green/30',
    sides: 'bg-pepe-orange/15 text-pepe-charcoal border border-pepe-orange/40',
    success: 'bg-pepe-orange/10 text-pepe-dark border border-pepe-orange/30',
    warning: 'bg-pepe-sand/30 text-pepe-terracotta border border-pepe-orange/40',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
