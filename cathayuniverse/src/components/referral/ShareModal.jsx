import React from "react";
import { X, MessageCircle, Share2, Link2, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ShareModal({ referralCode, onClose }) {
  const shareText = `🎉 加入国泰航空寰宇尊享圈！\n\n使用我的专属邀请码 ${referralCode}，立享新人礼遇！\n\n✨ 里程通兑全场景权益\n🎯 AI 智能推荐\n🔥 独家竞拍体验\n\n立即开启尊享旅程 👇`;
  
  const shareUrl = `https://app.cathay-universe.com?ref=${referralCode}`;

  const handleWechatShare = () => {
    // Copy text for WeChat sharing
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    alert("邀请文案已复制！请粘贴到微信分享给好友");
  };

  const handleMomentsShare = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
    alert("邀请文案已复制！请粘贴到朋友圈");
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    alert("邀请链接已复制！");
  };

  const handleQRCode = () => {
    // Would integrate with QR code generation service
    alert("二维码生成功能开发中");
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>分享邀请</span>
            <button onClick={onClose} className="tap-feedback">
              <X className="w-5 h-5 text-[#6E7683]" />
            </button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview */}
          <div className="bg-gradient-to-br from-[#E9F7F5] to-[#E9EDF2] rounded-xl p-4">
            <p className="text-sm text-[#2B2F36] whitespace-pre-line mb-3">{shareText}</p>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-xs text-[#6E7683]">邀请码</p>
              <p className="text-lg font-bold text-[#00645A] tracking-wider">{referralCode}</p>
            </div>
          </div>

          {/* Share Options */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleWechatShare}
              className="h-20 flex-col gap-2 bg-[#07C160] hover:bg-[#06AD56] text-white"
            >
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm">微信好友</span>
            </Button>

            <Button
              onClick={handleMomentsShare}
              className="h-20 flex-col gap-2 bg-[#00645A] hover:bg-[#004E46] text-white"
            >
              <Share2 className="w-6 h-6" />
              <span className="text-sm">朋友圈</span>
            </Button>

            <Button
              onClick={handleCopyLink}
              variant="outline"
              className="h-20 flex-col gap-2 border-[#E9EDF2] hover:bg-[#E9F7F5]"
            >
              <Link2 className="w-6 h-6 text-[#00645A]" />
              <span className="text-sm text-[#00645A]">复制链接</span>
            </Button>

            <Button
              onClick={handleQRCode}
              variant="outline"
              className="h-20 flex-col gap-2 border-[#E9EDF2] hover:bg-[#E9F7F5]"
            >
              <QrCode className="w-6 h-6 text-[#00645A]" />
              <span className="text-sm text-[#00645A]">生成二维码</span>
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-[#FFF4E5] rounded-xl p-3">
            <p className="text-xs text-[#6E7683]">
              💡 <strong>分享提示：</strong>邀请好友完成注册并首次兑换后，您将获得 500 里程奖励
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}