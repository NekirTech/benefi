import en from 'src/locales/en.json';
import tr from 'src/locales/tr.json';
import type { Lang } from 'src/composables/useLocale';
import { site } from 'src/site';

export type PageMeta = {
  title: string;
  description: string;
  /** Canonical path; missing for pages that should not be indexed. */
  path?: string;
};

/** Pages listed in sitemap.xml and prerendered at build time. */
export const indexedPaths = ['/', '/menu'];

export function pageMeta(path: string, lang: Lang): PageMeta {
  const text = lang === 'tr' ? tr : en;
  if (path === '/') {
    return {
      title: text.metaHomeTitle,
      description: text.metaHomeDescription,
      path,
    };
  }
  if (path === '/menu') {
    return {
      title: text.metaMenuTitle,
      description: text.metaMenuDescription,
      path,
    };
  }
  return { title: text.metaNotFoundTitle, description: text.notFound };
}

const dayNames = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

/** schema.org data so search engines can show address, hours and menu link. */
export function businessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'CafeOrCoffeeShop',
    '@id': `${site.url}/#cafe`,
    name: site.name,
    url: `${site.url}/`,
    image: site.url + site.image,
    logo: `${site.url}/benefi_logo.png`,
    telephone: site.phone.replace(/\s/g, ''),
    email: site.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.street,
      postalCode: site.postcode,
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    hasMenu: `${site.url}/menu`,
    servesCuisine: ['Coffee', 'Tea', 'Cakes', 'Breakfast'],
    currenciesAccepted: 'TRY',
    sameAs: [site.instagram],
    openingHoursSpecification: site.hours.map(([opens, closes], day) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${dayNames[day]}`,
      opens,
      // schema.org has no 24:00; the end of the day is written as 23:59.
      closes: closes === '24:00' ? '23:59' : closes,
    })),
  };
}

/** Keep title, description and canonical in sync while navigating in the browser. */
export function applyHead(meta: PageMeta) {
  document.title = meta.title;
  setAttr('meta[name="description"]', 'content', meta.description);
  setAttr('meta[property="og:title"]', 'content', meta.title);
  setAttr('meta[property="og:description"]', 'content', meta.description);
  if (meta.path) {
    setAttr('link[rel="canonical"]', 'href', site.url + meta.path);
    setAttr('meta[property="og:url"]', 'content', site.url + meta.path);
  }
}

function setAttr(selector: string, attr: string, value: string) {
  document.head.querySelector(selector)?.setAttribute(attr, value);
}
