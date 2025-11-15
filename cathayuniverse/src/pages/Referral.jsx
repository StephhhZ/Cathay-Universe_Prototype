import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { 
  Share2, Gift, Users, TrendingUp, Copy, Check,
  Shield, Sparkles, Award, AlertCircle, ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import ShareModal from "../components/referral/ShareModal";

export default function Referral() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const profiles = await base44.entities.MemberProfile.filter({ user_id: currentUser.id });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }

        // Generate or get referral code
        const code = `CX${currentUser.id.substring(0, 8).toUpperCase()}`;
        setReferralCode(code);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const { data: referrals = [] } = useQuery({
    queryKey: ['my-referrals', user?.id],
    queryFn: () => user ? base44.entities.Referral.filter({ referrer_id: user.id }) : [],
    enabled: !!user
  });

  const completedReferrals = referrals.filter(r => r.status === 'completed' || r.status === 'rewarded').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const totalRewardedMiles = referrals.reduce((sum, r) => sum + (r.reward_miles || 0), 0);

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  // Milestone rewards
  const milestones = [
    { count: 1, miles: 500, vouchers: 0, label: "首次邀请" },
    { count: 3, miles: 1000, vouchers: 1, label: "邀请3人" },
    { count: 5, miles: 2000, vouchers: 2, label: "邀请5人" },
    { count: 10, miles: 5000, vouchers: 5, label: "邀请10人" },
  ];

  const nextMilestone = milestones.find(m => m.count > completedReferrals);
  const progress = nextMilestone ? (completedReferrals / nextMilestone.count) * 100 : 100;

  return (
    <div className="min-h-screen bg-[#F7F5EF] pb-8">
      {/* Header */}
      <div className="bg-white border-b border-[#E9EDF2] px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-xl bg-[#E9F7F5] flex items-center justify-center tap-feedback hover:bg-[#d5ebe8] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-[#00645A]" />
            </button>
            <div className="bg-[#E9F7F5] rounded-xl w-12 h-12 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-[#00645A]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2B2F36]">宣传奖赏计划</h1>
              <p className="text-[#6E7683] text-sm mt-1">邀请好友，共享里程</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-6 space-y-6">
        {/* Referral Code Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="w-5 h-5 text-[#C6A867]" />
            <h3 className="font-bold text-[#2B2F36]">您的专属邀请码</h3>
          </div>

          <div className="bg-gradient-to-br from-[#00645A] to-[#2FA39A] rounded-2xl p-6 text-white mb-4">
            <p className="text-sm text-white/80 mb-2">邀请码</p>
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold tracking-wider">{referralCode}</p>
              <Button
                onClick={handleCopy}
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleShare}
              className="w-full h-12 bg-[#00645A] hover:bg-[#004E46] text-white rounded-xl"
            >
              <Share2 className="w-5 h-5 mr-2" />
              立即分享邀请
            </Button>
            
            <div className="flex items-center gap-2 text-sm text-[#6E7683]">
              <Shield className="w-4 h-4 text-[#00645A]" />
              <span>每成功邀请1位好友完成首次兑换，获得 500 里程</span>
            </div>
          </div>
        </div>

        {/* Progress to Next Milestone */}
        {nextMilestone && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-[#C6A867]" />
                <h3 className="font-bold text-[#2B2F36]">升级进度</h3>
              </div>
              <Badge className="bg-[#E9F7F5] text-[#00645A]">
                {completedReferrals}/{nextMilestone.count}
              </Badge>
            </div>

            <Progress value={progress} className="h-3 mb-4" />

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#6E7683]">下一阶段奖励</p>
                <p className="font-semibold text-[#2B2F36]">{nextMilestone.label}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-[#C6A867]">{nextMilestone.miles}</p>
                <p className="text-xs text-[#6E7683]">里程</p>
              </div>
            </div>
          </div>
        )}

        {/* Milestone Rewards */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-[#C6A867]" />
            <h3 className="font-bold text-[#2B2F36]">阶梯奖励</h3>
          </div>

          <div className="space-y-3">
            {milestones.map((milestone, idx) => {
              const isCompleted = completedReferrals >= milestone.count;
              const isCurrent = nextMilestone?.count === milestone.count;

              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                    isCompleted
                      ? 'border-[#1E824C] bg-[#E8F5E9]'
                      : isCurrent
                      ? 'border-[#00645A] bg-[#E9F7F5]'
                      : 'border-[#E9EDF2] bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      isCompleted ? 'bg-[#1E824C]' : isCurrent ? 'bg-[#00645A]' : 'bg-[#E9EDF2]'
                    }`}>
                      {isCompleted ? (
                        <Check className="w-5 h-5 text-white" />
                      ) : (
                        <span className={`font-bold ${isCurrent ? 'text-white' : 'text-[#6E7683]'}`}>
                          {milestone.count}
                        </span>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-[#2B2F36]">{milestone.label}</p>
                      <p className="text-sm text-[#6E7683]">邀请 {milestone.count} 位好友</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#C6A867]">{milestone.miles}</p>
                    <p className="text-xs text-[#6E7683]">里程</p>
                    {milestone.vouchers > 0 && (
                      <p className="text-xs text-[#00645A]">+{milestone.vouchers} 竞拍券</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2] rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-[#00645A]" />
            <h3 className="font-bold text-[#2B2F36]">如何获得奖励</h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-[#00645A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-[#2B2F36]">分享邀请码</p>
                <p className="text-sm text-[#6E7683]">通过微信、朋友圈或其他社交平台分享</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#00645A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-[#2B2F36]">好友注册</p>
                <p className="text-sm text-[#6E7683]">好友使用您的邀请码完成注册</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="bg-[#00645A] text-white w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-[#2B2F36]">完成首次兑换</p>
                <p className="text-sm text-[#6E7683]">好友完成首次权益兑换后，奖励即时到账</p>
              </div>
            </div>
          </div>
        </div>

        {/* Anti-Fraud Notice */}
        <Alert className="border-[#D99B00] bg-[#FFF4E5]">
          <AlertCircle className="h-4 w-4 text-[#D99B00]" />
          <AlertDescription className="text-sm text-[#2B2F36]">
            <strong>反作弊提醒：</strong>严禁使用虚假账号或恶意刷单行为。一经发现，将取消所有奖励并可能冻结账户。我们保留最终解释权。
          </AlertDescription>
        </Alert>

        {/* My Referrals */}
        {referrals.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-[#00645A]" />
              <h3 className="font-bold text-[#2B2F36]">我的邀请记录</h3>
            </div>

            <div className="space-y-2">
              {referrals.slice(0, 5).map((referral) => (
                <div
                  key={referral.id}
                  className="flex items-center justify-between p-3 bg-[#F7F5EF] rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E9EDF2] flex items-center justify-center">
                      <Users className="w-5 h-5 text-[#6E7683]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2B2F36]">邀请用户</p>
                      <p className="text-xs text-[#6E7683]">
                        {new Date(referral.created_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={
                      referral.status === 'rewarded'
                        ? 'bg-[#1E824C] text-white'
                        : referral.status === 'completed'
                        ? 'bg-[#2F80ED] text-white'
                        : 'bg-[#E9EDF2] text-[#6E7683]'
                    }
                  >
                    {referral.status === 'rewarded' ? '已奖励' : 
                     referral.status === 'completed' ? '已完成' : '待完成'}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal
          referralCode={referralCode}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </div>
  );
}