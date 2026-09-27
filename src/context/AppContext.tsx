import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Role,
  User,
  Product,
  CartItem,
  Order,
  Transaction,
  FrequentItemset,
  AssociationRule,
  AprioriRecommendation,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_ORDERS,
} from '../data/mockData';
import {
  parseUserDataset,
  INITIAL_PARSED_DATASET,
  GOOGLE_ADJUSTED_PRODUCTS,
  RawDatasetRow,
  RAW_DATASET_TEXT,
} from '../data/userDataset';
import {
  runApriori,
  generateAssociationRules,
  getAprioriRecommendationsForCart,
} from '../utils/apriori';

interface AppContextType {
  // Auth & Roles
  currentUser: User;
  currentRole: Role;
  switchRole: (role: Role) => void;
  login: (email: string, role: Role) => void;
  logout: () => void;
  allUsers: User[];
  deleteUser: (userId: string) => void;
  deleteSeller: (sellerId: string, removeProducts?: boolean) => void;

  // Catalog
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  editProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  toggleStock: (id: string) => void;

  // Cart & Wishlist
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (shippingAddress: { street: string; city: string; state: string; zip: string }, discountCode?: string) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Apriori & Association Rules
  transactions: Transaction[];
  rawDatasetRows: RawDatasetRow[];
  importDatasetText: (text: string) => { count: number };
  resetToGoogleAdjustedDataset: () => void;
  minSupport: number;
  setMinSupport: (val: number) => void;
  minConfidence: number;
  setMinConfidence: (val: number) => void;
  frequentItemsets: FrequentItemset[];
  associationRules: AssociationRule[];
  cartRecommendations: AprioriRecommendation[];
  topRecommendations: AprioriRecommendation[];
  recomputeApriori: () => void;
  seedSyntheticTransactions: (count: number) => void;

  // Modals & UI States
  selectedProductDetail: Product | null;
  setSelectedProductDetail: (product: Product | null) => void;
  activeMathModalRule: AssociationRule | null;
  setActiveMathModalRule: (rule: AssociationRule | null) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  isCheckoutModalOpen: boolean;
  setIsCheckoutModalOpen: (open: boolean) => void;
  activeCustomerTab: 'storefront' | 'recommendations' | 'orders' | 'wishlist';
  setActiveCustomerTab: (tab: 'storefront' | 'recommendations' | 'orders' | 'wishlist') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load or initialize state from localStorage
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (localStorage.getItem('pg_current_role') as Role) || 'customer';
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('pg_users');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = localStorage.getItem('pg_current_role') as Role || 'customer';
    const match = INITIAL_USERS.find(u => u.role === savedRole) || INITIAL_USERS[0];
    return match;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('pg_products');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(p => p.id === 'pg-skn-01')) {
          return parsed;
        }
      } catch (e) { /* fallback */ }
    }
    return INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('pg_cart');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('pg_wishlist');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return ['pg-skn-02', 'pg-har-06'];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('pg_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ORDERS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('pg_transactions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some(t => t.itemIds.includes('pg-skn-01') || t.itemIds.includes('pg-skn-03'))) {
          return parsed;
        }
      } catch (e) { /* fallback */ }
    }
    return INITIAL_TRANSACTIONS;
  });

  const [rawDatasetRows, setRawDatasetRows] = useState<RawDatasetRow[]>(() => {
    const saved = localStorage.getItem('pg_raw_dataset_rows');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_PARSED_DATASET.rawRows;
  });

  // Apriori hyper-parameters: calibrated for 100-transaction dataset
  const [minSupport, setMinSupport] = useState<number>(0.06); // 6% (appears in >= 6 transactions)
  const [minConfidence, setMinConfidence] = useState<number>(0.45); // 45% confidence
  const [miningTick, setMiningTick] = useState<number>(0);

  // Modals & Navigation
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeMathModalRule, setActiveMathModalRule] = useState<AssociationRule | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [activeCustomerTab, setActiveCustomerTab] = useState<'storefront' | 'recommendations' | 'orders' | 'wishlist'>('storefront');

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('pg_current_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    localStorage.setItem('pg_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    localStorage.setItem('pg_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('pg_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('pg_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('pg_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('pg_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Role switching
  const switchRole = (newRole: Role) => {
    setCurrentRole(newRole);
    const profile = allUsers.find(u => u.role === newRole);
    if (profile) {
      setCurrentUser(profile);
    }
  };

  const login = (email: string, role: Role) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      setCurrentRole(found.role);
    } else {
      const newUser: User = {
        id: `user-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role,
        joinedDate: 'Sep 2026',
      };
      setAllUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
      setCurrentRole(role);
    }
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    // Revert to demo customer
    const demoCust = INITIAL_USERS[0];
    setCurrentUser(demoCust);
    setCurrentRole('customer');
  };

  // Product management (Seller/Admin)
  const addProduct = (newProdData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...newProdData,
      id: `pg-${Date.now().toString().slice(-4)}`,
    };
    setProducts(prev => [newProduct, ...prev]);
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    setWishlist(prev => prev.filter(wishId => wishId !== id));
    if (selectedProductDetail && selectedProductDetail.id === id) {
      setSelectedProductDetail(null);
    }
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser.id === userId) {
      const fallback = allUsers.find(u => u.id !== userId && u.role === 'customer') || INITIAL_USERS[0];
      setCurrentUser(fallback);
      setCurrentRole(fallback.role);
    }
  };

  const deleteSeller = (sellerId: string, removeProducts: boolean = true) => {
    // 1. Remove the seller user from allUsers
    setAllUsers(prev => prev.filter(u => u.id !== sellerId));

    // 2. Optionally remove products listed by this seller
    if (removeProducts) {
      const sellerProductIds = new Set(products.filter(p => p.sellerId === sellerId).map(p => p.id));
      setProducts(prev => prev.filter(p => p.sellerId !== sellerId));
      setCart(prev => prev.filter(item => !sellerProductIds.has(item.product.id)));
      setWishlist(prev => prev.filter(id => !sellerProductIds.has(id)));
      if (selectedProductDetail && sellerProductIds.has(selectedProductDetail.id)) {
        setSelectedProductDetail(null);
      }
    }

    // 3. If currently acting as this seller, switch back to demo customer
    if (currentUser.id === sellerId) {
      const fallback = allUsers.find(u => u.id !== sellerId && u.role === 'customer') || INITIAL_USERS[0];
      setCurrentUser(fallback);
      setCurrentRole(fallback.role);
    }
  };

  const toggleStock = (id: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === id) {
        const nextInStock = !p.inStock;
        return {
          ...p,
          inStock: nextInStock,
          stockCount: nextInStock ? Math.max(p.stockCount, 5) : 0,
        };
      }
      return p;
    }));
  };

  // Cart operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Order placement & simulation
  const placeOrder = (
    shippingAddress: { street: string; city: string; state: string; zip: string },
    discountCode?: string
  ): Order => {
    const subtotal = cartSubtotal;
    let discount = 0;
    if (discountCode?.toUpperCase() === 'GENIUS10') {
      discount = subtotal * 0.10;
    } else if (discountCode?.toUpperCase() === 'BUNDLE15') {
      discount = subtotal * 0.15;
    }

    const total = Math.max(0, subtotal - discount);
    const orderItems = cart.map(item => ({
      productId: item.product.id,
      title: item.product.title,
      price: item.product.price,
      quantity: item.quantity,
      imageUrl: item.product.imageUrl,
    }));

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerEmail: currentUser.email,
      items: orderItems,
      subtotal,
      shipping: 0,
      discount,
      total,
      status: 'Processing',
      date: new Date().toISOString().split('T')[0],
      shippingAddress,
      trackingNumber: `PG-EXP-${Math.floor(100000 + Math.random() * 900000)}-FR`,
    };

    // Also register this basket as a new transaction for Apriori mining!
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      orderId: newOrder.id,
      date: newOrder.date,
      itemIds: cart.map(i => i.product.id),
    };

    setOrders(prev => [newOrder, ...prev]);
    setTransactions(prev => [...prev, newTx]);
    clearCart();

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  // Trigger recompute
  const recomputeApriori = () => {
    setMiningTick(prev => prev + 1);
  };

  const importDatasetText = (text: string) => {
    const parsed = parseUserDataset(text);
    if (parsed.transactions.length > 0) {
      setTransactions(parsed.transactions);
      setRawDatasetRows(parsed.rawRows);
      localStorage.setItem('pg_transactions', JSON.stringify(parsed.transactions));
      localStorage.setItem('pg_raw_dataset_rows', JSON.stringify(parsed.rawRows));
      recomputeApriori();
      return { count: parsed.transactions.length };
    }
    return { count: 0 };
  };

  const resetToGoogleAdjustedDataset = () => {
    setProducts(GOOGLE_ADJUSTED_PRODUCTS);
    setTransactions(INITIAL_PARSED_DATASET.transactions);
    setRawDatasetRows(INITIAL_PARSED_DATASET.rawRows);
    setMinSupport(0.06);
    setMinConfidence(0.45);
    localStorage.setItem('pg_products', JSON.stringify(GOOGLE_ADJUSTED_PRODUCTS));
    localStorage.setItem('pg_transactions', JSON.stringify(INITIAL_PARSED_DATASET.transactions));
    localStorage.setItem('pg_raw_dataset_rows', JSON.stringify(INITIAL_PARSED_DATASET.rawRows));
    recomputeApriori();
  };

  const seedSyntheticTransactions = (count: number = 5) => {
    const availableIds = products.map(p => p.id);
    if (availableIds.length < 2) return;

    const newTxs: Transaction[] = [];
    for (let i = 0; i < count; i++) {
      // Pick random 2 to 4 items with realistic affinity clusters
      const basketSize = Math.floor(Math.random() * 2) + 2;
      const shuffled = [...availableIds].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, basketSize);

      newTxs.push({
        id: `tx-sim-${Date.now()}-${i}`,
        date: new Date().toISOString().split('T')[0],
        itemIds: selected,
      });
    }

    setTransactions(prev => [...prev, ...newTxs]);
  };

  // Live Frequent Itemsets via Apriori Algorithm
  const frequentItemsets = useMemo(() => {
    return runApriori(transactions, minSupport, 3);
  }, [transactions, minSupport, miningTick]);

  // Live Association Rules mined from Frequent Itemsets
  const associationRules = useMemo(() => {
    return generateAssociationRules(frequentItemsets, transactions, minConfidence);
  }, [frequentItemsets, transactions, minConfidence, miningTick]);

  // Context-aware recommendations for active Cart
  const cartProductIds = useMemo(() => cart.map(c => c.product.id), [cart]);

  const cartRecommendations = useMemo(() => {
    return getAprioriRecommendationsForCart(cartProductIds, associationRules, products, 4);
  }, [cartProductIds, associationRules, products]);

  // Top recommendations globally across the catalog (highest support & confidence)
  const topRecommendations = useMemo(() => {
    return getAprioriRecommendationsForCart([], associationRules, products, 6);
  }, [associationRules, products]);

  const value: AppContextType = {
    currentUser,
    currentRole,
    switchRole,
    login,
    logout,
    allUsers,
    deleteUser,
    deleteSeller,
    products,
    addProduct,
    editProduct,
    deleteProduct,
    toggleStock,
    cart,
    cartCount,
    cartSubtotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    wishlist,
    toggleWishlist,
    orders,
    placeOrder,
    updateOrderStatus,
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
    cartRecommendations,
    topRecommendations,
    recomputeApriori,
    seedSyntheticTransactions,
    selectedProductDetail,
    setSelectedProductDetail,
    activeMathModalRule,
    setActiveMathModalRule,
    isCartOpen,
    setIsCartOpen,
    isAuthModalOpen,
    setIsAuthModalOpen,
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    activeCustomerTab,
    setActiveCustomerTab,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
