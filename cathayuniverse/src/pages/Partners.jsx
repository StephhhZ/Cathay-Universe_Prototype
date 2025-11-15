import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, Star, X, Building2,
  Hotel, UtensilsCrossed, Palette, Heart, 
  ShoppingBag, Car
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import PartnerCard from "../components/shared/PartnerCard";
import { createPageUrl } from "@/utils";

const categories = [
  { id: 'all', label: '全部', icon: Building2 },
  { id: 'hotel', label: '酒店', icon: Hotel },
  { id: 'dining', label: '餐饮', icon: UtensilsCrossed },
  { id: 'art', label: '艺术', icon: Palette },
  { id: 'wellness', label: '健康', icon: Heart },
  { id: 'shopping', label: '购物', icon: ShoppingBag },
  { id: 'transport', label: '交通', icon: Car },
];

export default function Partners() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: allPartners = [], isLoading } = useQuery({
    queryKey: ['partners'],
    queryFn: () => base44.entities.Partner.list('-created_date', 50),
  });

  // Filter partners
  const filteredPartners = allPartners.filter(partner => {
    const matchesSearch = !searchQuery || 
      partner.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      partner.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || partner.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const featuredPartners = filteredPartners.filter(p => p.featured);
  const regularPartners = filteredPartners.filter(p => !p.featured);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#E9EDF2] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-[#2B2F36]">合作伙伴</h1>
            <p className="text-sm text-[#6E7683] mt-1">携手顶级品牌，共享尊享权益</p>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7683]" />
            <Input
              type="text"
              placeholder="搜索合作伙伴、品牌..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 h-12 rounded-xl border-[#E9EDF2] focus:border-[#00645A]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 tap-feedback"
              >
                <X className="w-5 h-5 text-[#6E7683]" />
              </button>
            )}
          </div>

          {/* Category Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all tap-feedback ${
                    isSelected
                      ? 'bg-[#00645A] text-white'
                      : 'bg-white border border-[#E9EDF2] text-[#6E7683] hover:border-[#00645A]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-8">
        {/* Stats Banner */}
        <div className="bg-gradient-to-r from-[#00645A] to-[#2FA39A] rounded-2xl p-6 text-white">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold tabular-nums">{allPartners.length}</p>
              <p className="text-sm text-white/80 mt-1">合作品牌</p>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">50+</p>
              <p className="text-sm text-white/80 mt-1">覆盖城市</p>
            </div>
            <div>
              <p className="text-3xl font-bold tabular-nums">1000+</p>
              <p className="text-sm text-white/80 mt-1">权益商品</p>
            </div>
          </div>
        </div>

        {/* Featured Partners */}
        {featuredPartners.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-[#C6A867]" />
              <h2 className="text-lg font-bold text-[#2B2F36]">精选合作伙伴</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {featuredPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  onClick={() => window.location.href = createPageUrl("PartnerDetail") + `?id=${partner.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* All Partners */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        ) : regularPartners.length > 0 ? (
          <section>
            <h2 className="text-lg font-bold text-[#2B2F36] mb-4">
              {selectedCategory === 'all' ? '所有合作伙伴' : categories.find(c => c.id === selectedCategory)?.label}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {regularPartners.map((partner) => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  onClick={() => window.location.href = createPageUrl("PartnerDetail") + `?id=${partner.id}`}
                />
              ))}
            </div>
          </section>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Building2 className="w-16 h-16 text-[#E9EDF2] mx-auto mb-4" />
            <p className="text-lg font-semibold text-[#2B2F36] mb-2">未找到匹配的合作伙伴</p>
            <p className="text-sm text-[#6E7683]">试试调整搜索条件或筛选项</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}