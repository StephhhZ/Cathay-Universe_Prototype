import React, { useState, useEffect } from 'react';
import { Clock, Users, TrendingUp, Flame } from 'lucide-react';
import MilesTag from './MilesTag';

export default function AuctionCard({ item, onClick }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(item.ends_at);
      const diff = end - now;

      if (diff <= 0) {
        setTimeLeft('已结束');
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (hours > 24) {
        const days = Math.floor(hours / 24);
        setTimeLeft(`${days}天${hours % 24}小时`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      } else {
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [item.ends_at]);

  const isHot = item.bidder_count > 10 || item.highlight;
  const isEnding = new Date(item.ends_at) - new Date() < 3600000; // Less than 1 hour

  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer tap-feedback group ${
        isHot ? 'ring-2 ring-[#C6A867]' : ''
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[16/9] bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2] overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Flame className="w-16 h-16 text-[#C6A867]" />
          </div>
        )}

        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          {isHot ? (
            <div className="flex items-center gap-1 px-2.5 py-1 gradient-gold text-white rounded-lg text-xs font-bold shadow-md animate-pulse">
              <Flame className="w-3 h-3" />
              <span>热门竞拍</span>
            </div>
          ) : (
            <div className="px-2.5 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-medium text-[#00645A]">
              {item.status === 'active' ? '竞拍中' : item.status === 'upcoming' ? '即将开始' : '已结束'}
            </div>
          )}
        </div>

        {/* Time Left */}
        <div className={`absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold ${
          isEnding ? 'bg-[#C0463B] text-white animate-pulse' : 'bg-white/95 backdrop-blur-sm text-[#2B2F36]'
        }`}>
          <Clock className="w-4 h-4" />
          <span className="tabular-nums">{timeLeft}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <h3 className="font-semibold text-[#2B2F36] text-base line-clamp-2 leading-snug">
          {item.title}
        </h3>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-[#6E7683]">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5" />
            <span>{item.bidder_count || 0}人出价</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>每次加价 {item.bid_increment?.toLocaleString()}</span>
          </div>
        </div>

        {/* Current Bid */}
        <div className="pt-2 border-t border-[#E9EDF2] flex items-center justify-between">
          <div>
            <p className="text-xs text-[#6E7683] mb-1">当前价</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-[#00645A] tabular-nums number-counter">
                {(item.current_bid || item.starting_bid)?.toLocaleString()}
              </span>
              <span className="text-sm text-[#6E7683]">里程</span>
            </div>
          </div>

          {item.status === 'active' && (
            <div className="px-4 py-2 gradient-cathay text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">
              立即出价
            </div>
          )}
        </div>

        {/* Deposit Info */}
        {item.deposit_required && (
          <div className="text-xs text-[#6E7683] bg-[#E9EDF2] px-3 py-1.5 rounded-lg">
            保证金：{item.deposit_required.toLocaleString()} 里程
          </div>
        )}
      </div>
    </div>
  );
}