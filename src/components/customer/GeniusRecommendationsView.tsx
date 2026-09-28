import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  TrendingUp,
  Percent,
  CheckCircle2,
  Plus,
  ShoppingBag,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';
import { formatPrice } from '../../utils/format';
import { ImageWithFallback } from '../common/ImageWithFallback';

export const GeniusRecommendationsView: React.FC = () => {
  const {
    products,
    associationRules,
    frequentItemsets,
    transactions,
    addToCart,
    instantOrder,
    setActiveMathModalRule,
    setSelectedProductDetail,
    minSupport,
    minConfidence,
  } = useApp();

  const productMap = new Map(products.map(p => [p.id, p]));

  // Selected seed item for interactive Apriori basket pairing simulator
  const [selectedSeedProductId, setSelectedSeedProductId] = useState<string>(
    products[0]?.id || 'pg-skn-01'
  );

  // Mined rules where antecedent contains the selected seed product
  const matchingSeedRules = associationRules.filter(r =>
    r.antecedent.includes(selectedSeedProductId)
  );

  // Top overall rules with highest confidence & support
  const topRules = [...associationRules]
    .sort((a, b) => b.confidence * b.support - a.confidence * a.support)
    .slice(0, 6);

  const selectedSeedProduct = productMap.get(selectedSeedProductId);

  const handleAddBundle = (p1: Product, p2: Product) => {
    addToCart(p1, 1);
    addToCart(p2, 1);
  };

  const handleOrderBundle = (p1: Product, p2: Product) => {
    addToCart(p1, 1);
    instantOrder(p2, 1);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Editorial Hero Header */}
      <div className="bg-gradient-to-r from-[#5B1423] via-[#7A1C30] to-[#4A0E18] text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-[#460F1A] relative overflow-hidden">
        <div className="max-w-2xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#FAF7F2]/10 backdrop-blur-md px-3 py-1 rounded-full text-xs text-[#F2CAC2] border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-[#F2CAC2]" />
            <span>Mathematical Market Basket Mining Engine</span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-white leading-tight">
            Curated by Apriori Association Intelligence
          </h1>

          <p className="text-sm text-[#E8DDD8] leading-relaxed">
            ProductGenius analyzes <strong>200 verified customer checkout transactions</strong> across Skincare, Makeup, Bodycare, and Fragrance using the <strong>Apriori Algorithm</strong>. We identify items with the highest rates of <strong>Support</strong> (transaction frequency) and <strong>Confidence</strong> (conditional purchase likelihood).
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-[#F2CAC2]">
            <span>Active Transactions: <strong>{transactions.length}</strong></span>
            <span>·</span>
            <span>Frequent Itemsets: <strong>{frequentItemsets.length}</strong></span>
            <span>·</span>
            <span>Mined Rules: <strong>{associationRules.length}</strong></span>
            <span>·</span>
            <span>min_sup: {(minSupport * 100).toFixed(0)}% / min_conf: {(minConfidence * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 bg-[#9E2A40]/30 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Feature 1: Highest Support & Confidence Top Mined Pairs */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E8DDD8] pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#7A5B61] font-semibold">
              Highest Rate of Support & Confidence
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D1217] tracking-tight">
              Top Proven Association Rules
            </h2>
          </div>
          <p className="text-xs text-[#5C4449] max-w-md">
            Mined co-purchase patterns with statistically significant positive lift (&gt; 1.0), indicating genuine customer preference affinity across 200 orders.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topRules.map((rule, idx) => {
            const antecedentProduct = productMap.get(rule.antecedent[0]);
            const consequentProduct = productMap.get(rule.consequent[0]);
            if (!antecedentProduct || !consequentProduct) return null;

            const confPct = Math.round(rule.confidence * 100);
            const supPct = Math.round(rule.support * 100);
            const bundlePrice = antecedentProduct.price + consequentProduct.price;
            const discountedBundle = Math.round(bundlePrice * 0.9); // 10% bundle discount

            return (
              <div
                key={rule.id}
                className="bg-white rounded-2xl border border-[#E8DDD8] p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Top Stats Banner */}
                  <div className="flex items-center justify-between pb-3 border-b border-[#F5EBE6]">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#5B1423]">
                      <Sparkles className="w-3.5 h-3.5 text-[#5B1423]" />
                      <span>Pair #{idx + 1}</span>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="bg-[#FCECE9] text-[#5B1423] px-2 py-0.5 rounded font-bold">
                        {confPct}% Confidence
                      </span>
                      <span className="text-[#7A5B61]">
                        {supPct}% Support
                      </span>
                    </div>
                  </div>

                  {/* Visual Pair Showcase */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    {/* Item A */}
                    <div
                      onClick={() => setSelectedProductDetail(antecedentProduct)}
                      className="cursor-pointer group text-center"
                    >
                      <div className="rounded-lg overflow-hidden border border-[#E8DDD8] bg-[#FAF7F2] aspect-square mb-2">
                        <ImageWithFallback
                          src={antecedentProduct.imageUrl}
                          alt={antecedentProduct.title}
                          className="w-full h-full group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] text-[#7A5B61] uppercase tracking-wider block">
                        If You Buy
                      </span>
                      <h4 className="text-xs font-semibold text-[#2D1217] truncate">
                        {antecedentProduct.title}
                      </h4>
                      <div className="text-xs font-mono font-bold text-[#5B1423]">
                        {formatPrice(antecedentProduct.price)}
                      </div>
                    </div>

                    {/* Item B */}
                    <div
                      onClick={() => setSelectedProductDetail(consequentProduct)}
                      className="cursor-pointer group text-center"
                    >
                      <div className="rounded-lg overflow-hidden border border-[#F2CAC2] bg-[#FCECE9]/30 aspect-square mb-2">
                        <ImageWithFallback
                          src={consequentProduct.imageUrl}
                          alt={consequentProduct.title}
                          className="w-full h-full group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="text-[10px] text-[#5B1423] font-semibold uppercase tracking-wider block">
                        Recommended
                      </span>
                      <h4 className="text-xs font-semibold text-[#2D1217] truncate">
                        {consequentProduct.title}
                      </h4>
                      <div className="text-xs font-mono font-bold text-[#5B1423]">
                        {formatPrice(consequentProduct.price)}
                      </div>
                    </div>
                  </div>

                  {/* Association Explanation */}
                  <p className="text-xs text-[#5C4449] bg-[#FAF7F2] p-2.5 rounded-lg border border-[#E8DDD8] leading-snug">
                    <strong>Rule Math:</strong> {confPct}% of customers who ordered {antecedentProduct.title.split(' ')[0]} also ordered {consequentProduct.title.split(' ')[0]} (Lift: {rule.lift}x).
                  </p>
                </div>

                {/* Bottom Actions */}
                <div className="mt-4 pt-3 border-t border-[#F5EBE6] space-y-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleAddBundle(antecedentProduct, consequentProduct)}
                      className="flex-1 py-2 px-2.5 bg-white hover:bg-[#FAF7F2] text-[#5B1423] border border-[#E8DDD8] text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add Pair</span>
                    </button>
                    <button
                      onClick={() => handleOrderBundle(antecedentProduct, consequentProduct)}
                      className="flex-1 py-2 px-2.5 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#F2CAC2]" />
                      <span>Order ({formatPrice(discountedBundle)})</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setActiveMathModalRule(rule)}
                    className="w-full text-center text-xs text-[#7A1C30] hover:underline cursor-pointer flex items-center justify-center gap-1"
                  >
                    <span>View Apriori Derivation & Proof</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feature 2: Interactive Apriori Basket Simulator */}
      <div className="bg-white rounded-2xl border border-[#E8DDD8] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#5B1423] mb-1">
            <Sliders className="w-3.5 h-3.5" /> Interactive Algorithm Playground
          </div>
          <h3 className="font-display text-2xl font-semibold text-[#2D1217]">
            Simulate Your Basket: Mine Live Associations
          </h3>
          <p className="text-xs text-[#5C4449] mt-1 leading-relaxed">
            Select any product from our inventory below. The Apriori engine immediately inspects all mined frequent itemsets to output the product with the highest conditional affinity.
          </p>
        </div>

        {/* Product Selector Ribbon */}
        <div>
          <label className="block text-xs font-semibold text-[#7A5B61] uppercase tracking-wider mb-2">
            Step 1: Choose Your Primary Interest Item
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {products.slice(0, 4).map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedSeedProductId(p.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                  selectedSeedProductId === p.id
                    ? 'border-[#5B1423] bg-[#FCECE9] shadow-sm'
                    : 'border-[#E8DDD8] bg-[#FAF7F2] hover:border-[#7A1C30]'
                }`}
              >
                <ImageWithFallback
                  src={p.imageUrl}
                  alt={p.title}
                  className="w-12 h-12 rounded-lg border border-[#E8DDD8]"
                />
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#2D1217] truncate">{p.title}</div>
                  <div className="text-xs font-mono font-bold text-[#5B1423]">{formatPrice(p.price)}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Mined Association Results */}
        <div className="pt-4 border-t border-[#E8DDD8]">
          <label className="block text-xs font-semibold text-[#7A5B61] uppercase tracking-wider mb-3">
            Step 2: Apriori Engine Outputs for {selectedSeedProduct?.title}
          </label>

          {matchingSeedRules.length === 0 ? (
            <div className="p-8 text-center bg-[#FAF7F2] rounded-xl border border-dashed border-[#E8DDD8] text-xs text-[#7A5B61]">
              No association rules meet the current threshold of min_conf: {(minConfidence * 100).toFixed(0)}%.
              Adjust thresholds in the Admin Dashboard or inspect other catalog items!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingSeedRules.map(rule => {
                const conseqProd = productMap.get(rule.consequent[0]);
                if (!conseqProd) return null;

                const confPct = Math.round(rule.confidence * 100);
                const supPct = Math.round(rule.support * 100);

                return (
                  <div
                    key={rule.id}
                    className="p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DDD8] flex flex-col justify-between"
                  >
                    <div className="flex gap-4 items-start">
                      <ImageWithFallback
                        src={conseqProd.imageUrl}
                        alt={conseqProd.title}
                        className="w-20 h-20 rounded-lg border border-[#E8DDD8]"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] bg-[#5B1423] text-white px-2 py-0.5 rounded font-bold">
                            {confPct}% Confidence Match
                          </span>
                          <span className="text-xs font-mono text-[#5C4449]">
                            {supPct}% Support
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-[#2D1217] truncate">
                          {conseqProd.title}
                        </h4>
                        <div className="text-xs font-mono font-bold text-[#5B1423] mt-0.5">
                          {formatPrice(conseqProd.price)}
                        </div>
                        <div className="text-[11px] text-[#5C4449] mt-1">
                          Lift: <strong>{rule.lift}x</strong> · Co-purchased in {rule.transactionCount} orders
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#E8DDD8] flex items-center justify-between gap-2">
                      <button
                        onClick={() => setActiveMathModalRule(rule)}
                        className="text-xs text-[#7A1C30] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        Inspect Proof <ArrowRight className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => addToCart(conseqProd, 1)}
                          className="px-3 py-1.5 bg-white hover:bg-[#FAF7F2] text-[#5B1423] border border-[#E8DDD8] text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                        <button
                          onClick={() => instantOrder(conseqProd, 1)}
                          className="px-3 py-1.5 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles className="w-3 h-3 text-[#F2CAC2]" />
                          <span>Order</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
