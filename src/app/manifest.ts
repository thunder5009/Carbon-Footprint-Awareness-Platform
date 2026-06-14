import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'CarbonTrack',
    short_name: 'CarbonTrack',
    description: 'Calculate and reduce your carbon footprint.',
    start_url: '/',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      // In production, you would add maskable icons and larger PNGs here:
      // { src: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      // { src: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  };
}
