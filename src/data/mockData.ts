import { Product, User, Transaction, Order } from '../types';
import { GOOGLE_ADJUSTED_PRODUCTS, INITIAL_PARSED_DATASET, RAW_DATASET_TEXT } from './userDataset';

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

// Initial products: 12 Google Search adjusted boutique luxury items
export const INITIAL_PRODUCTS: Product[] = GOOGLE_ADJUSTED_PRODUCTS;

// Initial transactions: 100+ real transactions parsed from user dataset
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
        title: 'De Botanique Hyaluronic Hydrating Cleanser',
        price: 48,
        quantity: 1,
        imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
      },
      {
        productId: 'pg-skn-02',
        title: 'Cellular TFC8 Daily Recovery Moisturizer',
        price: 88,
        quantity: 1,
        imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
      },
      {
        productId: 'pg-skn-03',
        title: 'Silk Invisible UV Shield Broad Spectrum SPF50+',
        price: 54,
        quantity: 1,
        imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
      },
    ],
    subtotal: 190,
    shipping: 0,
    discount: 19.0,
    total: 171.0,
    status: 'Shipped',
    date: '2026-09-25',
    shippingAddress: {
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'Paris',
      state: 'Île-de-France',
      zip: '75008',
    },
    trackingNumber: 'PG-EXP-982104-FR',
  },
  {
    id: 'ORD-9755',
    customerId: 'user-customer-1',
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@boutique.com',
    items: [
      {
        productId: 'pg-har-04',
        title: 'Gold Lust Botanical Repair & Strengthen Shampoo',
        price: 56,
        quantity: 1,
        imageUrl: '/src/assets/images/luxury_hair_repair_serum_1790516287700.jpg',
      },
      {
        productId: 'pg-har-05',
        title: 'Deep Moisture Cuticle Repair Conditioner',
        price: 58,
        quantity: 1,
        imageUrl: '/src/assets/images/luxury_hair_repair_serum_1790516287700.jpg',
      },
    ],
    subtotal: 114,
    shipping: 0,
    discount: 0,
    total: 114.0,
    status: 'Delivered',
    date: '2026-09-20',
    shippingAddress: {
      street: '742 Evergreen Terrace, Apt 4B',
      city: 'Paris',
      state: 'Île-de-France',
      zip: '75008',
    },
    trackingNumber: 'PG-EXP-975512-FR',
  },
  {
    id: 'ORD-9610',
    customerId: 'user-cust-99',
    customerName: 'Julian Thorne',
    customerEmail: 'julian.thorne@lifestyle.co',
    items: [
      {
        productId: 'pg-mak-07',
        title: 'Velvet Soft-Focus Matte Foundation (All-Day Wear)',
        price: 68,
        quantity: 1,
        imageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
      },
      {
        productId: 'pg-mak-08',
        title: 'Pore-Refining Radiance Smoothing Face Primer',
        price: 46,
        quantity: 1,
        imageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
      },
      {
        productId: 'pg-mak-09',
        title: 'Artisanal Plush Precision Makeup Sponge Duo',
        price: 28,
        quantity: 1,
        imageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
      },
    ],
    subtotal: 142,
    shipping: 0,
    discount: 14.2,
    total: 127.8,
    status: 'Processing',
    date: '2026-09-26',
    shippingAddress: {
      street: '12 Kensington Church St',
      city: 'London',
      state: 'Greater London',
      zip: 'W8 4EP',
    },
    trackingNumber: 'PG-EXP-961099-GB',
  },
];
