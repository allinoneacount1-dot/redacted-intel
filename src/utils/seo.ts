const BASE_TITLE = '[REDACTED]';
const BASE_URL = 'https://redacted-chi.vercel.app';

interface SEOOptions {
  title: string;
  description: string;
  path?: string;
  image?: string;
}

export function updateSEO({ title, description, path = '/', image }: SEOOptions) {
  // Update document title
  document.title = title;

  // Helper to set or create a meta tag
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`);
    if (element) {
      element.setAttribute('content', content);
    } else {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      element.setAttribute('content', content);
      document.head.appendChild(element);
    }
  };

  // Helper to set or create a link tag
  const setLink = (rel: string, href: string) => {
    let element = document.querySelector(`link[rel="${rel}"]`);
    if (element) {
      element.setAttribute('href', href);
    } else {
      element = document.createElement('link');
      element.setAttribute('rel', rel);
      element.setAttribute('href', href);
      document.head.appendChild(element);
    }
  };

  // Standard meta
  setMeta('description', description);

  // Open Graph
  setMeta('og:title', title, true);
  setMeta('og:description', description, true);
  setMeta('og:url', `${BASE_URL}${path}`, true);
  setMeta('og:type', 'website', true);
  if (image) {
    setMeta('og:image', image, true);
  }

  // Twitter
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', title);
  setMeta('twitter:description', description);
  if (image) {
    setMeta('twitter:image', image);
  }

  // Canonical URL
  setLink('canonical', `${BASE_URL}${path}`);
}

// Page-specific SEO configs
export const SEO_PAGES = {
  home: {
    title: `${BASE_TITLE} — Classified Crypto Intelligence`,
    description:
      'AI intelligence agency for crypto. Classified market dossiers issued in real time. Declassified in 72 hours. Verified in public.',
    path: '/',
  },
  briefing: {
    title: `Briefing Room | ${BASE_TITLE}`,
    description:
      'Task the Agency. Generate classified dossiers on demand. Select an asset and receive intelligence in real time.',
    path: '/briefing',
  },
  declassified: {
    title: `Declassified Archive | ${BASE_TITLE}`,
    description:
      'Every dossier goes public after 72 hours. Full archive of classified intelligence. Every outcome on record.',
    path: '/declassified',
  },
  agency: {
    title: `The Agency | ${BASE_TITLE}`,
    description:
      'A statement from the Director. How the Agency operates. What we believe. Why it matters.',
    path: '/agency',
  },
} as const;
