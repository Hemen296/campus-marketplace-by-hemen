export type Category = 'Books' | 'Cycles' | 'Electronics' | 'Other';

export type Condition = 'Like New' | 'Good' | 'Fair';

export interface Listing {
  id: string;
  name: string;
  category: Category;
  price: number;
  condition: Condition;
  description: string;
  imageBase64?: string;
  createdAt: number;
  sellerId: string;
  sellerName: string;
  sellerEmail?: string;
  sellerPhoto?: string;
  isSample?: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  firstName: string;
  isVITStudent: boolean;
}

export type ActiveTab = 'all' | 'favourites' | 'my-listings';
