import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsFromSheet } from '@/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam) : null;

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    // Fetch all products
    const allProducts = await fetchProductsFromSheet();

    // Filter products based on the search query
    const searchQuery = query.toLowerCase().trim();
    let filteredProducts = allProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery) ||
      product.category.toLowerCase().includes(searchQuery) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery)) ||
      (product.sizes && product.sizes.some(size => size.toLowerCase().includes(searchQuery))) ||
      (product.colors && product.colors.some(color => color.toLowerCase().includes(searchQuery)))
    );

    // Apply limit if specified
    if (limit !== null && limit > 0) {
      filteredProducts = filteredProducts.slice(0, limit);
    }

    return NextResponse.json({
      query: searchQuery,
      results: filteredProducts,
      total: allProducts.filter(product => 
        product.name.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(searchQuery)) ||
        (product.sizes && product.sizes.some(size => size.toLowerCase().includes(searchQuery))) ||
        (product.colors && product.colors.some(color => color.toLowerCase().includes(searchQuery)))
      ).length
    });
  } catch (error) {
    console.error('Error in GET /api/search:', error);
    return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
  }
}