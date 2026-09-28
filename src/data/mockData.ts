import { Product, User, Transaction, Order, Campaign } from '../types';
import { GOOGLE_ADJUSTED_PRODUCTS, INITIAL_PARSED_DATASET } from './userDataset';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-customer-1',
    name: 'Elena Rostova',
    email: 'elena.rostova@boutique.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    joinedDate: 'Jan 2026',
  },
  {
    id: 'user-seller-1',
    name: 'Atelier Bordeaux',
    email: 'curator@atelierbordeaux.com',
    role: 'seller',
    storeName: 'Atelier Bordeaux & Co.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    joinedDate: 'Nov 2025',
  },
  {
    id: 'user-admin-1',
    name: 'Marcus Vance',
    email: 'marcus@productgenius.internal',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
    joinedDate: 'Aug 2025',
  },
];

// Initial products: 40 curated Skincare, Makeup, Bodycare, and Fragrance products
export const INITIAL_PRODUCTS: Product[] = GOOGLE_ADJUSTED_PRODUCTS;

// Initial transactions: 200 clean transactions provided by user
export const INITIAL_TRANSACTIONS: Transaction[] = INITIAL_PARSED_DATASET.transactions;

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-9821',
    customerId: 'user-customer-1',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@boutique.com',
    items: [
      {
        productId: 'pg-skn-01',
        title: 'Botanique Hyaluronic Hydrating Cleanser',
        price: 1450,
        quantity: 1,
        imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
      },
      {
        productId: 'pg-skn-02',
        title: 'Cellular TFC8 Daily Recovery Moisturizer',
        price: 2450,
        quantity: 1,
        imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
      },
      {
        productId: 'pg-skn-03',
        title: 'Silk Invisible UV Shield Broad Spectrum SPF50+',
        price: 1650,
        quantity: 1,
        imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
      },
    ],
    subtotal: 5550,
    shipping: 0,
    discount: 555,
    total: 4995,
    status: 'Shipped',
    date: '2026-09-25',
    shippingAddress: {
      street: 'Durbar Marg, Heritage Lane 4',
      city: 'Kathmandu',
      state: 'Bagmati',
      zip: '44600',
    },
    trackingNumber: 'PG-EXP-982104-NP',
  },
  {
    id: 'ORD-9755',
    customerId: 'user-customer-1',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@boutique.com',
    items: [
      {
        productId: 'pg-bdy-24',
        title: 'Gold Lust Botanical Repair & Strengthen Shampoo',
        price: 1750,
        quantity: 1,
        imageUrl: '/src/assets/images/luxury_hair_repair_serum_1790516287700.jpg',
      },
      {
        productId: 'pg-bdy-25',
        title: 'Deep Moisture Cuticle Repair Conditioner',
        price: 1850,
        quantity: 1,
        imageUrl: '/src/assets/images/luxury_hair_repair_serum_1790516287700.jpg',
      },
    ],
    subtotal: 3600,
    shipping: 0,
    discount: 360,
    total: 3240,
    status: 'Delivered',
    date: '2026-09-20',
    shippingAddress: {
      street: 'Lakeside Road, Ward 6',
      city: 'Pokhara',
      state: 'Gandaki',
      zip: '33700',
    },
    trackingNumber: 'PG-EXP-975512-NP',
  },
];

// Initial Festival & Season Campaigns
export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-festive-01',
    title: 'Grand Diwali & Tihar Festival Gala',
    type: 'festival',
    tagline: 'Illuminate Your Radiance with 25% Off on Skincare & Fragrance Pairs',
    discountCode: 'FESTIVE25',
    discountPercent: 25,
    themeColor: 'amber',
    badgeText: 'Festival Mega Offer',
    bannerImageUrl: '/src/assets/images/botanical_perfume_rose_1790511914245.jpg',
    startDate: '2026-09-20',
    endDate: '2026-10-31',
    isActive: true,
    featuredCategory: 'All',
    description: 'Celebrate the festive season with handcrafted luxury essentials. Enjoy flat 25% savings and accelerated Apriori festival pairing bundles.',
  },
  {
    id: 'cmp-dashain-02',
    title: 'Dashain Utsav Festive Bonanza',
    type: 'festival',
    tagline: 'Exclusive Festive Elegance: Flat 30% Off on Curated Luxury Makeup',
    discountCode: 'DASHAIN30',
    discountPercent: 30,
    themeColor: 'burgundy',
    badgeText: 'Festive Special',
    bannerImageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
    startDate: '2026-09-25',
    endDate: '2026-10-25',
    isActive: true,
    featuredCategory: 'Makeup',
    description: 'Elevate your festival celebration look with longwear velvet matte foundations, artisanal primers, and couture lipsticks.',
  },
  {
    id: 'cmp-season-03',
    title: 'Autumn Glow Seasonal Revival',
    type: 'season',
    tagline: 'Hydrate & Protect: Flat 20% Off on Skincare & Bodycare Nourishment',
    discountCode: 'AUTUMN20',
    discountPercent: 20,
    themeColor: 'emerald',
    badgeText: 'Season Offer',
    bannerImageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
    startDate: '2026-09-15',
    endDate: '2026-11-15',
    isActive: true,
    featuredCategory: 'Skincare',
    description: 'Pre-winter barrier protection formulas. Replenish moisture with hyaluronic cleansers, repair creams, and nourishing botanical oils.',
  },
];
