import React, { useState } from 'react';
import {
  Sparkles,
  Tag,
  Copy,
  Check,
  Calendar,
  Gift,
  Flame,
  ArrowRight,
  ShoppingBag,
  Percent,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Campaign, Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface CampaignShowcaseProps {
  variant?: 'navbar-banner' | 'apriori-spotlight';
  onFilterCategory?: (category: string) => void;
}

export const CampaignShowcase: React.FC<CampaignShowcaseProps> = ({
  variant = 'navbar-banner',
  onFilterCategory,
}) => {
  const {
    activeCampaigns,
    associationRules,
    products,
    addToCart,
    instantOrder,
    setActiveMathModalRule,
    setActiveCustomerTab,
  } = useApp();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  if (activeCampaigns.length === 0) return null;

  const currentCampaign = activeCampaigns[activeSlide % activeCampaigns.length];

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // Color theme mappings
  const themeClasses: Record<string, { bg: string; text: string; badge: string; border: string; accent: string }> = {
    amber: {
      bg: 'from-[#4D2800] via-[#7A3E00] to-[#3B1C00]',
      text: 'text-amber-100',
      badge: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
      border: 'border-amber-500/30',
      accent: 'bg-amber-500 hover:bg-amber-600 text-white',
    },
    burgundy: {
      bg: 'from-[#5B1423] via-[#7A1C30] to-[#3E0C17]',
      text: 'text-[#F2CAC2]',
      badge: 'bg-[#FAF7F2]/15 text-[#F2CAC2] border-white/20',
      border: 'border-[#7A1C30]/50',
      accent: 'bg-[#9E2A40] hover:bg-[#B3354C] text-white',
    },
    emerald: {
      bg: 'from-[#063826] via-[#0E523A] to-[#042418]',
      text: 'text-emerald-100',
      badge: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
      border: 'border-emerald-500/30',
      accent: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
    rose: {
      bg: 'from-[#52132A] via-[#7D1E42] to-[#3A0C1D]',
      text: 'text-rose-100',
      badge: 'bg-rose-400/20 text-rose-300 border-rose-400/30',
      border: 'border-rose-500/30',
      accent: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    indigo: {
      bg: 'from-[#1E1B4B] via-[#312E81] to-[#17143A]',
      text: 'text-indigo-100',
      badge: 'bg-indigo-400/20 text-indigo-300 border-indigo-400/30',
      border: 'border-indigo-500/30',
      accent: 'bg-indigo-600 hover:bg-indigo-700 text-white',
    },
    purple: {
      bg: 'from-[#3B0764] via-[#581C87] to-[#260542]',
      text: 'text-purple-100',
      badge: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
      border: 'border-purple-500/30',
      accent: 'bg-purple-600 hover:bg-purple-700 text-white',
    },
  };

  const theme = themeClasses[currentCampaign.themeColor] || themeClasses.burgundy;

  // --- Variant 1: Below Navbar Festive Campaign Banner ---
  if (variant === 'navbar-banner') {
    return (
      <div className="w-full mb-6">
        <div
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${theme.bg} text-white shadow-xl border ${theme.border} p-5 sm:p-7 transition-all`}
        >
          {/* Subtle festival sparkles background */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-black/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            
            {/* Left Content */}
            <div className="space-y-2.5 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border backdrop-blur-md ${theme.badge}`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{currentCampaign.badgeText}</span>
                </span>

                <span className="text-[11px] font-mono text-white/80 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Valid till {currentCampaign.endDate}</span>
                </span>

                {currentCampaign.featuredCategory && currentCampaign.featuredCategory !== 'All' && (
                  <span className="text-[10px] bg-white/10 px-2.5 py-0.5 rounded font-semibold text-white">
                    Category: {currentCampaign.featuredCategory}
                  </span>
                )}
              </div>

              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-snug">
                {currentCampaign.title}
              </h2>

              <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
                {currentCampaign.tagline}
              </p>
            </div>

            {/* Right Discount & Actions */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
              
              {/* Promo Code Box */}
              <div className="bg-black/30 backdrop-blur-md rounded-xl p-3 border border-white/15 flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-white/70 uppercase tracking-widest block font-bold">
                    Festive Coupon
                  </span>
                  <span className="font-mono text-base font-extrabold text-amber-300 tracking-wider">
                    {currentCampaign.discountCode}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(currentCampaign.discountCode)}
                  className="p-2 rounded-lg bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
                  title="Copy coupon code"
                >
                  {copiedCode === currentCampaign.discountCode ? (
                    <span className="text-xs flex items-center gap-1 text-emerald-300 font-semibold">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Discount Percentage Callout */}
              <div className="bg-white text-[#2D1217] rounded-xl px-4 py-2.5 text-center shadow-lg border border-white">
                <span className="text-[10px] uppercase font-bold text-[#7A5B61] tracking-wider block">
                  Savings
                </span>
                <span className="font-display text-xl font-extrabold text-[#5B1423] leading-none block">
                  {currentCampaign.discountPercent}% OFF
                </span>
              </div>

              {/* Action Button */}
              {onFilterCategory && currentCampaign.featuredCategory && currentCampaign.featuredCategory !== 'All' ? (
                <button
                  type="button"
                  onClick={() => onFilterCategory(currentCampaign.featuredCategory!)}
                  className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer whitespace-nowrap ${theme.accent}`}
                >
                  Shop {currentCampaign.featuredCategory}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveCustomerTab('recommendations')}
                  className={`px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${theme.accent}`}
                >
                  <span>Explore Offers</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

            </div>

          </div>

          {/* Dots if multiple campaigns */}
          {activeCampaigns.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-white/10">
              {activeCampaigns.map((camp, idx) => (
                <button
                  key={camp.id}
                  onClick={() => setActiveSlide(idx)}
                  className={`h-1.5 rounded-full transition-all cursor-pointer ${
                    activeSlide % activeCampaigns.length === idx
                      ? 'w-6 bg-white'
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`View campaign ${camp.title}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    );
  }

  // --- Variant 2: Around the Explore Apriori Recommendation (Replacing "recently added products") ---
  const topRule = associationRules[0];
  const productMap = new Map(products.map(p => [p.id, p]));
  const p1 = topRule ? productMap.get(topRule.antecedent[0]) : null;
  const p2 = topRule ? productMap.get(topRule.consequent[0]) : null;

  const bundleRawTotal = (p1?.price || 0) + (p2?.price || 0);
  const bundleDiscounted = Math.round(
    bundleRawTotal * (1 - currentCampaign.discountPercent / 100)
  );

  return (
    <div className="my-8 space-y-4">
      <div className="flex items-center justify-between border-b border-[#E8DDD8] pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#5B1423] text-white flex items-center justify-center">
            <Gift className="w-4 h-4 text-[#F2CAC2]" />
          </div>
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[#2D1217]">
              Festival & Season Campaign Showcase
            </h3>
            <p className="text-xs text-[#5C4449]">
              Special campaign perks integrated with our live Apriori association algorithms.
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FCECE9] text-[#5B1423] px-3 py-1 rounded-full border border-[#F2CAC2]">
          {currentCampaign.type === 'festival' ? 'Festival Special' : 'Season Special'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Campaign Announcement Banner (Left - 7 cols) */}
        <div
          className={`lg:col-span-7 rounded-2xl bg-gradient-to-br ${theme.bg} text-white p-6 sm:p-8 flex flex-col justify-between shadow-md border ${theme.border} relative overflow-hidden`}
        >
          <div className="space-y-3 relative z-10">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border ${theme.badge}`}
              >
                {currentCampaign.badgeText}
              </span>
              <span className="text-xs text-white/80 font-mono">
                Code: <strong className="text-amber-300 font-bold">{currentCampaign.discountCode}</strong>
              </span>
            </div>

            <h4 className="font-display text-2xl sm:text-3xl font-semibold leading-tight text-white">
              {currentCampaign.title}
            </h4>

            <p className="text-xs sm:text-sm text-white/90 leading-relaxed font-light">
              {currentCampaign.description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/80 font-mono">
                Valid until {currentCampaign.endDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleCopyCode(currentCampaign.discountCode)}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === currentCampaign.discountCode ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Code {currentCampaign.discountCode}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveCustomerTab('recommendations')}
                className="px-3.5 py-1.5 rounded-lg bg-white text-[#5B1423] text-xs font-bold uppercase tracking-wider hover:bg-[#FAF7F2] transition-colors cursor-pointer shadow-sm"
              >
                View Association Rules
              </button>
            </div>
          </div>
        </div>

        {/* Campaign Apriori Pairing Spotlight (Right - 5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#E8DDD8] p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#F5EBE6]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#5B1423] uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#5B1423]" />
                <span>Featured Festival Pair</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                Extra {currentCampaign.discountPercent}% Off
              </span>
            </div>

            {p1 && p2 ? (
              <div className="my-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-2 rounded-xl bg-[#FAF7F2] border border-[#E8DDD8]">
                    <ImageWithFallback
                      src={p1.imageUrl}
                      alt={p1.title}
                      className="h-24 w-full rounded-lg mb-2"
                    />
                    <div className="text-[10px] uppercase text-[#7A5B61] tracking-wider block">
                      Core Item
                    </div>
                    <div className="text-xs font-semibold text-[#2D1217] truncate">{p1.title}</div>
                    <div className="text-xs font-mono font-bold text-[#5B1423] mt-0.5">
                      {formatPrice(p1.price)}
                    </div>
                  </div>

                  <div className="text-center p-2 rounded-xl bg-[#FCECE9]/40 border border-[#F2CAC2]">
                    <ImageWithFallback
                      src={p2.imageUrl}
                      alt={p2.title}
                      className="h-24 w-full rounded-lg mb-2"
                    />
                    <div className="text-[10px] uppercase text-[#5B1423] font-semibold tracking-wider block">
                      Apriori Co-Match
                    </div>
                    <div className="text-xs font-semibold text-[#2D1217] truncate">{p2.title}</div>
                    <div className="text-xs font-mono font-bold text-[#5B1423] mt-0.5">
                      {formatPrice(p2.price)}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 bg-[#FAF7F2] rounded-xl border border-[#E8DDD8] text-center text-xs">
                  <span className="text-[#7A5B61]">Bundle Value: </span>
                  <span className="line-through font-mono text-[#7A5B61]">
                    {formatPrice(bundleRawTotal)}
                  </span>
                  <span className="mx-1.5 font-bold text-[#5B1423]">→</span>
                  <span className="font-mono font-bold text-[#5B1423] text-sm">
                    {formatPrice(bundleDiscounted)}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">
                    Includes {currentCampaign.discountPercent}% campaign savings
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center text-xs text-[#7A5B61]">
                Pairings calculated dynamically from 200 customer transactions.
              </div>
            )}
          </div>

          {p1 && p2 && (
            <div className="pt-3 border-t border-[#F5EBE6] flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  addToCart(p1, 1);
                  addToCart(p2, 1);
                }}
                className="flex-1 py-2 px-2.5 bg-white hover:bg-[#FAF7F2] text-[#5B1423] border border-[#E8DDD8] text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add Pair</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  addToCart(p1, 1);
                  instantOrder(p2, 1);
                }}
                className="flex-1 py-2 px-2.5 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#F2CAC2]" />
                <span>Order Pair</span>
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
