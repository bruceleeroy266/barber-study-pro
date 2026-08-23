import type { NextConfig } from "next";

type CspEnvironment = Partial<Pick<
  NodeJS.ProcessEnv,
  | 'NODE_ENV'
  | 'NEXT_PUBLIC_SUPABASE_URL'
  | 'NEXT_PUBLIC_GA_MEASUREMENT_ID'
  | 'NEXT_PUBLIC_CLARITY_PROJECT_ID'
>>;

function getOrigin(value: string | undefined): string | null {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

export function buildContentSecurityPolicy(
  environment: CspEnvironment = process.env
): string {
  const isProduction = environment.NODE_ENV === 'production';
  const scriptSources = ["'self'", "'unsafe-inline'"];
  const styleSources = ["'self'", "'unsafe-inline'"];
  const imageSources = ["'self'", 'data:', 'blob:'];
  const connectSources = ["'self'"];

  // Next.js emits inline hydration/bootstrap scripts. A nonce-based policy
  // would require converting all static routes to per-request dynamic rendering;
  // that broader architecture change is not appropriate for this correction.
  // Development additionally needs eval and local WebSocket access for HMR.
  if (!isProduction) {
    scriptSources.push("'unsafe-eval'", 'https://va.vercel-scripts.com');
    connectSources.push(
      'http://localhost:*',
      'http://127.0.0.1:*',
      'ws://localhost:*',
      'ws://127.0.0.1:*',
      'https://vitals.vercel-insights.com'
    );
  }

  const supabaseOrigin = getOrigin(environment.NEXT_PUBLIC_SUPABASE_URL);
  if (supabaseOrigin) {
    connectSources.push(supabaseOrigin);
    if (supabaseOrigin.startsWith('https://')) {
      connectSources.push(supabaseOrigin.replace('https://', 'wss://'));
    }
  }

  if (environment.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    scriptSources.push('https://www.googletagmanager.com');
    connectSources.push('https://www.google-analytics.com', 'https://region1.google-analytics.com');
    imageSources.push('https://www.google-analytics.com');
  }

  if (environment.NEXT_PUBLIC_CLARITY_PROJECT_ID) {
    scriptSources.push('https://www.clarity.ms');
    connectSources.push('https://*.clarity.ms', 'https://*.bing.com');
    imageSources.push('https://*.clarity.ms', 'https://*.bing.com');
  }

  const directives = [
    "default-src 'self'",
    `script-src ${scriptSources.join(' ')}`,
    `style-src ${styleSources.join(' ')}`,
    `img-src ${imageSources.join(' ')}`,
    "font-src 'self'",
    `connect-src ${connectSources.join(' ')}`,
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "manifest-src 'self'",
  ];

  if (isProduction) directives.push('upgrade-insecure-requests');

  return directives.join('; ');
}

export const SECURITY_HEADERS = [
  {
    key: 'Content-Security-Policy',
    value: buildContentSecurityPolicy(),
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on',
  },
  {
    // One year is deliberate. includeSubDomains and preload are omitted until
    // every present/future subdomain has an owned HTTPS lifecycle and rollback plan.
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'X-XSS-Protection',
    value: '0',
  },
] as const;

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: ".",
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes.
        source: '/(.*)',
        headers: [...SECURITY_HEADERS],
      },
      {
        // Cache static assets aggressively.
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Cache fonts.
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/login.html',
        destination: '/login',
        permanent: true,
      },
      {
        source: '/signup.html',
        destination: '/signup',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
