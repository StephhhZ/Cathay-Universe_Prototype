import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  User, CreditCard, Receipt, Settings, HelpCircle,
  ChevronRight, LogOut, Shield, Bell, MapPin, Heart,
  Award, TrendingUp, Gift, Crown, Share2 } from
"lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import MemberBadge from "../components/shared/MemberBadge";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);

        const profiles = await base44.entities.MemberProfile.filter({ user_id: currentUser.id });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  const tierBenefits = {
    bronze: ['基础里程累积', '生日礼遇'],
    silver: ['1.2倍里程累积', '贵宾厅权益', '优先客服'],
    gold: ['1.5倍里程累积', '贵宾厅权益', '优先客服', '专属竞拍'],
    jade: ['2倍里程累积', '顶级贵宾厅', '优先客服', '专属竞拍', '管家服务'],
    diamond: ['3倍里程累积', '顶级贵宾厅', '24/7专属客服', '专属竞拍', '私人管家', '限量体验']
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Profile Header */}
      <div className="gradient-cathay text-white px-4 pt-6 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-bold">
              {user?.full_name?.[0] || 'U'}
            </div>
            <div className="flex-1">
              <h1 className="text-yellow-700 text-2xl font-bold">{user?.full_name || '尊贵会员'}</h1>
              <p className="text-yellow-700 mt-1 text-sm">{user?.email}</p>
            </div>
          </div>

          <MemberBadge tier={profile?.tier || 'gold'} size="md" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-8 space-y-6">
        {/* Balance Card */}
        <div className="bg-white rounded-2xl p-6 shadow-md">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-sm text-[#6E7683] mb-1">里程余额</p>
              <p className="text-2xl font-bold text-[#00645A] tabular-nums">
                {(profile?.miles_balance || 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center border-x border-[#E9EDF2]">
              <p className="text-sm text-[#6E7683] mb-1">人民币</p>
              <p className="text-2xl font-bold text-[#00645A] tabular-nums">
                ¥{(profile?.cny_balance || 0).toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-[#6E7683] mb-1">数字人民币</p>
              <p className="text-2xl font-bold text-[#00645A] tabular-nums">
                ¥{(profile?.dcep_balance || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Tier Progress */}
        <div className="bg-gradient-to-br from-[#FFF4E5] to-[#FFE8CC] rounded-2xl p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-[#2B2F36] flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D99B00]" />
                升级进度
              </h3>
              <p className="text-sm text-[#6E7683] mt-1">
                再获得 {Math.round((100 - (profile?.tier_progress || 68)) * 150)} 里程升级至{' '}
                {profile?.tier === 'gold' ? '翡翠卡' : '更高等级'}
              </p>
            </div>
            <Crown className="w-6 h-6 text-[#C6A867]" />
          </div>
          <Progress value={profile?.tier_progress || 68} className="h-3 mb-2" />
          <p className="text-right text-sm font-semibold text-[#D99B00]">{profile?.tier_progress || 68}%</p>
        </div>

        {/* Current Tier Benefits */}
        <div className="bg-white rounded-2xl p-6">
          <h3 className="font-semibold text-[#2B2F36] flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#C6A867]" />
            当前等级权益
          </h3>
          <div className="space-y-2">
            {(tierBenefits[profile?.tier || 'gold'] || []).map((benefit, idx) =>
            <div key={idx} className="flex items-center gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-[#E9F7F5] flex items-center justify-center flex-shrink-0">
                  <Gift className="w-3.5 h-3.5 text-[#00645A]" />
                </div>
                <span className="text-[#2B2F36]">{benefit}</span>
              </div>
            )}
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-3">
          {/* Account */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <MenuItem
              icon={Share2}
              title="邀请好友"
              subtitle="赚取里程奖励"
              href={createPageUrl("Referral")} />

            <MenuItem
              icon={User}
              title="个人信息"
              subtitle="姓名、联系方式"
              href={createPageUrl("ProfileEdit")} />

            <MenuItem
              icon={CreditCard}
              title="支付方式"
              subtitle="管理支付与银行卡"
              href={createPageUrl("PaymentMethods")} />

            <MenuItem
              icon={Receipt}
              title="订单记录"
              subtitle="查看所有订单"
              href={createPageUrl("Orders")} />

            <MenuItem
              icon={Heart}
              title="我的心愿单"
              subtitle="收藏的商品与服务"
              href={createPageUrl("Wishlist")} />

          </div>

          {/* Settings */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <MenuItem
              icon={Bell}
              title="通知设置"
              subtitle="管理推送与提醒"
              href={createPageUrl("Notifications")} />

            <MenuItem
              icon={Shield}
              title="安全与隐私"
              subtitle="密码、两步验证"
              href={createPageUrl("Security")} />

            <MenuItem
              icon={MapPin}
              title="偏好设置"
              subtitle="语言、地区、偏好"
              href={createPageUrl("Preferences")} />

          </div>

          {/* Support */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <MenuItem
              icon={HelpCircle}
              title="帮助中心"
              subtitle="常见问题与支持"
              href={createPageUrl("Help")} />

            <MenuItem
              icon={Settings}
              title="关于我们"
              subtitle="版本 1.0.0"
              href={createPageUrl("About")} />

          </div>

          {/* Logout */}
          <div className="bg-white rounded-2xl overflow-hidden">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 hover:bg-[#FFF5F5] transition-colors tap-feedback">

              <LogOut className="w-5 h-5 text-[#C0463B]" />
              <span className="text-[#C0463B] font-medium">退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>);

}

function MenuItem({ icon: Icon, title, subtitle, href }) {
  return (
    <Link to={href}>
      <div className="flex items-center gap-3 p-4 hover:bg-[#F7F5EF] transition-colors border-b border-[#E9EDF2] last:border-0 tap-feedback">
        <Icon className="w-5 h-5 text-[#00645A]" />
        <div className="flex-1">
          <p className="font-medium text-[#2B2F36]">{title}</p>
          <p className="text-xs text-[#6E7683] mt-0.5">{subtitle}</p>
        </div>
        <ChevronRight className="w-5 h-5 text-[#6E7683]" />
      </div>
    </Link>);

}