export const legacyRedirects = {
  '/index.html': '/',
  '/about.html': '/about',
  '/services.html': '/services',
  '/pricing.html': '/pricing',
  '/pricing-land.html': '/pricing-land',
  '/partners.html': '/partners',
  '/tradelines.html': '/tradelines',
  '/consultation.html': '/consultation',
  '/contact.html': '/contact',
  '/credit-info.html': '/credit-info',
  '/faq.html': '/faq',
  '/success-stories.html': '/success-stories',
  '/privacy.html': '/privacy',
  '/terms.html': '/terms',
  '/sitemap.html': '/sitemap',
};

export const isInternalPath = (href) => href?.startsWith('/');
