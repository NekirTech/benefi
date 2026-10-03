// Runs after `vite build`: renders every page to static HTML (for search
// engines and link previews) and writes sitemap.xml and robots.txt.
import { readFile, rm, writeFile } from 'node:fs/promises';
import { readdirSync } from 'node:fs';

const dist = new URL('../dist/', import.meta.url);
const ssrDir = new URL('../dist-ssr/', import.meta.url);

const { render, pageMeta, businessJsonLd, indexedPaths, site } = await import(
  new URL('entry-server.js', ssrDir).href
);
const template = await readFile(new URL('index.html', dist), 'utf8');
const ssrManifest = JSON.parse(
  await readFile(new URL('.vite/ssr-manifest.json', dist), 'utf8'),
);

const escape = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// CSS and JS of the components on the page, so it is styled before the app starts.
function assetLinks(modules) {
  const seen = new Set();
  const links = [];
  for (const id of modules) {
    for (const file of ssrManifest[id] ?? []) {
      if (seen.has(file) || template.includes(file)) continue;
      seen.add(file);
      if (file.endsWith('.css'))
        links.push(`<link rel="stylesheet" href="${file}">`);
      else if (file.endsWith('.js'))
        links.push(`<link rel="modulepreload" crossorigin href="${file}">`);
    }
  }
  return links;
}

// The latin subsets of both fonts are needed for the first screen.
const fontLinks = readdirSync(new URL('assets/', dist))
  .filter((f) => /^(fraunces|outfit)-latin-wght-normal-.*\.woff2$/.test(f))
  .map(
    (f) =>
      `<link rel="preload" as="font" type="font/woff2" crossorigin href="/assets/${f}">`,
  );

function setMeta(html, selector, attr, value) {
  return html.replace(
    new RegExp(`(<${selector}[^>]*${attr}=")[^"]*(")`),
    `$1${escape(value)}$2`,
  );
}

async function prerender(url, file) {
  const { html, modules } = await render(url);
  const meta = pageMeta(url, 'tr');

  let page = template
    .replace(/<title>[^<]*<\/title>/, `<title>${escape(meta.title)}</title>`)
    .replace('<div id="app"></div>', `<div id="app">${html}</div>`);
  page = setMeta(page, 'meta name="description"', 'content', meta.description);
  page = setMeta(page, 'meta property="og:title"', 'content', meta.title);
  page = setMeta(
    page,
    'meta property="og:description"',
    'content',
    meta.description,
  );

  const head = [...fontLinks, ...assetLinks(modules)];
  if (meta.path) {
    page = setMeta(page, 'link rel="canonical"', 'href', site.url + meta.path);
    page = setMeta(
      page,
      'meta property="og:url"',
      'content',
      site.url + meta.path,
    );
    head.push(
      `<script type="application/ld+json">${JSON.stringify(businessJsonLd()).replace(/</g, '\\u003c')}</script>`,
    );
  } else {
    page = page
      .replace(/\s*<link rel="canonical"[^>]*>/, '')
      .replace(/\s*<meta property="og:url"[^>]*>/, '');
    head.push('<meta name="robots" content="noindex">');
  }
  page = page.replace('<!--prerender-head-->', head.join('\n    '));

  await writeFile(new URL(file, dist), page);
  console.log(`prerendered ${url} -> dist/${file}`);
}

for (const path of indexedPaths) {
  await prerender(path, path === '/' ? 'index.html' : `${path.slice(1)}.html`);
}
await prerender('/404', '404.html');

const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexedPaths
  .map(
    (path) => `  <url>
    <loc>${site.url}${path}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join('\n')}
</urlset>
`;
await writeFile(new URL('sitemap.xml', dist), sitemap);
await writeFile(
  new URL('robots.txt', dist),
  `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`,
);
console.log('wrote dist/sitemap.xml and dist/robots.txt');

await rm(new URL('.vite/', dist), { recursive: true, force: true });
await rm(ssrDir, { recursive: true, force: true });
