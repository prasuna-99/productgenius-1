import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { currentRole, switchRole } = useApp();

  return (
    <footer className="bg-[#24080E] text-[#FAF7F2] border-t border-[#460F1A] mt-24">
      {/* Brand assurance pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-[#3D0F18]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Sparkles className="w-5 h-5 text-[#F2CAC2]" />
            <h4 className="text-sm font-semibold text-[#FAF7F2]">Apriori Intelligence</h4>
            <p className="text-xs text-[#D8B7BE] leading-relaxed">
              Every recommendation mathematically computed from high-confidence association rules.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F2CAC2]" />
            <h4 className="text-sm font-semibold text-[#FAF7F2]">Verified Quality</h4>
            <p className="text-xs text-[#D8B7BE] leading-relaxed">
              Luxury Skincare, Makeup, Bodycare, and Fragrance curated by boutique merchants in Rs.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <HeartHandshake className="w-5 h-5 text-[#F2CAC2]" />
            <h4 className="text-sm font-semibold text-[#FAF7F2]">Tri-Role Architecture</h4>
            <p className="text-xs text-[#D8B7BE] leading-relaxed">
              Seamlessly toggle between Shopper, Artisan Merchant, and Platform Admin consoles.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start gap-2">
            <RefreshCw className="w-5 h-5 text-[#F2CAC2]" />
            <h4 className="text-sm font-semibold text-[#FAF7F2]">Live Market Baskets</h4>
            <p className="text-xs text-[#D8B7BE] leading-relaxed">
              Real-time frequent itemset mining ensures recommendations dynamically adapt to purchasing behavior.
            </p>
          </div>
        </div>
      </div>

      {/* Main footer navigation & branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          <div className="md:col-span-2 space-y-4">
            <span className="font-display text-2xl font-semibold tracking-tight text-[#FAF7F2]">
              ProductGenius
            </span>
            <p className="text-xs text-[#D8B7BE] leading-relaxed max-w-sm">
              The premier intelligent commerce destination combining artisanal luxury with data-driven Apriori market basket association rule discovery.
            </p>
            <div className="text-xs text-[#E8B4B8] pt-2">
              Color Signature: Deep Burgundy · Powder Blush · Warm Ivory
            </div>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#FAF7F2] uppercase tracking-wider mb-3">Customer Spaces</h5>
            <ul className="space-y-2 text-xs text-[#D8B7BE]">
              <li><button onClick={() => switchRole('customer')} className="hover:text-white transition-colors cursor-pointer">Curated Catalog</button></li>
              <li><button onClick={() => switchRole('customer')} className="hover:text-white transition-colors cursor-pointer">Apriori Recommendations</button></li>
              <li><button onClick={() => switchRole('customer')} className="hover:text-white transition-colors cursor-pointer">My Orders & Tracking</button></li>
              <li><button onClick={() => switchRole('customer')} className="hover:text-white transition-colors cursor-pointer">Curated Wishlist</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#FAF7F2] uppercase tracking-wider mb-3">Merchant & Ops</h5>
            <ul className="space-y-2 text-xs text-[#D8B7BE]">
              <li><button onClick={() => switchRole('seller')} className="hover:text-white transition-colors cursor-pointer">Artisan Merchant Hub</button></li>
              <li><button onClick={() => switchRole('seller')} className="hover:text-white transition-colors cursor-pointer">Inventory Management</button></li>
              <li><button onClick={() => switchRole('seller')} className="hover:text-white transition-colors cursor-pointer">Cross-Sell Opportunity Mining</button></li>
              <li><button onClick={() => switchRole('admin')} className="hover:text-white transition-colors cursor-pointer">Admin Apriori Engine Studio</button></li>
            </ul>
          </div>

          <div>
            <h5 className="text-xs font-semibold text-[#FAF7F2] uppercase tracking-wider mb-3">Apriori Math</h5>
            <p className="text-xs text-[#D8B7BE] leading-relaxed mb-3">
              Calculating Support $P(A \cup B)$ and Confidence $P(B|A)$ across all transactions to uncover high-affinity purchase pairs.
            </p>
            <div className="inline-block text-[11px] font-mono text-[#F2CAC2] bg-[#3D0F18] px-2.5 py-1 rounded">
              min_sup: 15% · min_conf: 50%
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[#3D0F18] flex flex-col sm:flex-row items-center justify-between text-xs text-[#B8969E] gap-4">
          <div>
            © 2026 ProductGenius Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <span>Current Role: <strong className="text-white capitalize">{currentRole}</strong></span>
            <span>·</span>
            <span>Zero Slop · Precision Engineered</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
