export function getSiteMetaData({
  title = 'Md. Mehadi Hasan | Expert Data Engineer & AI Enthusiast',
  description = 'Senior Software Engineer (Data team) at Goava | Data Engineering | Elasticsearch | DevOps (AWS) | SQL | ETL | Scraping | Microservices | AI - Helping people by data storytelling to make high valuable business decisions.',
  type = 'website',
  author = '@mehadihasan',
  images = ['https://mehadihasan-com.vercel.app/images/og/website.png'],
  creator = '@mehadihasan',
  keywords = [
    'Data Engineer',
    'Elasticsearch',
    'Scrapy',
    'SQL',
    'Data modeling',
    'ETL',
    'Data pipeline',
    'Crawl4ai',
    'Playwright',
    'FastAPI',
    'Pytest',
    'AWS',
    'LLM',
    'AI',
    'Machine Learning'
  ],
}: {
  title?: string;
  description?: string;
  type?: 'website' | 'article';
  author?: string;
  images?: string[];
  creator?: string;
  keywords?: string[];
}) {
  return {
    metadataBase: new URL('https://mehadihasan-com.vercel.app'),
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type,
      author,
      creator,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      author,
      creator,
      images,
    },
  };
}
