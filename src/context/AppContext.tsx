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
  Campaign,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_TRANSACTIONS,
  INITIAL_ORDERS,
  INITIAL_CAMPAIGNS,
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

// Safe localStorage helper to prevent quota exceeded or crash
const safeStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (err) {
      console.warn(`localStorage save skipped for key "${key}" to prevent quota crash:`, err);
    }
  },
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (err) {
      return null;
    }
  },
};

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

  // Festival & Season Campaigns
  campaigns: Campaign[];
  activeCampaigns: Campaign[];
  addCampaign: (campaign: Omit<Campaign, 'id'>) => void;
  updateCampaign: (id: string, updates: Partial<Campaign>) => void;
  deleteCampaign: (id: string) => void;
  toggleCampaignActive: (id: string) => void;

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
  placeOrder: (
    shippingAddress: { street: string; city: string; state: string; zip: string },
    discountCode?: string
  ) => Order;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  instantOrder: (product: Product, quantity?: number) => void;
  deliveryNotification: string | null;
  setDeliveryNotification: (msg: string | null) => void;

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
  // Current user & role
  const [currentRole, setCurrentRole] = useState<Role>(() => {
    return (safeStorage.getItem('pg_current_role') as Role) || 'customer';
  });

  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = safeStorage.getItem('pg_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedRole = (safeStorage.getItem('pg_current_role') as Role) || 'customer';
    const match = INITIAL_USERS.find(u => u.role === savedRole) || INITIAL_USERS[0];
    return match;
  });

  // Product Catalog: check if saved products adhere to the new 4 categories (Skincare, Makeup, Bodycare, Fragrance)
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = safeStorage.getItem('pg_products_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some(p => p.category === 'Skincare' || p.category === 'Makeup')
        ) {
          return parsed;
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  // Campaigns (Festival & Season Offers)
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = safeStorage.getItem('pg_campaigns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_CAMPAIGNS;
  });

  // Active campaigns
  const activeCampaigns = useMemo(() => {
    return campaigns.filter(c => c.isActive);
  }, [campaigns]);

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = safeStorage.getItem('pg_cart_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = safeStorage.getItem('pg_wishlist_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return ['pg-skn-02', 'pg-mak-11', 'pg-frg-38'];
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = safeStorage.getItem('pg_orders_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return INITIAL_ORDERS;
  });

  // Transactions & Raw Rows from 200 clean dataset
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = safeStorage.getItem('pg_transactions_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
      } catch (e) {}
    }
    return INITIAL_TRANSACTIONS;
  });

  const [rawDatasetRows, setRawDatasetRows] = useState<RawDatasetRow[]>(() => {
    const saved = safeStorage.getItem('pg_raw_dataset_rows_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 100) return parsed;
      } catch (e) {}
    }
    return INITIAL_PARSED_DATASET.rawRows;
  });

  // Apriori hyper-parameters: calibrated for 200 transactions
  const [minSupport, setMinSupport] = useState<number>(0.04); // 4% (>= 8 orders)
  const [minConfidence, setMinConfidence] = useState<number>(0.40); // 40% confidence
  const [miningTick, setMiningTick] = useState<number>(0);

  // Modals & Navigation
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [activeMathModalRule, setActiveMathModalRule] = useState<AssociationRule | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [activeCustomerTab, setActiveCustomerTab] = useState<
    'storefront' | 'recommendations' | 'orders' | 'wishlist'
  >('storefront');
  const [deliveryNotification, setDeliveryNotification] = useState<string | null>(null);

  // Sync to localStorage safely
  useEffect(() => {
    safeStorage.setItem('pg_current_role', currentRole);
  }, [currentRole]);

  useEffect(() => {
    safeStorage.setItem('pg_users', JSON.stringify(allUsers));
  }, [allUsers]);

  useEffect(() => {
    safeStorage.setItem('pg_products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    safeStorage.setItem('pg_campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    safeStorage.setItem('pg_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    safeStorage.setItem('pg_wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    safeStorage.setItem('pg_orders_v2', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    safeStorage.setItem('pg_transactions_v2', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    safeStorage.setItem('pg_raw_dataset_rows_v2', JSON.stringify(rawDatasetRows));
  }, [rawDatasetRows]);

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
    const defaultCust = INITIAL_USERS[0];
    setCurrentUser(defaultCust);
    setCurrentRole('customer');
  };

  const deleteUser = (userId: string) => {
    setAllUsers(prev => prev.filter(u => u.id !== userId));
  };

  const deleteSeller = (sellerId: string, removeProducts: boolean = true) => {
    setAllUsers(prev => prev.filter(u => u.id !== sellerId));
    if (removeProducts) {
      setProducts(prev => prev.filter(p => p.sellerId !== sellerId));
    }
  };

  // Product Catalog management
  const addProduct = (newProductData: Omit<Product, 'id'>) => {
    const newId = `pg-${Date.now().toString(36)}`;
    const fullProduct: Product = {
      ...newProductData,
      id: newId,
    };
    setProducts(prev => [fullProduct, ...prev]);
  };

  const editProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    setCart(prev => prev.filter(item => item.product.id !== id));
    setWishlist(prev => prev.filter(pId => pId !== id));
  };

  const toggleStock = (id: string) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const nextStock = !p.inStock;
          return {
            ...p,
            inStock: nextStock,
            stockCount: nextStock ? (p.stockCount > 0 ? p.stockCount : 10) : 0,
          };
        }
        return p;
      })
    );
  };

  // Campaign management (Festival & Season Offers)
  const addCampaign = (campaignData: Omit<Campaign, 'id'>) => {
    const newCampaign: Campaign = {
      ...campaignData,
      id: `cmp-${Date.now().toString(36)}`,
    };
    setCampaigns(prev => [newCampaign, ...prev]);
  };

  const updateCampaign = (id: string, updates: Partial<Campaign>) => {
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteCampaign = (id: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  const toggleCampaignActive = (id: string) => {
    setCampaigns(prev => prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
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
      prev.map(item => (item.product.id === productId ? { ...item, quantity } : item))
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
    const cleanCode = discountCode?.trim().toUpperCase();

    // Check campaigns first
    const matchedCampaign = campaigns.find(
      c => c.isActive && c.discountCode.toUpperCase() === cleanCode
    );

    if (matchedCampaign) {
      discount = (subtotal * matchedCampaign.discountPercent) / 100;
    } else if (cleanCode === 'GENIUS10') {
      discount = subtotal * 0.1;
    } else if (cleanCode === 'BUNDLE15') {
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
      trackingNumber: `PG-EXP-${Math.floor(100000 + Math.random() * 900000)}-NP`,
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    return newOrder;
  };

  const instantOrder = (product: Product, quantity: number = 1) => {
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
    setIsCartOpen(false);
    setSelectedProductDetail(null);
    setIsCheckoutModalOpen(true);
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const target = orders.find(o => o.id === orderId);

    setOrders(prev => {
      const updated = prev.map(o => (o.id === orderId ? { ...o, status } : o));
      safeStorage.setItem('pg_orders_v2', JSON.stringify(updated));
      return updated;
    });

    // Ingest into Apriori transactions if transitioned to 'Delivered'
    if (status === 'Delivered' && target && target.items.length > 0) {
      const purchasedProductIds = Array.from(new Set(target.items.map(i => i.productId)));

      const alreadyIngested = transactions.some(t => t.orderId === orderId);
      if (!alreadyIngested && purchasedProductIds.length > 0) {
        const newTx: Transaction = {
          id: `T-${orderId}`,
          orderId,
          date: new Date().toISOString().split('T')[0],
          itemIds: purchasedProductIds,
        };

        const updatedTxList = [newTx, ...transactions];
        setTransactions(updatedTxList);
        safeStorage.setItem('pg_transactions_v2', JSON.stringify(updatedTxList));

        const newRawRow: RawDatasetRow = {
          transaction_id: `T-${orderId}`,
          customer_id: target.customerId,
          transaction_date: newTx.date,
          products_purchased: target.items.map(i => i.title).join(', '),
          type: 'Live Delivered Order',
          matchedProductIds: purchasedProductIds,
        };

        const updatedRows = [newRawRow, ...rawDatasetRows];
        setRawDatasetRows(updatedRows);
        safeStorage.setItem('pg_raw_dataset_rows_v2', JSON.stringify(updatedRows));

        setDeliveryNotification(
          `Order ${orderId} delivered! Ingested ${purchasedProductIds.length} items into the Apriori Database.`
        );

        setMiningTick(prev => prev + 1);
      }
    }
  };

  // Dataset management
  const importDatasetText = (text: string) => {
    const parsed = parseUserDataset(text);
    if (parsed.transactions.length > 0) {
      setTransactions(parsed.transactions);
      setRawDatasetRows(parsed.rawRows);
      setMiningTick(prev => prev + 1);
      return { count: parsed.transactions.length };
    }
    return { count: 0 };
  };

  const resetToGoogleAdjustedDataset = () => {
    setProducts(GOOGLE_ADJUSTED_PRODUCTS);
    setTransactions(INITIAL_PARSED_DATASET.transactions);
    setRawDatasetRows(INITIAL_PARSED_DATASET.rawRows);
    setMiningTick(prev => prev + 1);
  };

  const seedSyntheticTransactions = (count: number = 25) => {
    const pIds = products.map(p => p.id);
    if (pIds.length === 0) return;

    const newTxList: Transaction[] = [];
    const newRawRows: RawDatasetRow[] = [];

    for (let i = 0; i < count; i++) {
      const size = Math.floor(Math.random() * 3) + 2; // 2 to 4 items
      const selected = new Set<string>();
      while (selected.size < size) {
        const randId = pIds[Math.floor(Math.random() * pIds.length)];
        selected.add(randId);
      }
      const arr = Array.from(selected);
      const txId = `T-SEED-${Date.now()}-${i + 1}`;

      newTxList.push({
        id: txId,
        orderId: `ORD-SYNTH-${i + 1}`,
        date: new Date().toISOString().split('T')[0],
        itemIds: arr,
      });

      const titles = arr
        .map(id => products.find(p => p.id === id)?.title || id)
        .join(', ');

      newRawRows.push({
        transaction_id: txId,
        customer_id: `C-SYNTH-${Math.floor(100 + Math.random() * 900)}`,
        transaction_date: new Date().toISOString().split('T')[0],
        products_purchased: titles,
        type: 'Synthetic Affinities',
        matchedProductIds: arr,
      });
    }

    const updatedTx = [...newTxList, ...transactions];
    const updatedRows = [...newRawRows, ...rawDatasetRows];
    setTransactions(updatedTx);
    setRawDatasetRows(updatedRows);
    setMiningTick(prev => prev + 1);
  };

  // Mining Engine: Frequent Itemsets & Association Rules
  const frequentItemsets = useMemo(() => {
    return runApriori(transactions, minSupport, 3);
  }, [transactions, minSupport, miningTick]);

  const associationRules = useMemo(() => {
    return generateAssociationRules(frequentItemsets, transactions, minConfidence);
  }, [frequentItemsets, transactions, minConfidence, miningTick]);

  const recomputeApriori = () => {
    setMiningTick(prev => prev + 1);
  };

  // Recommendations for Cart
  const cartProductIds = useMemo(() => cart.map(i => i.product.id), [cart]);

  const cartRecommendations = useMemo(() => {
    return getAprioriRecommendationsForCart(cartProductIds, associationRules, products, 4);
  }, [cartProductIds, associationRules, products]);

  // Top overall store recommendations
  const topRecommendations = useMemo(() => {
    return getAprioriRecommendationsForCart([], associationRules, products, 6);
  }, [associationRules, products]);

  return (
    <AppContext.Provider
      value={{
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

        campaigns,
        activeCampaigns,
        addCampaign,
        updateCampaign,
        deleteCampaign,
        toggleCampaignActive,

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
        instantOrder,
        deliveryNotification,
        setDeliveryNotification,

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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
