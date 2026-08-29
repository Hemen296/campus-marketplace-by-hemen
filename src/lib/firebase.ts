import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  deleteDoc, 
  doc, 
  Firestore 
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged, 
  Auth, 
  User as FirebaseUser 
} from 'firebase/auth';
import { Listing, UserProfile } from '../types';
import { INITIAL_SAMPLE_LISTINGS } from './sampleListings';

// Firebase configuration from environment variables or custom config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

const hasValidConfig = Boolean(
  firebaseConfig.apiKey && 
  firebaseConfig.projectId && 
  firebaseConfig.apiKey !== 'MY_FIREBASE_API_KEY'
);

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

if (hasValidConfig) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('Firebase initialization error, using client persistence fallback:', error);
  }
}

// Local Storage Fallback & Synchronization Channel for Multi-Tab Real-Time Sync
const STORAGE_KEY = 'campus_cart_listings_v1';
const AUTH_KEY = 'campus_cart_auth_user_v1';
const bc = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('campus_cart_sync') 
  : null;

function getStoredLocalListings(): Listing[] {
  if (typeof window === 'undefined') return INITIAL_SAMPLE_LISTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SAMPLE_LISTINGS));
      return INITIAL_SAMPLE_LISTINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SAMPLE_LISTINGS;
  } catch {
    return INITIAL_SAMPLE_LISTINGS;
  }
}

function saveLocalListings(listings: Listing[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(listings));
    if (bc) {
      bc.postMessage({ type: 'LISTINGS_UPDATED', listings });
    }
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
}

// Real-time Listings Subscriber
export function subscribeToListings(callback: (listings: Listing[]) => void): () => void {
  if (db) {
    try {
      const q = query(collection(db, 'listings'), orderBy('createdAt', 'desc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is empty, seed with initial sample listings
          callback(getStoredLocalListings());
        } else {
          const items: Listing[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Listing, 'id'>),
          }));
          callback(items);
        }
      }, (error) => {
        console.warn('Firestore subscription fallback to local state:', error);
        callback(getStoredLocalListings());
      });
      return unsubscribe;
    } catch (err) {
      console.warn('Using local fallback subscriber:', err);
    }
  }

  // Local state subscription with multi-tab broadcast support
  callback(getStoredLocalListings());

  const handleMessage = (event: MessageEvent) => {
    if (event.data?.type === 'LISTINGS_UPDATED' && Array.isArray(event.data.listings)) {
      callback(event.data.listings);
    }
  };

  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getStoredLocalListings());
    }
  };

  if (bc) {
    bc.addEventListener('message', handleMessage);
  }
  window.addEventListener('storage', handleStorage);

  return () => {
    if (bc) {
      bc.removeEventListener('message', handleMessage);
    }
    window.removeEventListener('storage', handleStorage);
  };
}

// Create New Listing
export async function createListing(listingData: Omit<Listing, 'id'>): Promise<string> {
  if (db) {
    try {
      const docRef = await addDoc(collection(db, 'listings'), listingData);
      return docRef.id;
    } catch (e) {
      console.warn('Firestore addDoc failed, writing to local persistence:', e);
    }
  }

  const current = getStoredLocalListings();
  const newId = 'listing-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  const newListing: Listing = {
    id: newId,
    ...listingData,
  };
  const updated = [newListing, ...current];
  saveLocalListings(updated);
  return newId;
}

// Delete Listing
export async function deleteListing(listingId: string): Promise<void> {
  if (db) {
    try {
      await deleteDoc(doc(db, 'listings', listingId));
      return;
    } catch (e) {
      console.warn('Firestore deleteDoc fallback to local:', e);
    }
  }

  const current = getStoredLocalListings();
  const updated = current.filter(item => item.id !== listingId);
  saveLocalListings(updated);
}

// Authentication Listeners
export function subscribeToAuth(callback: (user: UserProfile | null) => void): () => void {
  // Check local demo / active session
  const getLocalUser = (): UserProfile | null => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  };

  if (auth) {
    const unsub = onAuthStateChanged(auth, (fbUser: FirebaseUser | null) => {
      if (fbUser && fbUser.email) {
        if (!fbUser.email.endsWith('@vitstudent.ac.in')) {
          signOut(auth!);
          localStorage.removeItem(AUTH_KEY);
          callback(null);
          return;
        }
        const profile: UserProfile = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName || 'Student',
          firstName: (fbUser.displayName || 'Student').split(' ')[0],
          photoURL: fbUser.photoURL || undefined,
          isVITStudent: true,
        };
        localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
        callback(profile);
      } else {
        const local = getLocalUser();
        callback(local);
      }
    });
    return unsub;
  }

  callback(getLocalUser());
  const handleAuthStorage = (e: StorageEvent) => {
    if (e.key === AUTH_KEY) {
      callback(getLocalUser());
    }
  };
  window.addEventListener('storage', handleAuthStorage);
  return () => window.removeEventListener('storage', handleAuthStorage);
}

// Sign in with Google (OAuth)
export async function signInWithGoogle(): Promise<UserProfile> {
  if (!auth) {
    throw new Error('FIREBASE_AUTH_NOT_INITIALIZED');
  }

  const provider = new GoogleAuthProvider();
  // Prompt user to select account
  provider.setCustomParameters({ prompt: 'select_account' });

  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const email = user.email || '';

  if (!email.endsWith('@vitstudent.ac.in')) {
    await signOut(auth);
    localStorage.removeItem(AUTH_KEY);
    throw new Error('INVALID_DOMAIN');
  }

  const profile: UserProfile = {
    uid: user.uid,
    email: email,
    displayName: user.displayName || 'Student',
    firstName: (user.displayName || 'Student').split(' ')[0],
    photoURL: user.photoURL || undefined,
    isVITStudent: true,
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
  return profile;
}

// Sign in with instant VIT Student Demo Account for rapid testing / preview
export function signInDemoStudent(name = 'Arjun Verma', regno = '22BCE1492'): UserProfile {
  const email = `${name.toLowerCase().replace(' ', '.')}.${regno.toLowerCase()}@vitstudent.ac.in`;
  const profile: UserProfile = {
    uid: 'vit-user-' + regno.toLowerCase(),
    email: email,
    displayName: name,
    firstName: name.split(' ')[0],
    photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    isVITStudent: true,
  };
  localStorage.setItem(AUTH_KEY, JSON.stringify(profile));
  window.dispatchEvent(new Event('storage'));
  return profile;
}

// Sign Out
export async function signOutUser(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase sign out error:', e);
    }
  }
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event('storage'));
}

// Client-side image compression & base64 conversion (<50KB safe for Firestore documents)
export async function compressAndConvertToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 480;
        const MAX_HEIGHT = 480;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG at 0.7 quality
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}
