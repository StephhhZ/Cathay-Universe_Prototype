
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Gift, Gavel, Building2, User, Bell } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";

const navigationItems = [
  { name: "Home", title: "首页", icon: Home, url: createPageUrl("Home") },
  { name: "Redeem", title: "通兑", icon: Gift, url: createPageUrl("Redeem") },
  { name: "Auction", title: "竞拍", icon: Gavel, url: createPageUrl("Auction") },
  { name: "Partners", title: "伙伴", icon: Building2, url: createPageUrl("Partners") },
  { name: "Profile", title: "我的", icon: User, url: createPageUrl("Profile") },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  // Check if current page is Welcome or Recommendation
  const isFullscreenPage = currentPageName === "Welcome" || 
                           currentPageName === "Recommendation" ||
                           location.pathname === createPageUrl("Welcome") ||
                           location.pathname === createPageUrl("Recommendation");

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const user = await base44.auth.me();
        const notifications = await base44.entities.Notification.filter({ 
          user_id: user.id, 
          read: false 
        });
        setUnreadCount(notifications.length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchUnreadCount();
  }, [location]);

  return (
    <div className="min-h-screen bg-[#F7F5EF] flex flex-col">
      {/* Header - Hidden on Welcome and Recommendation pages */}
      {!isFullscreenPage && (
        <header className="sticky top-0 z-50 glass-effect border-b border-[#E9EDF2]">
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center p-1.5">
                  <img 
                    src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6914bac5e7905475fc7a8b54/456f7cb15_Cathay-Pacific-Logo.png" 
                    alt="Cathay Pacific"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
              <div>
                <h1 className="text-base font-semibold text-[#00645A] leading-tight">寰宇尊享圈</h1>
                <p className="text-[10px] text-[#6E7683]">Cathay Universe</p>
              </div>
            </div>
            
            <Link to={createPageUrl("Notifications")} className="relative tap-feedback">
              <Bell className="w-6 h-6 text-[#6E7683]" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#C0463B] text-white text-xs border-2 border-white">
                  {unreadCount}
                </Badge>
              )}
            </Link>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={isFullscreenPage ? "flex-1" : "flex-1 pb-20"}>
        {children}
      </main>

      {/* Bottom Navigation - Hidden on Welcome and Recommendation pages */}
      {!isFullscreenPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E9EDF2] safe-area-pb">
          <div className="max-w-7xl mx-auto px-2 h-20 flex items-center justify-around">
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.url;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  to={item.url}
                  className="flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl tap-feedback group"
                >
                  <div className={`p-2 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-[#00645A] text-white' 
                      : 'text-[#6E7683] group-hover:bg-[#E9EDF2]'
                  }`}>
                    <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className={`text-xs font-medium ${
                    isActive ? 'text-[#00645A]' : 'text-[#6E7683]'
                  }`}>
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}

      <style jsx>{`
        .safe-area-pb {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </div>
  );
}
