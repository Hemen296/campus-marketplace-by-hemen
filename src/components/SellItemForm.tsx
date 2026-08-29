import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { 
  Scissors, 
  Upload, 
  Send, 
  Sparkles, 
  Image as ImageIcon, 
  X, 
  Check, 
  IndianRupee, 
  HelpCircle,
  BookOpen,
  Bike,
  Laptop,
  Box
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Category, Condition, UserProfile } from '../types';
import { createListing, compressAndConvertToBase64 } from '../lib/firebase';
import { useToast } from './Toast';

interface SellItemFormProps {
  user: UserProfile | null;
  onOpenAuth: (actionName: string) => void;
  onListingCreated: () => void;
}

const CATEGORIES: { label: Category; icon: React.ReactNode }[] = [
  { label: 'Books', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { label: 'Cycles', icon: <Bike className="w-3.5 h-3.5" /> },
  { label: 'Electronics', icon: <Laptop className="w-3.5 h-3.5" /> },
  { label: 'Other', icon: <Box className="w-3.5 h-3.5" /> },
];

const CONDITIONS: Condition[] = ['Like New', 'Good', 'Fair'];

export const SellItemForm: React.FC<SellItemFormProps> = ({
  user,
  onOpenAuth,
  onListingCreated,
}) => {
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [category, setCategory] = useState<Category>('Books');
  const [price, setPrice] = useState('');
  const [condition, setCondition] = useState<Condition>('Good');
  const [description, setDescription] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  // Handle Photo selection
  const handleFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (JPG, PNG, WebP)', undefined, 'error');
      return;
    }

    setIsProcessingImage(true);
    try {
      const base64 = await compressAndConvertToBase64(file);
      setImagePreview(base64);
      showToast('Photo attached & compressed!', 'Ready to publish on campus', 'success');
    } catch (err) {
      console.error(err);
      showToast('Could not process photo', 'Please try a different image', 'error');
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      onOpenAuth('post an item for sale');
      return;
    }

    const numPrice = Number(price);
    if (!name.trim()) {
      showToast('Item name required', 'Please provide a clear title', 'error');
      return;
    }
    if (!numPrice || numPrice <= 0) {
      showToast('Invalid price', 'Please enter a valid price in Rupees (₹)', 'error');
      return;
    }
    if (!description.trim()) {
      showToast('Description required', 'Add a brief note about item condition or pickup spot', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      await createListing({
        name: name.trim(),
        category,
        price: Math.round(numPrice),
        condition,
        description: description.trim(),
        imageBase64: imagePreview || undefined,
        createdAt: Date.now(),
        sellerId: user.uid,
        sellerName: user.displayName,
        sellerEmail: user.email,
        sellerPhoto: user.photoURL,
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 45,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#E63946', '#FFD93D', '#1B3A5C', '#C9E2F5'],
        });
      } catch {}

      showToast('Listing published!', 'Your item is now live on the campus board 🚀', 'success');

      // Reset form
      setName('');
      setPrice('');
      setDescription('');
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';

      // Trigger listings update & smooth scroll
      onListingCreated();
    } catch (err) {
      console.error(err);
      showToast('Failed to publish listing', 'Please check your connection and try again', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="sell-section" className="py-8 sm:py-12 px-4 sm:px-8 relative">
      <div className="max-w-3xl mx-auto">
        
        {/* Paper-White Card with Dashed Cut-out Border */}
        <div className="bg-white rounded-[16px] border-2 border-dashed border-[#C9E2F5] p-6 sm:p-8 shadow-xs">
          
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#1B3A5C]">
            <svg className="w-5 h-5 text-[#E63946]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Sell an item
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field 1: Item Name */}
            <div>
              <label htmlFor="item-name-input" className="block text-[11px] uppercase font-bold tracking-wider mb-1 opacity-60 text-[#1B3A5C]">
                Item Name <span className="text-[#E63946]">*</span>
              </label>
              <input
                id="item-name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Scientific Calculator FX-991EX / DSA Textbook"
                required
                className="w-full border-b-2 border-[#C9E2F5] focus:border-[#E63946] outline-none py-1.5 bg-transparent text-sm font-semibold text-[#1B3A5C] placeholder:text-[#1B3A5C]/35 transition-colors"
              />
            </div>

            {/* Field 2: Category Chips */}
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider mb-2 opacity-60 text-[#1B3A5C]">
                Category <span className="text-[#E63946]">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.label;
                  return (
                    <button
                      type="button"
                      key={cat.label}
                      onClick={() => setCategory(cat.label)}
                      className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#E63946] text-white border border-[#E63946] shadow-xs'
                          : 'border border-[#1B3A5C] text-[#1B3A5C] hover:bg-[#E63946] hover:text-white hover:border-[#E63946]'
                      }`}
                    >
                      {cat.icon}
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Field 3 & 4: Price & Condition Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="item-price-input" className="block text-[11px] uppercase font-bold tracking-wider mb-1 opacity-60 text-[#1B3A5C]">
                  Price (₹) <span className="text-[#E63946]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="item-price-input"
                    type="number"
                    min="1"
                    max="100000"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0.00"
                    required
                    className="w-full border-b-2 border-[#C9E2F5] focus:border-[#E63946] outline-none py-1.5 bg-transparent text-sm font-bold text-[#1B3A5C] placeholder:text-[#1B3A5C]/35 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="item-condition-select" className="block text-[11px] uppercase font-bold tracking-wider mb-1 opacity-60 text-[#1B3A5C]">
                  Condition <span className="text-[#E63946]">*</span>
                </label>
                <select
                  id="item-condition-select"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value as Condition)}
                  className="w-full border-b-2 border-[#C9E2F5] focus:border-[#E63946] outline-none py-1.5 bg-transparent text-sm font-semibold text-[#1B3A5C] cursor-pointer"
                >
                  {CONDITIONS.map((c) => (
                    <option key={c} value={c} className="bg-white text-[#1B3A5C]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Field 5: Description */}
            <div>
              <label htmlFor="item-desc-input" className="block text-[11px] uppercase font-bold tracking-wider mb-1 opacity-60 text-[#1B3A5C]">
                Description <span className="text-[#E63946]">*</span>
              </label>
              <textarea
                id="item-desc-input"
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the item (edition, pickup spot, condition)..."
                required
                className="w-full border border-[#C9E2F5] rounded-lg p-2.5 text-sm bg-[#FAFBFC] focus:outline-none focus:border-[#E63946] text-[#1B3A5C] placeholder:text-[#1B3A5C]/35 transition-colors resize-none"
              />
            </div>

            {/* Field 6: Photo Upload */}
            <div>
              <label className="block text-[11px] uppercase font-bold tracking-wider mb-1.5 opacity-60 text-[#1B3A5C]">
                Item Photo (Optional)
              </label>
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={(e) => e.target.files && e.target.files[0] && handleFileChange(e.target.files[0])}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative rounded-xl border border-[#C9E2F5] bg-[#FAFBFC] p-3 flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 rounded-lg object-cover border border-[#C9E2F5]"
                  />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#1B3A5C]">Photo attached</p>
                    <p className="text-[11px] text-[#1B3A5C]/60">Compressed & ready to publish</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                    className="p-1.5 rounded-full bg-[#E63946] text-white hover:scale-105 transition-transform cursor-pointer"
                    title="Remove photo"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                  onDragLeave={() => setIsDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-3.5 text-center cursor-pointer transition-all ${
                    isDragOver 
                      ? 'border-[#E63946] bg-[#FAFBFC]' 
                      : 'border-[#C9E2F5] bg-[#FAFBFC] hover:border-[#E63946]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2 text-xs font-semibold text-[#1B3A5C]/75">
                    {isProcessingImage ? (
                      <span className="text-[#E63946] animate-pulse">Processing image...</span>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-[#1B3A5C]/60" />
                        <span>Click to attach photo or drag & drop</span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="submit-sell-form"
                disabled={isSubmitting || isProcessingImage}
                className="w-full bg-[#E63946] text-white py-3 rounded-full font-bold shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60 text-sm"
              >
                <span>List it now</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </div>

          </form>

        </div>

      </div>
    </section>
  );
};
