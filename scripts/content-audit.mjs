import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';
import { homeContent } from '../src/content/homeContent.js';
import { homepageContent } from '../src/content/homepageContent.js';
import { aboutContent } from '../src/content/aboutContent.js';
import { servicesContent } from '../src/content/servicesContent.js';
import { pricingContent } from '../src/content/pricingContent.js';
import { pricingLandContent } from '../src/content/pricingLandContent.js';
import { partnersContent } from '../src/content/partnersContent.js';
import { tradelinesContent } from '../src/content/tradelinesContent.js';
import { consultationContent } from '../src/content/consultationContent.js';
import { contactContent } from '../src/content/contactContent.js';
import { creditInfoContent } from '../src/content/creditInfoContent.js';
import { faqContent } from '../src/content/faqContent.js';
import { successStoriesContent } from '../src/content/successStoriesContent.js';
import { privacyContent } from '../src/content/legalContentPrivacy.js';
import { termsContent } from '../src/content/legalContentTerms.js';
import { sitemapContent } from '../src/content/sitemapContent.js';
import { globalContent } from '../src/content/globalContent.js';

const pages = [
  homeContent, aboutContent, servicesContent, pricingContent, pricingLandContent,
  partnersContent, tradelinesContent, consultationContent, contactContent,
  creditInfoContent, faqContent, successStoriesContent, privacyContent,
  termsContent, sitemapContent,
];
const root = process.cwd();
const clean = (value = '') => value.replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const attrs = (node) => Object.fromEntries((node.attrs || []).map(({ name, value }) => [name, value]));

function find(node, predicate) {
  if (!node) return null;
  if (predicate(node)) return node;
  for (const child of node.childNodes || []) {
    const match = find(child, predicate);
    if (match) return match;
  }
  return null;
}

function collect(node, predicate, result = []) {
  if (!node) return result;
  if (predicate(node)) result.push(node);
  for (const child of node.childNodes || []) collect(child, predicate, result);
  return result;
}

function text(node) {
  return clean((node?.childNodes || []).map((child) => {
    if (child.nodeName === '#text') return child.value;
    if (['script', 'style', 'svg', 'noscript'].includes(child.tagName)) return '';
    return text(child);
  }).join(' '));
}

function flattenContent(value, result = []) {
  if (typeof value === 'string') result.push(clean(value));
  else if (Array.isArray(value)) value.forEach((item) => flattenContent(item, result));
  else if (value && typeof value === 'object') Object.values(value).forEach((item) => flattenContent(item, result));
  return result.filter(Boolean);
}

function meaningfulSourceStrings(nodes) {
  const semanticTags = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'button', 'a', 'small', 'blockquote']);
  const candidates = [];
  for (const rootNode of nodes) {
    for (const node of collect(rootNode, (candidate) => semanticTags.has(candidate.tagName))) {
      const value = text(node);
      if (value) candidates.push(value);
    }
    for (const node of collect(rootNode, (candidate) => {
      if (!['div', 'span', 'strong', 'em'].includes(candidate.tagName)) return false;
      const visibleChildren = (candidate.childNodes || []).filter((child) => child.tagName && child.tagName !== 'svg');
      return visibleChildren.length === 0;
    })) {
      const value = text(node);
      if (value) candidates.push(value);
    }
  }
  return [...new Set(candidates)];
}

let failures = 0;
const report = [];

for (const page of pages) {
  const sourcePath = path.join(root, 'legacy-source', page.source);
  const document = parse(fs.readFileSync(sourcePath, 'utf8'));
  const body = find(document, (node) => node.tagName === 'body');
  const mainNodes = (body.childNodes || []).filter((node) => (
    node.tagName && !['nav', 'footer', 'script'].includes(node.tagName) && attrs(node).id !== 'tradelines-modal'
  ));
  const footer = find(body, (node) => node.tagName === 'footer');
  const auditedNodes = footer ? [...mainNodes, footer] : mainNodes;
  const sourceStrings = meaningfulSourceStrings(auditedNodes);
  const generated = clean(flattenContent([page, globalContent]).join(' '));
  const missing = sourceStrings.filter((value) => !generated.includes(clean(value)));
  const customHomepage = clean(flattenContent(homepageContent).join(' '));
  const customHomepageMissing = page.route === '/'
    ? meaningfulSourceStrings(mainNodes).filter((value) => !customHomepage.includes(clean(value)))
    : [];
  const sourceTitle = text(find(document, (node) => node.tagName === 'title'));
  const sourceDescription = attrs(find(document, (node) => node.tagName === 'meta' && attrs(node).name === 'description') || {}).content || '';
  const metadataMatches = page.title === sourceTitle && page.description === sourceDescription;
  const externalUrls = auditedNodes.flatMap((node) => collect(node, (candidate) => ['a', 'iframe', 'source'].includes(candidate.tagName)))
    .map((node) => attrs(node).href || attrs(node).src)
    .filter((url) => /^https?:/.test(url || ''));
  const moduleText = JSON.stringify([page, globalContent]);
  const missingExternalUrls = [...new Set(externalUrls)].filter((url) => !moduleText.includes(url));
  const okay = missing.length === 0 && customHomepageMissing.length === 0 && metadataMatches && missingExternalUrls.length === 0;
  if (!okay) failures += 1;
  report.push({
    route: page.route,
    sections: page.sections.length,
    sourceStrings: sourceStrings.length,
    missingStrings: missing,
    customHomepageMissing,
    metadataMatches,
    missingExternalUrls,
    status: okay ? 'PASS' : 'FAIL',
  });
}

const projectSource = fs.readdirSync(path.join(root, 'src'), { recursive: true })
  .filter((entry) => String(entry).endsWith('.js') || String(entry).endsWith('.jsx'))
  .map((entry) => fs.readFileSync(path.join(root, 'src', entry), 'utf8'))
  .join('\n');

const requiredIntegrations = [
  'https://kbrownconsultantgroupllc.getcredithelpnow.com/billing',
  'https://kbrownconsultantgroupllc.getcredithelpnow.com/checkout-OPTIMIZATIONTIER1',
  'https://kbrownconsultantgroupllc.getcredithelpnow.com/checkout-CREDITOPTIMIZATIONPLANGROUP',
  'https://kbrownconsultantgroupllc.getcredithelpnow.com/checkout-HomebuyerPathPremierPromo',
  'https://link.kbcnsult.com/widget/booking/2FdegAiF26T5ryjb1wRs',
  'https://link.kbcnsult.com/widget/form/DIILI736u9rwFgAbwALb',
  'https://link.kbcnsult.com/widget/form/7AL0Qf8OHQBqbjwKB1uR',
  'https://api.kbrownconsultant.com/widget/form/6u5ymHnjsWJYSyabGXHR',
  'https://www.secureclientaccess.com/',
  'https://app.creditrepaircloud.com/app/widget.umd.cjs',
];
const missingIntegrations = requiredIntegrations.filter((url) => !projectSource.includes(url));
const exactGlobalStrings = [
  '754-704-4737',
  'support@disputelevelcreditrestoration.com',
  'Important Disclosure',
  'Consumer Rights Notice',
  '© 2026 Dispute Levels. All rights reserved.',
];
const missingGlobalStrings = exactGlobalStrings.filter((value) => !JSON.stringify(globalContent).includes(value));
const faqCount = flattenContent(faqContent).filter((value) => value.endsWith('?')).length;
const tradelineButtonCount = flattenContent(tradelinesContent).filter((value) => value === 'Choose This Tradeline').length;

if (missingIntegrations.length || missingGlobalStrings.length || tradelineButtonCount !== 11) failures += 1;

console.log(JSON.stringify({
  pages: report,
  requiredIntegrations: missingIntegrations.length ? { status: 'FAIL', missing: missingIntegrations } : { status: 'PASS', count: requiredIntegrations.length },
  globalContent: missingGlobalStrings.length ? { status: 'FAIL', missing: missingGlobalStrings } : { status: 'PASS' },
  faqQuestionsDetected: faqCount,
  tradelinesDetected: tradelineButtonCount,
  result: failures ? 'FAIL' : 'PASS',
}, null, 2));

if (failures) process.exitCode = 1;
