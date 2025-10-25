import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  images: string[]; // Array of image URLs
  rating: number;
  category: string;
  videos?: string[]; // Optional array of video links
  subcategory?: string;
  subtitle?: string;
  discountAmount?: number;
  priceAfterDiscount?: number; // New field for discounted price
  sizes?: string[];
  colors?: string[];
  itemsLeft?: number;
  commentsAndRatings?: { comment: string; rating: number }[];
  isHotProduct?: number;
  tags?: string[];
}

// Cache to store products temporarily (keyed by timestamp to handle updates)
let cachedProducts: Product[] | null = null;
let cacheTimestamp: number | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Function to fetch products from Google Sheets - shared between API route and server components
export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  // Check if we have cached data that's still valid
  if (cachedProducts && cacheTimestamp) {
    const now = Date.now();
    if (now - cacheTimestamp < CACHE_DURATION) {
      // Return cached data if it's still valid
      return cachedProducts;
    }
  }


  try {
    // Set up authentication with service account credentials using JWT constructor (modern approach)

    const auth = new JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });


    const sheets = google.sheets({ version: 'v4', auth });

    // Google Sheets API configuration for products
    const SPREADSHEET_ID = process.env.PRODUCT_SHEET_ID!;
    const RANGE = 'Sheet1!A:Z'; // Assuming data is in the first sheet, columns A to Z

    // Get data from the Google Sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Extract headers from the first row
    const headers = rows[0];
    
    // Process data rows (starting from row 1, excluding header)
    const products: Product[] = [];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row || row.length === 0) continue; // Skip empty rows
      
      // Create an object mapping headers to row values
      const rowData: Record<string, unknown> = {};
      for (let j = 0; j < headers.length; j++) {
        const header = headers[j];
        if (header) {
          rowData[header] = row[j];
        }
      }

      // Only add the product if it has an ID (meaning it's not an empty row)
      if (rowData['id']) {
        const product: Product = {
          id: parseInt(rowData['id'] as string) || 0,
          name: (rowData['name'] as string) || '',
          price: parseFloat(rowData['price'] as string) || 0,
          description: (rowData['description'] as string) || '',
          images: (rowData['images'] as string) 
            ? (rowData['images'] as string).split(',').map(item => {
                const trimmedItem = item.trim();
                // Convert Google Drive file URLs to direct image URLs
                if (trimmedItem.includes('drive.google.com/file/d/')) {
                  const match = trimmedItem.match(/\/file\/d\/([^\/]+)/);
                  if (match && match[1]) {
                    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
                  }
                }
                return trimmedItem;
              }) 
            : [],
          rating: parseFloat(rowData['rating'] as string) || 0,
          category: (rowData['category'] as string) || '',
          videos: (rowData['videos'] as string)
            ? (rowData['videos'] as string).split(',').map(item => item.trim())
            : undefined,
          subcategory: (rowData['subcategory'] as string) || undefined,
          subtitle: (rowData['subtitle'] as string) || undefined,
          discountAmount: parseFloat(rowData['discountAmount'] as string) || undefined,
          priceAfterDiscount: parseFloat(rowData['priceAfterDiscount'] as string) || undefined,
          sizes: (rowData['sizes'] as string)
            ? (rowData['sizes'] as string).split(',').map(size => size.trim())
            : undefined,
          colors: (rowData['colors'] as string)
            ? (rowData['colors'] as string).split(',').map(color => color.trim())
            : undefined,
          itemsLeft: parseInt(rowData['itemsLeft'] as string) || undefined,
          isHotProduct: parseInt(rowData['isHotProduct'] as string) || undefined,
          tags: (rowData['tags'] as string)
            ? (rowData['tags'] as string).split(',').map(tag => tag.trim())
            : undefined,
        };

        // Process comments and ratings from the commentsAndRatings column
        if (rowData['commentsAndRatings']) {
          const commentsAndRatingsStr = rowData['commentsAndRatings'] as string;
          if (commentsAndRatingsStr) {
            // Parse format: "comment1#rating:4.7, comment2#rating:5, ..."
            const commentsAndRatings = commentsAndRatingsStr.split(',').map(item => {
              const [commentPart, ratingPart] = item.trim().split('#rating:');
              return {
                comment: commentPart?.trim() || '',
                rating: parseFloat(ratingPart) || 0,
              };
            }).filter(item => item.comment); // Filter out any empty comments

            if (commentsAndRatings.length > 0) {
              product.commentsAndRatings = commentsAndRatings;
              // Calculate an average rating if not already provided
              if (!product.rating || product.rating === 0) {
                const avgRating = commentsAndRatings.reduce((sum, item) => sum + item.rating, 0) / commentsAndRatings.length;
                product.rating = parseFloat(avgRating.toFixed(2));
              }
            }
          }
        }
        
        products.push(product);
      }
    }

    // Cache the products and timestamp
    cachedProducts = products;
    cacheTimestamp = Date.now();
    
    return products;
  } catch (error) {
    console.error('Error fetching products from Google Sheet:', error);
    // Clear the cache if there's an error to try again on next request
    cachedProducts = null;
    cacheTimestamp = null;
    throw new Error('Failed to fetch products from Google Sheet');
  }
};

// Function to get a single product by ID
export const getProductById = async (id: number): Promise<Product | undefined> => {
  try {
    const allProducts = await fetchProductsFromSheet();
    return allProducts.find(product => product.id === id);
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return undefined;
  }
};

// Function to get products by category
export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const allProducts = await fetchProductsFromSheet();
    return allProducts.filter(product => product.category === category);
  } catch (error) {
    console.error(`Error fetching products for category ${category}:`, error);
    return [];
  }
};

// Function to get products by both category and subcategory
export const getProductsByCategoryAndSubcategory = async (category: string, subcategory: string): Promise<Product[]> => {
  try {
    const allProducts = await fetchProductsFromSheet();
    return allProducts.filter(product => 
      product.category === category && 
      product.subcategory === subcategory
    );
  } catch (error) {
    console.error(`Error fetching products for category ${category} and subcategory ${subcategory}:`, error);
    return [];
  }
};

// Function to get unique subcategories for a specific category
export const getSubcategoriesByCategory = async (category: string): Promise<string[]> => {
  try {
    const allProducts = await fetchProductsFromSheet();
    const subcategories = [...new Set(
      allProducts
        .filter(product => product.category === category && product.subcategory)
        .map(product => product.subcategory as string)
    )] as string[];
    return subcategories;
  } catch (error) {
    console.error(`Error fetching subcategories for category ${category}:`, error);
    return [];
  }
};

// Function to get all unique categories
export const getAllCategories = async (): Promise<string[]> => {
  try {
    const allProducts = await fetchProductsFromSheet();
    const categories = [...new Set(
      allProducts
        .filter(product => product.category)
        .map(product => product.category as string)
    )] as string[];
    return categories;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    return [];
  }
};

// Function to get all categories with their subcategories
export const getAllCategoriesWithSubcategories = async (): Promise<{ name: string; subcategories: string[] }[]> => {
  try {
    const allProducts = await fetchProductsFromSheet();
    const categoriesMap: { [key: string]: Set<string> } = {};

    allProducts.forEach(product => {
      if (product.category) {
        if (!categoriesMap[product.category]) {
          categoriesMap[product.category] = new Set();
        }
        if (product.subcategory) {
          categoriesMap[product.category].add(product.subcategory);
        }
      }
    });

    const categoriesWithSubcategories = Object.keys(categoriesMap).map(category => ({
      name: category,
      subcategories: Array.from(categoriesMap[category]),
    }));

    return categoriesWithSubcategories;
  } catch (error) {
    console.error('Error fetching categories with subcategories:', error);
    return [];
  }
};

// Function to get all unique tags
export const getAllTags = async (): Promise<string[]> => {
  try {
    const allProducts = await fetchProductsFromSheet();
    const tags = [...new Set(
      allProducts
        .filter(product => product.tags)
        .flatMap(product => product.tags!)
    )];
    return tags;
  } catch (error) {
    console.error('Error fetching all tags:', error);
    return [];
  }
};