import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/demo', '/pilot', '/contact', '/privacy', '/terms'],
      disallow: ['/admin/', '/api/', '/auth/', '/instructor/'],
    },
    sitemap: 'https://ascynpro.com/sitemap.xml',
    host: 'https://ascynpro.com',
  }
}
