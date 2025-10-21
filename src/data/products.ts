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
  subcategory?: string; // New field for subcategory
  subtitle?: string; // New field for subtitle
  savePercentage?: number; // New field for save percentage
  sizes?: string[]; // New field for available sizes
  colors?: string[]; // New field for available colors
  itemsLeft?: number; // New field for items left
  commentsAndRatings?: { comment: string; rating: number }[]; // New field for comments and ratings
}

// Get all products - API route approach, works for client components
export const getAllProducts = async (): Promise<Product[]> => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Get products by category - API route approach, works for client components
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  const response = await fetch(`/api/products?category=${encodeURIComponent(category)}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Get a single product by ID - API route approach, works for client components
export const getProductById = async (id: number): Promise<Product | undefined> => {
  const response = await fetch(`/api/products?id=${id}`);
  if (!response.ok) {
    if (response.status === 404) {
      return undefined;
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Get product categories - API route approach, works for client components
export const getCategories = async (): Promise<string[]> => {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  const products: Product[] = await response.json();
  const categories = [...new Set(products.map(p => p.category).filter(cat => cat !== undefined))] as string[];
  return categories;
};