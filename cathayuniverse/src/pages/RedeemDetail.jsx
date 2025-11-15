import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  ArrowLeft, MapPin, Star, Phone, Clock, AlertCircle,
  CheckCircle, Calendar, Heart, Share2, Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Alert,
  AlertDescription,
} from "@/components/ui/alert";
import MilesTag from "../components/shared/MilesTag";
import { Skeleton } from "@/components/ui/skeleton";

export default function RedeemDetail() {
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');
      if (id) {
        try {
          const items = await base44.entities.RedeemItem.filter({ id });
          if (items.length > 0) {
            setItem(items[0]);
          }
        } catch (error) {
          console.error("Error fetching item:", error);
        }
      }
      setLoading(false);
    };
    fetchItem();
  }, []);

  const handleRedeem = () => {
    navigate(createPageUrl("Checkout") + `?type=redeem&id=${item.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Skeleton className="h-96" />
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-[#E9EDF2] mx-auto mb-4" />
          <p className="text-lg font-semibold text-[#2B2F36]">未找到商品</p>
          <Button onClick={() => navigate(-1)} className="mt-4">返回</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-white border-b border-[#E9EDF2]">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="tap-feedback">
            <ArrowLeft className="w-6 h-6 text-[#2B2F36]" />
          </button>
          <div className="flex gap-2">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="p-2 rounded-lg hover:bg-[#E9EDF2] tap-feedback"
            >
              <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-[#C0463B] text-[#C0463B]' : 'text-[#6E7683]'}`} />
            </button>
            <button className="p-2 rounded-lg hover:bg-[#E9EDF2] tap-feedback">
              <Share2 className="w-6 h-6 text-[#6E7683]" />
            </button>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative aspect-[16/10] bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2]">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Star className="w-24 h-24 text-white" />
          </div>
        )}
        
        {item.savings_percent && (
          <div className="absolute top-4 left-4">
            <div className="px-3 py-1.5 bg-[#1E824C] text-white rounded-xl text-sm font-bold">
              立省 {item.savings_percent}%
            </div>
          </div>
        )}

        {item.available && (
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 glass-effect rounded-xl text-sm font-medium text-[#1E824C]">
              <CheckCircle className="w-4 h-4" />
              <span>即时可兑</span>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Title & Rating */}
        <div>
          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags?.map((tag, idx) => (
              <Badge key={idx} variant="secondary" className="bg-[#E9EDF2] text-[#6E7683]">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-[#2B2F36] mb-3">{item.title}</h1>
          <div className="flex items-center gap-4">
            {item.rating && (
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-[#C6A867] text-[#C6A867]" />
                <span className="font-semibold text-[#2B2F36]">{item.rating}</span>
                <span className="text-sm text-[#6E7683]">/5.0</span>
              </div>
            )}
            {item.partner_name && (
              <span className="text-sm font-medium text-[#6E7683]">{item.partner_name}</span>
            )}
          </div>
        </div>

        {/* AI Recommendation */}
        {item.savings_percent > 10 && (
          <Alert className="border-[#00645A] bg-[#E9F7F5]">
            <Info className="h-4 w-4 text-[#00645A]" />
            <AlertDescription className="text-sm text-[#2B2F36]">
              <strong>AI 推荐：</strong>本周使用里程更划算，相比直接购买节省 {item.savings_percent}%
            </AlertDescription>
          </Alert>
        )}

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#E9EDF2]">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#6E7683] mb-2">所需里程</p>
              <MilesTag miles={item.miles_price} variant="default" className="mb-3" />
              {item.original_price && (
                <p className="text-sm text-[#6E7683]">
                  原价 <span className="line-through">¥{item.original_price.toLocaleString()}</span>
                </p>
              )}
            </div>
            {item.hybrid_price && (
              <div className="text-right">
                <p className="text-sm text-[#6E7683] mb-2">混合支付</p>
                <p className="font-semibold text-[#2B2F36]">
                  {item.hybrid_price.miles.toLocaleString()} 里程
                </p>
                <p className="text-sm text-[#00645A]">+ ¥{item.hybrid_price.cny}</p>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold text-[#2B2F36] mb-3">商品详情</h3>
            <p className="text-sm text-[#6E7683] leading-relaxed whitespace-pre-line">
              {item.description}
            </p>
          </div>
        )}

        {/* Location */}
        {item.location && (
          <div className="bg-white rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5 text-[#00645A]" />
              <h3 className="font-semibold text-[#2B2F36]">地点信息</h3>
            </div>
            <p className="text-sm text-[#6E7683]">{item.location}</p>
          </div>
        )}

        {/* Rules */}
        {item.rules && (
          <div className="bg-white rounded-2xl p-6">
            <h3 className="font-semibold text-[#2B2F36] mb-4">使用规则</h3>
            <div className="space-y-3 text-sm">
              {item.rules.refund_policy && (
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[#6E7683] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#2B2F36] mb-1">退改政策</p>
                    <p className="text-[#6E7683]">{item.rules.refund_policy}</p>
                  </div>
                </div>
              )}
              {item.rules.valid_until && (
                <div className="flex gap-3">
                  <Calendar className="w-5 h-5 text-[#6E7683] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-[#2B2F36] mb-1">有效期至</p>
                    <p className="text-[#6E7683]">{new Date(item.rules.valid_until).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Fixed Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9EDF2] p-4 z-50">
        <div className="max-w-7xl mx-auto flex gap-3">
          <Button
            variant="outline"
            className="flex-1 h-14 rounded-xl border-[#00645A] text-[#00645A]"
            onClick={() => navigate(createPageUrl("Checkout") + `?type=redeem&id=${item.id}&hybrid=true`)}
          >
            混合支付
          </Button>
          <Button
            className="flex-1 h-14 rounded-xl gradient-cathay text-white"
            onClick={handleRedeem}
          >
            立即兑换
          </Button>
        </div>
      </div>
    </div>
  );
}