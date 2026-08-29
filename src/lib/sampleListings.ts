import { Listing } from '../types';

export const INITIAL_SAMPLE_LISTINGS: Listing[] = [
  {
    id: 'sample-1',
    name: 'Introduction to Algorithms (CLRS) - 3rd Edition',
    category: 'Books',
    price: 450,
    condition: 'Good',
    description: 'Essential for CSE/IT Data Structures course. Clean pages with minimal pencil highlights in dynamic programming chapters. Free laminated quick-reference cheat sheet included!',
    imageBase64: 'https://images.unsplash.com/photo-1532012164546-f432f2e37264?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    sellerId: 'vit-sample-seller-1',
    sellerName: 'Aarav Sharma',
    sellerEmail: 'aarav.sharma2024@vitstudent.ac.in',
    sellerPhoto: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    isSample: true,
  },
  {
    id: 'sample-2',
    name: 'Hero Sprint Pro 21-Speed Hybrid Cycle',
    category: 'Cycles',
    price: 3200,
    condition: 'Good',
    description: 'Perfect for fast commutes between MH/LH Hostel blocks and Main Academic Tower. Front suspension, smooth Shimano gears, and brand new waterproof saddle cover.',
    imageBase64: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 1000 * 60 * 60 * 6, // 6 hours ago
    sellerId: 'vit-sample-seller-2',
    sellerName: 'Priya Venkatesh',
    sellerEmail: 'priya.v2023@vitstudent.ac.in',
    sellerPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    isSample: true,
  },
  {
    id: 'sample-3',
    name: 'Casio FX-991CW ClassWiz Scientific Calculator',
    category: 'Electronics',
    price: 650,
    condition: 'Like New',
    description: 'Bought for Calculus and Differential Equations. 540+ functions, high-res display, flawless buttons. Comes with original protective hard slide-case.',
    imageBase64: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=600&auto=format&fit=crop&q=80',
    createdAt: Date.now() - 1000 * 60 * 60 * 12, // 12 hours ago
    sellerId: 'vit-sample-seller-3',
    sellerName: 'Rohan Deshmukh',
    sellerEmail: 'rohan.d2024@vitstudent.ac.in',
    sellerPhoto: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    isSample: true,
  }
];
