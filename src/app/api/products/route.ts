// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';

interface Product {
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
  savePercentage?: number;
  sizes?: string[];
  colors?: string[];
  itemsLeft?: number;
  commentsAndRatings?: { comment: string; rating: number }[];
}

// Function to fetch products from Google Sheets
const fetchProductsFromSheet = async (): Promise<Product[]> => {
  try {
    // Set up authentication with service account credentials
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL!,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Google Sheets API configuration
    const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID!;
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
            ? (rowData['images'] as string).split(',').map(item => item.trim()) 
            : [],
          rating: parseFloat(rowData['rating'] as string) || 0,
          category: (rowData['category'] as string) || '',
          videos: (rowData['videos'] as string)
            ? (rowData['videos'] as string).split(',').map(item => item.trim())
            : undefined,
          subcategory: (rowData['subcategory'] as string) || undefined,
          subtitle: (rowData['subtitle'] as string) || undefined,
          savePercentage: parseFloat(rowData['save'] as string) || undefined,
          sizes: (rowData['sizes'] as string)
            ? (rowData['sizes'] as string).split(',').map(size => size.trim())
            : undefined,
          colors: (rowData['colors'] as string)
            ? (rowData['colors'] as string).split(',').map(color => color.trim())
            : undefined,
          itemsLeft: parseInt(rowData['itemsLeft'] as string) || undefined,
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

    return products;
  } catch (error) {
    console.error('Error fetching products from Google Sheet:', error);
    throw new Error('Failed to fetch products from Google Sheet');
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const id = searchParams.get('id');

    const products = await fetchProductsFromSheet();

    if (id) {
      // Return specific product by ID
      const productId = parseInt(id);
      const product = products.find(p => p.id === productId);
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      return NextResponse.json(product);
    } else if (category) {
      // Return products by category
      const filteredProducts = products.filter(p => p.category === category);
      return NextResponse.json(filteredProducts);
    } else {
      // Return all products
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}