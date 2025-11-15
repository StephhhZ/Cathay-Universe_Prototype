import React from 'react';
import { Star, MapPin, TrendingDown, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import MilesTag from './MilesTag';

export default function RedeemCard({ item, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer tap-feedback group"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2] overflow-hidden">
        {item.image_url ? (
          <img 
            src={item.image_url} 
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
              <Star className="w-8 h-8 text-[#00645A]" />
            </div>
          </div>
        )}
        
        {/* Savings Badge */}
        {item.savings_percent && (
          <div className="absolute top-3 left-3">
            <div className="flex items-center gap-1 px-2.5 py-1 bg-[#1E824C] text-white rounded-lg text-xs font-bold shadow-md">
              <TrendingDown className="w-3 h-3" />
              <span>省{item.savings_percent}%</span>
            </div>
          </div>
        )}

        {/* Available Badge */}
        {item.available && (
          <div className="absolute top-3 right-3">
            <div className="flex items-center gap-1 px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-xs font-medium text-[#1E824C]">
              <CheckCircle className="w-3 h-3" />
              <span>即时可兑</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {item.tags.slice(0, 2).map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs bg-[#E9EDF2] text-[#6E7683]">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="font-semibold text-[#2B2F36] text-base line-clamp-2 leading-snug">
          {item.title}
        </h3>

        {/* Partner & Location */}
        <div className="flex items-center gap-4 text-xs text-[#6E7683]">
          {item.partner_name && (
            <span className="font-medium">{item.partner_name}</span>
          )}
          {item.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{item.location}</span>
            </div>
          )}
        </div>

        {/* Rating */}
        {item.rating && (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-[#C6A867] text-[#C6A867]" />
            <span className="text-sm font-semibold text-[#2B2F36]">{item.rating}</span>
            <span className="text-xs text-[#6E7683]">/5.0</span>
          </div>
        )}

        {/* Pricing */}
        <div className="pt-2 border-t border-[#E9EDF2] flex items-center justify-between">
          <div className="space-y-0.5">
            {item.original_price && (
              <div className="text-xs text-[#6E7683] line-through">
                ¥{item.original_price.toLocaleString()}
              </div>
            )}
            <MilesTag miles={item.miles_price} variant="light" />
          </div>

          {item.hybrid_price && (
            <div className="text-right">
              <p className="text-xs text-[#6E7683]">混合支付</p>
              <p className="text-xs font-semibold text-[#2B2F36]">
                {item.hybrid_price.miles.toLocaleString()}里程 + ¥{item.hybrid_price.cny}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}