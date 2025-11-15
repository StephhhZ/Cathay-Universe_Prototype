import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import {
  Flame, Clock, TrendingUp, Info, AlertCircle } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Alert,
  AlertDescription } from
"@/components/ui/alert";
import AuctionCard from "../components/shared/AuctionCard";
import { createPageUrl } from "@/utils";

const statusFilters = [
{ id: 'all', label: '全部' },
{ id: 'active', label: '进行中' },
{ id: 'ending_soon', label: '即将结束' },
{ id: 'upcoming', label: '即将开始' }];


export default function Auction() {
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { data: allAuctions = [], isLoading } = useQuery({
    queryKey: ['auction-items'],
    queryFn: () => base44.entities.AuctionItem.list('-created_date', 50)
  });

  // Filter auctions
  const filteredAuctions = allAuctions.filter((item) => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'ending_soon') {
      const timeLeft = new Date(item.ends_at) - new Date();
      return item.status === 'active' && timeLeft < 3600000; // Less than 1 hour
    }
    return item.status === selectedStatus;
  });

  const activeCount = allAuctions.filter((a) => a.status === 'active').length;
  const totalBids = allAuctions.reduce((sum, a) => sum + (a.bidder_count || 0), 0);

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <div className="gradient-cathay text-white px-4 pt-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-stone-50 rounded-xl w-12 h-12 gradient-gold flex items-center justify-center">
              <Flame className="bg-transparent text-black lucide lucide-flame w-6 h-6" />
            </div>
            <div>
              <h1 className="text-yellow-700 text-2xl font-bold">寰宇竞拍厅</h1>
              <p className="text-[#da9f0a] mt-1 text-sm">尊享体验，竞价获得</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-zinc-50 p-3 text-center rounded-xl glass-effect">
              <p className="text-[#00645A] text-2xl font-bold tabular-nums">{activeCount}</p>
              <p className="text-[#00645A] mt-1 text-xs">进行中</p>
            </div>
            <div className="bg-zinc-50 text-zinc-50 p-3 text-center rounded-xl glass-effect">
              <p className="text-[#00645A] text-2xl font-bold tabular-nums">{totalBids}</p>
              <p className="text-[#00645A] mt-1 text-xs">总出价</p>
            </div>
            <div className="bg-zinc-50 p-3 text-center rounded-xl glass-effect">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4 text-[#1E824C]" />
                <p className="text-[#00645A] text-2xl font-bold tabular-nums">8%</p>
              </div>
              <p className="text-[#00645A] mt-1 text-xs">平均节省</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-4">
        {/* Notice */}
        <Alert className="mb-6 border-[#2F80ED] bg-[#EBF5FF]">
          <Info className="h-4 w-4 text-[#2F80ED]" />
          <AlertDescription className="text-sm text-[#2B2F36]">
            <strong>竞拍规则：</strong>每次出价需支付保证金，未中标将全额退还。竞拍结束前5分钟内出价将延长5分钟。
          </AlertDescription>
        </Alert>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
          {statusFilters.map((filter) => {
            const isSelected = selectedStatus === filter.id;
            return (
              <button
                key={filter.id}
                onClick={() => setSelectedStatus(filter.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all tap-feedback ${
                isSelected ?
                'bg-[#00645A] text-white' :
                'bg-white border border-[#E9EDF2] text-[#6E7683] hover:border-[#00645A]'}`
                }>

                {filter.label}
                {filter.id === 'active' && activeCount > 0 &&
                <Badge className="ml-2 bg-[#C0463B] text-white text-xs">{activeCount}</Badge>
                }
              </button>);

          })}
        </div>

        {/* Auctions Grid */}
        {isLoading ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) =>
          <Skeleton key={i} className="h-96 rounded-2xl" />
          )}
          </div> :
        filteredAuctions.length > 0 ?
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
            {filteredAuctions.map((item) =>
          <AuctionCard
            key={item.id}
            item={item}
            onClick={() => window.location.href = createPageUrl("AuctionDetail") + `?id=${item.id}`} />

          )}
          </div> :

        <div className="bg-white rounded-2xl p-12 text-center">
            <Flame className="w-16 h-16 text-[#E9EDF2] mx-auto mb-4" />
            <p className="text-lg font-semibold text-[#2B2F36] mb-2">暂无竞拍</p>
            <p className="text-sm text-[#6E7683]">请稍后查看或关注其他分类</p>
          </div>
        }

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2] rounded-2xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-[#00645A] flex-shrink-0 mt-0.5" />
            <div className="space-y-2">
              <h3 className="font-semibold text-[#2B2F36]">竞拍小贴士</h3>
              <ul className="text-sm text-[#6E7683] space-y-1 list-disc list-inside">
                <li>建议在结束前5分钟密切关注竞拍动态</li>
                <li>保证金将在未中标后24小时内自动退还至账户</li>
                <li>中标后请在7日内完成兑换，逾期视为放弃</li>
                <li>部分高价值拍品可能需要额外的身份验证</li>
              </ul>
            </div>
          </div>
        </div>
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
    </div>);

}