import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Sparkles, ArrowRight, Target, Gift, CheckCircle2,
  Flame, TrendingUp, MapPin } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import MemberBadge from "../components/shared/MemberBadge";
import MilesTag from "../components/shared/MilesTag";
import RedeemCard from "../components/shared/RedeemCard";
import AuctionCard from "../components/shared/AuctionCard";
import ValueChart from "../components/home/ValueChart";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [userPreferences, setUserPreferences] = useState([]);
  const [isPreferencesLoaded, setIsPreferencesLoaded] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const profiles = await base44.entities.MemberProfile.filter({ user_id: currentUser.id });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
          const interests = profiles[0].preferences?.interests;
          if (interests && Array.isArray(interests) && interests.length > 0) {
            setUserPreferences(interests);
          } else {
            setUserPreferences([]);
          }
        } else {
          setUserPreferences([]);
        }
        setIsPreferencesLoaded(true);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserPreferences([]);
        setIsPreferencesLoaded(true);
      }
    };
    fetchUserData();
  }, []);

  const { data: allRedeemItems = [], isLoading: loadingRedeem } = useQuery({
    queryKey: ['featured-redeem'],
    queryFn: () => base44.entities.RedeemItem.list('-created_date', 200)
  });

  const getRecommendedItems = () => {
    if (!isPreferencesLoaded) {
      return [];
    }

    if (!userPreferences || userPreferences.length === 0) {
      return allRedeemItems.slice(0, 4);
    }

    const matchedItems = allRedeemItems.filter(item => 
      item.category && userPreferences.includes(item.category)
    );

    return matchedItems.length > 0 ? matchedItems.slice(0, 4) : allRedeemItems.slice(0, 4);
  };

  const redeemItems = getRecommendedItems();

  const { data: auctionItems = [], isLoading: loadingAuction } = useQuery({
    queryKey: ['featured-auction'],
    queryFn: () => base44.entities.AuctionItem.filter({ status: 'active' }, '-created_date', 2)
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="gradient-cathay text-white px-4 pt-6 pb-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <MemberBadge tier={profile?.tier || 'gold'} size="lg" showLabel={false} />
              <div>
                <h2 className="bg-transparent text-yellow-700 text-2xl font-bold">{user?.full_name || '尊贵会员'}</h2>
                <p className="text-[#da9f0a] text-sm flex items-center gap-1">
                  {profile?.tier === 'gold' ? '金卡' : '会员'} 等级
                  <span className="bg-[#da9f0a] mx-1 text-4xl rounded-full inline-block w-1 h-1"></span>
                  升级进度 {profile?.tier_progress || 68}%
                </p>
              </div>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#ffffff] p-4 rounded-2xl backdrop-blur-sm">
              <p className="bg-transparent text-[#00645A] mb-1 text-xs">里程余额</p>
              <p className="text-[#00645A] text-2xl font-bold tabular-nums">{(profile?.miles_balance || 68000).toLocaleString()}</p>
            </div>
            <div className="bg-[#ffffff] p-4 rounded-2xl backdrop-blur-sm">
              <p className="text-[#00645A] mb-1 text-xs">可用券</p>
              <div className="flex items-baseline gap-2">
                <p className="text-[#00645A] text-2xl font-bold tabular-nums">{profile?.voucher_count || 3}</p>
                <span className="text-[#00645A] text-sm">张</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-4 pb-8 space-y-6">
        {/* Value Index Chart */}
        <ValueChart />

        {/* AI Recommendations */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C6A867]" />
              <h3 className="text-lg font-bold text-[#2B2F36]">AI 尊享推荐</h3>
              {userPreferences.length > 0 && (
                <Badge className="bg-[#E9F7F5] text-[#00645A] text-xs">
                  基于您的兴趣
                </Badge>
              )}
            </div>
            <Link to={createPageUrl("Redeem")}>
              <Button variant="ghost" size="sm" className="text-[#00645A] hover:text-[#004E46]">
                查看更多 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loadingRedeem || !isPreferencesLoaded ?
          <div className="space-y-4">
              {[1, 2].map((i) =>
            <Skeleton key={i} className="h-32 rounded-2xl" />
            )}
            </div> :

          <div className="space-y-3 overflow-x-auto pb-2">
              <div className="flex gap-3 min-w-max md:grid md:grid-cols-2 md:min-w-0">
                {redeemItems.slice(0, 2).map((item) =>
              <div key={item.id} className="w-[85vw] md:w-auto">
                    <RedeemCard
                  item={item}
                  onClick={() => window.location.href = createPageUrl("RedeemDetail") + `?id=${item.id}`} />

                  </div>
              )}
              </div>
            </div>
          }
        </section>

        {/* Tasks & Rewards */}
        <section className="bg-gradient-to-br from-[#FFF4E5] to-[#FFE8CC] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-[#D99B00]" />
            <h3 className="text-lg font-bold text-[#2B2F36]">任务中心</h3>
            <Badge className="bg-[#D99B00] text-white ml-auto">+500里程</Badge>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3 bg-white/80 rounded-xl p-3">
              <CheckCircle2 className="w-5 h-5 text-[#1E824C]" />
              <div className="flex-1">
                <p className="text-sm font-medium text-[#2B2F36]">完成首次兑换</p>
                <p className="text-xs text-[#6E7683]">获得 200 里程奖励</p>
              </div>
              <Button size="sm" className="bg-[#00645A] hover:bg-[#004E46] text-white">
                去完成
              </Button>
            </div>
          </div>
        </section>

        {/* Auction Highlight */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-[#C6A867]" />
              <h3 className="text-lg font-bold text-[#2B2F36]">寰宇竞拍厅</h3>
              <Badge className="bg-[#C0463B] text-white text-xs animate-pulse">热门</Badge>
            </div>
            <Link to={createPageUrl("Auction")}>
              <Button variant="ghost" size="sm" className="text-[#00645A] hover:text-[#004E46]">
                进入竞拍 <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {loadingAuction ?
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2].map((i) =>
            <Skeleton key={i} className="h-64 rounded-2xl" />
            )}
            </div> :
          auctionItems.length > 0 ?
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {auctionItems.map((item) =>
            <AuctionCard
              key={item.id}
              item={item}
              onClick={() => window.location.href = createPageUrl("AuctionDetail") + `?id=${item.id}`} />

            )}
            </div> :

          <div className="bg-white rounded-2xl p-8 text-center">
              <Flame className="w-12 h-12 text-[#E9EDF2] mx-auto mb-3" />
              <p className="text-[#6E7683]">暂无进行中的竞拍</p>
            </div>
          }
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 gap-3">
          <Link to={createPageUrl("Redeem")}>
            <div className="bg-white rounded-2xl p-5 text-center tap-feedback hover:shadow-md transition-shadow">
              <Gift className="w-8 h-8 text-[#00645A] mx-auto mb-2" />
              <p className="font-semibold text-[#2B2F36] text-sm">立即通兑</p>
              <p className="text-xs text-[#6E7683] mt-1">上千种权益可选</p>
            </div>
          </Link>
          <Link to={createPageUrl("Referral")}>
            <div className="bg-white rounded-2xl p-5 text-center tap-feedback hover:shadow-md transition-shadow">
              <TrendingUp className="w-8 h-8 text-[#2FA39A] mx-auto mb-2" />
              <p className="font-semibold text-[#2B2F36] text-sm">邀请好友</p>
              <p className="text-xs text-[#6E7683] mt-1">赚取额外里程</p>
            </div>
          </Link>
        </section>
      </div>
    </div>);

}