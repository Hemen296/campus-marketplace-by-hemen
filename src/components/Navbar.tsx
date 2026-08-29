import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, LogOut, Package, Heart, PlusCircle, Pencil, ChevronDown, Sparkles } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  user: UserProfile | null;
  onOpenAuth: (actionName?: string) => void;
  onSignOut: () => void;
  onSelectTab: (tab: 'all' | 'favourites' | 'my-listings') => void;
  activeTab: 'all' | 'favourites' | 'my-listings';
  favouritesCount: number;
  onScrollToSell: () => void;
  onScrollToListings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onOpenAuth,
  onSignOut,
  onSelectTab,
  activeTab,
  favouritesCount,
  onScrollToSell,
  onScrollToListings,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-[#FAFBFC] border-b border-[#C9E2F5] px-4 sm:px-8 h-16 flex items-center justify-between shadow-xs">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left: Professional Polish Logo */}
        <button 
          onClick={onScrollToListings}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-hidden"
          aria-label="Campus Cart Home"
        >
          <div className="w-10 h-10 bg-[#E63946] rounded-full flex items-center justify-center text-white font-bold text-xl transform -rotate-12 shadow-sm group-hover:rotate-0 transition-transform">
            C
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xl tracking-tight text-[#1B3A5C]">
              CampusCart<span className="text-[#E63946]">.</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md bg-[#C9E2F5]/60 text-[10px] font-bold text-[#1B3A5C] tracking-wide uppercase">
              VIT
            </span>
          </div>
        </button>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 sm:gap-5">
          
          {/* Sell Button Quick Action */}
          <button
            onClick={onScrollToSell}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#C9E2F5] bg-white hover:bg-[#E63946] hover:text-white hover:border-[#E63946] text-xs sm:text-sm font-bold text-[#1B3A5C] shadow-xs active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4 text-[#E63946] group-hover:text-white" />
            <span>Sell an item</span>
          </button>

          {/* Favourites Quick Pill */}
          <button
            onClick={() => {
              onSelectTab(activeTab === 'favourites' ? 'all' : 'favourites');
              onScrollToListings();
            }}
            className={`relative p-2 rounded-full border border-[#C9E2F5] bg-white text-[#1B3A5C] shadow-xs transition-all hover:border-[#1B3A5C] active:scale-95 ${
              activeTab === 'favourites' ? 'border-[#E63946] bg-[#FAFBFC]' : ''
            }`}
            title="View Favourites"
            aria-label="Saved items"
          >
            <Heart className={`w-5 h-5 ${activeTab === 'favourites' ? 'fill-[#E63946] text-[#E63946]' : 'text-[#1B3A5C]'}`} />
            {favouritesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E63946] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {favouritesCount}
              </span>
            )}
          </button>

          {/* User Auth Section */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-white border border-[#C9E2F5] rounded-full py-1.5 px-3 sm:px-4 shadow-sm hover:border-[#1B3A5C] transition-all cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName}
                    className="w-6 h-6 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.firstName || 'Student')}`} 
                    className="w-6 h-6 rounded-full" 
                    alt="avatar" 
                  />
                )}
                <span className="text-xs sm:text-sm font-medium text-[#1B3A5C] max-w-[80px] sm:max-w-[120px] truncate">
                  {user.firstName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#1B3A5C]/60" />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#C9E2F5] rounded-2xl shadow-lg py-2 z-50 overflow-hidden">
                  <div className="px-3.5 py-2 border-b border-[#C9E2F5] bg-[#FAFBFC]">
                    <p className="text-[11px] font-bold text-[#1B3A5C]/60 uppercase tracking-wider">Signed in as</p>
                    <p className="text-xs font-bold text-[#1B3A5C] truncate">{user.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      onSelectTab('my-listings');
                      setDropdownOpen(false);
                      onScrollToListings();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#1B3A5C] hover:bg-[#FAFBFC] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Package className="w-4 h-4 text-[#E63946]" />
                    <span>My Listings</span>
                  </button>

                  <button
                    onClick={() => {
                      onSelectTab('favourites');
                      setDropdownOpen(false);
                      onScrollToListings();
                    }}
                    className="w-full text-left px-3.5 py-2.5 text-xs sm:text-sm font-bold text-[#1B3A5C] hover:bg-[#FAFBFC] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-[#E63946]" />
                    <span>My Favourites</span>
                  </button>

                  <div className="my-1 border-t border-[#C9E2F5]" />

                  <button
                    onClick={() => {
                      onSignOut();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs sm:text-sm font-bold text-[#E63946] hover:bg-[#E63946]/10 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => onOpenAuth('sign in')}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#E63946] text-white font-bold text-xs sm:text-sm shadow-sm hover:shadow-md hover:bg-[#d62839] active:scale-95 transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sign in</span>
            </button>
          )}

        </div>
      </div>
    </header>
  );
};
