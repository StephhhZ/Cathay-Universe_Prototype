import Layout from "./Layout.jsx";

import Home from "./Home";

import Redeem from "./Redeem";

import Auction from "./Auction";

import Partners from "./Partners";

import Profile from "./Profile";

import RedeemDetail from "./RedeemDetail";

import Welcome from "./Welcome";

import Recommendation from "./Recommendation";

import Referral from "./Referral";

import ReferralReward from "./ReferralReward";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    Redeem: Redeem,
    
    Auction: Auction,
    
    Partners: Partners,
    
    Profile: Profile,
    
    RedeemDetail: RedeemDetail,
    
    Welcome: Welcome,
    
    Recommendation: Recommendation,
    
    Referral: Referral,
    
    ReferralReward: ReferralReward,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/Redeem" element={<Redeem />} />
                
                <Route path="/Auction" element={<Auction />} />
                
                <Route path="/Partners" element={<Partners />} />
                
                <Route path="/Profile" element={<Profile />} />
                
                <Route path="/RedeemDetail" element={<RedeemDetail />} />
                
                <Route path="/Welcome" element={<Welcome />} />
                
                <Route path="/Recommendation" element={<Recommendation />} />
                
                <Route path="/Referral" element={<Referral />} />
                
                <Route path="/ReferralReward" element={<ReferralReward />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}