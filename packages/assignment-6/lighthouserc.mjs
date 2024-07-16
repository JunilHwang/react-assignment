export default {
  ci: {
    collect: {
      staticDistDir: "./dist",
      startServerCommand: 'pnpm run preview',
      url: ['http://localhost:4173'],
      numberOfRuns: 1,
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      preset: 'lighthouse:no-pwa',
      assertions: {
        'categories:performance': ['error', {minScore: 0.8}],
        'categories:accessibility': ['error', {minScore: 0.8}],
        'categories:best-practices': ['error', {minScore: 0.9}],
        'categories:seo': ['error', {minScore: 0.8}],
      },
    },
  },
};
