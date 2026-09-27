import React, { useState } from 'react';
import { X, ShoppingBag, Store, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Role } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, currentRole, switchRole, login, allUsers } = useApp();
  const [selectedRole, setSelectedRole] = useState<Role>(currentRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'switch' | 'custom'>('switch');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'custom') {
      if (!email) return;
      login(email, selectedRole);
    } else {
      switchRole(selectedRole);
      setIsAuthModalOpen(false);
    }
  };

  const handleQuickSwitch = (role: Role) => {
    switchRole(role);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-lg rounded-2xl shadow-2xl border border-[#E8DDD8] overflow-hidden">
        {/* Header */}
        <div className="bg-[#5B1423] text-white p-6 relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-5 right-5 text-[#FAF7F2]/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="font-display text-2xl font-semibold tracking-tight block">
            Access ProductGenius
          </span>
          <p className="text-xs text-[#F2CAC2] mt-1">
            Choose your identity or switch between Customer, Seller, and Admin workspaces.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex border-b border-[#E8DDD8] mb-6">
            <button
              onClick={() => setMode('switch')}
              className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                mode === 'switch'
                  ? 'border-b-2 border-[#5B1423] text-[#5B1423]'
                  : 'text-[#7A5B61] hover:text-[#2D1217]'
              }`}
            >
              Instant Role Switcher
            </button>
            <button
              onClick={() => setMode('custom')}
              className={`pb-2.5 px-4 text-xs font-semibold uppercase tracking-wider cursor-pointer transition-colors ${
                mode === 'custom'
                  ? 'border-b-2 border-[#5B1423] text-[#5B1423]'
                  : 'text-[#7A5B61] hover:text-[#2D1217]'
              }`}
            >
              Sign In with Credentials
            </button>
          </div>

          {mode === 'switch' ? (
            <div className="space-y-3">
              <p className="text-xs text-[#5C4449] mb-4">
                Click any profile below to instantly simulate that user and view their tailored dashboard:
              </p>

              {/* Customer Option */}
              <div
                onClick={() => handleQuickSwitch('customer')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  currentRole === 'customer'
                    ? 'border-[#5B1423] bg-[#FCECE9] shadow-sm'
                    : 'border-[#E8DDD8] bg-white hover:border-[#7A1C30]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#5B1423] text-white flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2D1217] flex items-center gap-2">
                      Customer (Elena Rostova)
                      {currentRole === 'customer' && (
                        <span className="text-[10px] bg-[#5B1423] text-white px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5C4449]">
                      Browse catalog, add to cart, and experience Apriori-mined recommendations
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7A1C30]" />
              </div>

              {/* Seller Option */}
              <div
                onClick={() => handleQuickSwitch('seller')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  currentRole === 'seller'
                    ? 'border-[#5B1423] bg-[#FCECE9] shadow-sm'
                    : 'border-[#E8DDD8] bg-white hover:border-[#7A1C30]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#7A1C30] text-white flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2D1217] flex items-center gap-2">
                      Seller (Atelier Bordeaux & Co.)
                      {currentRole === 'seller' && (
                        <span className="text-[10px] bg-[#5B1423] text-white px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5C4449]">
                      Manage products, update order fulfillment, view cross-sell affinity rules
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7A1C30]" />
              </div>

              {/* Admin Option */}
              <div
                onClick={() => handleQuickSwitch('admin')}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  currentRole === 'admin'
                    ? 'border-[#5B1423] bg-[#FCECE9] shadow-sm'
                    : 'border-[#E8DDD8] bg-white hover:border-[#7A1C30]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#460F1A] text-white flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#2D1217] flex items-center gap-2">
                      Admin (Marcus Vance)
                      {currentRole === 'admin' && (
                        <span className="text-[10px] bg-[#5B1423] text-white px-2 py-0.5 rounded-full font-medium">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5C4449]">
                      Apriori Association Engine studio, configure min_sup/min_conf, view transactions
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[#7A1C30]" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#5C4449] uppercase tracking-wider mb-1.5">
                  Target Role
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['customer', 'seller', 'admin'] as Role[]).map(role => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setSelectedRole(role)}
                      className={`py-2 px-3 text-xs font-medium rounded-lg border capitalize transition-colors cursor-pointer ${
                        selectedRole === role
                          ? 'bg-[#5B1423] text-white border-[#5B1423]'
                          : 'bg-white text-[#5C4449] border-[#E8DDD8] hover:border-[#7A1C30]'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D1217] mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. shopper@lifestyle.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8DDD8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A1C30] text-[#2D1217]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#2D1217] mb-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-[#E8DDD8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7A1C30] text-[#2D1217]"
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-2.5 px-4 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md transition-colors cursor-pointer"
              >
                Sign In & Switch to {selectedRole}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
