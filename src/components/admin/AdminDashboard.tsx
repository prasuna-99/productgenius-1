import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  DollarSign,
  Users,
  Store,
  Layers,
  Sparkles,
  Sliders,
  RefreshCw,
  PlusCircle,
  Database,
  ArrowRight,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit2,
  Package,
  Search,
  Filter,
  X,
  AlertTriangle,
  Plus,
  FileText,
  RotateCcw,
  ExternalLink,
  Code,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Role, Product, User } from '../../types';
import { ProductFormModal } from '../seller/ProductFormModal';
import { RAW_DATASET_TEXT } from '../../data/userDataset';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    deleteProduct,
    orders,
    allUsers,
    deleteUser,
    deleteSeller,
    switchRole,
    transactions,
    rawDatasetRows,
    importDatasetText,
    resetToGoogleAdjustedDataset,
    minSupport,
    setMinSupport,
    minConfidence,
    setMinConfidence,
    frequentItemsets,
    associationRules,
    recomputeApriori,
    seedSyntheticTransactions,
    setActiveMathModalRule,
    currentUser,
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'apriori' | 'products' | 'sellers' | 'transactions'>('transactions');
  const [isMining, setIsMining] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [searchUser, setSearchUser] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'seller' | 'customer' | 'admin'>('all');

  // Dataset & Google Search Adjustments State
  const [searchTx, setSearchTx] = useState('');
  const [txTypeFilter, setTxTypeFilter] = useState<string>('all');
  const [datasetSubTab, setDatasetSubTab] = useState<'transactions' | 'mappings'>('transactions');
  const [isRawDatasetModalOpen, setIsRawDatasetModalOpen] = useState(false);
  const [datasetInputText, setDatasetInputText] = useState(RAW_DATASET_TEXT);

  // Modals & Confirmation States
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sellerToDelete, setSellerToDelete] = useState<User | null>(null);
  const [removeSellerProducts, setRemoveSellerProducts] = useState<boolean>(true);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [isProductFormOpen, setIsProductFormOpen] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Platform calculations
  const totalGMV = orders.reduce((sum, o) => sum + o.total, 0);
  const platformCommission = totalGMV * 0.05; // 5% marketplace fee
  const productMap = new Map(products.map(p => [p.id, p]));

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleRunMining = () => {
    setIsMining(true);
    setTimeout(() => {
      recomputeApriori();
      setIsMining(false);
      showToast('Apriori association rules successfully re-mined.');
    }, 300);
  };

  const handleConfirmDeleteProduct = () => {
    if (!productToDelete) return;
    const title = productToDelete.title;
    deleteProduct(productToDelete.id);
    setProductToDelete(null);
    showToast(`Product "${title}" has been permanently removed.`);
  };

  const handleConfirmDeleteSeller = () => {
    if (!sellerToDelete) return;
    const name = sellerToDelete.storeName || sellerToDelete.name;
    deleteSeller(sellerToDelete.id, removeSellerProducts);
    setSellerToDelete(null);
    showToast(`Seller "${name}" and permissions have been removed.`);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter === 'All' || p.category === categoryFilter;
      const matchSearch =
        p.title.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.sellerName.toLowerCase().includes(searchProduct.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, categoryFilter, searchProduct]);

  // Filtered Users / Sellers
  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => {
      const matchRole = roleFilter === 'all' || u.role === roleFilter;
      const matchSearch =
        u.name.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email.toLowerCase().includes(searchUser.toLowerCase()) ||
        (u.storeName && u.storeName.toLowerCase().includes(searchUser.toLowerCase()));
      return matchRole && matchSearch;
    });
  }, [allUsers, roleFilter, searchUser]);

  // Filtered Raw Dataset Transactions
  const filteredRawRows = useMemo(() => {
    return rawDatasetRows.filter(row => {
      const matchType = txTypeFilter === 'all' || row.type.toLowerCase().trim() === txTypeFilter.toLowerCase().trim();
      const query = searchTx.toLowerCase().trim();
      if (!query) return matchType;
      const matchSearch =
        row.transaction_id.toLowerCase().includes(query) ||
        row.customer_id.toLowerCase().includes(query) ||
        row.products_purchased.toLowerCase().includes(query) ||
        row.matchedProductIds.some(id => productMap.get(id)?.title.toLowerCase().includes(query));
      return matchType && matchSearch;
    });
  }, [rawDatasetRows, txTypeFilter, searchTx, productMap]);

  // Frequency count of each product in the transactions
  const datasetFrequencyMap = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const tx of transactions) {
      for (const id of tx.itemIds) {
        counts[id] = (counts[id] || 0) + 1;
      }
    }
    return counts;
  }, [transactions]);

  const sellerCount = allUsers.filter(u => u.role === 'seller').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Toast Notification Banner */}
      {notification && (
        <div className="p-4 bg-emerald-900 text-emerald-100 rounded-xl border border-emerald-700 shadow-lg flex items-center justify-between animate-in fade-in duration-200">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-emerald-300 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Admin Header Banner */}
      <div className="bg-[#460F1A] text-white p-6 sm:p-8 rounded-2xl border border-[#3D0F18] flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#5B1423] text-white flex items-center justify-center shrink-0 border border-[#7A1C30] shadow-md">
            <ShieldCheck className="w-7 h-7 text-[#F2CAC2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-[#F2CAC2] font-semibold">
                Platform Administrator Console
              </span>
              <span className="text-[10px] bg-white/10 text-white font-semibold px-2 py-0.5 rounded-full border border-white/20">
                Root System Access
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold text-white">
              ProductGenius Ops & Governance
            </h1>
            <p className="text-xs text-[#E8DDD8] mt-0.5">
              Supervise transactions, remove products or sellers, and calibrate the Apriori association engine.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setProductToEdit(null);
              setIsProductFormOpen(true);
            }}
            className="px-3.5 py-2 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#7A1C30] transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4 text-[#F2CAC2]" />
            <span>Add Product</span>
          </button>

          <button
            onClick={() => seedSyntheticTransactions(5)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded-lg border border-white/20 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Add 5 random simulated checkouts"
          >
            <PlusCircle className="w-4 h-4 text-[#F2CAC2]" />
            <span>Seed 5 Baskets</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-[#E8DDD8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A5B61] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales (GMV)</span>
            <DollarSign className="w-4 h-4 text-[#5B1423]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#5B1423] tabular-nums">
            ${totalGMV.toFixed(2)}
          </div>
          <div className="text-[11px] text-[#5C4449] mt-1">
            Across {orders.length} platform transactions
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E8DDD8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A5B61] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Platform Products</span>
            <Package className="w-4 h-4 text-[#5B1423]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D1217] tabular-nums">
            {products.length} Items
          </div>
          <div className="text-[11px] text-emerald-700 mt-1 font-medium">
            Full admin removal controls enabled
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E8DDD8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A5B61] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Merchants</span>
            <Store className="w-4 h-4 text-[#5B1423]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#2D1217] tabular-nums">
            {sellerCount} Sellers
          </div>
          <div className="text-[11px] text-[#5C4449] mt-1">
            Total {allUsers.length} platform accounts
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-[#E8DDD8] shadow-sm">
          <div className="flex items-center justify-between text-[#7A5B61] mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Mined Apriori Rules</span>
            <Sparkles className="w-4 h-4 text-[#5B1423]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#5B1423] tabular-nums">
            {associationRules.length} Rules
          </div>
          <div className="text-[11px] text-[#5C4449] mt-1">
            From {frequentItemsets.length} frequent itemsets
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8DDD8] pb-4 overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('products')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'products'
              ? 'bg-[#5B1423] text-white shadow-sm'
              : 'bg-white text-[#5C4449] hover:bg-[#FCECE9] hover:text-[#5B1423] border border-[#E8DDD8]'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Manage Products ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('sellers')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'sellers'
              ? 'bg-[#5B1423] text-white shadow-sm'
              : 'bg-white text-[#5C4449] hover:bg-[#FCECE9] hover:text-[#5B1423] border border-[#E8DDD8]'
          }`}
        >
          <Store className="w-3.5 h-3.5" />
          <span>Manage Sellers & Users ({allUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('apriori')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'apriori'
              ? 'bg-[#5B1423] text-white shadow-sm'
              : 'bg-white text-[#5C4449] hover:bg-[#FCECE9] hover:text-[#5B1423] border border-[#E8DDD8]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#E8B4B8]" />
          <span>Apriori Mining Engine</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('transactions')}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
            activeAdminTab === 'transactions'
              ? 'bg-[#5B1423] text-white shadow-sm'
              : 'bg-white text-[#5C4449] hover:bg-[#FCECE9] hover:text-[#5B1423] border border-[#E8DDD8]'
          }`}
        >
          <Database className="w-3.5 h-3.5" />
          <span>Dataset & Google Products ({transactions.length})</span>
        </button>
      </div>

      {/* TAB 1: PRODUCT MANAGEMENT (REMOVE & EDIT PRODUCTS) */}
      {activeAdminTab === 'products' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#2D1217]">
                Platform Product Inventory & Moderation
              </h3>
              <p className="text-xs text-[#5C4449]">
                Remove products, audit seller attributions, and manage inventory listings
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#7A5B61] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search title, SKU, seller..."
                  value={searchProduct}
                  onChange={e => setSearchProduct(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30] w-52 sm:w-64"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-3 py-1.5 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#5C4449] focus:outline-none focus:ring-1 focus:ring-[#7A1C30] cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Fragrance & Bath">Fragrance & Bath</option>
                <option value="Apparel & Silk">Apparel & Silk</option>
                <option value="Leather Goods">Leather Goods</option>
                <option value="Home & Ambiance">Home & Ambiance</option>
                <option value="Gourmet & Cellar">Gourmet & Cellar</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DDD8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#E8DDD8] text-[#7A5B61] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">Item Details</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Seller / Store</th>
                    <th className="py-3 px-4">SKU</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EBE6]">
                  {filteredProducts.map(p => (
                    <tr key={p.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-11 h-11 rounded-lg object-cover border border-[#E8DDD8]"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLElement).style.opacity = '0.5';
                            }}
                          />
                          <div className="max-w-[220px]">
                            <div className="font-semibold text-[#2D1217] truncate">{p.title}</div>
                            <div className="text-[10px] text-[#7A5B61] truncate">{p.description}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#5C4449]">{p.category}</td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-[#5B1423] bg-[#FCECE9] px-2 py-0.5 rounded text-[11px]">
                          {p.sellerName || 'Atelier Bordeaux'}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[#5C4449]">{p.sku}</td>

                      <td className="py-3 px-4 font-mono font-bold text-[#5B1423]">${p.price.toFixed(2)}</td>

                      <td className="py-3 px-4 font-mono">
                        <span className={p.stockCount <= 5 ? 'text-amber-700 font-bold' : 'text-[#2D1217]'}>
                          {p.stockCount} in stock
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setProductToEdit(p);
                              setIsProductFormOpen(true);
                            }}
                            className="p-1.5 text-[#5B1423] hover:bg-[#FCECE9] rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => setProductToDelete(p)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Remove Product from Platform"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredProducts.length === 0 && (
              <div className="p-12 text-center text-xs text-[#7A5B61]">
                No products found matching the search criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SELLER & USER MANAGEMENT (REMOVE SELLERS) */}
      {activeAdminTab === 'sellers' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#2D1217]">
                Merchant & User Governance
              </h3>
              <p className="text-xs text-[#5C4449]">
                Remove rogue sellers, manage merchant storefront permissions, or switch roles
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-[#7A5B61] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user name or email..."
                  value={searchUser}
                  onChange={e => setSearchUser(e.target.value)}
                  className="pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30] w-52 sm:w-60"
                />
              </div>

              <select
                value={roleFilter}
                onChange={e => setRoleFilter(e.target.value as any)}
                className="px-3 py-1.5 text-xs bg-white border border-[#E8DDD8] rounded-lg text-[#5C4449] focus:outline-none focus:ring-1 focus:ring-[#7A1C30] cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="seller">Sellers Only</option>
                <option value="customer">Customers Only</option>
                <option value="admin">Admins Only</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8DDD8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F2] border-b border-[#E8DDD8] text-[#7A5B61] uppercase tracking-wider font-semibold">
                  <tr>
                    <th className="py-3 px-4">User / Merchant Identity</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Account Role</th>
                    <th className="py-3 px-4">Listed Products</th>
                    <th className="py-3 px-4">Joined Date</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5EBE6]">
                  {filteredUsers.map(user => {
                    const userProducts = products.filter(p => p.sellerId === user.id);
                    const isSeller = user.role === 'seller';
                    const isAdmin = user.role === 'admin';

                    return (
                      <tr key={user.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#5B1423] text-white flex items-center justify-center font-bold text-xs">
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-[#2D1217] flex items-center gap-1.5">
                                {user.name}
                                {user.id === currentUser.id && (
                                  <span className="text-[10px] bg-[#5B1423] text-white px-1.5 py-0.2 rounded font-medium">
                                    Current
                                  </span>
                                )}
                              </div>
                              {user.storeName && (
                                <div className="text-[11px] text-[#7A5B61] font-medium flex items-center gap-1">
                                  <Store className="w-3 h-3 text-[#5B1423]" />
                                  <span>{user.storeName}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 text-[#5C4449] font-mono">{user.email}</td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-900'
                                : user.role === 'seller'
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : 'bg-emerald-100 text-emerald-900'
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        <td className="py-3 px-4 font-mono">
                          {isSeller ? (
                            <span className="font-semibold text-[#5B1423]">
                              {userProducts.length} items listed
                            </span>
                          ) : (
                            <span className="text-[#7A5B61]">—</span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-[#5C4449]">{user.joinedDate}</td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => switchRole(user.role)}
                              className="px-2.5 py-1 bg-[#FAF7F2] hover:bg-[#FCECE9] text-[#5B1423] text-xs font-semibold rounded-md border border-[#E8DDD8] transition-colors cursor-pointer"
                              title="Assume perspective"
                            >
                              Assume {user.role}
                            </button>

                            {/* Remove Seller Button */}
                            {isSeller && (
                              <button
                                onClick={() => {
                                  setSellerToDelete(user);
                                  setRemoveSellerProducts(true);
                                }}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Remove Seller and their Store"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove Seller</span>
                              </button>
                            )}

                            {/* Remove non-admin user */}
                            {!isAdmin && !isSeller && (
                              <button
                                onClick={() => deleteUser(user.id)}
                                className="p-1.5 text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                                title="Remove User"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="p-12 text-center text-xs text-[#7A5B61]">
                No users or merchants found matching search criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: APRIORI MINING ENGINE STUDIO */}
      {activeAdminTab === 'apriori' && (
        <div className="space-y-8">
          
          {/* Hyperparameter Controls Console */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E8DDD8] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F5EBE6] pb-4">
              <div>
                <span className="text-xs uppercase tracking-wider text-[#5B1423] font-semibold">
                  Algorithm Hyperparameters
                </span>
                <h3 className="font-display text-2xl font-semibold text-[#2D1217]">
                  Apriori Association Engine Calibration
                </h3>
              </div>

              <button
                onClick={handleRunMining}
                disabled={isMining}
                className="px-5 py-2.5 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isMining ? 'animate-spin' : ''}`} />
                <span>{isMining ? 'Mining Frequent Itemsets...' : 'Re-Mine Association Rules'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Minimum Support Slider */}
              <div className="space-y-3 p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DDD8]">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#2D1217] uppercase tracking-wider">
                    Minimum Support Threshold (min_sup)
                  </span>
                  <span className="font-mono text-base font-bold text-[#5B1423]">
                    {(minSupport * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="0.50"
                  step="0.05"
                  value={minSupport}
                  onChange={e => setMinSupport(parseFloat(e.target.value))}
                  className="w-full accent-[#5B1423] cursor-pointer"
                />
                <p className="text-[11px] text-[#5C4449] leading-snug">
                  Itemsets must appear in at least <strong>{Math.ceil(minSupport * transactions.length)}</strong> of {transactions.length} total baskets to be deemed frequent.
                </p>
              </div>

              {/* Minimum Confidence Slider */}
              <div className="space-y-3 p-4 bg-[#FAF7F2] rounded-xl border border-[#E8DDD8]">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-[#2D1217] uppercase tracking-wider">
                    Minimum Confidence Threshold (min_conf)
                  </span>
                  <span className="font-mono text-base font-bold text-[#5B1423]">
                    {(minConfidence * 100).toFixed(0)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.30"
                  max="0.90"
                  step="0.05"
                  value={minConfidence}
                  onChange={e => setMinConfidence(parseFloat(e.target.value))}
                  className="w-full accent-[#5B1423] cursor-pointer"
                />
                <p className="text-[11px] text-[#5C4449] leading-snug">
                  When Antecedent A is purchased, Consequent B must be co-purchased at least <strong>{(minConfidence * 100).toFixed(0)}%</strong> of the time to generate a recommendation.
                </p>
              </div>
            </div>
          </div>

          {/* Mined Association Rules Table */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#2D1217]">
                Discovered Association Rules ({associationRules.length})
              </h3>
              <p className="text-xs text-[#5C4449]">
                Sorted by Confidence descending, then by Support descending
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DDD8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E8DDD8] text-[#7A5B61] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Antecedent (Condition A)</th>
                      <th className="py-3 px-4">Consequent (Output B)</th>
                      <th className="py-3 px-4">Support</th>
                      <th className="py-3 px-4">Confidence</th>
                      <th className="py-3 px-4">Lift</th>
                      <th className="py-3 px-4">Basket Matches</th>
                      <th className="py-3 px-4 text-right">Derivation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EBE6]">
                    {associationRules.map(rule => {
                      const antecedentTitles = rule.antecedent
                        .map(id => productMap.get(id)?.title.split(' ')[0] || id)
                        .join(' + ');
                      const consequentTitles = rule.consequent
                        .map(id => productMap.get(id)?.title.split(' ')[0] || id)
                        .join(' + ');

                      const confPct = Math.round(rule.confidence * 100);
                      const supPct = Math.round(rule.support * 100);

                      return (
                        <tr key={rule.id} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          <td className="py-3 px-4 font-semibold text-[#2D1217]">
                            {`{ ${antecedentTitles} }`}
                          </td>

                          <td className="py-3 px-4 font-semibold text-[#5B1423]">
                            {`{ ${consequentTitles} }`}
                          </td>

                          <td className="py-3 px-4 font-mono font-medium text-[#5C4449]">
                            {supPct}%
                          </td>

                          <td className="py-3 px-4 font-mono">
                            <span className="bg-[#FCECE9] text-[#5B1423] font-bold px-2 py-0.5 rounded">
                              {confPct}%
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono font-bold text-[#2D1217]">
                            <span className={rule.lift > 1.2 ? 'text-emerald-700' : 'text-[#5C4449]'}>
                              {rule.lift}x
                            </span>
                          </td>

                          <td className="py-3 px-4 font-mono text-[#5C4449]">
                            {rule.transactionCount} baskets
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={() => setActiveMathModalRule(rule)}
                              className="text-[#7A1C30] hover:underline font-medium cursor-pointer"
                            >
                              Proof Details →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Frequent Itemsets Discovery Table */}
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-xl font-semibold text-[#2D1217]">
                Frequent Itemsets Mined ({frequentItemsets.length})
              </h3>
              <p className="text-xs text-[#5C4449]">
                Itemsets meeting minimum support threshold &ge; {(minSupport * 100).toFixed(0)}%
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8DDD8] overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F2] border-b border-[#E8DDD8] text-[#7A5B61] uppercase tracking-wider font-semibold">
                    <tr>
                      <th className="py-3 px-4">Itemset Items</th>
                      <th className="py-3 px-4">Size (k)</th>
                      <th className="py-3 px-4">Frequency Count</th>
                      <th className="py-3 px-4">Support</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5EBE6]">
                    {frequentItemsets.map((fi, idx) => {
                      const itemTitles = fi.items
                        .map(id => productMap.get(id)?.title || id)
                        .join(' · ');

                      return (
                        <tr key={idx} className="hover:bg-[#FAF7F2]/50 transition-colors">
                          <td className="py-3 px-4 font-medium text-[#2D1217]">
                            {itemTitles}
                          </td>
                          <td className="py-3 px-4 font-mono text-[#5C4449]">
                            k = {fi.items.length}
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-[#5B1423]">
                            {fi.supportCount}
                          </td>
                          <td className="py-3 px-4 font-mono text-[#5C4449]">
                            {(fi.support * 100).toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: PREPARED DATASET & GOOGLE SEARCH ADJUSTMENTS */}
      {activeAdminTab === 'transactions' && (
        <div className="space-y-6">
          
          {/* Header Card */}
          <div className="p-6 bg-white rounded-2xl border border-[#E8DDD8] shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#5B1423] uppercase tracking-wider bg-[#FCECE9] px-2.5 py-0.5 rounded-full border border-[#F2CAC2]">
                <Sparkles className="w-3.5 h-3.5 text-[#7A1C30]" />
                <span>Google Search Verified Adjustments & ML Apriori Engine</span>
              </div>
              <h3 className="font-display text-2xl font-semibold text-[#2D1217]">
                Prepared Dataset & Google Search Product Intelligence
              </h3>
              <p className="text-xs text-[#5C4449] leading-relaxed">
                Raw customer basket records (T0001–T00100) adjusted to high-end boutique personal care products benchmarked against real Google Search shopping queries, market pricing, and active cosmetic formulations.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 shrink-0">
              <button
                onClick={() => {
                  resetToGoogleAdjustedDataset();
                  showToast("Dataset successfully reset to user's 100-transaction data and Google-adjusted products!");
                }}
                className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#5B1423] border border-[#E8DDD8] text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Reset products and transactions to the 100 prepared rows"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset User Dataset</span>
              </button>

              <button
                onClick={() => setIsRawDatasetModalOpen(true)}
                className="px-3.5 py-2 bg-white hover:bg-[#FAF7F2] text-[#2D1217] border border-[#E8DDD8] text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-[#7A5B61]" />
                <span>View Raw TSV ({rawDatasetRows.length} Rows)</span>
              </button>

              <button
                onClick={handleRunMining}
                disabled={isMining}
                className="px-4 py-2 bg-[#5B1423] hover:bg-[#7A1C30] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isMining ? 'animate-spin' : ''}`} />
                <span>Re-Mine Rules</span>
              </button>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center gap-2 border-b border-[#E8DDD8] pb-3">
            <button
              onClick={() => setDatasetSubTab('transactions')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                datasetSubTab === 'transactions'
                  ? 'bg-[#5B1423] text-white'
                  : 'bg-white text-[#5C4449] hover:bg-[#FAF7F2] border border-[#E8DDD8]'
              }`}
            >
              100-Transaction Inspector ({filteredRawRows.length})
            </button>
            <button
              onClick={() => setDatasetSubTab('mappings')}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                datasetSubTab === 'mappings'
                  ? 'bg-[#5B1423] text-white'
                  : 'bg-white text-[#5C4449] hover:bg-[#FAF7F2] border border-[#E8DDD8]'
              }`}
            >
              12 Google Search Adjusted Products Matrix
            </button>
          </div>

          {/* SUBTAB 1: 100-TRANSACTION INSPECTOR */}
          {datasetSubTab === 'transactions' && (
            <div className="space-y-4">
              
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#E8DDD8]">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-[#7A5B61] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search transaction ID, customer ID, or products..."
                    value={searchTx}
                    onChange={e => setSearchTx(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-[#7A5B61] font-medium">Type:</span>
                  <select
                    value={txTypeFilter}
                    onChange={e => setTxTypeFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-[#FAF7F2] border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30] cursor-pointer"
                  >
                    <option value="all">All Types</option>
                    <option value="Strong">Strong Affinity</option>
                    <option value="Mixed">Mixed Baskets</option>
                    <option value="Random">Random / Discovery</option>
                    <option value="Online">Online Orders</option>
                    <option value="Store">In-Store Purchases</option>
                  </select>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl border border-[#E8DDD8] overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF7F2] border-b border-[#E8DDD8] text-[#7A5B61] uppercase tracking-wider font-semibold">
                      <tr>
                        <th className="py-3 px-4">Tx ID</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Type</th>
                        <th className="py-3 px-4">Raw Purchased Mention</th>
                        <th className="py-3 px-4">Adjusted Google Products</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F5EBE6]">
                      {filteredRawRows.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#7A5B61]">
                            No transactions match your search filter.
                          </td>
                        </tr>
                      ) : (
                        filteredRawRows.map(row => {
                          const typeLower = row.type.toLowerCase().trim();
                          const typeBadgeClass =
                            typeLower.includes('strong')
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : typeLower.includes('mixed')
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : typeLower.includes('random')
                              ? 'bg-purple-100 text-purple-800 border-purple-300'
                              : typeLower.includes('store')
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-sky-100 text-sky-800 border-sky-300';

                          return (
                            <tr key={row.transaction_id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-[#5B1423] whitespace-nowrap">
                                {row.transaction_id}
                              </td>
                              <td className="py-3 px-4 font-mono text-[#5C4449] whitespace-nowrap">
                                {row.customer_id || '—'}
                              </td>
                              <td className="py-3 px-4 text-[#5C4449] whitespace-nowrap">
                                {row.transaction_date}
                              </td>
                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${typeBadgeClass}`}>
                                  {row.type}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-[#2D1217] font-mono text-[11px] max-w-xs truncate" title={row.products_purchased}>
                                {row.products_purchased}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex flex-wrap gap-1.5">
                                  {row.matchedProductIds.map(id => {
                                    const p = productMap.get(id);
                                    if (!p) return null;
                                    return (
                                      <span
                                        key={id}
                                        className="inline-flex items-center gap-1.5 bg-[#FAF7F2] border border-[#E8DDD8] text-[#2D1217] px-2 py-0.5 rounded text-[11px]"
                                      >
                                        <img
                                          src={p.imageUrl}
                                          alt=""
                                          className="w-3.5 h-3.5 rounded object-cover"
                                        />
                                        <span>{p.title.split(' ')[0]} {p.title.split(' ')[1]}</span>
                                      </span>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* SUBTAB 2: 12 GOOGLE SEARCH ADJUSTED PRODUCTS MATRIX */}
          {datasetSubTab === 'mappings' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.filter(p => p.googleSearchMatchedTerm).map(p => {
                  const freq = datasetFrequencyMap[p.id] || 0;
                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-[#E8DDD8] p-5 shadow-sm space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-3">
                          <img
                            src={p.imageUrl}
                            alt={p.title}
                            className="w-16 h-16 rounded-xl object-cover border border-[#E8DDD8] shrink-0"
                          />
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] uppercase font-semibold text-[#5B1423] bg-[#FCECE9] px-2 py-0.5 rounded border border-[#F2CAC2]">
                              Dataset: {p.googleSearchMatchedTerm}
                            </span>
                            <h4 className="font-display text-sm font-semibold text-[#2D1217] truncate mt-1">
                              {p.title}
                            </h4>
                            <div className="text-[11px] text-[#7A5B61]">
                              SKU: {p.sku} · Store Price: <strong className="text-[#5B1423]">${p.price.toFixed(2)}</strong>
                            </div>
                          </div>
                        </div>

                        {/* Google Search Intelligence Specs */}
                        <div className="p-3 bg-[#FAF7F2] rounded-xl border border-[#E8DDD8] space-y-1.5 text-[11px]">
                          <div>
                            <span className="text-[#7A5B61] text-[10px] uppercase font-semibold block">Google Query Benchmark:</span>
                            <span className="font-mono text-[#2D1217] italic text-[10px]">
                              "{p.googleSearchQuery}"
                            </span>
                          </div>

                          {p.googleBenchmarkPrice && (
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-[#7A5B61]">Google Shopping Price:</span>
                              <span className="font-mono font-bold text-[#5B1423]">
                                ${p.googleBenchmarkPrice.toFixed(2)} (Save ${(p.googleBenchmarkPrice - p.price).toFixed(2)})
                              </span>
                            </div>
                          )}

                          {p.googleSearchTrends && (
                            <div className="text-[10px] text-emerald-700 font-medium">
                              📈 {p.googleSearchTrends}
                            </div>
                          )}

                          {p.googleActiveIngredients && (
                            <div className="pt-1 border-t border-[#E8DDD8]/80">
                              <span className="text-[#7A5B61] text-[10px] uppercase font-semibold block mb-0.5">Formulation Specs:</span>
                              <div className="flex flex-wrap gap-1">
                                {p.googleActiveIngredients.map((ing, i) => (
                                  <span key={i} className="bg-white border border-[#E8DDD8] px-1.5 py-0.5 rounded text-[9px] text-[#2D1217]">
                                    {ing}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Dataset Occurrence Footnote */}
                      <div className="pt-2 border-t border-[#F5EBE6] flex items-center justify-between text-[11px]">
                        <span className="text-[#7A5B61]">User Dataset Frequency:</span>
                        <span className="font-mono font-bold text-[#5B1423] bg-[#FCECE9] px-2 py-0.5 rounded">
                          {freq} / {transactions.length} baskets ({((freq / Math.max(1, transactions.length)) * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* RAW TSV DATASET MODAL */}
      {isRawDatasetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] w-full max-w-3xl rounded-2xl shadow-2xl border border-[#E8DDD8] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#5B1423] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#F2CAC2]" />
                <h3 className="font-display text-lg font-semibold">User Dataset Text (TSV / CSV)</h3>
              </div>
              <button
                onClick={() => setIsRawDatasetModalOpen(false)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <p className="text-[#5C4449] leading-relaxed">
                This raw dataset is parsed into co-purchase basket records. Product tokens like "Hydrating Cleanser", "SPF50 Sunscreen", and variations ("Lipstick Cream", "SPF50 Sunscreen Mini Gel") are automatically matched with Google Search adjusted products.
              </p>

              <textarea
                value={datasetInputText}
                onChange={e => setDatasetInputText(e.target.value)}
                rows={16}
                className="w-full font-mono text-[11px] p-3 bg-white border border-[#E8DDD8] rounded-xl text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
              />

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setDatasetInputText(RAW_DATASET_TEXT)}
                  className="px-3 py-1.5 bg-white text-[#5B1423] border border-[#E8DDD8] rounded-lg text-xs font-medium cursor-pointer"
                >
                  Reset to Original 100 Rows
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRawDatasetModalOpen(false)}
                    className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#5C4449] border border-[#E8DDD8] rounded-lg font-medium cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const res = importDatasetText(datasetInputText);
                      setIsRawDatasetModalOpen(false);
                      showToast(`Successfully parsed and loaded ${res.count} transactions!`);
                    }}
                    className="px-4 py-2 bg-[#5B1423] hover:bg-[#7A1C30] text-white font-semibold rounded-lg shadow-sm cursor-pointer"
                  >
                    Apply & Re-mine Rules
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE PRODUCT MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-2xl shadow-2xl border border-[#E8DDD8] overflow-hidden">
            <div className="bg-rose-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-300" />
                <h3 className="font-display text-lg font-semibold">Remove Product</h3>
              </div>
              <button
                onClick={() => setProductToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-[#E8DDD8]">
                <img
                  src={productToDelete.imageUrl}
                  alt={productToDelete.title}
                  className="w-14 h-14 rounded-lg object-cover border border-[#E8DDD8]"
                />
                <div className="min-w-0">
                  <div className="font-semibold text-sm text-[#2D1217] truncate">
                    {productToDelete.title}
                  </div>
                  <div className="text-[#7A5B61] text-[11px]">
                    SKU: {productToDelete.sku} · ${productToDelete.price.toFixed(2)}
                  </div>
                  <div className="text-[10px] text-[#5B1423] font-medium">
                    Seller: {productToDelete.sellerName}
                  </div>
                </div>
              </div>

              <p className="text-[#5C4449] leading-relaxed">
                Are you sure you want to delete this product? It will be immediately removed from the customer storefront, active shopping bags, saved wishlists, and future Apriori association mining.
              </p>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#5C4449] border border-[#E8DDD8] rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteProduct}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
                >
                  Yes, Remove Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SELLER MODAL */}
      {sellerToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-2xl shadow-2xl border border-[#E8DDD8] overflow-hidden">
            <div className="bg-rose-900 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-300" />
                <h3 className="font-display text-lg font-semibold">Remove Seller Account</h3>
              </div>
              <button
                onClick={() => setSellerToDelete(null)}
                className="text-white/80 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-white rounded-xl border border-[#E8DDD8] space-y-1">
                <div className="font-semibold text-sm text-[#2D1217]">
                  {sellerToDelete.storeName || sellerToDelete.name}
                </div>
                <div className="text-[11px] text-[#7A5B61]">Curator: {sellerToDelete.name} ({sellerToDelete.email})</div>
                <div className="text-[11px] text-[#5B1423] font-medium">
                  Products in Catalog: {products.filter(p => p.sellerId === sellerToDelete.id).length}
                </div>
              </div>

              <p className="text-[#5C4449] leading-relaxed">
                Removing this seller will revoke their merchant credentials and remove their storefront from ProductGenius.
              </p>

              {/* Option to also purge seller's products */}
              <label className="flex items-start gap-2.5 p-3 bg-[#FCECE9] rounded-xl border border-[#F2CAC2] cursor-pointer">
                <input
                  type="checkbox"
                  checked={removeSellerProducts}
                  onChange={e => setRemoveSellerProducts(e.target.checked)}
                  className="mt-0.5 accent-[#5B1423] cursor-pointer"
                />
                <span className="text-[11px] text-[#5B1423] font-medium leading-snug">
                  Also delete all {products.filter(p => p.sellerId === sellerToDelete.id).length} products listed by this seller from the catalog
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSellerToDelete(null)}
                  className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#5C4449] border border-[#E8DDD8] rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteSeller}
                  className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
                >
                  Confirm Remove Seller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Product Form (Add / Edit) */}
      <ProductFormModal
        isOpen={isProductFormOpen}
        onClose={() => {
          setIsProductFormOpen(false);
          setProductToEdit(null);
        }}
        productToEdit={productToEdit}
      />

    </div>
  );
};
