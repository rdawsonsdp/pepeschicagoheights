import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  const hoverStyles = hover ? 'hover:shadow-warm-lg transition-all duration-300' : '';
  const clickStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      className={`bg-pepe-warm-white rounded-2xl shadow-warm p-5 sm:p-7 border border-pepe-sand ${hoverStyles} ${clickStyles} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
}
