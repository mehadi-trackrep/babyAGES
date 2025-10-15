// src/data/products.ts

// Define product types
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[]; // Array of image URLs
  rating: number;
  category: string;
  videos?: string[]; // Optional array of video links
}

// Sample product data organized by category
const products: Product[] = [
  // Electronics
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 129.99,
    description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      // 'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      // 'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.5,
    category: 'Electronics',
    videos: ['https://drive.google.com/file/d/1YUAnz-VuBVrTftNLfb-dSuLVOYEF-Jvx/preview'] // Google Drive video example
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    description: 'Feature-rich smartwatch with health monitoring, GPS, and water resistance',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      // 'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.2,
    category: 'Electronics',
    videos: ['https://drive.google.com/file/d/1YUAnz-VuBVrTftNLfb-dSuLVOYEF-Jvx/preview']
  },
  {
    id: 3,
    name: 'Bluetooth Speaker',
    price: 89.99,
    description: 'Portable Bluetooth speaker with excellent sound quality and 20-hour battery',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.7,
    category: 'Electronics'
  },
  {
    id: 4,
    name: 'Wireless Charger',
    price: 39.99,
    description: 'Fast wireless charging pad compatible with all Qi-enabled devices',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.3,
    category: 'Electronics'
  },
  
  // Fashion
  {
    id: 5,
    name: 'Designer T-Shirt',
    price: 29.99,
    description: 'Premium cotton t-shirt with eco-friendly print',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.0,
    category: 'Fashion'
  },
  {
    id: 6,
    name: 'Running Shoes',
    price: 89.99,
    description: 'Lightweight running shoes with extra cushioning and breathability',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.6,
    category: 'Fashion'
  },
  {
    id: 7,
    name: 'Leather Wallet',
    price: 49.99,
    description: 'Genuine leather wallet with multiple card slots and RFID protection',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.4,
    category: 'Fashion'
  },
  
  // Home & Kitchen
  {
    id: 8,
    name: 'Coffee Maker',
    price: 79.99,
    description: 'Programmable coffee maker with thermal carafe',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.1,
    category: 'Home & Kitchen'
  },
  {
    id: 9,
    name: 'Air Purifier',
    price: 149.99,
    description: 'HEPA air purifier for allergen and odor removal',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.8,
    category: 'Home & Kitchen'
  },
  {
    id: 10,
    name: 'Blender',
    price: 59.99,
    description: 'High-speed blender with multiple speed settings',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.2,
    category: 'Home & Kitchen'
  },
  {
    id: 11,
    name: 'Laptop Backpack',
    price: 59.99,
    description: 'Durable backpack with dedicated laptop compartment and water bottle holder',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.0,
    category: 'Electronics'
  },

  // Books
  {
    id: 12,
    name: 'Bestselling Novel',
    price: 14.99,
    description: 'Award-winning fiction novel',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.9,
    category: 'Books'
  },
  {
    id: 13,
    name: 'Cookbook',
    price: 24.99,
    description: 'Collection of healthy and delicious recipes',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.7,
    category: 'Books'
  },

  // Beauty
  {
    id: 14,
    name: 'Skincare Set',
    price: 69.99,
    description: 'Complete skincare set with cleanser, toner, and moisturizer',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.5,
    category: 'Beauty'
  },
  {
    id: 15,
    name: 'Perfume',
    price: 89.99,
    description: 'Long-lasting fragrance with floral and woody notes',
    images: [
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH',
      'https://drive.google.com/uc?export=view&id=13RWZdE1n6BIZ5LJVIGPNYMbjRzXEnoDH'
    ],
    rating: 4.3,
    category: 'Beauty'
  }
];

// Get all products
export const getAllProducts = (): Product[] => {
  return products;
};

// Get products by category
export const getProductsByCategory = (category: string): Product[] => {
  return products.filter(product => product.category === category);
};

// Get a single product by ID
export const getProductById = (id: number): Product | undefined => {
  return products.find(product => product.id === id);
};

// Get product categories
export const getCategories = (): string[] => {
  const categories = [...new Set(products.map(p => p.category).filter(cat => cat !== undefined))] as string[];
  return categories;
};