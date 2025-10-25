// src/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { fetchProductsFromSheet, getProductById, getProductsByCategory, getProductsByCategoryAndSubcategory, getSubcategoriesByCategory, getAllCategories } from '@/data/products';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const subcategory = searchParams.get('subcategory');
    const id = searchParams.get('id');
    const action = searchParams.get('action'); // New parameter for different actions

    if (id) {
      // Return specific product by ID
      const productId = parseInt(id);
      const product = await getProductById(productId);
      
      if (!product) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
      }
      
      return NextResponse.json(product);
    } else if (action === 'subcategories' && category) {
      // Return subcategories for a specific category
      const subcategories = await getSubcategoriesByCategory(category);
      return NextResponse.json(subcategories);
    } else if (action === 'categories') {
      // Return all categories
      const categories = await getAllCategories();
      return NextResponse.json(categories);
    } else if (category && subcategory) {
      // Return products by both category and subcategory
      const filteredProducts = await getProductsByCategoryAndSubcategory(category, subcategory);
      return NextResponse.json(filteredProducts);
    } else if (category) {
      // Return products by category
      const filteredProducts = await getProductsByCategory(category);
      return NextResponse.json(filteredProducts);
    } else {
      // Return all products
      const products = await fetchProductsFromSheet();
      return NextResponse.json(products);
    }
  } catch (error) {
    console.error('Error in GET /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}