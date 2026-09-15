import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://luminate-j0x.firebaseapp.com', lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: 'https://luminate-j0x.firebaseapp.com/privacy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    { url: 'https://luminate-j0x.firebaseapp.com/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
  ];
}
