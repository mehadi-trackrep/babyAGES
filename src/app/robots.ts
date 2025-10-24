import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://babyages.vercel.app';
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/cart/', '/checkout/'], // Disallow sensitive or non-SEO pages
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}