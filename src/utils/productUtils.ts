// Helper functions for product slugs
export const generateProductSlug = (name: string, id: number): string => {
  return `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')}-${id}`;
};

export const parseProductIdFromSlug = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/);
  return match ? parseInt(match[1], 10) : null;
};

// Helper function to format category for URL
export const formatCategoryForUrl = (category: string): string => {
  return category.toLowerCase().replace(/\s+/g, '-');
};