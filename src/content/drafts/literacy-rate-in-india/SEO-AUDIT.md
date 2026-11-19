# Literacy Rate in India: Editorial and SEO Audit

Research check: 19 November 2026. Status: local editorial draft, not published.

This report records keyword decisions made before article drafting and the completed implementation/verification results. The article is prepared in the project as a local editorial draft. No production deployment, named-author approval, or original publication date is claimed.

## Delivery Summary

- Article body: **2,710 words**, including headings, tables, comparison chart labels and eight FAQs; excluding TOC, byline and bibliography.
- Narrative: **2,230 words**, additionally excluding tables and the chart.
- Full visible article: **3,128 words**, including source bibliography, byline and featured-image caption, but excluding TOC. The primary-source bibliography accounts for useful additional length rather than padded prose.
- Counts use rendered text nodes and the reproducible word tokenizer in `tests/literacy-article.test.mjs`; numbers and hyphenated terms count as words.
- Primary keyword: **literacy rate in India**. Secondary/long-tail/semantic mapping is recorded below.
- Local preview: `http://127.0.0.1:3100/demo/literacy-rate-in-india/`.
- Final full acceptance run: **12 tests passed, zero failures**.
- Files: **11 created and one existing file modified**; detailed inventory appears at the end.

## Keyword Strategy

Primary keyword: **literacy rate in India**.

Search intent: informational. Readers want a national answer, a complete state/UT comparison, highest/lowest areas, gender and residence gaps, and an explanation of which year and method the figures represent. This article will not target donation, school admissions, tax-saving, or other transactional queries.

The broad primary phrase fits the national overview and the observed state-comparison queries. The narrower phrase "state-wise literacy rate in India" is the main supporting target and appears in the H1/table section. This is a qualitative intent decision, not a claim about measured search volume, keyword difficulty, or Google ranking potential.

Search observations were made using accessible DuckDuckGo HTML results for:

- `state wise literacy rate in India`
- `"literacy rate in India"`
- `"which state" "highest literacy" India`

Observed results included Wikipedia's literacy/state list, Census-based aggregators, government data portals, and education publishers. Two inspected comparison pages were `https://indiacensus.in/literacy-rate/` and `https://www.21kschool.com/in/blog/literacy-rate-in-india/`. These were inspected for intent and presentation only, not used as statistical sources. Clear reference periods, primary-source citations, complete current geography, and separation of surveys from Census figures are the intended editorial differentiators.

Google's search page required JavaScript and did not provide usable results in this environment. Bing returned unrelated results and was discarded. Search Console, Keyword Planner, paid keyword tools, and site analytics were not accessed. No traffic or competition numbers have been invented.

### Keyword-to-Section Mapping

| Keyword / Semantic Cluster | Intended Section and Anchor | Reader Need |
| --- | --- | --- |
| literacy rate in India; India literacy statistics | SEO title, H1, introduction, `#understanding-literacy`, conclusion | National answer and denominator |
| state wise literacy rate in India; literacy rate of Indian states; literacy rate by state; what is the literacy rate of each Indian state | `#state-wise-literacy` | Complete comparable table |
| Indian states literacy ranking; literacy rate comparison between Indian states | `#state-wise-literacy`, `#highest-literacy`, `#lowest-literacy` | Point-estimate ordering with tie/method caveats |
| highest literacy rate in India; which Indian state has the highest literacy rate | `#highest-literacy`, FAQ | State answer, separate from UTs and Census history |
| lowest literacy rate in India; which state has the lowest literacy rate | `#lowest-literacy`, FAQ | Same-period lowest-state answer |
| female literacy rate in India; male literacy rate in India; male and female literacy rates across Indian states | `#gender-gap`, table, FAQ | Gender comparisons and percentage-point gaps |
| rural versus urban literacy; rural urban education gap | `#rural-urban-gap` | Residence and gender intersection |
| literacy rate of Union Territories; which Union Territory has the highest literacy rate | Table, highest-literacy section, FAQ | Current eight-UT coverage and distinct UT answer |
| regional literacy trends; education statistics in India | `#regional-trends`, `#literacy-barriers` | Examples without unweighted regional averages or causal ranking claims |
| latest state-wise literacy rate in India; Census versus survey estimates | `#data-methodology`, `#census-versus-survey`, FAQ | Actual reference period, publication/version dates, statistical limitations |
| Samagra Shiksha; NEP 2020; ULLAS; PM SHRI; foundational literacy | `#government-initiatives`, `#future-literacy` | Programme objectives, not unverified impact claims |

Semantic clusters: literacy measurement; seven-plus population; survey estimates and sampling; state/UT geography; male/female inequality; rural/urban residence; foundational learning; adult literacy; school access and inclusion; official education policy.

No arbitrary keyword-density target is used. Exact primary-keyword placement is checked for relevance, not repeated mechanically.

## On-Page Metadata

- SEO title: `Literacy Rate in India: State-Wise Rankings & Data | SCES` (**57 characters**).
- Meta description: `Explore the literacy rate in India with verified state and UT rankings, male-female comparisons, rural-urban gaps and clear Census versus survey sources.` (**153 characters**).
- H1: `Literacy Rate in India: State-Wise Literacy Rates and Rankings`
- URL slug: `literacy-rate-in-india-state-wise`
- Publication canonical: `https://scesindia.com/blog/literacy-rate-in-india-state-wise/`
- Featured filename: `literacy-rate-in-india-state-wise-plfs-2025.png`.
- Open Graph: article type, title, description, URL, real 1200 x 630 raster image, image alt, and SCES organization site name.
- X/Twitter: summary-large-image card, title, description, image and alt; no unverified social handle.

The public URL and public image URL are reserved publication targets, not existing live resources. Publication metadata/schema factories implement the canonical above and `https://scesindia.com/images/blog/literacy-rate-in-india-state-wise-plfs-2025.png`, but require explicit author and publication/modification inputs. The public article URL currently returns 404 by design.

The local preview explicitly clears the inherited home-page canonical and uses its actual loopback URL/image endpoint for Open Graph and Article schema. It is intentionally `noindex,follow,noimageindex`; ordinary citations remain follow links. Publication-mode metadata is `index,follow`. No shared SEO settings were overwritten.

Primary-keyword placement passed checks in the SEO title, H1, URL slug, opening paragraph, an H2, conclusion paragraph and meta description. The absolute metadata title avoids the existing helper's long organization-name suffix and the root template's duplicate suffix.

Open Graph implementation passed uniqueness checks for `og:title`, `og:description`, `og:type=article`, `og:url`, `og:image` and `og:site_name`. Image dimensions and alt text are included. X/Twitter checks passed for `twitter:card=summary_large_image`, title, description, image and image alt. No unverified creator handle is inherited.

## Statistical Method

The selected comprehensive dataset is NSO/MoSPI PLFS 2025: January-December 2025, age seven and above. The verified national combined estimate is 81.1%, male 87.5%, female 74.9%. All 28 state and eight UT rows were verified from the original PDF and government workbook before drafting.

The main ranking uses only the combined rural+urban panel of one version of this report, not Census figures, programme declarations, age-five-plus estimates, or an average of male/female percentages. State and UT labels are explicit. Equal published percentages share competition ranks; ordering is not a claim of statistically significant differences.

Census 2011 final national rates (72.98%, male 80.88%, female 64.63%) are described separately from provisional figures (74.04%, 82.14%, 65.46%). The modern-area table does not backfill changed state/UT boundaries using old Census jurisdictions. Historical Kerala 94.00% and Bihar 61.80% are explicitly Census 2011 state answers, not current survey rankings.

Publication date, reference period, and revision-file date are separate fields. A newer publication that repeats an older dataset does not become a new statistical reference year.

### Sources and Reference Years

| Dataset / Document | Statistical or Policy Reference | Verified Publication / Version | Use |
| --- | --- | --- | --- |
| NSO Annual PLFS 2025, Table (7) | January-December 2025; age 7+; reference midpoint of that survey period | Original release **27 March 2026**, imprint March 2026; revised PDF filename/metadata **29 May 2026** | Only dataset used in the state/UT ranking and national residence table |
| Census 2011 final PCA | **2011**, historical Census geography, age 7+ | Original final PCA release date/year **not independently established**; not inferred from catalog/archive dates | Separate historical national/state context; computed from original final counts |
| Census 2011 provisional presentation | **2011**, age 7+ | **31 March 2011**, slide 44 | Explains why 74.04% must not be called the final rate |
| Samagra Shiksha overview | School-education programme design | Undated current Ministry overview | Objectives only |
| NEP 2020 | Policy **2020** | Policy year 2020; later migrated PDF path is not a new policy date | Original FLN aim and adult-education priorities, not achieved targets |
| ULLAS/NILP parliamentary reply | Age 15+ adult learning; FY 2022-23 to FY 2026-27 | **29 March 2023** | Eligibility and five components |
| Ministry full-literacy explanation | Separate programme benchmark | **28 August 2024** | 95% designation, not literal 100% or a PLFS observation |
| Tripura declaration explanation | Separate age-15-plus declaration | **23 June 2025** | Age/method comparability caution, not a replacement table row |
| PM SHRI approval | School programme objectives | **7 September 2022** | Selected exemplar schools/mentoring, not attributed literacy gains |
| Current NIPUN parliamentary reply | Early-years foundational learning | **27 July 2026** | General current FLN objective; avoids unqualified older grade-target wording |

Direct primary URLs, table/PDF/workbook coordinates, definitions, sample counts, coverage, hashes and the full comparison matrix are in `data.json`; the article's visible bibliography is defined in `seo.ts` (`literacySources`). No third-party statistics aggregator supplied a rate.

Recency research also inspected PLFS 2023-24 (July 2023-June 2024, released 23 September 2024), the PLFS 2024 key-indicator report, CMS Education April-June 2025 (released 26 August 2025), 2026 NSS Health/Tourism publications, Women and Men in India 2025 (published 29 April 2026 but reusing older literacy data), the July-September 2026 PLFS quarterly bulletin and October 2026 monthly bulletin. Relevant original files among 83 official 2026 publication records did not provide a newer comparable all-36 literacy table. Full source URLs/evidence are preserved in `data.json.recency_audit`.

### Statistical Verification

- Research compared **660 numeric cells and six blank cells** between plain PDF, layout PDF and original XLSX, including adjacent age-five-plus columns to prevent substitution.
- The project's acceptance test independently decoded the downloaded official XLSX ZIP/XML, checked its SHA-256, all **330 selected age-seven-plus numeric cells**, source row names in all panels and rural Chandigarh's genuine blanks.
- All **108 state/UT percentages rendered in the main table** match the verified combined panel. Nine national residence/gender cells and derived gaps also agree.
- All-India Table (7) figures were cross-checked against repetitions in Tables (47) and (49).
- Final Census national rates and historical Kerala/Bihar percentages were recalculated from matching literate and age-seven-plus counts. The archived exact official workbook used for the additional state check has recorded digest verification and national-count agreement; the official live URLs also returned 200 in the final link audit.
- No microdata re-estimation is claimed. No unverified literacy-specific confidence interval, population headcount, causal programme effect, growth-series subtraction or forecast year is published.
- Both the narrative and FAQ now disclose PLFS's exclusion of not-reported cases. Survey rates are weighted estimates, not sample headcounts or unweighted state averages.

## Architecture and Draft Safety

The project is Next.js App Router with a hard-coded public blog array in `src/config/blog.ts`, not WordPress or an external CMS. Its client listings import the whole array, and the detail route/static parameters/sitemap include all entries. There is no existing draft flag.

The article stays in this separate source directory, outside the public array and outside public assets. A development-only server preview and guarded image endpoint load it only after development-mode checks. The local preview server is bound to `127.0.0.1`.

Production testing caught Next.js's streamed `notFound()` soft-404 behavior: the body was hidden, but a page response could still be HTTP 200. A narrowly scoped guard in the existing `src/proxy.ts` now rejects the draft preview and reserved public article path before rendering. The preview, image and public article URL all returned actual **404** responses in the final local production-mode audit.

The public blog, sitemap and existing static-article list remain unchanged. The audit scanned **90 production browser JS chunks** without finding the draft headline or dataset ID. The original donation alias's 308 redirect chain and query preservation passed regression checks. Host checks are defense in depth; loopback binding is the actual local-network restriction, not a substitute for a general CMS authentication system.

The existing root NGO/WebSite schema and global metadata were not rewritten. There is no existing Organization `@id`; none was invented. The new Article's minimal embedded publisher identity matches the real NGO's name and URL, without copying unrelated addresses, founding dates or social values. No person, qualification, author approval or publication date was fabricated. This is not a general cleanup of pre-existing site-wide schema.

The new article uses semantic JSX rather than the existing regex Markdown renderer, whose table/list processing cannot provide the required accessibility semantics. No dependencies or package files were added or changed.

## Internal Links Checked

These existing live pages returned article/page content during research:

- `/about/`: SCES's educational mission, without reusing unverified organizational impact figures.
- `/blog/international-literacy-day-help-a-child-learn-to-read/`: practical reading support.
- `/blog/childrens-education-support-children-in-delhi/`: educational access context.
- `/blog/education-the-ultimate-weapon-against-poverty/`: education and poverty discussion, not a statistical source.
- `/blog/transforming-education-through-technology/`: digital learning context, not a source of national figures.
- `/volunteer/`: actual teaching/tutoring opportunities.

Five existing destinations were actually linked: `/about/` in the genuine organization/preparation line; the reading-support article in the literacy definition section; children's education in Delhi and digital learning access in the barriers section; and `/volunteer/` in practical next steps. The education/poverty article was inspected but not added merely to increase link count. All five destinations returned 200 after normal redirects.

There are **15 distinct external citation resources**: 14 original government sources plus one preserved copy of an exact official Census workbook. Combined with the five internal destinations, the final HTTP audit verified **20 distinct editorial resources**, all returning 200. PDF page fragments are not separate HTTP resources. PIB rejected HEAD with 401 but public GET requests succeeded; the checker handles that method difference and does not misclassify it as a credential requirement. A transient PM India connection failure was resolved by subsequent checks. No broken or blocked editorial resource remained in the final full run.

No `nofollow` or `sponsored` attributes were added to ordinary editorial citations, and no forced new-tab links were added. Native same-page anchors and Next.js internal links render crawlable `<a href>` markup.

## Future Topic Cluster

These are proposed supporting articles, not current URLs or links in the article:

1. Female Literacy in India: Reading State-Wise Gender Gaps Correctly.
2. Rural Education in India: School Access, Attendance and Learning Outcomes.
3. Census vs PLFS vs NSS: How to Interpret Indian Education Statistics.
4. ULLAS and Adult Literacy: Who It Serves and What Full Literacy Means.
5. Reading Comprehension vs Decoding: A Parent's Guide to Foundational Learning.

## Image and Schema Decisions

No existing image-generation workflow was found. An original open-book/statistical-bar visual was created and rasterized using the already-installed Sharp tooling. It is **1200 x 630 pixels, 34,297 bytes**, with six verified state bars on a zero-to-100 scale and the verified national 81.1% estimate. The PNG stays outside `public`; a guarded development endpoint serves it.

The featured alt text is `Open book and zero-based bars comparing literacy rates in six Indian states using PLFS 2025 estimates for people aged seven and above`. Its title is `Literacy in Indian states: PLFS 2025 comparison`. The visible caption identifies age, combined sectors, point estimates and the Census distinction. The SVG is the editable original; the PNG is the social-card asset.

A map variant remains a concept requiring a rights-cleared, accurate cartographic asset. Survey of India's current copyright policy requires written reproduction permission, so no outline was copied: `https://surveyofindia.gov.in/pages/copyright-policy`. No map-generation or permission acquisition is claimed.

The implemented new schemas are **Article and BreadcrumbList**, in one script-safe JSON-LD graph. The Article headline matches the H1; its preview URL and image match the actual local page. Eight FAQ answers are visible without FAQPage markup. Google's current documentation changelog records FAQ rich-result retirement from **7 May 2026** and documentation removal in June 2026; the former government/health eligibility advice is no longer current.

Structured data is descriptive, not a rich-result or ranking guarantee. Draft creation/modification dates can be accurate without asserting a datePublished. The approved first publication date and actual responsible author/reviewer remain editorial decisions before eventual publication.

JSON syntax, graph types, single-instance counts, publisher identity, headline, image URL/dimensions, dates and breadcrumb ordering passed local assertions. `<` is escaped in the JSON-LD serializer, including a tested `</script>` fixture. No new Person or standalone Organization graph was fabricated, and no FAQ graph or duplicate metadata was emitted.

The preview has fixed `dateCreated`/`dateModified` of **2026-11-19**, matching the actual preparation/editing day and visible research date. It has no `datePublished` or author schema. Publication-mode factories require explicitly supplied author and dates and were tested using clearly synthetic inputs that are never used by the actual draft.

An external Google Rich Results Test on a live article was not run because the article is intentionally unpublished and the preview is loopback-only/noindex. Local syntax/semantic validation is not represented as a Google eligibility certification.

Google guidance consulted:

- `https://developers.google.com/search/docs/essentials`
- `https://developers.google.com/search/docs/fundamentals/creating-helpful-content`
- `https://developers.google.com/search/docs/appearance/structured-data/article`
- `https://developers.google.com/search/docs/appearance/publication-dates`
- `https://developers.google.com/search/docs/appearance/structured-data/sd-policies`
- `https://developers.google.com/search/updates`

## Baseline Verification

Before any article files were added:

- `npm run type-check -- --incremental false`: failed with 29 pre-existing diagnostics outside this draft.
- `npm run lint`: failed with 83 errors and 44 warnings in existing files.
- `git status --short`: clean.
- Next.js production builds are configured to ignore TypeScript errors; build success alone cannot prove type safety.

These unrelated baseline issues were not silently fixed or represented as article regressions. Post-change TypeScript checking still reports the same 29 existing diagnostics and no draft/proxy diagnostics. Scoped ESLint passed for all seven changed code/test paths with no errors or warnings. The existing project-wide lint baseline is still a separate known limitation, not a claim of full repository lint health.

## Final Verification

| Check | Result |
| --- | --- |
| Original official workbook SHA-256, row names and 330 selected numeric cells | Passed |
| Main table's 108 cells, source year, descending order and competition ties | Passed |
| National residence table and percentage-point arithmetic | Passed |
| Census final/provisional separation and historical-state arithmetic | Passed |
| One H1, unique IDs, H2/H3 hierarchy, eight FAQs | Passed |
| Table captions, column/row scopes and named focusable scroll regions | Passed |
| Mobile/desktop Chrome at 320, 375 and 1440 pixels | Passed; no article/page horizontal overflow; table-local overflow at narrow widths |
| Keyboard horizontal table scrolling | Passed at both mobile widths |
| All 14 TOC anchor clicks | Passed; targets land below the fixed header |
| Featured PNG and SVG scale/data consistency | Passed; 1200 x 630 and six zero-based state bars |
| Open Graph/X metadata and new schema instance counts | Passed; no duplicate new metadata/schema or unverified creator handle |
| JSON-LD syntax, visibility consistency and script-safe serialization | Passed locally |
| Every distinct editorial HTTP resource | Passed; 20/20 successful, including public GET fallback for PIB |
| Production draft, image and reserved public URL | Actual 404, body absent |
| Production blog/sitemap/browser JS exclusion | Passed; 90 browser chunks scanned |
| Existing published-article indexing and donation redirect/query regression | Passed |
| Scoped lint | Passed |
| Local `npm run build` | Passed; TypeScript validation skipped by existing project configuration |
| Full repository TypeScript/lint | Known pre-existing baseline limitations; not falsely reported clean |
| Independent editorial/fact-consistency review | No statistical/causal/author/date mismatches; low-priority wording qualifications incorporated |

Browser exceptions were empty. Third-party analytics/fonts/payment scripts were blocked during automated browser validation so the audit did not send production tracking/payment requests; original site integrations were not modified. No Lighthouse/Core Web Vitals score or Google ranking guarantee is claimed.

Final screenshot/metrics evidence: `C:\Users\Asus\AppData\Local\Temp\kilo\literacy-browser-VndUp4\`. Downloaded primary-source verification input: `C:\Users\Asus\AppData\Local\Temp\kilo\literacy_PLFS_2025_Table_7_official.xlsx`. Larger research downloads remain in the approved temporary directory, not the project or public assets.

### Reproducible Commands

Run from `sces-website`. The full acceptance command below is the command actually used for the 12-test passing run.

```powershell
node "scripts/prepare-literacy-image.mjs"
npm run dev -- --hostname 127.0.0.1 --port 3100
npm run build
npm run start -- --hostname 127.0.0.1 --port 3101
node "tests/literacy-article.test.mjs" --source-workbook "C:\Users\Asus\AppData\Local\Temp\kilo\literacy_PLFS_2025_Table_7_official.xlsx" --base-url "http://127.0.0.1:3100" --production-url "http://127.0.0.1:3101" --check-links
```

The two servers are separate processes; the commands are listed as a workflow, not instructions to run a second server behind a foreground one. No deploy, Git commit, push, remote upload, or CMS publish command was run.

## Publication Handoff

Still required before public publication: explicit publication/deployment authorization, the actual responsible author or genuinely approved organization byline, human editorial sign-off, the fixed first publication date and accurate modification date. Real site author profiles exist, but none was assigned without approval.

The first release date/year of the final Census 2011 PCA was not independently established. It is explicitly marked unknown, not guessed from the archive/catalog. Its rates and reference year are verified; that metadata limitation must remain transparent unless a dated original release is obtained.

After authorization, promote the server-rendered article into a canonical `/blog/literacy-rate-in-india-state-wise/` page using `createLiteracyMetadata`, `createLiteracySchema` and the same `PublicationDetails` for its visible byline/dates. Retain semantic JSX rather than routing these tables through the legacy regex Markdown parser. Place the prepared PNG at its stated public asset destination only at that stage, and supply that path to the article renderer.

Remove only the reserved public-article guard/matcher from `src/proxy.ts` when that real published page is ready; keep production denial for the editorial preview/image. Add the approved listing/discovery record through `src/config/blog.ts` with accurate author/date values and include the canonical in the sitemap. Recheck its single canonical, image availability, metadata, article/breadcrumb schema and actual indexability on the real URL after publication. Do not add FAQPage merely for Google rich results.

For future statistics updates, reverify the reference period, methodology, coverage, the unversioned government workbook URL and its hash, every table/prose/FAQ/image value and relevant policy guidance. Do not merely change the year or refresh `dateModified` without meaningful work.

## File Inventory

All paths below are relative to `sces-website`.

| Operation | File | Purpose |
| --- | --- | --- |
| Created | `src/content/drafts/literacy-rate-in-india/article.tsx` | Complete server-rendered article, accessible tables/chart, TOC, eight FAQs, contextual links and bibliography |
| Created | `src/content/drafts/literacy-rate-in-india/article.module.css` | Scoped brand-consistent typography, mobile scrolling, chart and focus styles |
| Created | `src/content/drafts/literacy-rate-in-india/data.json` | Verified 36-area matrix, national splits, source/version/method notes, hashes, Census context and recency evidence |
| Created | `src/content/drafts/literacy-rate-in-india/seo.ts` | Exact metadata, direct-source bibliography, publication inputs and Article/BreadcrumbList serializers |
| Created | `src/content/drafts/literacy-rate-in-india/literacy-rate-in-india-state-wise-plfs-2025.svg` | Original, verified, zero-based featured-image artwork |
| Created | `src/content/drafts/literacy-rate-in-india/literacy-rate-in-india-state-wise-plfs-2025.png` | Generated optimized 1200 x 630 social-card raster, kept outside public assets |
| Created | `src/content/drafts/literacy-rate-in-india/SEO-AUDIT.md` | Keyword mapping, research/SEO/technical/quality results and publication handoff |
| Created | `src/app/demo/literacy-rate-in-india/page.tsx` | Development/loopback preview, truthful draft notice, breadcrumb and safe schema injection |
| Created | `src/app/demo/literacy-rate-in-india/featured-image/route.ts` | Development-only, no-store/noindex image response |
| Created | `scripts/prepare-literacy-image.mjs` | Reproducible raster generation with verified-data and scale assertions |
| Created | `tests/literacy-article.test.mjs` | Source-cell, rendering, metadata/schema, browser, links and production-exclusion acceptance tests |
| Modified | `src/proxy.ts` | Scoped pre-render draft/reserved-URL denial; original donation aliases preserved |
