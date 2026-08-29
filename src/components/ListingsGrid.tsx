import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Heart, 
  Package, 
  BookOpen, 
  Bike, 
  Laptop, 
  Box, 
  Layers, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';
import { Listing, Category, UserProfile, ActiveTab } from '../types';
import { ListingCard } from './ListingCard';

interface ListingsGridProps {
  listings: Listing[];
  currentUser: UserProfile | null;
  favourites: string[];
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  onToggleFavourite: (id: string) => void;
  onMessageSeller: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
}

const CATEGORY_CHIPS: { label: string; value: Category | 'All'; icon: React.ReactNode }[] = [
  { label: 'All', value: 'All', icon: <Layers className="w-3.5 h-3.5" /> },
  { label: 'Books', value: 'Books', icon: <BookOpen className="w-3.5 h-3.5" /> },
  { label: 'Cycles', value: 'Cycles', icon: <Bike className="w-3.5 h-3.5" /> },
  { label: 'Electronics', value: 'Electronics', icon: <Laptop className="w-3.5 h-3.5" /> },
  { label: 'Other', value: 'Other', icon: <Box className="w-3.5 h-3.5" /> },
];

export const ListingsGrid: React.FC<ListingsGridProps> = ({
  listings,
  currentUser,
  favourites,
  activeTab,
  onSelectTab,
  onToggleFavourite,
  onMessageSeller,
  onDeleteListing,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  
  // Live Animated Count-Up Counter from 0 to total listings
  const [displayCount, setDisplayCount] = useState(0);

  const totalLiveListings = listings.length;

  useEffect(() => {
    if (totalLiveListings === 0) {
      setDisplayCount(0);
      return;
    }

    let start = 0;
    const end = totalLiveListings;
    const duration = 900; // ms
    const stepTime = Math.max(20, Math.floor(duration / end));

    const timer = setInterval(() => {
      start += 1;
      setDisplayCount(start);
      if (start >= end) {
        clearInterval(timer);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalLiveListings]);

  // Filter listings based on Tab, Category, and Search query
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Tab filter
      if (activeTab === 'favourites') {
        if (!favourites.includes(item.id)) return false;
      } else if (activeTab === 'my-listings') {
        if (!currentUser || item.sellerId !== currentUser.uid) return false;
      }

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search Query filter (by name & description)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCat) return false;
      }

      return true;
    });
  }, [listings, activeTab, favourites, currentUser, selectedCategory, searchQuery]);

  return (
    <section id="listings-section" className="py-8 sm:py-12 px-4 sm:px-8 relative">
      <div className="max-w-6xl mx-auto">
        
        {/* Filter & Search Header from Professional Polish theme */}
        <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-xs border border-[#C9E2F5] mb-8">
          
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#1B3A5C] opacity-40 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search books, cycles, electronics..."
              className="w-full pl-10 pr-8 py-2 bg-transparent text-sm font-medium outline-none text-[#1B3A5C] placeholder:text-[#1B3A5C]/40"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-bold text-[#1B3A5C]/50 hover:text-[#E63946] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          <div className="hidden md:block h-6 w-[1px] bg-[#C9E2F5]" />

          {/* Filter Pills & Live Count */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setSelectedCategory('All');
                onSelectTab('all');
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                activeTab === 'all' && selectedCategory === 'All'
                  ? 'bg-[#1B3A5C] text-white shadow-xs'
                  : 'bg-white border border-[#C9E2F5] text-[#1B3A5C] hover:border-[#1B3A5C]'
              }`}
            >
              Live ({displayCount})
            </button>

            {CATEGORY_CHIPS.filter(c => c.value !== 'All').map((chip) => {
              const isActive = activeTab === 'all' && selectedCategory === chip.value;
              return (
                <button
                  key={chip.value}
                  onClick={() => {
                    setSelectedCategory(chip.value);
                    if (activeTab !== 'all') onSelectTab('all');
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all ${
                    isActive
                      ? 'bg-[#E63946] text-white border border-[#E63946] shadow-xs'
                      : 'bg-white border border-[#C9E2F5] text-[#1B3A5C] hover:border-[#1B3A5C]'
                  }`}
                >
                  {chip.label}
                </button>
              );
            })}

            {/* Saved Tab Chip */}
            <button
              onClick={() => onSelectTab(activeTab === 'favourites' ? 'all' : 'favourites')}
              className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                activeTab === 'favourites'
                  ? 'bg-[#E63946] text-white border border-[#E63946] shadow-xs'
                  : 'bg-white border border-[#C9E2F5] text-[#1B3A5C] hover:border-[#1B3A5C]'
              }`}
            >
              <Heart className={`w-3 h-3 ${activeTab === 'favourites' ? 'fill-white' : 'fill-[#E63946] text-[#E63946]'}`} />
              <span>Saved ({favourites.length})</span>
            </button>

            {/* My Listings Chip (If Signed in) */}
            {currentUser && (
              <button
                onClick={() => onSelectTab(activeTab === 'my-listings' ? 'all' : 'my-listings')}
                className={`px-3 py-1 rounded-full text-xs font-bold cursor-pointer transition-all flex items-center gap-1 ${
                  activeTab === 'my-listings'
                    ? 'bg-[#1B3A5C] text-white shadow-xs'
                    : 'bg-white border border-[#C9E2F5] text-[#1B3A5C] hover:border-[#1B3A5C]'
                }`}
              >
                <Package className="w-3 h-3" />
                <span>My items ({listings.filter(i => i.sellerId === currentUser.uid).length})</span>
              </button>
            )}
          </div>

        </div>

        {/* Listings Grid */}
        {filteredListings.length > 0 ? (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredListings.map((listing, index) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  index={index}
                  isFavourite={favourites.includes(listing.id)}
                  isOwner={Boolean(currentUser && listing.sellerId === currentUser.uid)}
                  onToggleFavourite={onToggleFavourite}
                  onMessageSeller={onMessageSeller}
                  onDeleteListing={onDeleteListing}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <div className="bg-white border-2 border-dashed border-[#C9E2F5] rounded-[16px] p-8 sm:p-12 text-center max-w-md mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#FAFBFC] border border-[#C9E2F5] flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-[#1B3A5C]/60" />
            </div>
            
            <h3 className="text-lg font-bold text-[#1B3A5C]">
              {activeTab === 'favourites' 
                ? 'No favourite items saved' 
                : activeTab === 'my-listings' 
                ? 'No listings posted yet' 
                : 'No matching listings found'}
            </h3>
            
            <p className="text-xs text-[#1B3A5C]/70 mt-1.5 font-medium">
              {activeTab === 'favourites'
                ? 'Tap the heart icon on any card to bookmark items.'
                : activeTab === 'my-listings'
                ? 'Use the form above to list your books, cycle, or gadgets.'
                : 'Try clearing your search keyword or selecting a different category.'}
            </p>

            {(searchQuery || selectedCategory !== 'All' || activeTab !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  onSelectTab('all');
                }}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1B3A5C] text-white text-xs font-bold shadow-xs hover:bg-[#E63946] transition-all cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset filters</span>
              </button>
            )}
          </div>
        )}

      </div>
    </section>
  );
};
