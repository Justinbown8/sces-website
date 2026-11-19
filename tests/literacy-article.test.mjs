import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
import { readFileSync, existsSync } from 'node:fs';
import { mkdtemp, mkdir, rm, writeFile, readdir, readFile } from 'node:fs/promises';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { JSDOM } from 'jsdom';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const directory = join(root, 'src/content/drafts/literacy-rate-in-india');
const data = JSON.parse(readFileSync(join(directory, 'data.json'), 'utf8'));
const load = createRequire(import.meta.url);
const argument = name => process.argv.includes(name) ? process.argv[process.argv.indexOf(name) + 1] : undefined;

// Compile the checked-in server article in memory; nothing is emitted or added to a client bundle.
for (const extension of ['.ts', '.tsx']) {
  load.extensions[extension] = (module, filename) => module._compile(ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText, filename);
}
load.extensions['.css'] = module => {
  module.exports = { __esModule: true, default: new Proxy({}, { get: (_, name) => String(name) }) };
};
const article = load(join(directory, 'article.tsx'));
const seo = load(join(directory, 'seo.ts'));
const document = new JSDOM(renderToStaticMarkup(React.createElement(article.default, { imagePath: seo.literacySEO.previewImagePath }))).window.document;
const copy = document.querySelector('[data-article-copy]');
const preview = { mode: 'preview', origin: 'http://127.0.0.1:3100' };

function readableText(element, excluded = '') {
  const clone = element.cloneNode(true);
  clone.querySelectorAll(`script, style, nav${excluded ? `, ${excluded}` : ''}`).forEach(node => node.remove());
  const walker = clone.ownerDocument.createTreeWalker(clone, 4);
  const nodes = [];
  let node;
  while ((node = walker.nextNode())) nodes.push(node.textContent);
  return nodes.join(' ').replace(/\s+/g, ' ').trim();
}

function words(element, excluded = '') {
  return (readableText(element, excluded).match(/[A-Za-z0-9]+(?:['.-][A-Za-z0-9]+)*/g) || []).length;
}

test('36 current jurisdictions, bounded values, explicit geography and missing rural Chandigarh', () => {
  assert.equal(data.rows.length, 36);
  assert.equal(new Set(data.rows.map(row => row.name)).size, 36);
  assert.equal(data.rows.filter(row => row.type === 'State').length, 28);
  assert.equal(data.rows.filter(row => row.type === 'UT').length, 8);
  assert.equal(data.rows.find(row => row.name === 'Delhi').type, 'UT');
  assert.equal(data.rows.find(row => row.name === 'Chandigarh').rural, null);
  for (const row of [...data.rows, data.all_india]) {
    for (const sector of ['combined', 'rural', 'urban']) {
      if (row[sector] === null) continue;
      assert.equal(row[sector].length, 3);
      row[sector].forEach(rate => assert.ok(Number.isFinite(rate) && rate >= 0 && rate <= 100));
    }
  }
});

test('all 108 displayed state/UT cells, competition ties and overall/male/female column order', () => {
  const rows = [...document.querySelectorAll('#state-literacy-table tbody tr')];
  assert.equal(rows.length, 36);
  rows.forEach((row, index) => {
    const expected = article.rankedLiteracyRows[index];
    const cells = [...row.children];
    assert.equal(row.dataset.area, expected.name);
    assert.equal(cells[1].getAttribute('scope'), 'row');
    assert.equal(cells[1].textContent, expected.name);
    assert.equal(cells[2].textContent, expected.type);
    assert.deepEqual(cells.slice(3, 6).map(cell => cell.textContent), expected.combined.map(rate => rate.toFixed(1)));
    assert.equal(Number(cells[0].textContent), article.rankedLiteracyRows.findIndex(other => other.combined[0] === expected.combined[0]) + 1);
    assert.match(cells[6].textContent, /PLFS 2025.*Jan-Dec 2025/);
    if (index) assert.ok(expected.combined[0] <= article.rankedLiteracyRows[index - 1].combined[0]);
  });
  const tied = rows.filter(row => ['Haryana', 'Karnataka'].includes(row.dataset.area));
  assert.equal(tied[0].children[0].textContent, tied[1].children[0].textContent);
});

test('residence table, derived gaps and Census final/provisional counts', () => {
  for (const row of document.querySelectorAll('#residence-literacy-table tbody tr')) {
    assert.deepEqual([...row.querySelectorAll('td')].map(cell => Number(cell.textContent)), data.all_india[row.dataset.sector]);
  }
  const gap = (a, b) => Number((a - b).toFixed(1));
  assert.equal(gap(data.all_india.combined[1], data.all_india.combined[2]), 12.6);
  assert.equal(gap(data.all_india.urban[0], data.all_india.rural[0]), 11.6);
  assert.equal(gap(data.rows.find(row => row.name === 'Rajasthan').combined[1], data.rows.find(row => row.name === 'Rajasthan').combined[2]), 20.8);
  assert.equal(gap(data.rows.find(row => row.name === 'Lakshadweep').urban[0], data.rows.find(row => row.name === 'Lakshadweep').rural[0]), -4.4);
  const census = data.census_2011_reference_not_mixed_into_main_dataset;
  census.final_national_total_counts.literates.forEach((count, index) => {
    const denominator = census.final_national_total_counts.total_population[index] - census.final_national_total_counts.population_0_to_6[index];
    assert.equal(Number((100 * count / denominator).toFixed(2)), census.final_pca_rates_percent.combined[index]);
  });
  for (const state of Object.values(census.historical_state_extrema).filter(value => typeof value === 'object' && value.percent)) {
    assert.equal(Number((100 * state.literates / (state.total_population - state.population_0_to_6)).toFixed(2)), state.percent);
  }
  assert.equal(census.final_release_date, null);
  assert.deepEqual(census.provisional_2011_rates_percent, [74.04, 82.14, 65.46]);
});

test('semantic tables, heading hierarchy, unique IDs, working TOC and follow links', () => {
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.equal(document.querySelector('h1').textContent, seo.literacySEO.headline);
  const ids = [...document.querySelectorAll('[id]')].map(element => element.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const anchor of document.querySelectorAll('a[href^="#"]')) assert.ok(document.getElementById(anchor.getAttribute('href').slice(1)));
  for (const table of document.querySelectorAll('table')) {
    assert.ok(table.querySelector('caption'));
    assert.ok(table.querySelector('thead'));
    assert.ok(table.querySelector('tbody'));
    table.querySelectorAll('thead th').forEach(th => assert.equal(th.getAttribute('scope'), 'col'));
    assert.equal(table.parentElement.getAttribute('role'), 'region');
    assert.equal(table.parentElement.getAttribute('tabindex'), '0');
    assert.ok(document.getElementById(table.parentElement.getAttribute('aria-labelledby')));
  }
  let previous = 0;
  for (const heading of document.querySelectorAll('h1, h2, h3')) {
    const current = Number(heading.tagName.slice(1));
    assert.ok(current <= previous + 1);
    previous = current;
  }
  for (const anchor of document.querySelectorAll('a')) {
    assert.ok(!/nofollow|sponsored/.test(anchor.getAttribute('rel') || ''));
    assert.ok(!/^(javascript|data):/i.test(anchor.getAttribute('href')));
    assert.notEqual(anchor.getAttribute('target'), '_blank');
  }
  assert.equal(document.querySelectorAll('#literacy-faqs h3').length, 8);
});

test('SEO intent/placement, precise title lengths, accurate draft schema and no FAQ markup', () => {
  const keyword = /literacy rate in india/i;
  assert.ok(keyword.test(seo.literacySEO.title));
  assert.ok(keyword.test(seo.literacySEO.headline));
  assert.ok(keyword.test(seo.literacySEO.description));
  assert.ok(keyword.test(seo.literacySEO.slug.replaceAll('-', ' ')));
  assert.ok(keyword.test(copy.querySelector('p').textContent));
  assert.ok([...copy.querySelectorAll('h2')].some(heading => keyword.test(heading.textContent)));
  assert.ok(keyword.test(copy.querySelector('#literacy-conclusion').closest('section').querySelector('p').textContent));
  assert.equal(seo.literacySEO.title.length, 57);
  assert.equal(seo.literacySEO.description.length, 153);
  const metadata = seo.createLiteracyMetadata(preview);
  assert.equal(metadata.alternates.canonical, null);
  assert.equal(metadata.robots, 'noindex,follow,noimageindex');
  assert.equal(metadata.authors, null);
  assert.equal(metadata.openGraph.type, 'article');
  assert.equal(metadata.twitter.card, 'summary_large_image');
  const graph = JSON.parse(seo.serializeLiteracySchema(preview))['@graph'];
  assert.deepEqual(graph.map(node => node['@type']), ['Article', 'BreadcrumbList']);
  assert.equal(graph[0].headline, document.querySelector('h1').textContent);
  assert.equal(graph[0].dateModified, data.research_as_of);
  assert.equal(graph[0].creativeWorkStatus, 'Draft');
  assert.ok(!Object.hasOwn(graph[0], 'datePublished'));
  assert.ok(!Object.hasOwn(graph[0], 'author'));
  assert.equal(graph[0].publisher.url, 'https://scesindia.com');
  assert.ok(!Object.hasOwn(graph[0].publisher, '@id'));
  assert.equal(graph[0].image.url, metadata.openGraph.images[0].url);
});

test('publication factory needs explicit dates and author; canonical/schema/image stay consistent', () => {
  // Synthetic factory-test inputs only; they are never the draft's dates or byline.
  const context = { mode: 'publication', publication: {
    datePublished: '2026-11-19T12:00:00+05:30', dateModified: '2026-11-19T13:00:00+05:30',
    author: { type: 'Organization', name: seo.literacySEO.siteName, url: 'https://scesindia.com/about/' },
  } };
  const metadata = seo.createLiteracyMetadata(context);
  const graph = seo.createLiteracySchema(context)['@graph'];
  assert.equal(metadata.robots, 'index,follow');
  assert.equal(metadata.alternates.canonical, seo.literacySEO.canonical);
  assert.equal(graph[0].url, metadata.alternates.canonical);
  assert.equal(graph[0].datePublished, context.publication.datePublished);
  assert.equal(graph[0].image.url, metadata.openGraph.images[0].url);
  assert.equal(graph[0].author['@type'], 'Organization');
  assert.throws(() => seo.createLiteracyMetadata({ mode: 'publication', publication: { ...context.publication, datePublished: '' } }));
  assert.throws(() => seo.createLiteracyMetadata({ mode: 'preview', origin: 'https://scesindia.com' }));
  const escaped = seo.serializeLiteracySchema({ ...context, publication: { ...context.publication, author: { ...context.publication.author, name: '</script><script>fixture</script>' } } });
  assert.ok(!escaped.includes('</script>'));
  assert.equal(JSON.parse(escaped)['@graph'][0].author.name, '</script><script>fixture</script>');
});

test('featured raster/SVG dimensions, same six figures and zero-based chart scale', () => {
  const png = readFileSync(join(directory, 'literacy-rate-in-india-state-wise-plfs-2025.png'));
  assert.equal(png.subarray(1, 4).toString(), 'PNG');
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
  assert.ok(png.length < 100000);
  assert.ok(!existsSync(join(root, 'public/images/blog/literacy-rate-in-india-state-wise-plfs-2025.png')));
  const svg = new JSDOM(readFileSync(join(directory, 'literacy-rate-in-india-state-wise-plfs-2025.svg'), 'utf8'), { contentType: 'image/svg+xml' }).window.document;
  article.comparisonStates.forEach(row => {
    const rect = svg.querySelector(`rect[data-state="${row.name}"]`);
    assert.equal(Number(rect.getAttribute('x')), 748);
    assert.ok(Math.abs(Number(rect.getAttribute('width')) / 280 * 100 - row.combined[0]) < 0.001);
  });
  [...document.querySelectorAll('.chartRow')].forEach((row, index) => {
    assert.equal(row.children[2].textContent, `${article.comparisonStates[index].combined[0].toFixed(1)}%`);
    assert.equal(row.querySelector('[style]').style.width, `${article.comparisonStates[index].combined[0]}%`);
  });
});

test('article word count and percentage whitelist', () => {
  const count = words(copy);
  console.log(`WORD_COUNT body/headings/tables/FAQs, excluding TOC/byline/bibliography: ${count}; narrative excluding tables/chart: ${words(copy, 'table, figure')}; full article excluding TOC: ${words(document.querySelector('article'))}.`);
  assert.ok(count >= 2000 && count <= 3200, `Useful article body is ${count} words.`);
  const allowed = new Set([95, 100, 94, 61.8, ...data.rows.flatMap(row => [...row.combined, ...(row.rural || []), ...row.urban]), ...Object.values(data.all_india).flat(), ...data.census_2011_reference_not_mixed_into_main_dataset.final_pca_rates_percent.combined, ...data.census_2011_reference_not_mixed_into_main_dataset.provisional_2011_rates_percent]);
  for (const match of readableText(copy).matchAll(/\b(\d+(?:\.\d+)?)%/g)) assert.ok(allowed.has(Number(match[1])), `Untracked percentage ${match[1]}%.`);
});

if (argument('--source-workbook')) test('independent original XLSX hash and all 330 selected numeric cells', () => {
  const workbook = readFileSync(argument('--source-workbook'));
  assert.equal(createHash('sha256').update(workbook).digest('hex'), data.sources.original_table_xlsx_sha256);
  const files = new Map();
  let end = workbook.length - 22;
  while (end >= 0 && workbook.readUInt32LE(end) !== 0x06054b50) end--;
  assert.ok(end >= 0, 'ZIP end record');
  let position = workbook.readUInt32LE(end + 16);
  for (let index = 0; index < workbook.readUInt16LE(end + 10); index++) {
    assert.equal(workbook.readUInt32LE(position), 0x02014b50);
    const nameLength = workbook.readUInt16LE(position + 28);
    const extraLength = workbook.readUInt16LE(position + 30);
    const commentLength = workbook.readUInt16LE(position + 32);
    const name = workbook.subarray(position + 46, position + 46 + nameLength).toString();
    const local = workbook.readUInt32LE(position + 42);
    const start = local + 30 + workbook.readUInt16LE(local + 26) + workbook.readUInt16LE(local + 28);
    const bytes = workbook.subarray(start, start + workbook.readUInt32LE(position + 20));
    const method = workbook.readUInt16LE(position + 10);
    assert.ok(method === 0 || method === 8, 'Supported non-encrypted XLSX ZIP compression');
    files.set(name, (method === 8 ? inflateRawSync(bytes) : bytes).toString());
    position += 46 + nameLength + extraLength + commentLength;
  }
  const sheet = new JSDOM(files.get('xl/worksheets/sheet1.xml'), { contentType: 'application/xml' }).window.document;
  const shared = files.has('xl/sharedStrings.xml')
    ? [...new JSDOM(files.get('xl/sharedStrings.xml'), { contentType: 'application/xml' }).window.document.querySelectorAll('si')].map(node => node.textContent.trim())
    : [];
  let numeric = 0;
  for (const [sector, start] of [['rural', 7], ['urban', 51], ['combined', 94]]) {
    [...data.rows, data.all_india].forEach((row, index) => {
      if (row.name) {
        const cell = sheet.querySelector(`c[r="A${start + index}"]`);
        const name = cell.getAttribute('t') === 's' ? shared[Number(cell.querySelector('v').textContent)] : cell.textContent;
        assert.equal(name.trim().replace(/\s+/g, ' '), row.source_name, `${sector} source row name ${start + index}`);
      }
      ['F', 'B', 'D'].forEach((column, rateIndex) => {
        const value = sheet.querySelector(`c[r="${column}${start + index}"] v`)?.textContent;
        if (row[sector] === null) assert.ok(!value);
        else {
          assert.equal(Number(value), row[sector][rateIndex], `${sector}, ${row.name || 'India'}, ${column}${start + index}`);
          numeric++;
        }
      });
    });
  }
  assert.equal(numeric, 330);
  console.log('PRIMARY_SOURCE_CHECK: official workbook SHA-256 and 330 age-7-plus numeric cells match; rural Chandigarh remains blank.');
});

if (argument('--base-url')) test('rendered draft metadata, mobile scrolling, image, anchors and desktop layout', async () => {
  const base = argument('--base-url');
  const response = await fetch(new URL(seo.literacySEO.previewPath, base));
  assert.equal(response.status, 200);
  const pageDocument = new JSDOM(await response.text()).window.document;
  assert.equal(pageDocument.title, seo.literacySEO.title);
  assert.equal(pageDocument.querySelectorAll('meta[name="description"]').length, 1);
  assert.equal(pageDocument.querySelector('meta[name="description"]').content, seo.literacySEO.description);
  assert.equal(pageDocument.querySelectorAll('link[rel="canonical"]').length, 0);
  assert.match(pageDocument.querySelector('meta[name="robots"]').content, /noindex/);
  assert.ok(!pageDocument.querySelector('meta[name="robots"]').content.includes('nofollow'));
  assert.equal(pageDocument.querySelectorAll('meta[name="author"]').length, 0);
  assert.equal(pageDocument.querySelectorAll('meta[property="article:published_time"]').length, 0);
  for (const property of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image', 'og:site_name']) assert.equal(pageDocument.querySelectorAll(`meta[property="${property}"]`).length, 1, property);
  for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image', 'twitter:image:alt']) assert.equal(pageDocument.querySelectorAll(`meta[name="${name}"]`).length, 1, name);
  assert.equal(pageDocument.querySelectorAll('meta[name="twitter:creator"]').length, 0);
  assert.equal(pageDocument.querySelector('meta[property="og:image"]').content, new URL(seo.literacySEO.previewImagePath, base).href);
  const schemas = [...pageDocument.querySelectorAll('script[type="application/ld+json"]')].flatMap(script => {
    const parsed = JSON.parse(script.textContent);
    return parsed['@graph'] || [parsed];
  });
  assert.equal(schemas.filter(node => node['@type'] === 'Article').length, 1);
  assert.equal(schemas.filter(node => node['@type'] === 'BreadcrumbList').length, 1);
  assert.equal(schemas.filter(node => node['@type'] === 'FAQPage' || node['@type'] === 'Person').length, 0);
  const imageResponse = await fetch(new URL(seo.literacySEO.previewImagePath, base));
  assert.equal(imageResponse.status, 200);
  assert.match(imageResponse.headers.get('content-type'), /image\/png/);
  assert.match(imageResponse.headers.get('x-robots-tag'), /noindex/);

  const { default: puppeteer } = await import('puppeteer-core');
  const auditDirectory = await mkdtemp(join(argument('--temp-dir') || 'C:\\Users\\Asus\\AppData\\Local\\Temp\\kilo', 'literacy-browser-'));
  const profile = join(auditDirectory, 'profile');
  await mkdir(profile);
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true, userDataDir: profile,
    args: ['--disable-background-networking', '--disable-default-apps', '--no-first-run'],
  });
  try {
    const page = await browser.newPage();
    const exceptions = [];
    page.on('pageerror', error => exceptions.push(error.message));
    await page.setRequestInterception(true);
    page.on('request', request => {
      const url = new URL(request.url());
      if (['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname) || ['data:', 'blob:'].includes(url.protocol)) request.continue();
      else request.abort();
    });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const layouts = [];
    for (const width of [320, 375, 1440]) {
      await page.setViewport({ width, height: 900 });
      await page.goto(new URL(seo.literacySEO.previewPath, base).href, { waitUntil: 'networkidle0', timeout: 60000 });
      const layout = await page.evaluate(() => {
        const article = document.getElementById('literacy-article');
        const regions = [...article.querySelectorAll('[role="region"]')];
        const image = article.querySelector('img');
        return {
          viewport: innerWidth, articleWidth: article.getBoundingClientRect().width, pageWidth: document.body.scrollWidth,
          articleCount: document.querySelectorAll('#literacy-article').length, h1Count: document.querySelectorAll('h1').length,
          regions: regions.map(region => ({ width: region.getBoundingClientRect().width, client: region.clientWidth, scroll: region.scrollWidth })),
          imageWidth: image.naturalWidth, imageHeight: image.naturalHeight,
        };
      });
      assert.ok(layout.articleWidth <= width + 1);
      assert.ok(layout.pageWidth <= width + 1);
      assert.equal(layout.articleCount, 1);
      assert.equal(layout.h1Count, 1);
      assert.equal(layout.imageWidth, 1200);
      assert.equal(layout.imageHeight, 630);
      layout.regions.forEach(region => assert.ok(region.width <= width));
      if (width < 480) {
        assert.ok(layout.regions[0].scroll > layout.regions[0].client);
        await page.focus('#state-literacy-table');
        await page.evaluate(() => document.querySelector('#state-literacy-table').parentElement.focus());
        await page.keyboard.press('ArrowRight');
        await page.waitForFunction(() => document.querySelector('#state-literacy-table').parentElement.scrollLeft > 0, { timeout: 3000 });
      }
      await page.screenshot({ path: join(auditDirectory, `literacy-${width}.png`), fullPage: true });
      layouts.push(layout);
    }
    for (const anchor of pageDocument.querySelectorAll('[aria-label="Article table of contents"] a')) {
      const hash = anchor.getAttribute('href');
      await page.click(`[aria-label="Article table of contents"] a[href="${hash}"]`);
      assert.equal(await page.evaluate(() => location.hash), hash);
      const top = await page.$eval(hash, element => element.getBoundingClientRect().top);
      assert.ok(top >= 0 && top < 450, `${hash} must land below the fixed header; top=${top}`);
    }
    await writeFile(join(auditDirectory, 'browser-audit.json'), JSON.stringify({ layouts, exceptions, metadataUnique: true, tocAnchors: 14 }, null, 2));
    console.log(`BROWSER_AUDIT: ${auditDirectory}; widths 320/375/1440, keyboard scroll, 14 anchors, PNG, unique metadata/schema. Browser exceptions: ${JSON.stringify(exceptions)}.`);
    assert.equal(exceptions.length, 0);
  } finally {
    await browser.close();
    await rm(profile, { recursive: true, force: true });
  }
});

if (argument('--production-url')) test('production denies draft/image/public slug and omits content from blog, sitemap and browser JS', async () => {
  const base = argument('--production-url');
  for (const path of [seo.literacySEO.previewPath, seo.literacySEO.previewImagePath, `/blog/${seo.literacySEO.slug}/`]) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 404, path);
    assert.ok(!(await response.text()).includes(seo.literacySEO.headline));
  }
  for (const path of ['/blog/', '/sitemap.xml']) {
    const response = await fetch(new URL(path, base));
    assert.equal(response.status, 200);
    assert.ok(!(await response.text()).includes(seo.literacySEO.slug));
  }
  const published = await fetch(new URL('/blog/international-literacy-day-help-a-child-learn-to-read/', base));
  assert.equal(published.status, 200);
  const publishedDocument = new JSDOM(await published.text()).window.document;
  assert.ok(!publishedDocument.querySelector('meta[name="robots"]').content.includes('noindex'));
  let target = new URL('/donate-now?literacy-audit=1', base);
  let redirects = 0;
  while (target.pathname.replace(/\/+$/, '') !== '/donate' && redirects < 3) {
    const alias = await fetch(target, { redirect: 'manual' });
    assert.equal(alias.status, 308);
    target = new URL(alias.headers.get('location'), target);
    assert.equal(target.search, '?literacy-audit=1');
    redirects++;
  }
  assert.equal(target.pathname.replace(/\/+$/, ''), '/donate');
  assert.equal(target.search, '?literacy-audit=1');
  const pending = [join(root, '.next/static')];
  let chunks = 0;
  while (pending.length) {
    const directory = pending.pop();
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) pending.push(path);
      else if (entry.name.endsWith('.js')) {
        const source = await readFile(path, 'utf8');
        assert.ok(!source.includes(seo.literacySEO.headline) && !source.includes(data.dataset_id), path);
        chunks++;
      }
    }
  }
  console.log(`PRODUCTION_EXCLUSION: 404 draft/image/public slug; absent blog/sitemap and ${chunks} browser JS chunks; existing article indexing unchanged.`);
});

if (process.argv.includes('--check-links')) test('HTTP-check every distinct editorial citation and internal destination', async () => {
  const urls = [...new Set([...document.querySelectorAll('a[href]')].map(anchor => anchor.getAttribute('href')).filter(href => !href.startsWith('#')).map(href => {
    const url = new URL(href, seo.literacySEO.siteUrl);
    url.hash = '';
    return url.href;
  }))];
  const results = [];
  for (let offset = 0; offset < urls.length; offset += 4) {
    const batch = await Promise.all(urls.slice(offset, offset + 4).map(async url => {
      let failure;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          let method = 'HEAD';
          let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(20000) });
          if (!response.ok) {
            method = 'GET';
            response = await fetch(url, { headers: { Range: 'bytes=0-1023' }, redirect: 'follow', signal: AbortSignal.timeout(20000) });
            await response.body?.cancel();
          }
          return { url, method, status: response.status, finalUrl: response.url, result: response.ok ? 'reachable' : [401, 403, 429, 503].includes(response.status) ? 'blocked-or-unavailable' : 'http-error' };
        } catch (error) {
          failure = error.message;
        }
      }
      return { url, result: 'unreachable-from-audit', error: failure };
    }));
    results.push(...batch);
  }
  console.log(`LINK_AUDIT ${JSON.stringify(results, null, 2)}`);
  assert.ok(results.every(result => result.result !== 'http-error'), 'A cited URL returned a broken HTTP response; check the report.');
  const pending = results.filter(result => result.result !== 'reachable');
  console.log(`LINK_AUDIT_SUMMARY: ${urls.length} unique editorial URLs; ${urls.length - pending.length} reachable, ${pending.length} blocked/unreachable (not silently treated as verified).`);
  assert.equal(pending.length, 0, 'All editorial URLs must have a successful response for the complete audit.');
});
