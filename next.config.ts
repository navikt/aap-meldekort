import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

const ssr = require('@navikt/nav-dekoratoren-moduler/ssr');

const appDirectives = {
  'connect-src': [
    "'self'",
    'https://telemetry.ekstern.dev.nav.no',
    'https://telemetry.nav.no',
    'https://api.uxsignals.com',
  ],
  'font-src': ['https://fonts.gstatic.com'],
  'object-src': ['blob:'],
  'script-src-elem': ["'self'", 'https://widget.uxsignals.com/embed.js'],
  'style-src-elem': ["'self'"],
  'frame-src': ["'self'", 'blob:'],
  'img-src': ["'self'", 'data:', 'blob:'],
};

const nextConfig: NextConfig = {
  basePath: '/aap/meldekort',
  trailingSlash: true,
  reactStrictMode: true,
  output: 'standalone',
  assetPrefix: process.env.ASSET_PREFIX ?? undefined,
  productionBrowserSourceMaps: true,
  experimental: {
    optimizePackageImports: ['@navikt/ds-react', '@navikt/aksel-icons'],
  },

  async headers() {
    const csp = await ssr.buildCspHeader(appDirectives, { env: process.env.DECORATOR_ENV ?? 'prod' });
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: csp,
          },
        ],
      },
    ];
  },
};

module.exports = withNextIntl(nextConfig);
