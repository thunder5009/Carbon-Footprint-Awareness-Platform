module.exports = {
  ci: {
    collect: {
      staticDistDir: './.next/server/app', // or run a server
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000/', 'http://localhost:3000/calculator'],
      numberOfRuns: 3,
    },
    assert: {
      preset: 'lighthouse:recommended',
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 1.0 }], // Zero axe violations
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 1.0 }],
        
        // Core Web Vitals specifically
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }], // LCP < 2.5s
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],   // CLS < 0.1
        'max-potential-fid': ['error', { maxNumericValue: 100 }],         // FID proxy < 100ms
        
        // Prevent huge bundles
        'total-byte-weight': ['warn', { maxNumericValue: 500000 }], // 500KB warn
        
        // Relax strict PWA offline rules for this Next.js app
        'service-worker': 'off',
        'installable-manifest': 'off',
        'splash-screen': 'off',
        'themed-omnibox': 'off',
        'maskable-icon': 'off',
        'apple-touch-icon': 'off'
      },
    },
    upload: {
      target: 'temporary-public-storage', // Free temporary LHCI hosting for PR comments
    },
  },
};
