import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/calculator'],
      disallow: ['/api/', '/dashboard', '/settings'], // Keep private routes out of index
    },
    sitemap: 'https://carbontrack.app/sitemap.xml',
  };
}
