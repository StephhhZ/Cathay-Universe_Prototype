import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, SlidersHorizontal, X, MapPin, 
  Hotel, UtensilsCrossed, Palette, Heart, 
  ShoppingBag, Car
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import RedeemCard from "../components/shared/RedeemCard";
import { createPageUrl } from "@/utils";

const categories = [
  { id: 'all', label: '全部', icon: null },
  { id: 'hotel', label: '酒店', icon: Hotel },
  { id: 'dining', label: '餐饮', icon: UtensilsCrossed },
  { id: 'art', label: '艺术', icon: Palette },
  { id: 'wellness', label: '健康', icon: Heart },
  { id: 'shopping', label: '购物', icon: ShoppingBag },
  { id: 'transport', label: '交通', icon: Car },
];

const sortOptions = [
  { id: 'best_value', label: '最划算' },
  { id: 'miles_low', label: '里程从低到高' },
  { id: 'miles_high', label: '里程从高到高' },
  { id: 'rating', label: '评分最高' },
];

export default function Redeem() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSort, setSelectedSort] = useState('best_value');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ['redeem-items'],
    queryFn: () => base44.entities.RedeemItem.list('-created_date', 200),
  });

  // Filter and sort items
  const filteredItems = allItems.filter(item => {
    const matchesSearch = !searchQuery || 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.partner_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesAvailable = !showAvailableOnly || item.available;

    return matchesSearch && matchesCategory && matchesAvailable;
  }).sort((a, b) => {
    switch (selectedSort) {
      case 'miles_low':
        return (a.miles_price || 0) - (b.miles_price || 0);
      case 'miles_high':
        return (b.miles_price || 0) - (a.miles_price || 0);
      case 'rating':
        return (b.rating || 0) - (a.rating || 0);
      case 'best_value':
      default:
        return (b.savings_percent || 0) - (a.savings_percent || 0);
    }
  });

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#E9EDF2] sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 space-y-4">
          {/* Title */}
          <div>
            <h1 className="text-2xl font-bold text-[#2B2F36]">里程通兑</h1>
            <p className="text-sm text-[#6E7683] mt-1">从飞行到生活，一键尊享</p>
          </div>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6E7683]" />
              <Input
                type="text"
                placeholder="搜索目的地、品牌、服务..."
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

            {/* Filter Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-[#E9EDF2]">
                  <SlidersHorizontal className="w-5 h-5 text-[#6E7683]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[80vh]">
                <SheetHeader>
                  <SheetTitle>筛选与排序</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Sort */}
                  <div>
                    <h3 className="font-semibold text-[#2B2F36] mb-3">排序方式</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {sortOptions.map(option => (
                        <button
                          key={option.id}
                          onClick={() => setSelectedSort(option.id)}
                          className={`p-3 rounded-xl border-2 text-sm font-medium transition-all tap-feedback ${
                            selectedSort === option.id
                              ? 'border-[#00645A] bg-[#E9F7F5] text-[#00645A]'
                              : 'border-[#E9EDF2] text-[#6E7683]'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Available Only */}
                  <div>
                    <label className="flex items-center justify-between p-4 bg-[#E9EDF2] rounded-xl cursor-pointer tap-feedback">
                      <span className="font-medium text-[#2B2F36]">仅显示即时可兑</span>
                      <input
                        type="checkbox"
                        checked={showAvailableOnly}
                        onChange={(e) => setShowAvailableOnly(e.target.checked)}
                        className="w-5 h-5 rounded accent-[#00645A]"
                      />
                    </label>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Category Pills */}
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
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-[#6E7683]">
            共找到 <span className="font-semibold text-[#00645A]">{filteredItems.length}</span> 个结果
          </p>
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="bg-[#E9EDF2] text-[#6E7683]">
              {categories.find(c => c.id === selectedCategory)?.label}
            </Badge>
          )}
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Skeleton key={i} className="h-80 rounded-2xl" />
            ))}
          </div>
        ) : filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {filteredItems.map((item) => (
              <RedeemCard
                key={item.id}
                item={item}
                onClick={() => window.location.href = createPageUrl("RedeemDetail") + `?id=${item.id}`}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <Search className="w-16 h-16 text-[#E9EDF2] mx-auto mb-4" />
            <p className="text-lg font-semibold text-[#2B2F36] mb-2">未找到匹配结果</p>
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