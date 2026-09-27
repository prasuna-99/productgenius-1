import React, { useState } from 'react';
import { X, CheckCircle, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    placeOrder,
    setActiveCustomerTab,
  } = useApp();

  const [street, setStreet] = useState('742 Evergreen Terrace, Suite 4B');
  const [city, setCity] = useState('Paris');
  const [state, setState] = useState('Île-de-France');
  const [zip, setZip] = useState('75008');
  const [placedOrderInfo, setPlacedOrderInfo] = useState<{ id: string; tracking: string } | null>(null);

  if (!isCheckoutModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const order = placeOrder({ street, city, state, zip });
    setPlacedOrderInfo({ id: order.id, tracking: order.trackingNumber });
  };

  const handleFinish = () => {
    setPlacedOrderInfo(null);
    setIsCheckoutModalOpen(false);
    setActiveCustomerTab('orders');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E8DDD8] overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#5B1423] text-white p-6 relative">
          {!placedOrderInfo && (
            <button
              onClick={() => setIsCheckoutModalOpen(false)}
              className="absolute top-5 right-5 text-[#FAF7F2]/80 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <span className="font-display text-2xl font-semibold tracking-tight block">
            {placedOrderInfo ? 'Order Confirmed' : 'Artisanal Checkout'}
          </span>
          <p className="text-xs text-[#F2CAC2] mt-1">
            {placedOrderInfo
              ? 'Thank you for your patronage. Your basket is being prepared for dispatch.'
              : 'Complete your delivery information for insured white-glove shipping.'}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {placedOrderInfo ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-semibold text-[#2D1217]">
                  Order {placedOrderInfo.id} Confirmed
                </h3>
                <p className="text-xs text-[#5C4449] mt-1">
                  Tracking Reference: <strong className="font-mono text-[#5B1423]">{placedOrderInfo.tracking}</strong>
                </p>
              </div>

              {/* Apriori Integration Note */}
              <div className="p-4 bg-[#FCECE9] rounded-xl border border-[#F2CAC2] text-left text-xs text-[#5B1423] space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Market Basket Live Feed
                </div>
                <p className="text-[#5C4449] text-[11px] leading-relaxed">
                  Your purchase combination was appended to the <strong>ProductGenius Apriori Transaction Database</strong>. Future customer recommendations will now incorporate this basket's frequent itemset affinities.
                </p>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleFinish}
                  className="px-6 py-2.5 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md transition-colors cursor-pointer"
                >
                  View in My Orders
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Order Summary Recap */}
              <div className="p-3.5 bg-white rounded-xl border border-[#E8DDD8] space-y-2 text-xs">
                <div className="font-semibold text-[#7A5B61] uppercase tracking-wider text-[10px]">
                  Bag Breakdown ({cart.length} unique items)
                </div>
                <div className="max-h-28 overflow-y-auto space-y-1 pr-2">
                  {cart.map(item => (
                    <div key={item.product.id} className="flex justify-between text-[#2D1217]">
                      <span className="truncate max-w-[260px]">
                        {item.quantity}x {item.product.title}
                      </span>
                      <span className="font-mono font-medium">${(item.product.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E8DDD8] flex justify-between font-bold text-sm text-[#5B1423]">
                  <span>Total Due</span>
                  <span className="font-mono">${cartSubtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Shipping Address Inputs */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-[#7A5B61] uppercase tracking-wider">
                  Delivery Destination
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#2D1217] mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-[#2D1217] mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#2D1217] mb-1">Region/State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={e => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#2D1217] mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={e => setZip(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Simulator */}
              <div className="p-3 bg-white rounded-xl border border-[#E8DDD8] text-xs space-y-1">
                <div className="font-semibold text-[#2D1217] flex items-center justify-between">
                  <span>Payment Method</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
                    Verified Checkout
                  </span>
                </div>
                <p className="text-[#5C4449] text-[11px]">
                  Visa / Mastercard / Amex Boutique Express Card Ending in •••• 4242
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 px-4 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Authorize & Place Order (${cartSubtotal.toFixed(2)})</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#7A5B61]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Complimentary insured shipping & 30-day atelier return guarantee</span>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
