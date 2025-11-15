import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { 
  Hotel, UtensilsCrossed, Palette, Heart, 
  ShoppingBag, Car, Sparkles, ArrowRight, Check
} from "lucide-react";

const interestOptions = [
  { 
    id: 'hotel', 
    label: '酒店', 
    description: '在旅途中，为自己留一个更美好的夜晚',
    icon: Hotel, 
    color: 'from-blue-500 to-blue-600' 
  },
  { 
    id: 'dining', 
    label: '餐饮', 
    description: '用里程，尝一口城市的灵魂',
    icon: UtensilsCrossed, 
    color: 'from-orange-500 to-orange-600' 
  },
  { 
    id: 'art', 
    label: '艺术', 
    description: '让灵感在你的旅程中闪光',
    icon: Palette, 
    color: 'from-purple-500 to-purple-600' 
  },
  { 
    id: 'wellness', 
    label: '健康', 
    description: '给自己一次全身的温柔修复',
    icon: Heart, 
    color: 'from-red-500 to-red-600' 
  },
  { 
    id: 'shopping', 
    label: '购物', 
    description: '用里程，把想要的生活带回家',
    icon: ShoppingBag, 
    color: 'from-pink-500 to-pink-600' 
  },
  { 
    id: 'transport', 
    label: '交通', 
    description: '把每段出行，都变成轻松愉悦的体验',
    icon: Car, 
    color: 'from-teal-500 to-teal-600' 
  },
];

export default function Recommendation() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleInterest = (id) => {
    setSelectedInterests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    );
  };

  const handleContinue = async () => {
    if (selectedInterests.length === 0) return;

    setIsLoading(true);
    try {
      const user = await base44.auth.me();
      
      const profiles = await base44.entities.MemberProfile.filter({ user_id: user.id });
      
      if (profiles.length > 0) {
        await base44.entities.MemberProfile.update(profiles[0].id, {
          preferences: {
            ...profiles[0].preferences,
            interests: selectedInterests
          }
        });
      } else {
        await base44.entities.MemberProfile.create({
          user_id: user.id,
          tier: 'bronze',
          miles_balance: 68000,
          voucher_count: 3,
          tier_progress: 68,
          preferences: {
            interests: selectedInterests,
            dietary: [],
            non_smoking: true
          }
        });
      }

      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error saving preferences:", error);
      navigate(createPageUrl("Home"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    navigate(createPageUrl("Home"));
  };

  return (
    <div className="min-h-screen gradient-cathay overflow-auto">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-2xl shadow-lg mb-6">
            <Sparkles className="w-8 h-8 text-[#00645A]" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#004E46] mb-4">
            量身定制您的尊享体验
          </h1>
          <p className="text-lg text-[#00645A] max-w-2xl mx-auto">
            选择您感兴趣的生活场景，我们的AI将为您推荐最适合的权益和体验
          </p>
        </div>

        {/* Selection Hint */}
        <div className="text-center mb-8 animate-fade-in" style={{animationDelay: '0.1s'}}>
          <p className="text-sm text-[#004E46] font-medium">
            已选择 <span className="text-xl font-bold text-[#00645A]">{selectedInterests.length}</span> 个场景
            {selectedInterests.length > 0 && <span className="ml-2">✨</span>}
          </p>
        </div>

        {/* Interest Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {interestOptions.map((option, index) => {
            const Icon = option.icon;
            const isSelected = selectedInterests.includes(option.id);
            
            return (
              <button
                key={option.id}
                onClick={() => toggleInterest(option.id)}
                className={`relative p-6 rounded-2xl transition-all duration-300 tap-feedback animate-fade-in ${
                  isSelected
                    ? 'bg-white shadow-2xl scale-105'
                    : 'bg-white/80 hover:bg-white hover:shadow-xl'
                }`}
                style={{animationDelay: `${0.2 + index * 0.05}s`}}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-[#00645A] rounded-full flex items-center justify-center animate-fade-in">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Icon */}
                <div className={`w-16 h-16 mx-auto mb-3 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center shadow-lg ${
                  isSelected ? 'scale-110' : ''
                } transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                </div>

                {/* Label & Description */}
                <div>
                  <p className={`text-base font-semibold text-center mb-1 ${
                    isSelected ? 'text-[#00645A]' : 'text-[#2B2F36]'
                  }`}>
                    {option.label}
                  </p>
                  <p className="text-xs text-[#6E7683] text-center leading-tight">
                    {option.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{animationDelay: '0.5s'}}>
          <Button
            onClick={handleSkip}
            variant="ghost"
            className="text-[#6E7683] hover:text-[#2B2F36] hover:bg-white/50"
            disabled={isLoading}
          >
            暂时跳过
          </Button>
          
          <Button
            onClick={handleContinue}
            disabled={selectedInterests.length === 0 || isLoading}
            className={`h-14 px-8 rounded-xl font-bold text-lg shadow-xl transition-all duration-300 ${
              selectedInterests.length > 0
                ? 'bg-gradient-to-r from-[#00645A] to-[#2FA39A] hover:shadow-2xl hover:scale-105 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              '保存中...'
            ) : (
              <>
                开始体验
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Footer Hint */}
        <div className="text-center mt-12 animate-fade-in" style={{animationDelay: '0.6s'}}>
          <p className="text-sm text-[#00645A]">
            💡 别担心，您随时可以在个人设置中修改这些偏好
          </p>
        </div>
      </div>
    </div>
  );
}