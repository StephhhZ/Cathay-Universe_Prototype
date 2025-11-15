import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, Shield } from "lucide-react";

const features = [
{
  title: "AI 智能推荐",
  description: "个性化推荐最优兑换方案，里程价值最大化"
},
{
  title: "动态价值指数",
  description: "实时追踪里程价值波动，把握最佳兑换时机"
},
{
  title: "实时竞拍",
  description: "独家体验竞拍，用里程获取稀缺尊享权益"
},
{
  title: "全场景覆盖",
  description: "酒店、餐饮、艺术、健康、购物全方位生活体验"
},
{
  title: "混合支付",
  description: "里程+人民币灵活组合，支持数字人民币"
},
{
  title: "会员等级",
  description: "5级会员体系，专属权益与服务升级"
}];


export default function Welcome() {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate(createPageUrl("Recommendation"));
  };

  return (
    <div className="min-h-screen gradient-cathay overflow-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="w-32 h-32 mx-auto rounded-3xl bg-white flex items-center justify-center mb-8 shadow-2xl animate-fade-in p-4">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6914bac5e7905475fc7a8b54/982d4cfe7_Cathay-Pacific-Logo.png"
              alt="Cathay Pacific"
              className="w-full h-full object-contain" />

          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#004E46] mb-4 animate-slide-in">
            寰宇尊享圈
          </h1>
          <p className="text-xl text-[#004E46] mb-2 animate-slide-in" style={{ animationDelay: '0.1s' }}>Cathay Universe

          </p>
          <p className="text-lg text-[#00645A] max-w-2xl mx-auto animate-slide-in" style={{ animationDelay: '0.2s' }}>
            从飞行到生活，一键尊享 · AI 赋能里程价值最大化
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) =>
          <div
            key={index}
            className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}>

              <h3 className="text-lg font-bold text-[#2B2F36] mb-2">{feature.title}</h3>
              <p className="text-sm text-[#6E7683] leading-relaxed">{feature.description}</p>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-12 animate-fade-in" style={{ animationDelay: '0.9s' }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-[#00645A] mb-2">1000+</p>
              <p className="text-sm text-[#6E7683]">权益商品</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#00645A] mb-2">50+</p>
              <p className="text-sm text-[#6E7683]">覆盖城市</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#00645A] mb-2">100+</p>
              <p className="text-sm text-[#6E7683]">合作品牌</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-[#00645A] mb-2">20%</p>
              <p className="text-sm text-[#6E7683]">平均节省</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center animate-fade-in" style={{ animationDelay: '1s' }}>
          <Button
            onClick={handleGetStarted}
            className="h-16 px-12 rounded-2xl gradient-gold text-white font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 glow-effect">

            <Sparkles className="w-6 h-6 mr-3" />
            立即开启尊享旅程
          </Button>
          <p className="text-[#00645A] mt-6 text-sm font-medium">
            加入寰宇尊享圈，解锁里程无限可能
          </p>
        </div>

        {/* Footer Badge */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/90 backdrop-blur-sm rounded-full shadow-md">
            <Shield className="w-4 h-4 text-[#00645A]" />
            <span className="text-sm text-[#00645A] font-medium">国泰航空官方认证平台</span>
          </div>
        </div>
      </div>
    </div>);

}