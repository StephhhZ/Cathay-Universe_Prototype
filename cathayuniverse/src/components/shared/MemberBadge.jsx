import React from 'react';
import { Crown, Star, Gem, Zap, Award } from 'lucide-react';

const tierConfig = {
  bronze: {
    label: '铜卡',
    icon: Award,
    gradient: 'from-amber-600 to-amber-800',
    textColor: 'text-amber-700',
    bgColor: 'bg-amber-50',
  },
  silver: {
    label: '银卡',
    icon: Star,
    gradient: 'from-gray-400 to-gray-600',
    textColor: 'text-gray-700',
    bgColor: 'bg-gray-50',
  },
  gold: {
    label: '金卡',
    icon: Crown,
    gradient: 'from-yellow-400 to-yellow-600',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
  },
  jade: {
    label: '翡翠卡',
    icon: Gem,
    gradient: 'from-emerald-400 to-emerald-600',
    textColor: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
  },
  diamond: {
    label: '钻石卡',
    icon: Zap,
    gradient: 'from-purple-400 to-purple-600',
    textColor: 'text-purple-700',
    bgColor: 'bg-purple-50',
  },
};

export default function MemberBadge({ tier = 'bronze', size = 'md', showLabel = true }) {
  const config = tierConfig[tier] || tierConfig.bronze;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-md`}>
        <Icon className={`${iconSizes[size]} text-white`} strokeWidth={2.5} />
      </div>
      {showLabel && (
        <div>
          <p className={`font-semibold ${config.textColor} text-sm`}>{config.label}</p>
          <p className="text-xs text-[#6E7683]">会员</p>
        </div>
      )}
    </div>
  );
}