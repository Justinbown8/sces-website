import Image from 'next/image';
import Link from 'next/link';
import data from './data.json';
import { literacySEO, literacySources, type PublicationDetails } from './seo';
import styles from './article.module.css';

export const rankedLiteracyRows = [...data.rows].sort((a, b) =>
  b.combined[0] - a.combined[0] || a.name.localeCompare(b.name, 'en')
);
export const comparisonStates = [
  ...rankedLiteracyRows.filter(row => row.type === 'State').slice(0, 3),
  ...rankedLiteracyRows.filter(row => row.type === 'State').slice(-3),
];

const outline = [
  ['understanding-literacy', 'Understanding literacy'],
  ['data-methodology', 'Sources, years and methodology'],
  ['state-wise-literacy', 'State-wise and UT table'],
  ['highest-literacy', 'Highest literacy rate'],
  ['lowest-literacy', 'Lowest literacy rate'],
  ['gender-gap', 'Male and female literacy'],
  ['rural-urban-gap', 'Rural and urban literacy'],
  ['regional-trends', 'Regional comparisons'],
  ['literacy-barriers', 'Barriers to literacy'],
  ['government-initiatives', 'Government initiatives'],
  ['future-literacy', 'Challenges and next steps'],
  ['literacy-faqs', 'Frequently asked questions'],
  ['literacy-conclusion', 'Conclusion'],
  ['literacy-sources', 'Sources and references'],
] as const;

const census = data.census_2011_reference_not_mixed_into_main_dataset;
const formatDate = (date: string) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata',
}).format(new Date(date));

export default function LiteracyArticle({
  imagePath,
  publication,
}: {
  imagePath: string;
  publication?: PublicationDetails;
}) {
  return (
    <article id="literacy-article" className={styles.article} aria-labelledby="literacy-title">
      <header className={styles.header}>
        <p className={styles.eyebrow}>Education statistics | Literacy</p>
        <h1 id="literacy-title">{literacySEO.headline}</h1>
        <div className={styles.byline}>
          {publication ? (
            <>
              <p>By <a href={publication.author.url}>{publication.author.name}</a></p>
              <p>
                Published <time dateTime={publication.datePublished}>{formatDate(publication.datePublished)}</time>
                {' | '}Updated <time dateTime={publication.dateModified}>{formatDate(publication.dateModified)}</time>
              </p>
            </>
          ) : (
            <p>Prepared for <Link href="/about/" prefetch={false}>Sunrise Children Educational Society</Link>. Human editorial review pending.</p>
          )}
          <p>Research checked: <time dateTime={data.research_as_of}>{formatDate(data.research_as_of)}</time>. Statistical reference period: January-December 2025.</p>
        </div>
      </header>

      <figure className={styles.featured}>
        <Image
          src={imagePath}
          alt={literacySEO.imageAlt}
          title={literacySEO.imageTitle}
          width={1200}
          height={630}
          priority
          unoptimized
        />
        <figcaption>{literacySEO.imageCaption} Source: <a href={data.sources.main_pdf_url}>NSO Table (7)</a>.</figcaption>
      </figure>

      <div data-article-copy>
        <p>
          The <strong>literacy rate in India is {data.all_india.combined[0].toFixed(1)}%</strong> for people aged seven and above in
          the <a href={data.sources.main_pdf_url}>Periodic Labour Force Survey (PLFS) 2025</a>. This is the newest comprehensive
          official state-wise literacy dataset independently verified for this article as of 19 November 2026. It covers
          January-December 2025 and was released in March 2026. <strong>It is a survey estimate, not a new Census literacy rate.</strong>
        </p>
        <p>
          Reading and writing help people use classroom instructions, workplace notices, health information and public services.
          Literacy is therefore relevant to education, economic participation and social inclusion. But a national percentage
          can conceal unequal access. This guide compares all 28 states and eight Union Territories, then examines gender and
          residence gaps without treating literacy as a substitute for educational attainment or learning quality.
        </p>

        <nav className={styles.toc} aria-label="Article table of contents">
          <p><strong>On This Page</strong></p>
          <ol>{outline.map(([id, label]) => <li key={id}><a href={`#${id}`}>{label}</a></li>)}</ol>
        </nav>

        <section aria-labelledby="understanding-literacy">
          <h2 id="understanding-literacy">Understanding Literacy Rate in India</h2>
          <p>
            PLFS defines a literate person as someone who can both read and write a simple message with understanding in at
            least one language. The <a href={`${data.sources.main_pdf_url}#page=549`}>survey definition in Appendix C, paragraph 2.4</a>
            {' '}does not require a school certificate. The <a href={literacySources[5].url}>Census 2011 instructions</a> similarly
            require reading and writing with understanding; reading alone or merely signing a name is insufficient.
          </p>
          <p className={styles.formula}>
            Literacy rate (%) = 100 x literate people aged 7+ / total people aged 7+
          </p>
          <p>
            For a survey, these are weighted estimated totals, not an unweighted count of interviewed respondents. Both numerator
            and denominator must refer to the same age group and population. Children younger than seven are excluded from this
            effective literacy rate; dividing by the entire all-age population would produce a different indicator.
            {' '}PLFS percentage estimates also exclude not-reported cases, as its
            {' '}<a href={`${data.sources.main_pdf_url}#page=38`}>estimation note</a> explains.
          </p>
          <p>
            Literacy is not the same as school enrolment, years of education, graduation, numeracy or digital proficiency. Someone
            can learn to read outside formal schooling, while school attendance alone does not establish reading comprehension.
            Parents interested in practice rather than population statistics can explore SCES&apos;s guide to
            {' '}<Link href="/blog/international-literacy-day-help-a-child-learn-to-read/" prefetch={false}>helping a child learn to read</Link>.
          </p>
        </section>

        <section aria-labelledby="data-methodology">
          <h2 id="data-methodology">Which Data Is Used, and How Was It Checked?</h2>
          <p>
            The main table uses only the <strong>age-seven-plus, rural-plus-urban panel of PLFS 2025 Table (7)</strong>, published
            by NSO under MoSPI. The <a href={data.sources.original_press_note_url}>official release note</a> is dated
            27 March 2026. We used the revised PDF file dated 29 May 2026; a separate revision-announcement date was not verified.
            Publication year 2026 must not be confused with the survey reference year 2025.
          </p>
          <p>
            Percentages were cross-checked against the <a href={data.sources.original_table_xlsx_url}>original government workbook</a>.
            {' '}PLFS sampled 270,472 households and 1,148,634 people across all ages; these are sample counts, not the seven-plus
            denominator or India&apos;s population. Coverage excludes extremely difficult-to-access villages in the Andaman and
            Nicobar Islands. Rural Chandigarh is absent from the survey frame, not assigned a zero rate.
          </p>
          <p>
            Rankings below are our descending order of rounded point estimates, not an official league table or a test of
            statistically significant differences. Equal published percentages share a rank. Small territories warrant particular
            caution, and national totals are weighted estimates, not averages of state percentages. Persons totals include all
            reported genders; the male and female columns are the categories published separately by NSO.
          </p>
          <h3 id="census-versus-survey">Census Figures and Survey Estimates Are Different</h3>
          <p>
            The final Census 2011 national effective literacy rate is <strong>{census.final_pca_rates_percent.combined[0].toFixed(2)}%</strong>,
            {' '}calculated from the <a href={census.final_source_xlsx_url}>final Primary Census Abstract</a> counts.
            The often-repeated <strong>74.04%</strong> belongs to the <a href={census.provisional_source_pdf_url}>2011 provisional results</a>.
            {' '}Neither is a 2026 observation. The final PCA&apos;s original release date was not independently established here;
            its statistical reference remains 2011.
          </p>
          <p>
            <a href={literacySources[6].url}>Census 2027 has been announced</a>, but enumeration notices are not newly released
            literacy results. PLFS also changed its sampling and estimation design in January 2025 and explicitly warns that
            its 2025 estimates may not be strictly comparable with earlier PLFS reports. Do not turn the difference between
            two Census/survey percentages into an exact growth claim, or mix their geographical boundaries in one ranking.
          </p>
        </section>

        <section aria-labelledby="state-wise-literacy">
          <h2 id="state-wise-literacy">State-Wise Literacy Rate in India: All States and UTs</h2>
          <p>
            All 36 current jurisdictions appear below. State and UT status is explicit: Delhi is a UT, Jammu and Kashmir and
            Ladakh have separate rows, and Dadra and Nagar Haveli and Daman and Diu is one merged UT. None has been backfilled
            using Census 2011 boundaries. <strong>India&apos;s national benchmark is 81.1%, not a ranked jurisdiction.</strong>
          </p>
          <p id="state-table-note" className={styles.note}>
            Rank compares states and UTs together using the same dataset. Ties share competition ranks, so the following rank
            is skipped. Rates are percentages, rounded to one decimal. On a narrow screen, focus the table and scroll horizontally.
          </p>
          <div className={styles.tableScroll} role="region" aria-labelledby="state-table-caption" aria-describedby="state-table-note" tabIndex={0}>
            <table id="state-literacy-table">
              <caption id="state-table-caption">State and UT literacy: PLFS 2025, January-December 2025, age 7+, rural and urban combined</caption>
              <thead><tr>
                <th scope="col">Rank</th><th scope="col">State / Union Territory</th><th scope="col">Type</th>
                <th scope="col">Overall (%)</th><th scope="col">Male (%)</th><th scope="col">Female (%)</th>
                <th scope="col">Source / Reference Period</th>
              </tr></thead>
              <tbody>{rankedLiteracyRows.map(row => (
                <tr key={row.name} data-area={row.name}>
                  <td className={styles.number}>{rankedLiteracyRows.findIndex(other => other.combined[0] === row.combined[0]) + 1}</td>
                  <th scope="row">{row.name}</th><td>{row.type}</td>
                  {row.combined.map((rate, index) => <td className={styles.number} key={index}>{rate.toFixed(1)}</td>)}
                  <td className={styles.sourceCell}><a href="#source-plfs-table">PLFS 2025</a><br />Jan-Dec 2025</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <p className={styles.note}>
            Source: <a href={`${data.sources.main_pdf_url}#page=87`}>NSO Table (7), printed page A-10 / PDF page 87</a>.
            {' '}All overall, male and female values come from this single combined panel.
          </p>
          <figure className={styles.chart} aria-labelledby="comparison-caption">
            <p><strong>Three Highest and Three Lowest States</strong></p>
            <div className={styles.chartAxis} aria-hidden="true"><span>0</span><span>25</span><span>50</span><span>75</span><span>100%</span></div>
            <ol>{comparisonStates.map((row, index) => (
              <li className={styles.chartRow} key={row.name}>
                <span>{row.name}</span>
                <span className={styles.track} aria-hidden="true"><span className={index < 3 ? styles.highBar : styles.lowBar} style={{ width: `${row.combined[0]}%` }} /></span>
                <span className={styles.number}>{row.combined[0].toFixed(1)}%</span>
              </li>
            ))}</ol>
            <figcaption id="comparison-caption">
              Same-period state point estimates, excluding UTs. Every bar uses a zero-to-100 scale; small differences are not
              necessarily statistically significant. Source: <a href={data.sources.original_table_xlsx_url}>PLFS 2025 Table (7)</a>.
            </figcaption>
          </figure>
        </section>

        <section aria-labelledby="highest-literacy">
          <h2 id="highest-literacy">Which Indian State Has the Highest Literacy Rate?</h2>
          <p>
            <strong>Mizoram leads states at 99.8% in PLFS 2025</strong>. Its male and female estimates are both 99.8% at the
            published precision. Kerala follows at 95.6%, then Nagaland at 94.5%. Among UTs, <strong>Puducherry leads at 94.7%</strong>,
            {' '}ahead of Lakshadweep&apos;s 93.8%. These answers come from the same age-seven-plus table.
          </p>
          <p>
            For a question specifically about <em>Census 2011</em>, Kerala was the leading state at 94.00% under that Census&apos;s
            geography. That historical answer remains valid, but it is not the leading-state answer for the newer PLFS series.
            A programme&apos;s &quot;full literacy&quot; declaration is another, separately defined indicator.
          </p>
        </section>

        <section aria-labelledby="lowest-literacy">
          <h2 id="lowest-literacy">Which Indian State Has the Lowest Literacy Rate?</h2>
          <p>
            <strong>Andhra Pradesh is lowest among states at 71.4% in PLFS 2025</strong>. Bihar follows at 73.1% and Rajasthan
            at 74.0%. Andhra Pradesh&apos;s male estimate is 77.7% and female estimate 65.5%. Among UTs, Jammu and Kashmir is
            lowest at 79.4%.
          </p>
          <p>
            Bihar was the lowest state in final Census 2011 figures at 61.80%; that is a different-period answer.
            Low population literacy does not mean every school in a state performs poorly, and it cannot by itself diagnose
            current classroom quality, dropout or the reasons individuals missed schooling.
          </p>
        </section>

        <section aria-labelledby="gender-gap">
          <h2 id="gender-gap">Male vs Female Literacy Rate in India</h2>
          <p>
            The national <strong>male literacy rate is 87.5%</strong> and <strong>female literacy rate is 74.9%</strong> in PLFS 2025.
            {' '}The difference is <strong>12.6 percentage points</strong>. This is a subtraction of two rates, not a relative
            percentage increase or a count of people.
          </p>
          <p>
            Rajasthan has the widest state gender gap: 84.5% male versus 63.7% female, a 20.8-point difference. Ladakh&apos;s
            89.1% versus 71.7% gives the widest UT gap, 17.4 points. Mizoram&apos;s published male and female rates are equal,
            while Kerala&apos;s 96.9% and 94.4% differ by 2.5 points. Equality after rounding does not prove exact equality in the
            underlying population.
          </p>
          <p>
            Because the indicator includes older adults, disparities reflect accumulated differences across generations,
            not only today&apos;s pupils. Improving girls&apos; schooling and supporting women who missed school are complementary
            tasks, but these cross-sectional percentages do not establish the effect of any particular intervention.
          </p>
        </section>

        <section aria-labelledby="rural-urban-gap">
          <h2 id="rural-urban-gap">Rural vs Urban Literacy in India</h2>
          <div className={styles.tableScroll} role="region" aria-labelledby="residence-caption" tabIndex={0}>
            <table id="residence-literacy-table">
              <caption id="residence-caption">India literacy by residence: PLFS 2025, January-December 2025, age 7+, percentages</caption>
              <thead><tr><th scope="col">Residence</th><th scope="col">Overall (%)</th><th scope="col">Male (%)</th><th scope="col">Female (%)</th></tr></thead>
              <tbody>{(['rural', 'urban', 'combined'] as const).map(sector => (
                <tr key={sector} data-sector={sector}>
                  <th scope="row">{sector === 'combined' ? 'Rural + Urban' : sector === 'rural' ? 'Rural' : 'Urban'}</th>
                  {data.all_india[sector].map((rate, index) => <td key={index} className={styles.number}>{rate.toFixed(1)}</td>)}
                </tr>
              ))}</tbody>
            </table>
          </div>
          <p>
            Urban literacy is 89.0%, compared with 77.4% in rural areas: an <strong>11.6-point gap</strong>.
            Rural women&apos;s 70.3% and urban women&apos;s 84.8% differ by 14.5 points. Within rural areas, the male-female gap
            is 14.5 points; within urban areas it is 8.3. Residence and gender therefore need to be examined together.
          </p>
          <p>
            Telangana has the largest state residence gap in this table: 86.0% urban versus 66.4% rural, or 19.6 points.
            Do not assume urban areas always lead: Lakshadweep&apos;s rural estimate is 97.4%, above its urban 93.0%.
            Such small-area estimates require the sampling cautions described earlier. Source:
            {' '}<a href={`${data.sources.main_pdf_url}#page=85`}>Table (7), rural and urban panels</a>.
          </p>
        </section>

        <section aria-labelledby="regional-trends">
          <h2 id="regional-trends">Regional Literacy Trends Across India</h2>
          <p>
            Regional labels can hide considerable variation. The following are illustrative state comparisons from PLFS 2025,
            not official regional averages or claims that geography causes literacy outcomes:
          </p>
          <ul>
            <li><strong>South:</strong> Kerala&apos;s 95.6% and Tamil Nadu&apos;s 87.2% contrast with Telangana&apos;s 74.6% and Andhra Pradesh&apos;s 71.4%. A blanket &quot;high-literacy South&quot; description misses these differences.</li>
            <li><strong>Northeast:</strong> Mizoram has 99.8%, Nagaland 94.5%, Meghalaya 93.0% and Arunachal Pradesh 86.4%. The published state estimates vary.</li>
            <li><strong>North and north-central examples:</strong> Himachal Pradesh has 89.8%, Uttarakhand 84.6%, Punjab 82.2% and Uttar Pradesh 77.2%.</li>
            <li><strong>East:</strong> West Bengal&apos;s 84.6% exceeds Odisha&apos;s 80.6%, Jharkhand&apos;s 79.5% and Bihar&apos;s 73.1%.</li>
            <li><strong>West and central examples:</strong> Goa records 92.9%, Maharashtra 88.0%, Gujarat 84.5%, Chhattisgarh 81.1% and Madhya Pradesh 77.4%.</li>
          </ul>
          <p>
            A simple average of these state percentages would give small and large states equal weight. It would not be a
            population-weighted regional literacy rate. Age composition, residence and gender distributions also matter when
            interpreting differences; the table alone cannot separate their contributions.
          </p>
        </section>

        <section aria-labelledby="literacy-barriers">
          <h2 id="literacy-barriers">Factors Affecting Literacy Rates in India</h2>
          <p>
            The literacy table describes differences, not their causes. <a href={literacySources[8].url}>NEP 2020</a> and
            {' '}<a href={literacySources[7].url}>Samagra Shiksha</a> identify access, inclusion and learning support as policy
            priorities. When assessing a local community, relevant questions include:
          </p>
          <ul>
            <li><strong>School access and infrastructure:</strong> Are schools reachable, buildings accessible, and facilities appropriate for girls and children with disabilities?</li>
            <li><strong>Poverty and time costs:</strong> Can families manage transport, materials, irregular work schedules and the time needed for continued study?</li>
            <li><strong>Gender inequality:</strong> Do girls and adult women have safe, practical opportunities to attend, return to education and practise reading?</li>
            <li><strong>Teacher availability and support:</strong> Is sustained instruction available, with training and help for learners who fall behind or speak a different home language?</li>
            <li><strong>Digital accessibility:</strong> Are devices, connectivity, accessible formats and suitable learning materials available, rather than merely an online portal?</li>
          </ul>
          <p>
            These are needs to investigate, not explanations proven for every low-ranked state. SCES&apos;s discussions of
            {' '}<Link href="/blog/childrens-education-support-children-in-delhi/" prefetch={false}>supporting children&apos;s education in Delhi</Link> and
            {' '}<Link href="/blog/transforming-education-through-technology/" prefetch={false}>digital learning access</Link> provide local context;
            they are not sources for national literacy estimates.
          </p>
        </section>

        <section aria-labelledby="government-initiatives">
          <h2 id="government-initiatives">Government Initiatives to Improve Literacy</h2>
          <h3>Samagra Shiksha</h3>
          <p>
            <a href={literacySources[7].url}>Samagra Shiksha</a> treats school education as a continuum from pre-school to senior
            secondary. Its objectives include access, equity, inclusion, learning outcomes, foundational literacy and numeracy,
            and teacher capacity. These describe intended support, not measured effects on the state ranking.
          </p>
          <h3>National Education Policy 2020 and NIPUN Bharat</h3>
          <p>
            <a href={literacySources[8].url}>NEP 2020</a> prioritises foundational reading, writing and numeracy and adult education.
            Its original universal-FLN goal for 2025 is a policy target, not confirmation of achievement.
            {' '}<a href={literacySources[13].url}>NIPUN Bharat</a>{' '}supports early-years foundational learning under Samagra Shiksha.
            A population literacy percentage and a child&apos;s assessed foundational proficiency should not be treated as the same result.
          </p>
          <h3>ULLAS / New India Literacy Programme</h3>
          <p>
            The <a href={literacySources[9].url}>New India Literacy Programme</a>, known as ULLAS, targets non-literate people
            aged 15 and above during FY 2022-23 to FY 2026-27. Its five components are foundational literacy and numeracy,
            critical life skills, vocational skills development, basic education and continuing education. This extends adult
            learning beyond recognising letters, including practical financial and digital skills.
          </p>
          <h3>PM SHRI</h3>
          <p>
            <a href={literacySources[12].url}>PM SHRI</a> is intended to develop selected existing schools as examples of NEP
            implementation, with quality, equitable and inclusive education and mentoring for neighbouring schools.
            Its planned activities do not establish that it caused a change in population literacy.
          </p>
          <h3>What Does &quot;Full Literacy&quot; Mean?</h3>
          <p>
            The <a href={literacySources[10].url}>Ministry&apos;s full-literacy benchmark</a> allows 95% to count as fully literate,
            not literal 100%. The <a href={literacySources[11].url}>Tripura declaration</a> explicitly concerns the age-15-plus
            benchmark. Programme surveys, assessments and declarations can have different age coverage and methods, so their
            figures are not substituted into this age-seven-plus PLFS ranking.
          </p>
        </section>

        <section aria-labelledby="future-literacy">
          <h2 id="future-literacy">Challenges and the Future of Literacy in India</h2>
          <p>
            The central challenge is not simply raising a headline percentage: it is reaching people missed by earlier schooling
            while helping children develop usable comprehension. Adult learning needs practical schedules and continued practice;
            foundational teaching needs regular feedback, suitable languages and materials, and support for learners with disabilities.
          </p>
          <p>
            Future monitoring should report age, gender and residence breakdowns, document survey-design changes, and keep Census,
            school-enrolment, learning-assessment and programme-certification data distinct. Until comparable evidence is available,
            neither a universal-literacy forecast year nor a scheme&apos;s claimed contribution should be inferred from two rates.
            Readers seeking practical involvement can find real <Link href="/volunteer/" prefetch={false}>SCES teaching and tutoring opportunities</Link>;
            that local action should not be presented as proof of a nationwide statistical effect.
          </p>
        </section>

        <section id="literacy-faqs" aria-labelledby="faq-heading">
          <h2 id="faq-heading">Frequently Asked Questions</h2>
          <h3>What is the literacy rate in India?</h3>
          <p>PLFS 2025 estimates 81.1% for people aged seven and above, referring to January-December 2025. Final Census 2011 records 72.98%; the figures come from different methods and periods.</p>
          <h3>Which Indian state has the highest literacy rate?</h3>
          <p>Mizoram leads PLFS 2025 at 99.8%. Kerala was highest in final Census 2011 at 94.00%. Specify the dataset when answering.</p>
          <h3>Which state has the lowest literacy rate in India?</h3>
          <p>Andhra Pradesh is lowest in PLFS 2025 at 71.4%. Bihar was lowest under final Census 2011 geography at 61.80%. These are not interchangeable rankings.</p>
          <h3>What are the male and female literacy rates in India?</h3>
          <p>For age seven-plus in PLFS 2025, male literacy is 87.5% and female literacy is 74.9%, a 12.6-percentage-point gap.</p>
          <h3>Which Union Territory has the highest literacy rate?</h3>
          <p>Puducherry leads UTs at 94.7% in PLFS 2025, followed by Lakshadweep at 93.8%. This is the same reference period used for the state table.</p>
          <h3>How is India&apos;s literacy rate calculated?</h3>
          <p>Divide literate people aged seven-plus by the corresponding seven-plus population and multiply by 100. PLFS uses weighted estimates excluding not-reported cases. Reading and writing with understanding are required.</p>
          <h3>What is the difference between Census literacy data and survey estimates?</h3>
          <p>A Census enumerates the population; PLFS estimates from a probability household sample. Reference dates, frames, weights and geographic units matter. Neither programme certificates nor later publication dates automatically create a comparable new literacy rate.</p>
          <h3>Does &quot;full literacy&quot; mean everyone is literate?</h3>
          <p>No. The Ministry allows the 95% programme benchmark to count as full literacy. Its adult-learning/declaration context is different from the age-seven-plus PLFS indicator.</p>
        </section>

        <section aria-labelledby="literacy-conclusion">
          <h2 id="literacy-conclusion">Conclusion: Reading the Literacy Rate in India Correctly</h2>
          <p>
            The literacy rate in India is best understood with its source attached: <strong>81.1% in PLFS 2025, age seven-plus</strong>.
            {' '}Mizoram&apos;s 99.8% and Andhra Pradesh&apos;s 71.4% mark the state extremes in this survey, while national gender
            and rural-urban gaps remain substantial. The useful lesson is not a timeless league table. It is to identify where
            access and learning support need attention, use consistent evidence, and distinguish basic literacy from the broader
            education people need to participate confidently in society.
          </p>
        </section>
      </div>

      <section id="literacy-sources" aria-labelledby="sources-heading" className={styles.sources}>
        <h2 id="sources-heading">Sources and References</h2>
        <p>Primary sources below support the statistics and programme descriptions. SCES did not conduct the surveys or attribute their results to its own work.</p>
        <ol>{literacySources.map(source => (
          <li id={source.id} key={source.id}><a href={source.url}>{source.title}</a>. {source.note}</li>
        ))}</ol>
        <p>
          Census retrieval note: the live archive was intermittently unreachable during an additional historical-state check.
          Kerala and Bihar&apos;s final PCA counts were checked using a <a href={census.historical_state_extrema.retrieval_archive_url}>preserved copy of the exact official workbook</a>,
          {' '}with archive-digest and national-count cross-checks. The capture date is not a publication or statistical reference date.
        </p>
        <p>Editorial method: this article was prepared with AI-assisted research and writing, with statistics cross-checked against the official sources listed above.</p>
      </section>
    </article>
  );
}
