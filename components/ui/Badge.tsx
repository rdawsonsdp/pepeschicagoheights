import React from 'react';

interface BadgeProps {
  variant?: 'default' | 'appetizers' | 'entrees' | 'sides' | 'success' | 'warning';
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  const variantStyles = {
    default: 'bg-[#C8102E]/10 text-[#1C1C1C] border border-[#C8102E]',
    appetizers: 'bg-[#C8102E]/10 text-[#C8102E] border border-[#C8102E]',
    entrees: 'bg-[#006847]/10 text-[#006847] border border-[#006847]',
    sides: 'bg-[#E8A317]/10 text-[#1C1C1C] border border-[#E8A317]',
    success: 'bg-green-100 text-green-800 border border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
