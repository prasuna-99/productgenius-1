import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Link as LinkIcon, Sparkles, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  productToEdit,
}) => {
  const { addProduct, editProduct, currentUser } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<Product['category']>('Fragrance & Bath');
  const [price, setPrice] = useState(120);
  const [originalPrice, setOriginalPrice] = useState(140);
  const [stockCount, setStockCount] = useState(15);
  const [sku, setSku] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('/src/assets/images/scented_candle_ivory_1790511939065.jpg');
  const [features, setFeatures] = useState('Artisanal craft\nHypoallergenic\nMade in France');
  const [imageMethod, setImageMethod] = useState<'gallery' | 'presets' | 'url'>('gallery');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const sampleImages = [
    { label: 'Burgundy Silk', path: '/src/assets/images/burgundy_silk_robe_1790511897311.jpg' },
    { label: 'Blush Perfume', path: '/src/assets/images/botanical_perfume_rose_1790511914245.jpg' },
    { label: 'Oxblood Leather', path: '/src/assets/images/leather_tote_burgundy_1790511925707.jpg' },
    { label: 'Ivory Candle', path: '/src/assets/images/scented_candle_ivory_1790511939065.jpg' },
  ];

  useEffect(() => {
    if (productToEdit) {
      setTitle(productToEdit.title);
      setCategory(productToEdit.category);
      setPrice(productToEdit.price);
      setOriginalPrice(productToEdit.originalPrice || productToEdit.price);
      setStockCount(productToEdit.stockCount);
      setSku(productToEdit.sku);
      setDescription(productToEdit.description);
      setImageUrl(productToEdit.imageUrl);
      setUrlInput(productToEdit.imageUrl);
      setFeatures(productToEdit.features.join('\n'));
      setUploadedFileName(productToEdit.imageUrl.startsWith('data:') ? 'Custom Gallery Upload' : null);
    } else {
      setTitle('');
      setCategory('Fragrance & Bath');
      setPrice(120);
      setOriginalPrice(140);
      setStockCount(20);
      setSku(`PG-${Math.floor(100 + Math.random() * 900)}`);
      setDescription('');
      setImageUrl('/src/assets/images/scented_candle_ivory_1790511939065.jpg');
      setUrlInput('');
      setUploadedFileName(null);
      setFeatures('Handcrafted finish\nSignature packaging\nSustainable ingredients');
    }
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  // Process selected image file from device/gallery
  const handleFileProcess = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (PNG, JPG, WebP, etc.).');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageUrl(reader.result);
        setUploadedFileName(file.name);
        setImageMethod('gallery');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const featureList = features
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    if (productToEdit) {
      editProduct(productToEdit.id, {
        title,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        stockCount: Number(stockCount),
        inStock: Number(stockCount) > 0,
        sku,
        description,
        imageUrl,
        features: featureList,
      });
    } else {
      addProduct({
        title,
        category,
        price: Number(price),
        originalPrice: Number(originalPrice),
        rating: 5.0,
        reviewsCount: 1,
        inStock: Number(stockCount) > 0,
        stockCount: Number(stockCount),
        sku,
        sellerId: currentUser.id,
        sellerName: currentUser.storeName || currentUser.name,
        description,
        features: featureList,
        imageUrl,
        tags: ['New Arrival', category],
        isFeatured: false,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E8DDD8] overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#5B1423] text-white p-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl font-semibold">
              {productToEdit ? 'Edit Atelier Product' : 'Add New Inventory Piece'}
            </h2>
            <p className="text-xs text-[#F2CAC2] mt-0.5">
              Upload photos from your gallery, specify craftsmanship details, and configure stock.
            </p>
          </div>
          <button onClick={onClose} className="text-[#FAF7F2]/80 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 text-xs">
          
          {/* Product Picture Gallery & Upload Section */}
          <div className="p-4 bg-white rounded-xl border border-[#E8DDD8] space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-xs text-[#2D1217] uppercase tracking-wider flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-[#5B1423]" />
                Product Picture (Gallery & Media)
              </label>

              {/* Source method pills */}
              <div className="flex bg-[#FAF7F2] p-1 rounded-lg border border-[#E8DDD8] gap-1">
                <button
                  type="button"
                  onClick={() => setImageMethod('gallery')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    imageMethod === 'gallery'
                      ? 'bg-[#5B1423] text-white shadow-xs'
                      : 'text-[#5C4449] hover:text-[#5B1423]'
                  }`}
                >
                  From Gallery
                </button>
                <button
                  type="button"
                  onClick={() => setImageMethod('presets')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    imageMethod === 'presets'
                      ? 'bg-[#5B1423] text-white shadow-xs'
                      : 'text-[#5C4449] hover:text-[#5B1423]'
                  }`}
                >
                  Presets
                </button>
                <button
                  type="button"
                  onClick={() => setImageMethod('url')}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-colors cursor-pointer ${
                    imageMethod === 'url'
                      ? 'bg-[#5B1423] text-white shadow-xs'
                      : 'text-[#5C4449] hover:text-[#5B1423]'
                  }`}
                >
                  Web URL
                </button>
              </div>
            </div>

            {/* Hidden File Input for Device Gallery */}
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {/* 1. Gallery Upload View */}
            {imageMethod === 'gallery' && (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                  isDragging
                    ? 'border-[#5B1423] bg-[#FCECE9]'
                    : 'border-[#D8B7BE] bg-[#FAF7F2] hover:bg-[#FCECE9]/50 hover:border-[#7A1C30]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#FCECE9] text-[#5B1423] flex items-center justify-center">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-semibold text-xs text-[#5B1423]">
                    Click to choose photo from your gallery / device
                  </span>
                  <p className="text-[11px] text-[#7A5B61] mt-0.5">
                    Supports JPG, PNG, WebP, GIF photos from camera roll or storage
                  </p>
                </div>
                {uploadedFileName && (
                  <div className="mt-1 px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-[11px] font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" /> Photo loaded: {uploadedFileName}
                  </div>
                )}
              </div>
            )}

            {/* 2. Preset Selection View */}
            {imageMethod === 'presets' && (
              <div>
                <div className="text-[11px] text-[#7A5B61] mb-2">
                  Select one of our studio-photographed atelier assets:
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {sampleImages.map(img => (
                    <div
                      key={img.path}
                      onClick={() => {
                        setImageUrl(img.path);
                        setUploadedFileName(null);
                      }}
                      className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
                        imageUrl === img.path
                          ? 'border-[#5B1423] bg-[#FCECE9] ring-2 ring-[#5B1423]'
                          : 'border-[#E8DDD8] bg-white hover:border-[#7A1C30]'
                      }`}
                    >
                      <img src={img.path} alt={img.label} className="w-full h-14 object-cover rounded" />
                      <div className="text-[10px] text-center mt-1 truncate font-medium text-[#2D1217]">
                        {img.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. Direct URL View */}
            {imageMethod === 'url' && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={urlInput}
                    onChange={e => {
                      setUrlInput(e.target.value);
                      setImageUrl(e.target.value);
                      setUploadedFileName(null);
                    }}
                    className="flex-1 px-3 py-2 bg-[#FAF7F2] border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
                  />
                </div>
                <div className="text-[10px] text-[#7A5B61]">
                  Paste any publicly accessible direct image link.
                </div>
              </div>
            )}

            {/* Live Preview Box */}
            <div className="flex items-center gap-4 p-3 bg-[#FAF7F2] rounded-lg border border-[#E8DDD8]">
              <img
                src={imageUrl}
                alt="Selected Preview"
                className="w-16 h-16 rounded-lg object-cover border border-[#E8DDD8] bg-white shadow-xs"
                onError={(e) => {
                  (e.target as HTMLElement).style.opacity = '0.5';
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-semibold text-[#2D1217] flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  Active Picture Preview
                </div>
                <div className="text-[10px] text-[#7A5B61] truncate mt-0.5">
                  {uploadedFileName ? `Gallery File: ${uploadedFileName}` : imageUrl}
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-2.5 py-1 text-[11px] bg-white border border-[#E8DDD8] hover:bg-[#FCECE9] text-[#5B1423] rounded font-medium transition-colors cursor-pointer shrink-0"
              >
                Change Photo
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block font-medium text-[#2D1217] mb-1">Product Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Mulberry Silk Peignoir in Deep Crimson"
              className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
            />
          </div>

          {/* Category & SKU */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-[#2D1217] mb-1">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
              >
                <option value="Fragrance & Bath">Fragrance & Bath</option>
                <option value="Apparel & Silk">Apparel & Silk</option>
                <option value="Leather Goods">Leather Goods</option>
                <option value="Home & Ambiance">Home & Ambiance</option>
                <option value="Gourmet & Cellar">Gourmet & Cellar</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-[#2D1217] mb-1">SKU Code</label>
              <input
                type="text"
                required
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="PG-SLK-09"
                className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block font-medium text-[#2D1217] mb-1">Retail Price ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={e => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2D1217] mb-1">Original Price ($)</label>
              <input
                type="number"
                step="0.01"
                value={originalPrice}
                onChange={e => setOriginalPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
              />
            </div>

            <div>
              <label className="block font-medium text-[#2D1217] mb-1">Stock Quantity</label>
              <input
                type="number"
                required
                value={stockCount}
                onChange={e => setStockCount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium text-[#2D1217] mb-1">Product Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detailed description of craftsmanship, materials, and provenance..."
              className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
            />
          </div>

          {/* Artisanal Features */}
          <div>
            <label className="block font-medium text-[#2D1217] mb-1">Artisanal Features (One per line)</label>
            <textarea
              rows={3}
              value={features}
              onChange={e => setFeatures(e.target.value)}
              placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
              className="w-full px-3 py-2 bg-white border border-[#E8DDD8] rounded-lg text-[#2D1217] focus:outline-none focus:ring-1 focus:ring-[#7A1C30]"
            />
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-[#E8DDD8] flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white hover:bg-[#FAF7F2] text-[#5C4449] border border-[#E8DDD8] rounded-lg font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#5B1423] hover:bg-[#7A1C30] text-white font-semibold uppercase tracking-wider rounded-lg shadow-sm cursor-pointer"
            >
              {productToEdit ? 'Save Changes' : 'Publish Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
