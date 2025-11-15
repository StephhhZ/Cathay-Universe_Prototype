import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function ValueChart() {
  // Mock data for the week
  const data = [
    { day: '周一', value: 95 },
    { day: '周二', value: 98 },
    { day: '周三', value: 102 },
    { day: '周四', value: 100 },
    { day: '周五', value: 105 },
    { day: '周六', value: 108 },
    { day: '今天', value: 110 },
  ];

  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const currentValue = data[data.length - 1].value;
  const previousValue = data[data.length - 2].value;
  const change = ((currentValue - previousValue) / previousValue * 100).toFixed(1);
  const isPositive = change > 0;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs text-[#6E7683] mb-1">本周里程价值指数</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-[#00645A]">{currentValue}</span>
            <div className={`flex items-center gap-0.5 text-xs font-semibold ${
              isPositive ? 'text-[#1E824C]' : 'text-[#C0463B]'
            }`}>
              {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mini Line Chart */}
      <div className="relative h-20">
        <svg className="w-full h-full" viewBox="0 0 280 80" preserveAspectRatio="none">
          {/* Grid lines */}
          <line x1="0" y1="20" x2="280" y2="20" stroke="#E9EDF2" strokeWidth="1" />
          <line x1="0" y1="40" x2="280" y2="40" stroke="#E9EDF2" strokeWidth="1" />
          <line x1="0" y1="60" x2="280" y2="60" stroke="#E9EDF2" strokeWidth="1" />

          {/* Line path */}
          <path
            d={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 280;
              const y = 80 - ((d.value - minValue) / (maxValue - minValue)) * 60 - 10;
              return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
            }).join(' ')}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Area under line */}
          <path
            d={
              data.map((d, i) => {
                const x = (i / (data.length - 1)) * 280;
                const y = 80 - ((d.value - minValue) / (maxValue - minValue)) * 60 - 10;
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ') + ' L 280 80 L 0 80 Z'
            }
            fill="url(#areaGradient)"
          />

          {/* Gradient definitions */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00645A" />
              <stop offset="100%" stopColor="#2FA39A" />
            </linearGradient>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2FA39A" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#2FA39A" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Labels */}
      <div className="flex justify-between mt-2 px-1">
        {data.map((d, i) => (
          <span key={i} className={`text-[10px] ${
            i === data.length - 1 ? 'text-[#00645A] font-semibold' : 'text-[#6E7683]'
          }`}>
            {d.day}
          </span>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-[#E9EDF2] text-xs text-[#6E7683]">
        💡 <span className="font-medium">当前使用里程更划算</span>（相比上周提升 8%）
      </div>
    </div>
  );
}