import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';

const root = process.cwd();
const legacyDir = path.join(root, 'legacy-source');
const contentDir = path.join(root, 'src', 'content');

const pages = {
  'index.html': ['homeContent.js', 'homeContent', '/'],
  'about.html': ['aboutContent.js', 'aboutContent', '/about'],
  'services.html': ['servicesContent.js', 'servicesContent', '/services'],
  'pricing.html': ['pricingContent.js', 'pricingContent', '/pricing'],
  'pricing-land.html': ['pricingLandContent.js', 'pricingLandContent', '/pricing-land'],
  'partners.html': ['partnersContent.js', 'partnersContent', '/partners'],
  'tradelines.html': ['tradelinesContent.js', 'tradelinesContent', '/tradelines'],
  'consultation.html': ['consultationContent.js', 'consultationContent', '/consultation'],
  'contact.html': ['contactContent.js', 'contactContent', '/contact'],
  'credit-info.html': ['creditInfoContent.js', 'creditInfoContent', '/credit-info'],
  'faq.html': ['faqContent.js', 'faqContent', '/faq'],
  'success-stories.html': ['successStoriesContent.js', 'successStoriesContent', '/success-stories'],
  'privacy.html': ['legalContentPrivacy.js', 'privacyContent', '/privacy'],
  'terms.html': ['legalContentTerms.js', 'termsContent', '/terms'],
  'sitemap.html': ['sitemapContent.js', 'sitemapContent', '/sitemap'],
};

const missingPages = new Set(['refund.html', 'consumer-rights.html', 'accessibility.html']);
const skippedTags = new Set(['script', 'style', 'svg', 'noscript', 'source']);
const textTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'small', 'label', 'blockquote']);

const attrs = (node) => Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]));
const classes = (node) => (attrs(node).class || '').split(/\s+/).filter(Boolean);
const hasClass = (node, matcher) => classes(node).some((value) => matcher.test(value));
const elements = (node) => (node.childNodes || []).filter((child) => child.tagName);
const clean = (value = '') => value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const nodeText = (node) => clean((node?.childNodes || []).map((child) => (
  child.nodeName === '#text' ? child.value : skippedTags.has(child.tagName) ? '' : nodeText(child)
)).join(' '));

function find(node, predicate) {
  if (!node) return null;
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const match = find(child, predicate);
    if (match) return match;
  }
  return null;
}

function findAll(node, predicate, result = []) {
  if (!node) return result;
  if (predicate(node)) result.push(node);
  for (const child of node.childNodes || []) findAll(child, predicate, result);
  return result;
}

function normalizeHref(href = '') {
  if (!href) return '';
  if (href.startsWith('assets/')) return '/' + href;
  const [file, hash = ''] = href.split('#');
  if (missingPages.has(file)) return '';
  if (file.endsWith('.html')) {
    const base = file === 'index.html' ? '/' : '/' + file.slice(0, -5);
    return hash ? (base === '/' ? '' : base) + '#' + hash : base;
  }
  if (file === 'sitemap.xml') return '/sitemap';
  return href;
}

function containerRole(node) {
  if (hasClass(node, /grid/)) return 'grid';
  if (hasClass(node, /rounded|shadow|border/)) return 'card';
  if (hasClass(node, /max-w/)) return 'container';
  if (hasClass(node, /flex/)) return 'row';
  return 'group';
}

function simplify(node) {
  if (!node || skippedTags.has(node.tagName)) return null;
  const tag = node.tagName;
  const attributes = attrs(node);

  if (tag === 'img') {
    return { type: 'image', src: normalizeHref(attributes.src), alt: attributes.alt || '' };
  }

  if (tag === 'iframe') {
    return {
      type: 'embed',
      src: attributes.src,
      title: attributes.title || 'Dispute Levels secure form',
    };
  }

  if (tag === 'video') {
    const source = find(node, (candidate) => candidate.tagName === 'source');
    const src = attributes.src || attrs(source || {}).src;
    return src ? { type: 'video', src: normalizeHref(src), title: 'Client experience video' } : null;
  }

  if (tag === 'ul' || tag === 'ol') {
    const items = elements(node).filter((child) => child.tagName === 'li').map(nodeText).filter(Boolean);
    return items.length ? { type: 'list', ordered: tag === 'ol', items } : null;
  }

  if (textTags.has(tag)) {
    const text = nodeText(node);
    if (!text) return null;
    if (/^h[1-6]$/.test(tag)) return { type: 'heading', level: Number(tag.slice(1)), text };
    if (tag === 'blockquote') return { type: 'quote', text };
    return { type: tag === 'small' ? 'note' : 'paragraph', text };
  }

  if (tag === 'a') {
    const text = nodeText(node);
    const image = find(node, (candidate) => candidate.tagName === 'img');
    if (!text && image) return simplify(image);
    if (!text) return null;
    return {
      type: 'link',
      text,
      href: normalizeHref(attributes.href),
      external: /^(https?:|mailto:|tel:)/.test(attributes.href || ''),
    };
  }

  if (tag === 'button') {
    const text = nodeText(node);
    if (!text) return null;
    return {
      type: 'button',
      text,
      action: /Choose This Tradeline/i.test(text) ? 'tradeline' : 'toggle',
    };
  }

  if (tag === 'div') {
    const accordionButton = elements(node).find((child) => child.tagName === 'button' && hasClass(child, /accordion-button/));
    if (accordionButton) {
      const answer = clean(elements(node).filter((child) => child !== accordionButton).map(nodeText).join(' '));
      return { type: 'faq', question: nodeText(accordionButton), answer };
    }
  }

  const children = (node.childNodes || []).map(simplify).filter(Boolean);
  if (!children.length) {
    const text = nodeText(node);
    return text ? { type: 'copy', text } : null;
  }

  if (tag === 'span' || tag === 'strong' || tag === 'em') {
    const text = nodeText(node);
    return text ? { type: 'copy', text, emphasis: tag } : null;
  }

  return {
    type: tag === 'section' || tag === 'header' ? 'section' : 'container',
    role: tag === 'section' || tag === 'header' ? 'section' : containerRole(node),
    id: attributes.id || undefined,
    children,
  };
}

function sectionVariant(node, index, pageName) {
  const text = nodeText(node);
  if (pageName === 'privacy.html' || pageName === 'terms.html') return index === 0 ? 'legal-hero' : 'legal';
  if (pageName === 'pricing-land.html' && index === 0) return 'landing-hero';
  if (index === 0) return 'hero';
  if (attrs(node).id === 'signup' || hasClass(node, /cta-bg/)) return 'cta';
  if (find(node, (candidate) => candidate.tagName === 'iframe')) return 'embed';
  if (/OPTIMIZATION TIER1|CREDIT OPTIMIZATION PLAN GROUP|Homebuyer Path Premier Promo/.test(text)) return 'pricing';
  if (/Choose This Tradeline/.test(text)) return 'tradelines';
  if (hasClass(node, /bg-slate-900|bg-secondary|darkbg/)) return 'dark';
  if (hasClass(node, /bg-slate-50|bg-slate-100/)) return 'soft';
  return index % 2 ? 'plain' : 'soft';
}

function extractFooter(footer) {
  const blocks = findAll(footer, (node) => ['h2', 'h3', 'h4', 'p'].includes(node.tagName))
    .map((node) => ({ type: node.tagName.startsWith('h') ? 'heading' : 'paragraph', text: nodeText(node) }))
    .filter((block) => block.text);
  const description = blocks.find((block) => /^(Empowering individuals|Credit education, consultation)/.test(block.text))?.text || '';
  const copyright = blocks.find((block) => /2026 Dispute Levels/.test(block.text))?.text || '';
  const headings = blocks.filter((block) => block.type === 'heading').map((block) => block.text);
  const legalBlocks = blocks.filter((block) => (
    /Important Disclosure|IMPORTANT DISCLOSURE|Consumer Rights Notice|CONSUMER NOTICE/.test(block.text)
    || /^(We provide|Dispute Levels provides|Consumers may|You have the right|Purchasing our services|We do not guarantee|Results vary)/.test(block.text)
  ));
  const links = findAll(footer, (node) => node.tagName === 'a')
    .map((node) => ({ label: nodeText(node), to: normalizeHref(attrs(node).href) }))
    .filter((link) => link.label);
  const contactLines = findAll(footer, (node) => node.tagName === 'li')
    .map(nodeText)
    .filter((line) => /754-704-4737|support@disputelevelcreditrestoration\.com/.test(line));
  return { description, copyright, headings, legalBlocks, links, contactLines };
}

function documentData(fileName, route) {
  const source = fs.readFileSync(path.join(legacyDir, fileName), 'utf8');
  const document = parse(source);
  const titleNode = find(document, (node) => node.tagName === 'title');
  const descriptionNode = find(document, (node) => node.tagName === 'meta' && attrs(node).name === 'description');
  const body = find(document, (node) => node.tagName === 'body');
  const footer = find(body, (node) => node.tagName === 'footer');
  const pageNodes = elements(body).filter((node) => !['nav', 'footer', 'script'].includes(node.tagName) && attrs(node).id !== 'tradelines-modal');
  const sections = pageNodes.map((node, index) => {
    const data = simplify(node);
    return { ...data, role: 'section', variant: sectionVariant(node, index, fileName), sourceIndex: index };
  }).filter((section) => section.children?.length);
  const h1 = find(body, (node) => node.tagName === 'h1');
  const images = findAll(body, (node) => node.tagName === 'img').map((node) => ({
    src: normalizeHref(attrs(node).src),
    alt: attrs(node).alt || '',
  }));

  return {
    route,
    source: fileName,
    title: nodeText(titleNode),
    description: attrs(descriptionNode || {}).content || '',
    heading: nodeText(h1),
    sections,
    images,
    footer: extractFooter(footer),
  };
}

fs.mkdirSync(contentDir, { recursive: true });

const footerMap = {};
for (const [source, [fileName, exportName, route]] of Object.entries(pages)) {
  const data = documentData(source, route);
  footerMap[route] = data.footer;
  const output = '// Generated from legacy-source/' + source + '. Do not edit copy here; update the archived source and regenerate.\nexport const ' + exportName + ' = ' + JSON.stringify(data, null, 2) + ';\n';
  fs.writeFileSync(path.join(contentDir, fileName), output, 'utf8');
}

const legalIndex = "export { privacyContent } from './legalContentPrivacy';\nexport { termsContent } from './legalContentTerms';\n";
fs.writeFileSync(path.join(contentDir, 'legalContent.js'), legalIndex, 'utf8');
fs.writeFileSync(path.join(contentDir, 'footerContent.js'), 'export const footerContent = ' + JSON.stringify(footerMap, null, 2) + ';\n', 'utf8');

console.log('Generated ' + Object.keys(pages).length + ' exact-content modules in src/content.');
