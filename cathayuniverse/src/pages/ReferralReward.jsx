import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Gift, TrendingUp } from "lucide-react";

export default function ReferralReward() {
  const navigate = useNavigate();

  // This page is shown after a referral reward is credited
  const rewardMiles = 500;
  const rewardVouchers = 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2] flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        {/* Success Animation */}
        <div className="text-center animate-fade-in">
          <div className="relative inline-block">
            <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-2xl mb-6">
              <CheckCircle2 className="w-12 h-12 text-[#1E824C] animate-pulse" />
            </div>
            <div className="absolute -top-2 -right-2 bg-[#C6A867] rounded-full w-8 h-8 flex items-center justify-center animate-bounce">
              <Gift className="w-4 h-4 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-[#2B2F36] mb-2">🎉 恭喜您！</h1>
          <p className="text-[#6E7683]">邀请奖励已到账</p>
        </div>

        {/* Reward Details */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in">
          <div className="text-center mb-6">
            <p className="text-sm text-[#6E7683] mb-2">您获得了</p>
            <div className="flex items-center justify-center gap-4">
              <div>
                <p className="text-4xl font-bold text-[#C6A867] tabular-nums">{rewardMiles}</p>
                <p className="text-sm text-[#6E7683] mt-1">里程</p>
              </div>
              {rewardVouchers > 0 && (
                <>
                  <div className="w-px h-12 bg-[#E9EDF2]"></div>
                  <div>
                    <p className="text-4xl font-bold text-[#00645A] tabular-nums">{rewardVouchers}</p>
                    <p className="text-sm text-[#6E7683] mt-1">竞拍券</p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-[#E9F7F5] rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1E824C] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#2B2F36]">您的好友已成功完成首次兑换</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1E824C] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#2B2F36]">奖励已自动添加至您的账户</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#1E824C] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#2B2F36]">继续邀请好友，获得更多奖励</p>
            </div>
          </div>
        </div>

        {/* Next Milestone */}
        <div className="bg-white rounded-2xl p-6 shadow-lg animate-slide-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-[#C6A867]" />
            <h3 className="font-bold text-[#2B2F36]">继续努力</h3>
          </div>
          <p className="text-sm text-[#6E7683]">
            再邀请 <strong className="text-[#00645A]">2</strong> 位好友，即可获得 <strong className="text-[#C6A867]">1000</strong> 里程 + <strong className="text-[#00645A]">1</strong> 张竞拍券
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <Button
            onClick={() => navigate(createPageUrl("Referral"))}
            className="w-full h-12 bg-[#00645A] hover:bg-[#004E46] text-white rounded-xl"
          >
            继续邀请好友
          </Button>

          <Button
            onClick={() => navigate(createPageUrl("Home"))}
            variant="outline"
            className="w-full h-12 rounded-xl border-[#E9EDF2]"
          >
            返回首页
          </Button>
        </div>
      </div>
    </div>
  );
}