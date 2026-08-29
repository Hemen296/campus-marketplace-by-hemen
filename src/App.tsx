import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { SellItemForm } from './components/SellItemForm';
import { ListingsGrid } from './components/ListingsGrid';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { MessageSellerModal } from './components/MessageSellerModal';
import { ToastProvider } from './components/Toast';
import { Listing, UserProfile, ActiveTab } from './types';
import { subscribeToListings, subscribeToAuth, signOutUser, deleteListing } from './lib/firebase';

const FAVOURITES_STORAGE_KEY = 'campus_cart_favourites_v1';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [favourites, setFavourites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVOURITES_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authTargetAction, setAuthTargetAction] = useState<string | undefined>(undefined);
  const [activeMessageListing, setActiveMessageListing] = useState<Listing | null>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Subscribe to real-time Firestore / local storage updates
  useEffect(() => {
    const unsubListings = subscribeToListings((updatedListings) => {
      setListings(updatedListings);
    });

    const unsubAuth = subscribeToAuth((currentUser) => {
      setUser(currentUser);
    });

    return () => {
      unsubListings();
      unsubAuth();
    };
  }, []);

  // Save favourites to localStorage
  const handleToggleFavourite = useCallback((id: string) => {
    setFavourites((prev) => {
      const isFav = prev.includes(id);
      const next = isFav ? prev.filter((item) => item !== id) : [...prev, id];
      try {
        localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error('Failed to save favourites to local storage', e);
      }
      return next;
    });
  }, []);

  // Open Auth Modal helper
  const handleOpenAuth = (actionName?: string, afterAuthCallback?: () => void) => {
    setAuthTargetAction(actionName);
    if (afterAuthCallback) {
      setPendingAction(() => afterAuthCallback);
    }
    setIsAuthOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    if (activeTab === 'my-listings') {
      setActiveTab('all');
    }
  };

  // Delete Listing handler
  const handleDeleteListing = async (listingId: string) => {
    if (window.confirm('Are you sure you want to remove this listing from the campus board?')) {
      await deleteListing(listingId);
    }
  };

  // Message Seller click handler
  const handleMessageSeller = (listing: Listing) => {
    if (!user) {
      handleOpenAuth(`message the seller of ${listing.name}`, () => {
        setActiveMessageListing(listing);
      });
      return;
    }
    setActiveMessageListing(listing);
  };

  // Scroll helpers
  const handleScrollToListings = () => {
    const element = document.getElementById('listings-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToSell = () => {
    const element = document.getElementById('sell-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleListingCreated = () => {
    setActiveTab('all');
    setTimeout(() => {
      handleScrollToListings();
    }, 150);
  };

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col font-sans selection:bg-[#FFD93D] selection:text-[#1B3A5C]">
        
        {/* Navbar */}
        <Navbar
          user={user}
          onOpenAuth={handleOpenAuth}
          onSignOut={handleSignOut}
          onSelectTab={setActiveTab}
          activeTab={activeTab}
          favouritesCount={favourites.length}
          onScrollToSell={handleScrollToSell}
          onScrollToListings={handleScrollToListings}
        />

        <main className="flex-1">
          {/* 1. Hero Section */}
          <Hero onBrowseClick={handleScrollToListings} />

          {/* 2. Sell an Item Form */}
          <SellItemForm
            user={user}
            onOpenAuth={handleOpenAuth}
            onListingCreated={handleListingCreated}
          />

          {/* 3. Listings Grid */}
          <ListingsGrid
            listings={listings}
            currentUser={user}
            favourites={favourites}
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            onToggleFavourite={handleToggleFavourite}
            onMessageSeller={handleMessageSeller}
            onDeleteListing={handleDeleteListing}
          />
        </main>

        {/* 4. Footer */}
        <Footer />

        {/* Auth Modal for @vitstudent.ac.in Verification */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => {
            setIsAuthOpen(false);
            setPendingAction(null);
          }}
          onSuccess={handleAuthSuccess}
          targetActionName={authTargetAction}
        />

        {/* Message Seller Modal */}
        <MessageSellerModal
          listing={activeMessageListing}
          currentUser={user}
          onClose={() => setActiveMessageListing(null)}
        />

      </div>
    </ToastProvider>
  );
}
