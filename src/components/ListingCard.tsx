import React from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Send, 
  Trash2, 
  MessageSquare, 
  BookOpen, 
  Bike, 
  Laptop, 
  Box, 
  Sparkles,
  Share2
} from 'lucide-react';
import { Listing, Category } from '../types';
import { useToast } from './Toast';

interface ListingCardProps {
  listing: Listing;
  index: number;
  isFavourite: boolean;
  isOwner: boolean;
  onToggleFavourite: (id: string) => void;
  onMessageSeller: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
}

// Category fallback doodle icons & colors
const CategoryPlaceholder: React.FC<{ category: Category }> = ({ category }) => {
  switch (category) {
    case 'Books':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#C9E2F5]/30 text-[#1B3A5C]">
          <BookOpen className="w-12 h-12 text-[#1B3A5C]/70 stroke-[1.5]" />
          <span className="text-xs font-black font-handwriting mt-1 text-[#1B3A5C]/70">Textbook / Notes</span>
        </div>
      );
    case 'Cycles':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#C9E2F5]/30 text-[#1B3A5C]">
          <Bike className="w-12 h-12 text-[#1B3A5C]/70 stroke-[1.5]" />
          <span className="text-xs font-black font-handwriting mt-1 text-[#1B3A5C]/70">Hostel Cycle</span>
        </div>
      );
    case 'Electronics':
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#C9E2F5]/30 text-[#1B3A5C]">
          <Laptop className="w-12 h-12 text-[#1B3A5C]/70 stroke-[1.5]" />
          <span className="text-xs font-black font-handwriting mt-1 text-[#1B3A5C]/70">Campus Gadget</span>
        </div>
      );
    default:
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-[#C9E2F5]/30 text-[#1B3A5C]">
          <Box className="w-12 h-12 text-[#1B3A5C]/70 stroke-[1.5]" />
          <span className="text-xs font-black font-handwriting mt-1 text-[#1B3A5C]/70">Hostel Item</span>
        </div>
      );
  }
};

// Subtle deterministic tilt based on index for natural corkboard feel
const ROTATION_PATTERNS = [-0.8, 0.9, -0.5, 0.7, -1.1, 0.6];

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  index,
  isFavourite,
  isOwner,
  onToggleFavourite,
  onMessageSeller,
  onDeleteListing,
}) => {
  const { showToast } = useToast();
  const sellerFirstName = listing.sellerName ? listing.sellerName.split(' ')[0] : 'Student';

  // Condition Badge Color Helper
  const getConditionStyle = (cond: string) => {
    switch (cond) {
      case 'Like New':
        return 'bg-[#E63946] text-white';
      case 'Good':
        return 'bg-[#FFD93D] text-[#1B3A5C]';
      case 'Fair':
        return 'bg-white text-[#1B3A5C] border border-[#C9E2F5]';
      default:
        return 'bg-white text-[#1B3A5C]';
    }
  };

  // Share action with Web Share API and Clipboard fallback
  const handleShare = async () => {
    const shareUrl = window.location.origin + window.location.pathname + '#listing-' + listing.id;
    const shareText = `${listing.name} — ₹${listing.price}, ${listing.condition}. Check it out on Campus Cart: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${listing.name} on Campus Cart`,
          text: shareText,
          url: shareUrl,
        });
        showToast('Shared successfully!', undefined, 'success');
        return;
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fall back to clipboard
        }
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      showToast('Copied to clipboard!', 'Share message ready to paste into WhatsApp / Discord', 'success');
    } catch {
      showToast('Sharing link ready', shareUrl, 'info');
    }
  };

  return (
    <motion.div
      layout
      id={`listing-${listing.id}`}
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white rounded-[16px] overflow-hidden border border-[#C9E2F5] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group relative"
    >
      {/* Card Content Top */}
      <div>
        {/* Photo Container */}
        <div className="relative w-full h-44 bg-[#FAFBFC] border-b border-[#C9E2F5] overflow-hidden">
          
          {/* Category Tag on Top Left corner */}
          <div className="absolute top-3 left-3 z-20">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/95 border border-[#C9E2F5] text-[10px] font-bold text-[#1B3A5C] shadow-xs uppercase tracking-wider">
              {listing.category}
            </span>
          </div>

          {/* Action buttons Top Right */}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            {isOwner && (
              <button
                onClick={() => onDeleteListing(listing.id)}
                className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs text-[#E63946] border border-[#C9E2F5] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Delete listing"
                aria-label="Delete listing"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={() => onToggleFavourite(listing.id)}
              className="w-7 h-7 rounded-full bg-white/90 backdrop-blur-xs border border-[#C9E2F5] flex items-center justify-center shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer group/fav"
              aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
              title={isFavourite ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart
                className={`w-3.5 h-3.5 transition-colors ${
                  isFavourite
                    ? 'fill-[#E63946] text-[#E63946]'
                    : 'text-[#1B3A5C] group-hover/fav:text-[#E63946]'
                }`}
              />
            </button>
          </div>

          {/* Listing Image or Category Doodle */}
          {listing.imageBase64 ? (
            <img
              src={listing.imageBase64}
              alt={listing.name}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          ) : (
            <CategoryPlaceholder category={listing.category} />
          )}

          {/* Condition Badge in Bottom Right of Image */}
          <div className="absolute bottom-2.5 right-2.5 z-10">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${getConditionStyle(listing.condition)}`}>
              {listing.condition}
            </span>
          </div>
        </div>

        {/* Card Body Details */}
        <div className="p-4">
          
          {/* Price & Name */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <div className="text-xl font-black text-[#1B3A5C] tracking-tight">
              ₹{listing.price.toLocaleString('en-IN')}
            </div>
            
            {/* Seller profile pill */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#FAFBFC] border border-[#C9E2F5] text-[11px] font-semibold text-[#1B3A5C]/75">
              {listing.sellerPhoto ? (
                <img
                  src={listing.sellerPhoto}
                  alt={listing.sellerName}
                  className="w-3.5 h-3.5 rounded-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full bg-[#E63946] text-white text-[8px] font-bold flex items-center justify-center">
                  {sellerFirstName.charAt(0)}
                </div>
              )}
              <span className="truncate max-w-[80px]">{sellerFirstName}</span>
            </div>
          </div>

          {/* Listing Name */}
          <h3 className="font-bold text-sm text-[#1B3A5C] leading-snug line-clamp-1 group-hover:text-[#E63946] transition-colors">
            {listing.name}
          </h3>

          {/* Description */}
          <p className="text-xs text-[#1B3A5C]/70 mt-1 font-medium line-clamp-2 leading-relaxed">
            {listing.description}
          </p>
        </div>
      </div>

      {/* Card Action Buttons Bottom */}
      <div className="p-4 pt-0">
        <div className="pt-2 border-t border-[#C9E2F5]/60 flex items-center gap-2">
          
          {/* Message Seller Primary Action */}
          <button
            onClick={() => onMessageSeller(listing)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-full bg-[#FAFBFC] border border-[#C9E2F5] hover:bg-[#E63946] hover:text-white hover:border-[#E63946] text-[#1B3A5C] font-bold text-xs shadow-xs active:scale-95 transition-all cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#E63946] group-hover:text-white" />
            <span>Message seller</span>
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 rounded-full bg-[#FAFBFC] hover:bg-white border border-[#C9E2F5] text-[#1B3A5C] shadow-xs active:scale-95 transition-all cursor-pointer"
            title="Share listing"
            aria-label="Share listing"
          >
            <Share2 className="w-3.5 h-3.5 text-[#1B3A5C]/70" />
          </button>

        </div>
      </div>
    </motion.div>
  );
};
