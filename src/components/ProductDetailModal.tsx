import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Sparkles, ArrowRight, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProductDetail,
    setSelectedProductDetail,
    addToCart,
    wishlist,
    toggleWishlist,
    associationRules,
    products,
    setActiveMathModalRule,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!selectedProductDetail) return null;

  const product = selectedProductDetail;
  const isWishlisted = wishlist.includes(product.id);
  const productMap = new Map(products.map(p => [p.id, p]));

  // Find Apriori rules where antecedent contains this product
  const relatedRules = associationRules.filter(r => r.antecedent.includes(product.id));

  // Extract distinct recommendations
  const relatedItems = relatedRules.flatMap(rule =>
    rule.consequent.map(conseqId => ({
      rule,
      product: productMap.get(conseqId),
    }))
  ).filter((item): item is { rule: typeof relatedRules[0]; product: Product } => Boolean(item.product));

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8DDD8] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD8] bg-white">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#7A5B61]">
            {product.category} · SKU: {product.sku}
          </div>
          <button
            onClick={() => setSelectedProductDetail(null)}
            className="text-[#7A5B61] hover:text-[#2D1217] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* Product Image & Badges */}
            <div className="relative rounded-xl overflow-hidden bg-white border border-[#E8DDD8] shadow-sm">
              <img
                src={product.imageUrl}
                alt={product.title}
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md shadow-md transition-colors cursor-pointer ${
                  isWishlisted ? 'bg-[#5B1423] text-white' : 'bg-white/80 text-[#5B1423] hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <div className="p-4 bg-[#FAF7F2] border-t border-[#E8DDD8] flex items-center justify-between text-xs text-[#5C4449]">
                <span>Artisan: <strong>{product.sellerName}</strong></span>
                <span className={product.inStock ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}>
                  {product.inStock ? `In Stock (${product.stockCount} available)` : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Contiguous Purchase Module */}
            <div className="space-y-5">
              <div>
                <h2 className="font-display text-2xl sm:text-3xl font-semibold text-[#2D1217] tracking-tight">
                  {product.title}
                </h2>
                
                <div className="flex items-center gap-3 mt-2 text-xs text-[#7A5B61]">
                  <div className="flex items-center text-amber-600">
                    <Star className="w-4 h-4 fill-current text-amber-500 mr-1" />
                    <span className="font-bold">{product.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{product.reviewsCount} Verified Reviews</span>
                  <span>·</span>
                  <span className="text-emerald-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Authenticity Verified
                  </span>
                </div>
              </div>

              {/* Pricing */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#5B1423] font-mono tabular-nums">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-base text-[#7A5B61] line-through font-mono tabular-nums">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Google Search Product Intelligence Adjustment */}
              {product.googleSearchMatchedTerm && (
                <div className="p-3.5 bg-[#FCECE9]/60 border border-[#F2CAC2] rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#5B1423] flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                      <Sparkles className="w-3.5 h-3.5 text-[#7A1C30]" />
                      Google Search Product Adjustment
                    </span>
                    <span className="bg-[#5B1423] text-white px-2 py-0.5 rounded text-[10px] font-mono">
                      Dataset Token: {product.googleSearchMatchedTerm}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#5C4449]">
                    <div>
                      <span className="text-[#7A5B61] block text-[10px] uppercase font-semibold">Google Query Benchmark</span>
                      <span className="font-mono text-[#2D1217] italic">"{product.googleSearchQuery}"</span>
                    </div>
                    {product.googleBenchmarkPrice && (
                      <div>
                        <span className="text-[#7A5B61] block text-[10px] uppercase font-semibold">Market Benchmark Price</span>
                        <span className="font-mono font-bold text-[#5B1423]">
                          ${product.googleBenchmarkPrice.toFixed(2)} (Shop saves ${Math.max(0, product.googleBenchmarkPrice - product.price).toFixed(2)})
                        </span>
                      </div>
                    )}
                  </div>

                  {product.googleActiveIngredients && product.googleActiveIngredients.length > 0 && (
                    <div className="pt-1 border-t border-[#F2CAC2]/70">
                      <span className="text-[#7A5B61] text-[10px] uppercase font-semibold block mb-1">
                        Active Ingredients & Specs:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {product.googleActiveIngredients.map((ing, i) => (
                          <span key={i} className="bg-white border border-[#E8DDD8] px-2 py-0.5 rounded text-[10px] text-[#2D1217]">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {product.googleSearchTrends && (
                    <div className="text-[10px] text-[#7A1C30] font-medium flex items-center gap-1 pt-0.5">
                      <span>📈</span>
                      <span>Google Search Trends: {product.googleSearchTrends}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              <p className="text-sm text-[#5C4449] leading-relaxed">
                {product.description}
              </p>

              {/* Features List */}
              <div className="space-y-1.5 pt-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#7A5B61]">
                  Artisanal Specifications
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#2D1217]">
                  {product.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <span className="text-[#5B1423] font-bold">✓</span>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="pt-4 border-t border-[#E8DDD8] space-y-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#E8DDD8] rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-3 py-1.5 text-sm text-[#5B1423] hover:bg-[#FCECE9] transition-colors cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-sm font-semibold font-mono text-[#2D1217]">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="px-3 py-1.5 text-sm text-[#5B1423] hover:bg-[#FCECE9] transition-colors cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className={`flex-1 py-3 px-6 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer ${
                      product.inStock
                        ? addedNotice
                          ? 'bg-emerald-700 text-white'
                          : 'bg-[#5B1423] hover:bg-[#7A1C30] text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {addedNotice ? (
                      <>
                        <Check className="w-4 h-4" /> Added to Shopping Bag
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag (${(product.price * quantity).toFixed(2)})
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Apriori Pairings Section */}
          {relatedItems.length > 0 && (
            <div className="pt-6 border-t border-[#E8DDD8]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#5B1423]" />
                  <h3 className="font-display text-xl font-semibold text-[#2D1217]">
                    Apriori Recommended Pairings
                  </h3>
                </div>
                <div className="text-xs text-[#7A5B61]">
                  Mined with Apriori algorithm from checkout baskets
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedItems.slice(0, 2).map(({ rule, product: pairedProd }) => (
                  <div
                    key={`${rule.id}-${pairedProd.id}`}
                    className="p-4 bg-white rounded-xl border border-[#E8DDD8] shadow-sm flex flex-col justify-between"
                  >
                    <div className="flex gap-3">
                      <img
                        src={pairedProd.imageUrl}
                        alt={pairedProd.title}
                        className="w-16 h-16 rounded-lg object-cover border border-[#E8DDD8]"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] text-[#7A5B61] uppercase tracking-wider">
                          Frequently Bought Together
                        </div>
                        <h4 className="text-xs font-semibold text-[#2D1217] truncate">
                          {pairedProd.title}
                        </h4>
                        <div className="text-xs font-mono font-bold text-[#5B1423] mt-0.5">
                          ${pairedProd.price.toFixed(2)}
                        </div>
                        
                        {/* Association Stats */}
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-[#5C4449]">
                          <span className="font-semibold text-[#5B1423]">
                            {(rule.confidence * 100).toFixed(0)}% Confidence
                          </span>
                          <span>·</span>
                          <span>{(rule.support * 100).toFixed(0)}% Support</span>
                          <span>·</span>
                          <span>{rule.lift}x Lift</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#F5EBE6] flex items-center justify-between">
                      <button
                        onClick={() => setActiveMathModalRule(rule)}
                        className="text-[11px] text-[#7A1C30] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        Inspect Math Proof <ArrowRight className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => addToCart(pairedProd, 1)}
                        className="px-3 py-1 bg-[#FCECE9] hover:bg-[#F8DDD7] text-[#5B1423] text-xs font-semibold rounded-md border border-[#E8B4B8] transition-colors cursor-pointer"
                      >
                        + Add Pairing
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
