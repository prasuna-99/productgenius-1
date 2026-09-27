import { Product, Transaction } from '../types';

export interface RawDatasetRow {
  transaction_id: string;
  customer_id: string;
  transaction_date: string;
  products_purchased: string;
  type: string;
  matchedProductIds: string[];
}

// 12 High-End Boutique Skincare, Cosmetics & Haircare Products adjusted via Google Search
export const GOOGLE_ADJUSTED_PRODUCTS: Product[] = [
  {
    id: 'pg-skn-01',
    title: 'De Botanique Hyaluronic Hydrating Cleanser',
    category: 'Fragrance & Bath',
    price: 48,
    originalPrice: 56,
    rating: 4.9,
    reviewsCount: 84,
    inStock: true,
    stockCount: 26,
    sku: 'PG-CLN-HYA-01',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Purifying cream-to-foam cleanser enriched with triple molecular weight hyaluronic acid, organic green tea extract, and soothing chamomile to maintain the skin’s moisture barrier without stripping.',
    features: ['Triple Hyaluronic Acid Complex', 'Chamomile & White Tea Infusion', 'pH 5.5 Barrier Balancing', 'Non-comedogenic & Sulfate-free'],
    imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
    tags: ['Skincare', 'Clean Beauty', 'Hydration', 'Top Pick'],
    isFeatured: true,
    googleSearchMatchedTerm: 'Hydrating Cleanser',
    googleSearchQuery: 'luxury hydrating hyaluronic acid face cleanser barrier repair',
    googleBenchmarkPrice: 52,
    googleActiveIngredients: ['Triple Molecular Hyaluronic Acid', 'Organic Green Tea Extract', 'Bisabolol Chamomile'],
    googleShoppingRating: 4.9,
    googleSearchTrends: '+24% YoY search volume on Google Trends',
  },
  {
    id: 'pg-skn-02',
    title: 'Cellular TFC8 Daily Recovery Moisturizer',
    category: 'Fragrance & Bath',
    price: 88,
    originalPrice: 98,
    rating: 5.0,
    reviewsCount: 112,
    inStock: true,
    stockCount: 18,
    sku: 'PG-MST-TFC-02',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Clinically formulated with cellular renewal peptides, plant squalane, and aloe leaf water. Restores barrier levels and locks hydration with a soft ivory satin finish.',
    features: ['Cellular TFC8 Peptide Complex', '100% Plant-Derived Squalane', '72-Hour Deep Moisture Lock', 'Lightweight Velvety Absorption'],
    imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
    tags: ['Skincare', 'Moisturizer', 'Anti-Aging', 'Best Seller'],
    isFeatured: true,
    googleSearchMatchedTerm: 'Daily Moisturizer',
    googleSearchQuery: 'peptide rich barrier recovery daily moisturizer squalane',
    googleBenchmarkPrice: 94,
    googleActiveIngredients: ['Cellular TFC8 Peptides', '100% Plant Squalane', 'Ceramide NP'],
    googleShoppingRating: 4.9,
    googleSearchTrends: '+32% search growth for barrier recovery creams',
  },
  {
    id: 'pg-skn-03',
    title: 'Silk Invisible UV Shield Broad Spectrum SPF50+',
    category: 'Fragrance & Bath',
    price: 54,
    originalPrice: 62,
    rating: 4.9,
    reviewsCount: 96,
    inStock: true,
    stockCount: 30,
    sku: 'PG-SPF-SLK-03',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Weightless mineral sun serum infused with hydrolyzed silk proteins and antioxidant vitamin C. Delivers full spectrum UVA/UVB defense without white cast or greasiness.',
    features: ['Broad Spectrum SPF 50+ / PA++++', 'Hydrolyzed Silk Protein Base', 'Zero White Cast / Invisible Sheer', 'Reef-Safe & Water Resistant (80 min)'],
    imageUrl: '/src/assets/images/skincare_cleanser_moisturizer_1790516249925.jpg',
    tags: ['Suncare', 'SPF50', 'Silk Infused', 'Daily Essential'],
    isFeatured: true,
    googleSearchMatchedTerm: 'SPF50 Sunscreen',
    googleSearchQuery: 'broad spectrum SPF 50 sheer invisible mineral sunscreen silk protein',
    googleBenchmarkPrice: 58,
    googleActiveIngredients: ['Zinc Oxide 18.2%', 'Hydrolyzed Silk Protein', 'Ascorbyl Glucoside (Vit C)'],
    googleShoppingRating: 5.0,
    googleSearchTrends: '#1 Top breakout beauty search on Google',
  },
  {
    id: 'pg-har-04',
    title: 'Gold Lust Botanical Repair & Strengthen Shampoo',
    category: 'Fragrance & Bath',
    price: 56,
    originalPrice: 65,
    rating: 4.8,
    reviewsCount: 73,
    inStock: true,
    stockCount: 20,
    sku: 'PG-SHM-REP-04',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Bio-restorative cleansing formula with plant collagen, caffeine, and Mediterranean cypress extract to reinforce inner cuticle strength and smooth damaged strands.',
    features: ['Plant Collagen & Biotin Fortification', 'Sulfate-Free Micro-Lather', 'Protects Color & Keratin Treatments', 'Proven 82% Split-End Reduction'],
    imageUrl: '/src/assets/images/luxury_hair_repair_serum_1790516287700.jpg',
    tags: ['Haircare', 'Repair', 'Sulfate-Free'],
    isFeatured: true,
    googleSearchMatchedTerm: 'Repair Shampoo',
    googleSearchQuery: 'botanical bond repair shampoo sulfate free plant collagen',
    googleBenchmarkPrice: 62,
    googleActiveIngredients: ['Hydrolyzed Pea Peptide', 'Biotin B7', 'Mediterranean Cypress'],
    googleShoppingRating: 4.8,
    googleSearchTrends: '+19% search interest for luxury bond repair',
  },
  {
    id: 'pg-har-05',
    title: 'Deep Moisture Cuticle Repair Conditioner',
    category: 'Fragrance & Bath',
    price: 58,
    originalPrice: 68,
    rating: 4.9,
    reviewsCount: 68,
    inStock: true,
    stockCount: 15,
    sku: 'PG-CND-REP-05',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Intensive nourishing cream conditioner formulated with macadamia nut butter, maracuja oil, and silk amino acids to untangle, seal moisture, and restore high-gloss luster.',
    features: ['Silk Amino Acid Restructuring', 'Cold-Pressed Maracuja Seed Oil', 'Thermal Heat Defense Shield', 'Instant Detangling & Silky Slip'],
    imageUrl: '/src/assets/images/luxury_hair_repair_serum_1790516287700.jpg',
    tags: ['Haircare', 'Conditioner', 'Intense Moisture'],
    isFeatured: false,
    googleSearchMatchedTerm: 'Repair Conditioner',
    googleSearchQuery: 'deep moisture cuticle repair conditioner maracuja silk amino',
    googleBenchmarkPrice: 64,
    googleActiveIngredients: ['Maracuja Seed Oil', 'Silk Amino Acids', 'Macadamia Butter'],
    googleShoppingRating: 4.9,
    googleSearchTrends: '+15% search interest for cuticle sealing conditioners',
  },
  {
    id: 'pg-har-06',
    title: 'Elixir Ultime Nourishing Botanical Hair Serum',
    category: 'Fragrance & Bath',
    price: 62,
    originalPrice: 72,
    rating: 4.9,
    reviewsCount: 91,
    inStock: true,
    stockCount: 22,
    sku: 'PG-SRM-HAR-06',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Micro-weight dry hair oil infused with French camellia blossom, sacred marula, and argan oil. Controls humidity frizz, seals split ends, and imparts brilliant mirror shine.',
    features: ['Imperial Camellia & Argan Infusion', '450°F Thermal Heat Protection', 'Zero Residue Featherlight Feel', 'Signature Rose & Bergamot Aroma'],
    imageUrl: '/src/assets/images/luxury_hair_repair_serum_1790516287700.jpg',
    tags: ['Haircare', 'Serum', 'Argan Oil', 'Shine'],
    isFeatured: true,
    googleSearchMatchedTerm: 'Hair Serum',
    googleSearchQuery: 'nourishing botanical hair oil serum heat protectant camellia argan',
    googleBenchmarkPrice: 68,
    googleActiveIngredients: ['French Camellia Oil', 'Cold-Pressed Argan', 'Sacred Marula'],
    googleShoppingRating: 4.9,
    googleSearchTrends: '+41% search interest for anti-frizz gloss serums',
  },
  {
    id: 'pg-mak-07',
    title: 'Velvet Soft-Focus Matte Foundation (All-Day Wear)',
    category: 'Apparel & Silk',
    price: 68,
    originalPrice: 78,
    rating: 4.9,
    reviewsCount: 104,
    inStock: true,
    stockCount: 25,
    sku: 'PG-FND-MAT-07',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Breathable liquid foundation engineered with micro-powder blurring spheres and hyaluronic acid. Delivers 24-hour transfer-proof medium-to-full coverage without caking.',
    features: ['24-Hour Transfer-Resistant Wear', 'Blurring Micro-Powder Complex', 'Hyaluronic Acid Comfort Core', 'Non-Oxidizing Natural Matte Finish'],
    imageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
    tags: ['Cosmetics', 'Foundation', 'Matte', 'All-Day'],
    isFeatured: true,
    googleSearchMatchedTerm: 'Matte Foundation',
    googleSearchQuery: 'longwear soft-focus velvet matte liquid foundation non-drying',
    googleBenchmarkPrice: 72,
    googleActiveIngredients: ['Micro-Blurring Spheres', 'Encapsulated Hyaluronic Acid', 'Antioxidant Vitamin E'],
    googleShoppingRating: 4.9,
    googleSearchTrends: '+27% trending search for transfer-proof matte bases',
  },
  {
    id: 'pg-mak-08',
    title: 'Pore-Refining Radiance Smoothing Face Primer',
    category: 'Apparel & Silk',
    price: 46,
    originalPrice: 54,
    rating: 4.8,
    reviewsCount: 77,
    inStock: true,
    stockCount: 28,
    sku: 'PG-PRM-FAC-08',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Silky gripping primer with silica blurring veil and niacinamide. Minimizes the appearance of pores and fine lines while locking foundation in place for 16+ hours.',
    features: ['Silica Optical Blurring Veil', 'Niacinamide Pore-Clarifying Extract', 'All-Day Foundation Gripping Matrix', 'Oil-Free & Hydrating Finish'],
    imageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
    tags: ['Cosmetics', 'Primer', 'Pore-Minimizing'],
    isFeatured: false,
    googleSearchMatchedTerm: 'Face Primer',
    googleSearchQuery: 'pore refining radiance smoothing grip face primer niacinamide',
    googleBenchmarkPrice: 50,
    googleActiveIngredients: ['Niacinamide 3%', 'Silica Optical Blurring Veil', 'Agave Grip Extract'],
    googleShoppingRating: 4.8,
    googleSearchTrends: '+22% search volume for hydrating makeup primers',
  },
  {
    id: 'pg-mak-09',
    title: 'Artisanal Plush Precision Makeup Sponge Duo',
    category: 'Apparel & Silk',
    price: 28,
    originalPrice: 34,
    rating: 4.9,
    reviewsCount: 120,
    inStock: true,
    stockCount: 45,
    sku: 'PG-SPN-MAK-09',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Latex-free hydrophilic memory foam blending sponges designed with precision drop tips and flat contour edges for streak-free foundation and concealer application.',
    features: ['Ultra-Plush Hydrophilic Foam', 'Precision Tear-Drop Ergonomics', 'Streak-Free Seamless Airbrush Finish', 'Includes Ivory Travel Capsule'],
    imageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
    tags: ['Beauty Tools', 'Sponge', 'Airbrush'],
    isFeatured: false,
    googleSearchMatchedTerm: 'Makeup Sponge',
    googleSearchQuery: 'hydrophilic latex-free precision teardrop beauty blending sponge',
    googleBenchmarkPrice: 32,
    googleActiveIngredients: ['Hydrophilic Antimicrobial Memory Foam', 'Ultra-Fine Micro-Pore Structure'],
    googleShoppingRating: 4.9,
    googleSearchTrends: '+14% steady search volume for airbrush tools',
  },
  {
    id: 'pg-mak-10',
    title: 'Satin Cashmere Matte Lipstick in Bordeaux Rose',
    category: 'Apparel & Silk',
    price: 42,
    originalPrice: 48,
    rating: 4.9,
    reviewsCount: 88,
    inStock: true,
    stockCount: 32,
    sku: 'PG-LIP-BRD-10',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Richly pigmented couture lipstick in a weighted burgundy-gold fluted case. Formulated with wild mango butter and argan oil for non-drying, plush velvety color.',
    features: ['Wild Mango Butter Hydration', '10-Hour Velvet Color Fidelity', 'Debossed Architectural Fluted Case', 'Smooth Glide, Never Cracks'],
    imageUrl: '/src/assets/images/luxury_matte_foundation_lipstick_1790516270933.jpg',
    tags: ['Cosmetics', 'Lipstick', 'Bordeaux', 'Trending'],
    isFeatured: true,
    googleSearchMatchedTerm: 'Lipstick',
    googleSearchQuery: 'satin cashmere velvet matte lipstick burgundy bordeaux rose',
    googleBenchmarkPrice: 46,
    googleActiveIngredients: ['Wild Mango Seed Butter', 'Moroccan Argan Oil', 'Pure Mineral Pigments'],
    googleShoppingRating: 4.9,
    googleSearchTrends: '+35% search spike for bordeaux & berry lips',
  },
  {
    id: 'pg-prf-11',
    title: 'Pétale de Rose Botanical Eau de Parfum (100ml)',
    category: 'Fragrance & Bath',
    price: 165,
    originalPrice: 190,
    rating: 4.9,
    reviewsCount: 95,
    inStock: true,
    stockCount: 18,
    sku: 'PG-PRF-ROS-11',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Sensual artisanal eau de parfum capturing Grasse centifolia rose, crushed pink peppercorn, and warm cashmeran enveloped in a fluted crystal flacon.',
    features: ['Top: Damask Rose, Lychee', 'Heart: Cashmeran, Pink Pepper', 'Base: White Amber, Sandalwood', 'Artisanal Micro-Batch Distillation'],
    imageUrl: '/src/assets/images/botanical_perfume_rose_1790511914245.jpg',
    tags: ['Fragrance', 'Boutique', 'Rose', 'Signature'],
    isFeatured: true,
    googleSearchMatchedTerm: 'Floral Perfume',
    googleSearchQuery: 'artisanal Grasse centifolia rose botanical eau de parfum cashmeran',
    googleBenchmarkPrice: 175,
    googleActiveIngredients: ['Grasse Centifolia Rose Absolute', 'Pink Peppercorn Co2', 'White Sandalwood'],
    googleShoppingRating: 5.0,
    googleSearchTrends: '+29% niche fragrance search popularity',
  },
  {
    id: 'pg-bdy-12',
    title: 'Velvet Rose & Peony Nourishing Body Lotion',
    category: 'Fragrance & Bath',
    price: 52,
    originalPrice: 60,
    rating: 4.8,
    reviewsCount: 62,
    inStock: true,
    stockCount: 24,
    sku: 'PG-LOT-ROS-12',
    sellerId: 'user-seller-1',
    sellerName: 'Atelier Bordeaux & Co.',
    description: 'Rich yet fast-absorbing botanical body emulsion infused with cold-pressed rosehip seed, organic shea butter, and crushed peony petals for luminous softness.',
    features: ['Cold-Pressed Rosehip & Shea Base', 'Omega 3, 6 & 9 Essential Fatty Acids', 'Delicate Scent of Blooming Rose & Fig', 'Dermatologist Tested & 100% Vegan'],
    imageUrl: '/src/assets/images/botanical_perfume_rose_1790511914245.jpg',
    tags: ['Bodycare', 'Body Lotion', 'Hydrating'],
    isFeatured: false,
    googleSearchMatchedTerm: 'Body Lotion',
    googleSearchQuery: 'nourishing botanical rose peony body emulsion cold-pressed rosehip',
    googleBenchmarkPrice: 58,
    googleActiveIngredients: ['Cold-Pressed Chilean Rosehip', 'Organic Shea Butter', 'Peony Flower Extract'],
    googleShoppingRating: 4.8,
    googleSearchTrends: '+18% search interest for scented luxury bodycare',
  },
];

export const RAW_DATASET_TEXT = `transaction_id	customer_id	transaction_date	products_purchased	type
T0001	C001	2026-01-03	Hydrating Cleanser, Daily Moisturizer, SPF50 Sunscreen	Strong
T0002	C002	2026-01-05	Repair Shampoo, Repair Conditioner	Strong
T0003	C003	2026-01-08	Matte Foundation, Face Primer, Makeup Sponge	Strong
T0004	C004	2026-01-10	Floral Perfume, Body Lotion	Mixed
T0005	C005	2026-01-12	Lipstick, Hair Serum	Random
T0006	C001	2026-01-15	Daily Moisturizer	Strong
T0007	C003	2026-01-18	Matte Foundation, Repair Shampoo, Body Lotion	Mixed
T0008	C002	2026-01-20	Makeup Sponge, Body Lotion	Random
T0009	C004	2026-01-23	Hydrating Cleanser, Floral Perfume, Repair Conditioner	Mixed
T0010	 	2026-01-25	SPF50 Sunscreen, Lipstick, Hair Serum, Makeup Sponge	Random
T00011	c081	45885	Lipstick Cream, Hair Serum Serum Gel Gel Gel, SPF50 Sunscreen Mini Plus Mini Gel Serum, Hair Serum Plus Gel Cream Serum Cream	Online
T00012	C125	45724	Hair Serum Plus Gel Cream Plus Gel, SPF50 Sunscreen Mini Serum Cream Cream Serum, Daily Moisturizer Gel Mini Plus Plus Cream, Daily Moisturizer Gel Mini Plus Gel Cream	online
T00013	C158	45679	Face Primer Plus Mini, Face Primer Gel Cream Serum Mini Gel, SPF50 Sunscreen Mini Plus Plus Mini Plus Plus, Dily Moisturizr Gl Crm Plus, Hair Serum Serum Gel Gel Gel	Online
T00014		45927	SPF50 Sunscreen Mini Plus Mini XL, SPF50 Sunscreen Mini Serum Cream Plus, Lipstick Plus Serum	 STORE 
T00015		45692	SPF50 Sunscreen Mini Gel, SPF50 Sunscreen Mini Serum Plus Cream Gel, Matte Foundation Serum Cream	online
T00016	C090	45869	SPF50 Sunscreen Mini Plus, Lipstick Serum Serum Serum, SPF50 Sunscrn Mini Srum XL, Floral Perfume Plus Serum Plus, Face Primer Plus Plus Plus XL Cream	Store
T00017		45815	Floral Perfume Plus Serum Plus Plus Cream Serum Gel, Repair Shampoo	Store
T00018	c287	45790	SPF50 Sunscreen Mini Plus Mini Plus Gel, SPF50 Sunscreen Mini Plus Cream	Store
T00019		45980	Floral Perfume Plus Serum Plus Plus Cream Serum XL, Matte Foundation Plus XL Serum	online
T00020	C009	45984	Repair Shampoo Plus, Hair Serum Plus Gel Cream Plus Serum XL Serum, Face Primer Cream Cream Serum	 STORE 
T00021		46023	Matte Foundation Plus XL Cream, Hair Serum Plus Gel Cream Serum Gel	 STORE 
T00022		45945	SPF50 Sunscreen Mini Serum Cream Cream XL Cream, Repair Shampoo, Floral Perfume XL Cream, SPF50 Sunscreen Mini Mini XL	Online
T00023		45917	SPF50 Sunscreen Mini Mini Mini, Daily Moisturizer Gel Cream Cream Serum Cream, SPF50 Sunscreen Mini Serum XL Gel	Online
T00024	C024	45717	SPF50 Sunscreen Mini Gel Serum	Store
T00025	c202	45899	Lipstick Mini Serum Mini Cream Gel	online
T00026		45708	SPF50 Sunscreen Mini Serum XL Cream Cream	online
T00027	C132	45854	Matte Foundation Plus XL Serum Mini Cream Mini, Hair Serum Plus Serum Mini XL, Face Primer Cream XL XL Gel	Store
T00028		45668	Lipstick Mini Serum, Matte Foundation Plus Plus XL, Face Primer Gel, Floral Perfume XL Cream Cream Plus, Hair Serum Serum Gel	 STORE 
T00029		45978	SPF50 Sunscreen Mini Serum XL Gel, Lipstick Serum Serum Plus XL, SPF50 Sunscreen Mini Serum XL XL, Matte Foundation Plus XL Cream, Makeup Sponge Gel Plus	online
T00030		45698	Lipstick Mini Serum Mini XL, Hair Serum Plus Gel Mini, SPF50 Sunscreen Mini Serum Cream	Store
T00031		45815	Matte Foundation Plus XL Mini, Hair Serum Plus Serum Mini, Hair Serum Plus Serum, Daily Moisturizer Gel Mini Plus Gel Gel Gel Gel Serum	Online
T00032		45795	Matte Foundation Serum Cream Cream, FACE PRIMER GEL	online
T00033	C213	45720	Hydrating Cleanser XL Serum Plus Gel, Hair Serum Plus Serum Mini Gel Mini, SPF50 Sunscreen Mini Serum Mini, Lipstick Serum Serum Serum Gel, Daily Moisturizer Gel Mini Plus Gel Gel Gel	 STORE 
T00034	c149	45686	Hydrating Cleanser Serum Cream, SPF50 Sunscreen Mini Serum Cream Cream Mini	Online
T00035	C232	45753	Lipstick Serum Serum XL Plus Gel, Matte Foundation, Matte Foundation Plus XL Mini Gel Mini	 STORE 
T00036		45939	Matte Foundation Serum Cream Mini Serum, SPF50 Sunscreen Mini Serum XL Cream Cream, SPF50 Sunscreen Cream, Hair Serum Cream Plus Mini	Store
T00037	C051	45773	Makeup Sponge Gel Cream Serum Plus, Matte Foundation Serum Cream Cream XL, Hydrating Cleanser Serum Cream Mini Gel, SPF50 Sunscreen XL Gel	online
T00038	c076	45903	SPF50 Sunscreen Mini Serum XL Gel, Face Primer Cream Serum Plus Gel, SPF50 Sunscreen Mini Serum Cream Cream, SPF50 Sunscreen Gel Cream Gel, Lipstick Serum Serum XL Mini	online
T00039	c107	45941	Matte Foundation Serum Cream Cream XL Mini XL, SPF50 Sunscreen Mini Plus Plus Mini Plus Plus, Repair Conditioner Mini, Matte Foundation Plus XL Cream Mini, SPF50 Sunscreen XL Gel	Store
T00040		45774	SPF50 Sunscreen Mini Serum Plus	Store
T00041		45998	Lipstick Serum Serum Cream Cream, Hair Serum Plus Serum Mini Cream XL, Daily Moisturizer Gel Cream, Hair Serum Plus Serum Mini, Hair Serum Serum Gel	Online
T00042	C126	45697	Hair Serum Cream Plus Plus, Face Primer Cream Cream Gel XL, SPF50 Sunscreen Mini	Online
T00043	c106	45684	SPF50 Sunscreen Mini Serum XL Serum, Hydrating Cleanser Gel, Face Primer Cream Serum Plus	Store
T00044		45788	Hair Serum Serum Gel Mini, SPF50 Sunscreen Gel Cream Gel, Lipstick Serum Serum Plus Serum XL, SPF50 Sunscreen Mini Serum Cream	 STORE 
T00045	C287	46003	SPF50 Sunscreen XL Mini Mini, Makeup Sponge Gel Cream Gel, SPF50 Sunscreen Mini Serum XL Cream Cream, Face Primer Cream Cream Plus Plus, Hair Serum Plus Serum	Online
T00046		45723	Hair Serum Serum Gel Gel Gel	Online
T00047		45980	Daily Moisturizer Gel Mini Plus Plus	Store
T00048	C034	45877	Hair Serum Plus Serum XL Cream Cream, SPF50 Sunscreen Mini Plus Mini Plus, Floral Perfume Plus Serum Plus Plus Cream, Matte Foundation XL Gel Serum, SPF50 Sunscreen Plus Serum Plus	Store
T00049	c140	45780	Lipstick Plus Mini, Hair Serum Plus Gel Mini Cream Plus, SPF50 Sunscreen Mini Plus Plus XL Plus Mini, SPF50 Sunscreen Mini Gel	 STORE 
T00050		45925	SPF50 Sunscreen XL Gel Mini XL, Repair Conditioner Mini	Store
T00051	c030	45949	SPF50 Sunscreen Mini Plus Mini Gel Serum, SPF50 Sunscreen Mini Serum Plus XL, SPF50 Sunscreen Mini Plus Mini	Store
T00052	C052	45874	Hair Serum Plus Gel Cream Gel Plus, Face Primer Cream	Store
T00053	C008	45661	Hair Serum Plus Serum Mini Cream Mini, SPF50 Sunscreen Mini Plus Gel	Store
T00054	C243	46011	Lipstick Mini Serum Mini Serum Serum	online
T00055	C293	45678	Face Primer Cream Cream Gel, SPF50 Sunscreen XL Mini Serum, SPF50 Sunscreen XL Serum Mini, Matte Foundation Plus Cream XL	 STORE 
T00056		45668	Face Primer Cream Serum	Store
T00057		45937	Repair Conditioner Cream XL, Matte Foundation Serum Cream Plus Serum, Makeup Sponge Gel Serum, SPF50 Sunscreen Mini Plus Mini Plus Gel	online
T00058	C071	45876	Hair Serum Plus Gel Mini Cream, Hair Serum Plus Gel Cream Gel, Lipstick Serum Serum Plus Cream Gel, Hair Serum Plus Serum XL	online
T00059		45953	Hydrating Cleanser Gel	Online
T00060	c268	45723	SPF50 Sunscreen Mini Serum Cream Gel Serum, Hair Serum Plus Gel Cream Plus Serum XL Serum, Hydrating Cleanser Serum Cream Mini Gel, Hair Serum Plus Gel Cream XL, Lipstick Serum Serum XL Mini	 STORE 
T00061	c028	45785	Hair Serum Plus Gel Cream Plus Serum, SPF50 Sunscreen Mini Cream, Makeup Sponge Gel Cream Serum Plus, Face Primer Cream Cream Gel Gel XL	 STORE 
T00062	c176	45738	Hydrating Cleanser XL Serum, Lipstick Plus Serum Plus Mini, SPF50 Sunscreen Mini Serum Cream Plus, Hair Serum Mini, Makeup Sponge Gel Cream Serum Plus	Store
T00063	c001	45893	Makeup Sponge Gel Cream Serum, Hydrating Cleanser XL Serum XL, Lipstick Serum Serum XL, Matte Foundation Serum Cream Cream XL	online
T00064	c296	45793	Matte Foundation Serum Cream Mini, Hair Serum Plus Serum XL, SPF50 Sunscreen Mini Plus Plus	Online
T00065		45841	Hair Serum Plus Gel Cream Gel Cream Gel, Daily Moisturizer Gel Mini Plus Gel, Floral Perfume Plus Serum Cream XL, Hair Serum Plus Gel Cream Plus Serum XL	online
T00066	C067	45783	SPF50 Sunscreen Mini Serum Cream Cream Serum, Face Primer Cream Cream Gel Mini, Hydrating Cleanser Serum Cream Mini, Hydrating Cleanser Serum Cream Mini Gel, Floral Perfume Plus Serum Cream	Store
T00067		45748	Face Primer Plus, Lipstick Serum Serum Cream, SPF50 Sunscreen Mini Plus Plus Serum, Daily Moisturizer Gel Mini, SPF50 Sunscreen Mini Plus Plus XL Plus Mini	Store
T00068		45929	Lipstick Mini Serum XL Serum, SPF50 Sunscreen Mini Serum Cream Mini, Matte Foundation Serum Cream Cream XL Mini, Hair Serum Plus Serum Mini Gel Serum, Hair Serum Plus Gel Cream Plus Serum	Store
T00069	C266	45789	SPF50 Sunscreen XL Gel Mini, SPF50 Sunscreen Mini Serum Cream Gel, Matte Foundation Plus Cream XL Mini Cream, Matte Foundation Serum XL	 STORE 
T00070	c259	45879	 SPF50 Sunscreen Mini Serum XL Cream Cream , Matte Foundation Plus XL Serum Mini	online
T00071	C078	45864	Matte Foundation Serum Cream Cream XL Mini, Hydrating Cleanser Plus, Floral Perfume Plus Serum Gel	online
T00072	C158	45683	Matte Foundation Plus XL Serum Mini, Hair Serum Plus Gel Cream Gel Cream, Hair Serum Plus Serum XL Cream	Store
T00073	c166	45700	Makeup Sponge Gel XL, Hair Serum, SPF50 Sunscreen Mini Plus Plus Mini, SPF50 Sunscreen Mini Mini, Hair Serum Plus Serum Mini Gel Serum	 STORE 
T00074	c054	45713	Hair Serum Plus Gel Gel, Lipstick XL Gel, Face Primer Serum, SPF50 Sunscreen Mini	online
T00075	C208	45925	Hair Serum Plus Gel Cream, Matte Foundation XL,  SPF50 Sunscreen Mini Serum Cream Cream Serum Plus 	Online
T00076	c041	45738	Repair Conditioner Cream Gel, Hair Serum Cream Plus Mini, Hair Serum Plus Serum Mini XL, SPF50 Sunscreen Mini Serum Cream Cream Mini	Online
T00077	c186	45848	Hydrating Cleanser Serum Cream Mini Gel Mini	Online
T00078	C117	45724	SPF50 Sunscreen XL Cream, Hydrating Cleanser Plus, Matte Foundation Serum Cream Plus Serum, Hydrating Cleanser XL Serum Mini	Online
T00079		46016	Daily Moisturizer Gel Mini Gel Mini, Hair Serum Mini XL, Hair Serum	 STORE 
T00080		45962	SPF50 Sunscreen Mini Cream XL	 STORE 
T00081	C009	45868	Hair Serum Serum Gel Mini, Hair Serum Plus Gel Cream Serum Cream Plus Gel, Hydrating Cleanser Serum Cream Mini Gel Mini Cream, Hydrating Cleanser XL Serum Plus, SPF50 Sunscreen Mini Mini Serum	 STORE 
T00082		46020	Floral Perfume Plus Serum Plus, Face Primer Cream Serum Cream	Online
T00083		45866	Hair Serum Plus Gel Mini Cream Cream	 STORE 
T00084		45704	 Lipstick Mini Serum Mini Cream Gel Cream 	Store
T00085	c025	45847	Face Primer Cream Cream Serum Plus, Hair Serum Plus Gel Cream Serum, Lipstick Plus Serum	 STORE 
T00086	C182	45921	Makeup Sponge Gel Plus, Floral Perfume Plus, Makeup Sponge Gel Cream, Repair Shampoo Plus, SPF50 Sunscreen Mini Gel Serum XL Cream	Store
T00087	C111	45669	SPF50 Sunscreen Mini Serum XL, SPF50 Sunscreen Mini Plus Plus Mini, Hydrating Cleanser Serum Cream Mini, Hydrating Cleanser XL Gel	 STORE 
T00088	C220	45933	Hair Serum Serum Gel Gel Gel Serum, SPF50 Sunscreen Mini Plus XL	Store
T00089		45786	SPF50 Sunscreen Mini Plus, SPF50 Sunscreen Mini Plus Plus Mini Gel, Matte Foundation Plus XL Gel	Store
T00090	c078	45885	Daily Moisturizer Gel Mini Plus Gel Cream, Face Primer Plus Plus Plus XL, SPF50 Sunscreen XL Gel Mini Cream Gel	 STORE 
T00091	c211	45930	Hydrating Cleanser XL Mini Gel Gel, Face Primer Cream XL, SPF50 Sunscreen Mini Mini, Face Primer Cream Cream Gel Gel, SPF50 Sunscreen	Online
T00092	c098	45872	Hydrating Cleanser Serum Cream, Matte Foundation Serum Cream, Daily Moisturizer Gel Mini Plus Plus Cream	Online
T00093		45961	Hydrating Cleanser Serum Cream Mini Gel Mini XL, SPF50 Sunscreen Mini Plus Plus Mini Gel	 STORE 
T00094	c184	45813	SPF50 Sunscreen Mini Mini, Makeup Sponge Gel Cream Serum, SPF50 Sunscreen Mini Plus Mini Plus Gel, SPF50 Sunscreen Plus Serum Mini, SPF50 Sunscreen Mini Serum XL XL XL	 STORE 
T00095		45904	Hair Serum Plus Gel, Face Primer Cream Cream, Hydrating Cleanser XL Serum Serum Mini, Hair Serum Mini Cream	 STORE 
T00096	C205	45851	Matte Foundation Serum Cream, Hydrating Cleanser XL Serum Plus XL, SPF50 Sunscreen Mini Mini XL, Face Primer Cream Cream Gel Plus Gel	Online
T00097	C066	45923	Daily Moisturizer Gel Mini Plus Plus, Matte Foundation XL Gel Plus, SPF50 Sunscreen Mini Serum Cream Plus	online
T00098		45950	Face Primer Plus Plus Plus XL Mini, Face Primer Cream Cream XL, Body Lotion Mini, Hair Serum Plus Gel Cream Serum Gel	online
T00099		45914	Lipstick Serum Serum Serum Gel	Store
T00100	C239	45739	Lipstick Serum Serum Serum, Face Primer Cream XL	Online`;

/**
 * Intelligent mapper: converts noisy raw transaction product mentions to canonical Google-adjusted product IDs
 */
export function mapRawItemToProductId(rawItem: string): string | null {
  const item = rawItem.toLowerCase().trim();
  if (!item) return null;

  // 1. Cleanser
  if (item.includes('cleanser') || item.includes('cleanse')) {
    return 'pg-skn-01';
  }
  // 2. Moisturizer
  if (item.includes('moisturiz') || item.includes('moisturiser') || item.includes('dily moisturizr')) {
    return 'pg-skn-02';
  }
  // 3. Sunscreen / SPF
  if (item.includes('sunscreen') || item.includes('sunscrn') || item.includes('spf')) {
    return 'pg-skn-03';
  }
  // 4. Shampoo
  if (item.includes('shampoo')) {
    return 'pg-har-04';
  }
  // 5. Conditioner
  if (item.includes('conditioner')) {
    return 'pg-har-05';
  }
  // 6. Hair Serum / Hair
  if (item.includes('hair serum') || item.includes('hair')) {
    return 'pg-har-06';
  }
  // 7. Matte Foundation
  if (item.includes('foundation')) {
    return 'pg-mak-07';
  }
  // 8. Face Primer
  if (item.includes('primer')) {
    return 'pg-mak-08';
  }
  // 9. Makeup Sponge
  if (item.includes('sponge')) {
    return 'pg-mak-09';
  }
  // 10. Lipstick
  if (item.includes('lipstick')) {
    return 'pg-mak-10';
  }
  // 11. Floral Perfume
  if (item.includes('perfume') || item.includes('parfum') || item.includes('fragrance')) {
    return 'pg-prf-11';
  }
  // 12. Body Lotion
  if (item.includes('body lotion') || item.includes('lotion')) {
    return 'pg-bdy-12';
  }

  return null;
}

/**
 * Parses raw TSV/CSV dataset text into structured transactions and raw inspector rows
 */
export function parseUserDataset(rawText: string): {
  transactions: Transaction[];
  rawRows: RawDatasetRow[];
} {
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return { transactions: [], rawRows: [] };

  const transactions: Transaction[] = [];
  const rawRows: RawDatasetRow[] = [];

  // Determine separator (tab or comma)
  const header = lines[0];
  const isTab = header.includes('\t');
  const sep = isTab ? '\t' : ',';

  // Process rows
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(sep);
    if (cols.length < 4) continue;

    const txId = cols[0]?.trim() || `T${i.toString().padStart(4, '0')}`;
    const custId = cols[1]?.trim() || 'Guest';
    let txDate = cols[2]?.trim() || '2026-01-15';
    // If Excel serial date number like 45885, convert to human date
    if (/^\d{5}$/.test(txDate)) {
      const serial = parseInt(txDate, 10);
      const utcDays = Math.floor(serial - 25569);
      const utcValue = utcDays * 86400;
      const dateInfo = new Date(utcValue * 1000);
      txDate = dateInfo.toISOString().split('T')[0];
    }

    const rawProducts = cols[3]?.trim() || '';
    const txType = cols[4]?.trim() || 'Online';

    // Parse products (comma-separated inside column)
    const productTokens = rawProducts.split(',').map(p => p.trim()).filter(Boolean);
    const matchedSet = new Set<string>();

    for (const token of productTokens) {
      const mappedId = mapRawItemToProductId(token);
      if (mappedId) {
        matchedSet.add(mappedId);
      }
    }

    const matchedProductIds = Array.from(matchedSet);

    rawRows.push({
      transaction_id: txId,
      customer_id: custId,
      transaction_date: txDate,
      products_purchased: rawProducts,
      type: txType,
      matchedProductIds,
    });

    if (matchedProductIds.length > 0) {
      transactions.push({
        id: txId,
        date: txDate,
        itemIds: matchedProductIds,
      });
    }
  }

  return { transactions, rawRows };
}

export const INITIAL_PARSED_DATASET = parseUserDataset(RAW_DATASET_TEXT);
