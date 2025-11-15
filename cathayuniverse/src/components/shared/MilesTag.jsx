import React from 'react';
import { TrendingDown, AlertCircle } from 'lucide-react';

export default function MilesTag({ 
  miles, 
  savingsPercent = null, 
  variant = 'default',
  showIcon = true,
  className = ''
}) {
  const variants = {
    default: 'bg-[#00645A] text-white',
    outline: 'bg-white border-2 border-[#00645A] text-[#00645A]',
    light: 'bg-[#E9F7F5] text-[#00645A]',
    warning: 'bg-[#FFF4E5] text-[#D99B00] border border-[#D99B00]',
  };

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold tabular-nums ${variants[variant]} ${className}`}>
      {showIcon && (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v6l4 2" />
        </svg>
      )}
      <span className="text-sm">{miles?.toLocaleString()}</span>
      <span className="text-xs opacity-80">里程</span>
      {savingsPercent && (
        <div className="flex items-center gap-0.5 ml-1 px-1.5 py-0.5 bg-white/20 rounded">
          <TrendingDown className="w-3 h-3" />
          <span className="text-xs font-bold">省{savingsPercent}%</span>
        </div>
      )}
    </div>
  );
}