import React from 'react';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export default function ProgressBar({
  value,
  max,
  label,
  showPercentage = false,
  variant = 'default',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const variantStyles = {
    default: 'bg-primary-brown',
    success: 'bg-success-green',
    warning: 'bg-pepe-orange',
    error: 'bg-error-red',
  };

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-charcoal">{label}</span>}
          {showPercentage && (
            <span className="text-sm font-semibold text-primary-brown">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full h-2 bg-light-brown/20 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${variantStyles[variant]}`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
