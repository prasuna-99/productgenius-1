export type Role = 'customer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  storeName?: string;
  joinedDate: string;
}

export interface Product {
  id: string;
  title: string;
  category: 'Fragrance & Bath' | 'Apparel & Silk' | 'Leather Goods' | 'Home & Ambiance' | 'Gourmet & Cellar';
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  sku: string;
  sellerId: string;
  sellerName: string;
  description: string;
  features: string[];
  imageUrl: string;
  tags: string[];
  isFeatured?: boolean;
  googleSearchQuery?: string;
  googleBenchmarkPrice?: number;
  googleActiveIngredients?: string[];
  googleSearchMatchedTerm?: string;
  googleShoppingRating?: number;
  googleSearchTrends?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  date: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingNumber: string;
}

// Apriori & Association Rule Types
export interface Transaction {
  id: string;
  orderId?: string;
  date: string;
  itemIds: string[]; // List of product IDs purchased together
}

export interface FrequentItemset {
  items: string[]; // Product IDs
  supportCount: number; // Frequency
  support: number; // supportCount / totalTransactions (0.0 to 1.0)
}

export interface AssociationRule {
  id: string;
  antecedent: string[]; // LHS product IDs
  consequent: string[]; // RHS product IDs
  support: number; // Support of (A U B)
  confidence: number; // Support(A U B) / Support(A)
  lift: number; // Confidence / Support(B)
  transactionCount: number; // how many transactions had both
  antecedentCount: number; // how many transactions had antecedent
}

export interface AprioriRecommendation {
  rule: AssociationRule;
  recommendedProduct: Product;
  basedOnProducts: Product[];
  confidencePercent: number;
  supportPercent: number;
  lift: number;
  reason: string;
}
