import React from 'react';
import { MapPin, Star, Gift } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function PartnerCard({ partner, onClick }) {
  const categoryLabels = {
    hotel: '酒店',
    dining: '餐饮',
    art: '艺术',
    wellness: '健康',
    shopping: '购物',
    transport: '交通',
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer tap-feedback"
    >
      {/* Header with Logo */}
      <div className="relative h-32 bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2] flex items-center justify-center">
        {partner.logo_url ? (
          <img 
            src={partner.logo_url} 
            alt={partner.name}
            className="max-h-16 max-w-[80%] object-contain"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-white/80 flex items-center justify-center">
            <Gift className="w-8 h-8 text-[#00645A]" />
          </div>
        )}

        {partner.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-[#C6A867] text-white text-xs">精选</Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Name */}
        <h3 className="font-semibold text-[#2B2F36] text-base">
          {partner.name}
        </h3>

        {/* Category & Location */}
        <div className="flex items-center gap-3 text-xs text-[#6E7683]">
          <Badge variant="secondary" className="bg-[#E9EDF2] text-[#6E7683]">
            {categoryLabels[partner.category] || partner.category}
          </Badge>
          {partner.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{partner.location}</span>
            </div>
          )}
        </div>

        {/* Description */}
        {partner.description && (
          <p className="text-sm text-[#6E7683] line-clamp-2 leading-relaxed">
            {partner.description}
          </p>
        )}

        {/* Stats */}
        <div className="pt-2 border-t border-[#E9EDF2] flex items-center justify-between">
          <div className="flex items-center gap-4">
            {partner.rating && (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-[#C6A867] text-[#C6A867]" />
                <span className="text-sm font-semibold text-[#2B2F36]">{partner.rating}</span>
              </div>
            )}
            {partner.available_items_count > 0 && (
              <div className="text-sm text-[#6E7683]">
                <span className="font-semibold text-[#00645A]">{partner.available_items_count}</span>
                {' '}可兑商品
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}