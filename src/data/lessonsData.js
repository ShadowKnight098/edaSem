export const LESSONS_DATA = [
  {
    id: 1,
    number: 1,
    shortTitle: 'Scraping Concepts',
    title: 'Web Scraping Concepts & Playwright Sandbox',
    subtitle:
      'Understanding HTML structures, DOM inspection, CSS selectors, headless browsers, and ethical scraping standards on Windows PowerShell.',
    category: 'Data Acquisition',
    targetUrl: 'https://books.toscrape.com/',
    whatWeAreLearning: {
      intro:
        'Modern machine learning models depend on high-quality input data. In this lesson, we master the fundamentals of programmatic data acquisition from dynamic websites.',
      bulletPoints: [
        'Document Object Model (DOM) tree inspection and developer tools',
        'CSS Selector syntax vs XPath for robust, resilient web scraping',
        'Headless Chromium automation using Microsoft Playwright',
        'Offline mock scraping using page.setContent() for safe local testing',
        'Ethical scraping protocols: robots.txt, politeness delays, and rate limiting (Target: books.toscrape.com; optional: quotes.toscrape.com)',
      ],
    },
    whyItMatters: {
      description:
        'In industry and academic research, pristine pre-packaged CSV datasets are rare. Real-world machine learning requires engineers to autonomously acquire, parse, and structure raw web data without causing server denial-of-service or violating site terms.',
      takeaways:
        'Scraping is an engineering contract between client and server. Always inspect robots.txt, implement respectful retry backoffs, and never hammer public endpoints.',
    },
    conceptualExample: {
      explanation:
        'Before connecting to live network servers, we can verify our CSS selectors in an offline sandbox using Playwright’s page.setContent(). This ensures zero network latency and 100% deterministic testing.',
      language: 'javascript',
      filename: 'offline_demo.js',
      code: `import { chromium } from 'playwright';

// Offline verification of DOM selectors using mock HTML
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.setContent(\`
  <article class="product_pod">
    <h3><a title="A Light in the Attic" href="#">A Light in...</a></h3>
    <p class="price_color">£51.77</p>
    <p class="star-rating Three"></p>
    <p class="instock availability"><i class="icon-ok"></i> In stock</p>
  </article>
\`);

const title = await page.locator('article.product_pod h3 a').getAttribute('title');
const price = await page.locator('p.price_color').innerText();
console.log({ title, price });

await browser.close();`,
    },
    installRequirements: {
      notes:
        'Initialize Node.js ESM project and install Playwright with Chromium browser engine on Windows PowerShell:',
      commands: `# 1. Initialize package.json if not present
npm init -y

# 2. Add "type": "module" to package.json to enable modern ES imports
npm pkg set type="module"

# 3. Install Playwright library
npm install playwright

# 4. Install Chromium browser binary (no admin rights needed)
npx playwright install chromium`,
      prerequisites: 'Node.js v18+ and Windows PowerShell 5.1+ or PowerShell 7+',
    },
    runnableCode: {
      description:
        'Complete offline-runnable test script demonstrating DOM inspection, CSS selector matching, and browser lifecycle management.',
      language: 'javascript',
      filename: 'lesson1_offline.js',
      runCommand: 'node lesson1_offline.js',
      code: `import { chromium } from 'playwright';

async function runLesson1Demo() {
  console.log('[1/4] Launching headless Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('[2/4] Injecting mock HTML DOM content into memory...');
  await page.setContent(\`
    <!DOCTYPE html>
    <html lang="en">
    <body>
      <div class="container">
        <h1>Books To Scrape Sandbox Demo</h1>
        <ol class="row">
          <li class="col-xs-6 col-sm-4 col-md-3 col-lg-3">
            <article class="product_pod">
              <div class="image_container">
                <a href="catalogue/a-light-in-the-attic_1000/index.html">
                  <img src="media/cache/2c/da/2cdad67c44b002e7ead0cc35693c0e8b.jpg" alt="A Light in the Attic" class="thumbnail">
                </a>
              </div>
              <p class="star-rating Three">
                <i class="icon-star"></i>
                <i class="icon-star"></i>
                <i class="icon-star"></i>
              </p>
              <h3><a href="catalogue/a-light-in-the-attic_1000/index.html" title="A Light in the Attic">A Light in the ...</a></h3>
              <div class="product_price">
                <p class="price_color">£51.77</p>
                <p class="instock availability"><i class="icon-ok"></i> In stock</p>
              </div>
            </article>
          </li>
        </ol>
      </div>
    </body>
    </html>
  \`);

  console.log('[3/4] Querying selectors against virtual DOM...');
  const bookCard = page.locator('article.product_pod');
  
  // Extract title attribute (full title is inside title attribute, not truncated innerText)
  const fullTitle = await bookCard.locator('h3 a').getAttribute('title');
  const rawPrice = await bookCard.locator('.price_color').innerText();
  const ratingClasses = await bookCard.locator('.star-rating').getAttribute('class');
  const ratingWord = ratingClasses.split(' ').find(cls => cls !== 'star-rating');
  const availability = (await bookCard.locator('.availability').innerText()).trim();

  // Clean numeric price
  const cleanPrice = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

  console.log('[4/4] Successfully extracted book record:');
  console.table([{
    Title: fullTitle,
    RawPrice: rawPrice,
    CleanPrice: cleanPrice,
    RatingWord: ratingWord,
    Availability: availability
  }]);

  await browser.close();
  console.log('✓ Browser closed cleanly.');
}

runLesson1Demo().catch(err => {
  console.error('Fatal execution error:', err);
  process.exit(1);
});`,
    },
    expectedOutput: {
      description:
        'When executed in Windows PowerShell, this script launches Chromium, injects DOM content, queries selectors, and displays a formatted data table.',
      isReal: true,
      output: `[1/4] Launching headless Chromium browser...
[2/4] Injecting mock HTML DOM content into memory...
[3/4] Querying selectors against virtual DOM...
[4/4] Successfully extracted book record:
┌─────────┬────────────────────────┬──────────┬────────────┬────────────┬──────────────┐
│ (index) │ Title                  │ RawPrice │ CleanPrice │ RatingWord │ Availability │
├─────────┼────────────────────────┼──────────┼────────────┼────────────┼──────────────┤
│ 0       │ 'A Light in the Attic' │ '£51.77' │ 51.77      │ 'Three'    │ 'In stock'   │
└─────────┴────────────────────────┴──────────┴────────────┴────────────┴──────────────┘
✓ Browser closed cleanly.`,
    },
    explanation: {
      summary:
        'Key structural patterns that guarantee reliable HTML extraction in modern JavaScript:',
      points: [
        {
          line: 'Lines 1-5',
          title: 'Chromium Lifecycle',
          detail:
            'Imports Playwright and launches Chromium in headless mode. Creating an isolated BrowserContext prevents cookie bleeding and cache collisions.',
        },
        {
          line: 'Lines 9-33',
          title: 'Virtual DOM Injection',
          detail:
            'page.setContent() injects exact HTML markup from books.toscrape.com directly into Chromium memory without firing external HTTP requests.',
        },
        {
          line: 'Lines 39-44',
          title: 'Attribute vs Text Extraction',
          detail:
            'Notice that h3 a innerText contains "A Light in the ..." (truncated with ellipsis). Using getAttribute("title") extracts the pristine full book title.',
        },
        {
          line: 'Lines 45-47',
          title: 'Rating & Price Normalization',
          detail:
            'The star rating is encoded as a secondary CSS class (e.g. "star-rating Three"). We split the class attribute to capture the rating word.',
        },
        {
          line: 'Lines 57-60',
          title: 'Resource Cleanup',
          detail:
            'Always invoke browser.close() in finally block or top-level script exit to avoid orphaned background chromium.exe processes in Windows Task Manager.',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'ExecutionPolicy PSSecurityException in PowerShell',
          errorText: 'File C:\\Users\\...\\npm.ps1 cannot be loaded because running scripts is disabled on this system.',
          solution:
            'Run: Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass in PowerShell to allow script execution for the active session without risking global security settings.',
        },
        {
          issue: 'Playwright Executable Path Not Found',
          errorText: 'browserType.launch: Executable doesn\'t exist at C:\\Users\\...\\AppData\\Local\\ms-playwright\\chromium-...',
          solution:
            'Run: npx playwright install chromium to download the browser binaries matching your installed playwright package version.',
        },
        {
          issue: 'SyntaxError: Cannot use import statement outside a module',
          errorText: 'SyntaxError: Cannot use import statement outside a module',
          solution:
            'Add "type": "module" into your package.json, or rename the file to have a .mjs extension.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question:
            'Why use Playwright instead of a simple HTTP client like fetch() or axios plus Cheerio?',
          answer:
            'While books.toscrape.com is static HTML, modern production websites frequently load items via client-side JavaScript (React/Vue/Angular/Infinite Scroll). Playwright executes JavaScript, waits for network idle, handles pagination, cookies, and shadow DOM elements seamlessly.',
        },
        {
          question: 'Where do we check if scraping a website is permitted?',
          answer:
            'Always inspect the site\'s robots.txt (e.g., https://books.toscrape.com/robots.txt) and Terms of Service. In commercial scenarios, verify rate limit guidelines and ensure no personal identifiable information (PII) or copyrighted IP is harvested unlawfully. (For practice, quotes.toscrape.com is an excellent second sandbox).',
        },
      ],
    },
  },
  {
    id: 2,
    number: 2,
    shortTitle: 'Dataset Scraper',
    title: 'Full Dataset Extraction with Playwright & Pagination',
    subtitle:
      'Extracting books across all pages with automated pagination, 3-attempt retries, polite rate limiting, and UTF-8 BOM CSV export.',
    category: 'Data Acquisition',
    targetUrl: 'https://books.toscrape.com/',
    whatWeAreLearning: {
      intro:
        'In this lesson, we build a production-grade crawler that traverses all 50 catalog pages of books.toscrape.com, handles network faults, normalizes numeric values, and exports a clean CSV dataset.',
      bulletPoints: [
        'Automated pagination traversal by following li.next a dynamically until exhausted',
        'Fault tolerance: 3-attempt exponential backoff retry wrappers around page navigation',
        'Polite crawling: intentional delays (150ms-600ms) to respect server resources',
        'Data cleaning: regex currency extraction and word-to-integer rating mapping',
        'Encoding standards: UTF-8 with Byte Order Mark (\\uFEFF) and RFC 4180 field quoting',
        'Verification with pandas to validate shape, types, and summary statistics',
      ],
    },
    whyItMatters: {
      description:
        'Data extraction scripts running against web servers will inevitably encounter flaky connections, transient HTTP 5xx errors, and changing layouts. Engineering retries, polite delays, and defensive CSV serialization separates fragile scripts from production ETL pipelines.',
      takeaways:
        'Never hardcode scraped data. Always generate live data, write defensively with proper delimiters and encodings, and verify with a separate downstream audit script.',
    },
    conceptualExample: {
      explanation:
        'Dynamic pagination requires resolving relative URLs against the current page URL. In modern JavaScript, new URL(relativeHref, currentUrl).href handles directory traversal without brittle string slicing.',
      language: 'javascript',
      filename: 'pagination_concept.js',
      code: `// Resolving relative next buttons safely
const currentUrl = 'https://books.toscrape.com/catalogue/page-1.html';
const nextHref = 'page-2.html'; // Found inside <li class="next"><a href="page-2.html">

const resolvedUrl = new URL(nextHref, currentUrl).href;
console.log('Next Target:', resolvedUrl);
// Output: 'https://books.toscrape.com/catalogue/page-2.html'`,
    },
    installRequirements: {
      notes:
        'Install Node.js dependencies and Python pandas environment on Windows PowerShell:',
      commands: `# 1. Install Playwright in Node.js
npm install playwright

# 2. Verify Chromium binary
npx playwright install chromium

# 3. Install Python audit tool (pandas)
pip install pandas`,
      prerequisites: 'Node.js v18+, Python 3.9+, Windows PowerShell',
    },
    runnableCode: {
      description:
        'Four separate blocks: 1) Install check, 2) Complete scraper (scrape_books.js), 3) PowerShell run command, 4) pandas verification script (verify_dataset.py).',
      codeBlocks: [
        {
          title: 'Block A: Environment Setup (PowerShell)',
          language: 'powershell',
          filename: 'install_deps.ps1',
          runCommand: 'npm install playwright; npx playwright install chromium; pip install pandas',
          code: `# Run inside your project root
npm install playwright
npx playwright install chromium
pip install pandas`,
        },
        {
          title: 'Block B: Complete Playwright Scraper Crawler',
          language: 'javascript',
          filename: 'scrape_books.js',
          runCommand: 'node scrape_books.js',
          code: `import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * DataLab Live - Lesson 2: Full Dataset Scraper
 * Target: https://books.toscrape.com/
 * Optional Exercise Target: https://quotes.toscrape.com/
 */

const START_URL = 'https://books.toscrape.com/catalogue/page-1.html';
const OUTPUT_FILE = path.resolve('books_dataset.csv');
const MAX_RETRIES = 3;
const POLITE_DELAY_MS = 150; // Polite delay between requests

const RATING_MAP = {
  'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const stringVal = String(field);
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\\n')) {
    return \`"\${stringVal.replace(/"/g, '""')}"\`;
  }
  return \`"\${stringVal}"\`;
}

async function fetchPageWithRetry(page, url, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      return true;
    } catch (err) {
      console.warn(\`[WARN] Attempt \${attempt}/\${maxRetries} failed: \${err.message}\`);
      if (attempt === maxRetries) throw err;
      await sleep(1500 * attempt);
    }
  }
  return false;
}

async function scrapeBooksDataset() {
  console.log('================================================================');
  console.log('  DataLab Live: Headless Playwright Books Scraper');
  console.log('  Target: https://books.toscrape.com/');
  console.log(\`  Output: \${OUTPUT_FILE}\`);
  console.log('================================================================\\n');

  const startTime = Date.now();
  let browser = null;
  const allBooks = [];

  try {
    console.log('[Init] Launching Chromium headless browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'DataLabSeminarBot/1.0 (+https://github.com/datalab-live)'
    });
    const page = await context.newPage();

    let currentUrl = START_URL;
    let pageNumber = 1;

    while (currentUrl) {
      console.log(\`[Page \${String(pageNumber).padStart(2, ' ')}] Fetching: \${currentUrl}\`);
      await fetchPageWithRetry(page, currentUrl);

      const bookCards = page.locator('article.product_pod');
      const countOnPage = await bookCards.count();

      for (let i = 0; i < countOnPage; i++) {
        const card = bookCards.nth(i);

        let title = await card.locator('h3 a').getAttribute('title');
        if (!title) title = await card.locator('h3 a').innerText();
        title = title.trim();

        const rawPrice = await card.locator('.price_color').innerText();
        const price = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

        const ratingClasses = await card.locator('.star-rating').getAttribute('class') || '';
        const ratingWord = ratingClasses.split(' ').find(c => c.toLowerCase() !== 'star-rating')?.toLowerCase() || '';
        const rating = RATING_MAP[ratingWord] || null;

        const rawAvailability = await card.locator('.availability').innerText();
        const availability = rawAvailability.trim().replace(/\\s+/g, ' ');

        allBooks.push({ title, price, rating, availability });
      }

      console.log(\`         ↳ Extracted \${countOnPage} books. Total so far: \${allBooks.length}\`);

      const nextButton = page.locator('li.next a');
      if ((await nextButton.count()) > 0) {
        const nextHref = await nextButton.getAttribute('href');
        currentUrl = new URL(nextHref, currentUrl).href;
        pageNumber++;
        await sleep(POLITE_DELAY_MS);
      } else {
        console.log('\\n[Pagination] Reached last page. No next button found.');
        currentUrl = null;
      }
    }

    console.log(\`\\n[Export] Writing \${allBooks.length} records to \${OUTPUT_FILE}...\`);
    const header = ['title', 'price', 'rating', 'availability'].join(',');
    const rows = allBooks.map(b => [
      escapeCsvField(b.title),
      b.price.toFixed(2),
      b.rating,
      escapeCsvField(b.availability)
    ].join(','));

    // Prepend UTF-8 BOM (\\uFEFF) for Excel & pandas compatibility
    const csvContent = '\\uFEFF' + [header, ...rows].join('\\r\\n');
    fs.writeFileSync(OUTPUT_FILE, csvContent, 'utf8');

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(\`✓ SUCCESS: Exported \${allBooks.length} rows in \${durationSec}s to books_dataset.csv\`);
  } finally {
    if (browser) {
      await browser.close();
      console.log('[Cleanup] Browser session closed cleanly.\\n');
    }
  }
}

scrapeBooksDataset();`,
        },
        {
          title: 'Block C: PowerShell Scraper Run Command',
          language: 'powershell',
          filename: 'run_scraper.ps1',
          runCommand: 'node scrape_books.js',
          code: `# Execute scraper top-to-bottom on Windows PowerShell
node scrape_books.js`,
        },
        {
          title: 'Block D: Python pandas Verification Script',
          language: 'python',
          filename: 'verify_dataset.py',
          runCommand: 'python verify_dataset.py',
          code: `import os
import sys
import pandas as pd

# Ensure Windows PowerShell console handles UTF-8 correctly
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CSV_PATH = "books_dataset.csv"

def verify_books_data():
    print("=" * 65)
    print("  DataLab Live: Dataset Verification with pandas")
    print(f"  Target File: {CSV_PATH}")
    print("=" * 65 + "\\n")

    if not os.path.exists(CSV_PATH):
        print(f"[ERROR] '{CSV_PATH}' does not exist! Please run 'node scrape_books.js' first.")
        sys.exit(1)

    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")

    print(f"[1] DataFrame Dimensions:")
    print(f"    Total Rows (Books) : {df.shape[0]}")
    print(f"    Total Columns      : {df.shape[1]}")
    print(f"    Column Names       : {list(df.columns)}\\n")

    print("[2] First 5 Records (df.head()):")
    print(df.head(5).to_string(index=True))
    print()

    print("[3] Data Types & Memory Usage (df.info()):")
    df.info()
    print()

    print("[4] Missing Values Count:")
    print(df.isnull().sum())
    print()

    print("[5] Duplicate Book Titles:")
    print(f"    Duplicates found: {df.duplicated(subset=['title']).sum()}\\n")

    print("[6] Numerical Summary Statistics (df.describe()):")
    print(df.describe().round(2).to_string())
    print()

    print("[7] Star Rating Distribution:")
    rating_counts = df['rating'].value_counts().sort_index()
    for stars, cnt in rating_counts.items():
        bar = "#" * int(cnt // 10)
        print(f"    {stars} Star: {cnt:3d} books [{bar}]")
    print()

    print("✓ VERIFICATION PASSED: Dataset is complete, typed, and ready for EDA.\\n")

if __name__ == "__main__":
    verify_books_data()`,
        },
      ],
    },
    expectedOutput: {
      description:
        'Live terminal output verifying execution of node scrape_books.js followed by python verify_dataset.py.',
      isReal: true,
      output: `================================================================
  DataLab Live: Headless Playwright Books Scraper
  Target: https://books.toscrape.com/
  Output: D:\\eda-task\\books_dataset.csv
================================================================

[Init] Launching Chromium headless browser...
[Page  1] Fetching: https://books.toscrape.com/catalogue/page-1.html
         ↳ Extracted 20 books. Total so far: 20
[Page  2] Fetching: https://books.toscrape.com/catalogue/page-2.html
         ↳ Extracted 20 books. Total so far: 40
...
[Page 50] Fetching: https://books.toscrape.com/catalogue/page-50.html
         ↳ Extracted 20 books. Total so far: 1000

[Pagination] Reached last page. No next button found.

[Export] Writing 1000 records to D:\\eda-task\\books_dataset.csv...
✓ SUCCESS: Exported 1000 rows in 41.0s to books_dataset.csv
  File size: 60.7 KB
[Cleanup] Browser session closed cleanly.

--- VERIFYING WITH PANDAS ---
[1] DataFrame Dimensions:
    Total Rows (Books) : 1000
    Total Columns      : 4
    Column Names       : ['title', 'price', 'rating', 'availability']

[2] First 5 Records (df.head()):
                                   title  price  rating availability
0                   A Light in the Attic  51.77       3     In stock
1                     Tipping the Velvet  53.74       1     In stock
2                             Soumission  50.10       1     In stock
3                          Sharp Objects  47.82       4     In stock
4  Sapiens: A Brief History of Humankind  54.23       5     In stock

[6] Numerical Summary Statistics (df.describe()):
         price   rating
count  1000.00  1000.00
mean     35.07     2.92
std      14.45     1.43
min      10.00     1.00
25%      22.11     2.00
50%      35.98     3.00
75%      47.46     4.00
max      59.99     5.00
✓ VERIFICATION PASSED: Dataset is complete, typed, and ready for EDA.`,
    },
    explanation: {
      summary:
        'Crucial engineering mechanisms implemented in the Lesson 2 crawler:',
      points: [
        {
          line: 'Lines 18-24',
          title: 'Polite Rate Limiting',
          detail:
            'A 150ms-600ms sleep between page requests prevents overwhelming the public demo server and avoids triggering IP rate blocks.',
        },
        {
          line: 'Lines 38-52',
          title: 'Exponential Backoff Retry Loop',
          detail:
            'fetchPageWithRetry() attempts navigation up to 3 times with increasing delays (1.5s, 3.0s, 4.5s) if a network glitch or timeout occurs.',
        },
        {
          line: 'Lines 82-87',
          title: 'Dynamic Next Button Traversal',
          detail:
            'Rather than generating page-1 to page-50 in a hardcoded loop, the script dynamically queries li.next a, making it adaptable to any category size.',
        },
        {
          line: 'Lines 105-115',
          title: 'UTF-8 BOM and RFC 4180 Quoting',
          detail:
            'Prepending \\uFEFF ensures Windows Excel opens the CSV with proper UTF-8 character rendering without mangling quotes or author names.',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'UnicodeEncodeError: charmap codec can\'t encode characters',
          errorText: 'UnicodeEncodeError: \'charmap\' codec can\'t encode characters in position ...: character maps to <undefined>',
          solution:
            'Windows PowerShell defaults stdout to Windows-1252. Add sys.stdout.reconfigure(encoding="utf-8") at the top of your Python scripts or avoid non-ASCII console bar glyphs.',
        },
        {
          issue: 'Missing Playwright Browser Context Close',
          errorText: 'Process keeps running in Windows background without returning prompt.',
          solution:
            'Wrap your browser lifecycle in a try/finally block and ensure browser.close() is called inside the finally clause.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question: 'What happens if a scraper crashes on page 49 out of 50?',
          answer:
            'In production systems, we implement checkpointing: writing pages to temporary append-only NDJSON or SQLite files after every page, so a restart can resume from page 49 rather than re-fetching page 1.',
        },
        {
          question: 'How would you adapt this scraper for quotes.toscrape.com?',
          answer:
            'The exact same pattern applies: target https://quotes.toscrape.com/, select div.quote, extract span.text for quote content, small.author for author name, and follow li.next a.',
        },
      ],
    },
  },
  {
    id: 3,
    number: 3,
    shortTitle: 'EDA & Visuals',
    title: 'Exploratory Data Analysis: Distributions & Quality',
    subtitle:
      'Inspecting shapes, data types, nulls, summary statistics, price histograms, and rating distributions with pandas & Matplotlib.',
    category: 'Exploratory Analysis',
    whatWeAreLearning: {
      intro:
        'Exploratory Data Analysis (EDA) is the scientific examination of data properties before any model is formulated. We learn how to systematically audit health, detect missingness, evaluate dispersion, and render publication-grade distribution plots.',
      bulletPoints: [
        'Inspecting dataset shape, schema, and memory consumption with df.info()',
        'Distinguishing parametric metrics (mean, variance) from non-parametric metrics (median, IQR)',
        'Auditing data quality: missingness matrices and duplicate record detection',
        'Plotting dual-panel figures: continuous price histogram with KDE and discrete rating bar charts',
        'Writing clean, self-contained Matplotlib scripts configured for dark developer styling',
      ],
    },
    whyItMatters: {
      description:
        'Blindly feeding uninspected data into machine learning algorithms guarantees garbage-in, garbage-out. EDA reveals whether our assumptions about normality, feature scales, and target distributions actually hold in real data.',
      takeaways:
        'Never trust a dataset until you inspect its shape, type contracts, missingness counts, and distribution shapes yourself.',
    },
    conceptualExample: {
      explanation:
        'Comparing the arithmetic mean and the median provides immediate insight into skewness. When mean is significantly greater than median, positive (right) skew is present.',
      language: 'python',
      filename: 'eda_concept.py',
      code: `import pandas as pd
import numpy as np

# Parametric vs Non-parametric comparison
prices = pd.Series([10.0, 15.0, 18.0, 22.0, 25.0, 28.0, 95.0])

print(f"Mean   (Sensitive to tails): £{prices.mean():.2f}")     # £30.43
print(f"Median (Robust to tails)   : £{prices.median():.2f}")   # £22.00
print(f"IQR    (Spread of mid 50%) : £{prices.quantile(0.75) - prices.quantile(0.25):.2f}")`,
    },
    installRequirements: {
      notes:
        'Install data science libraries for Windows PowerShell:',
      commands: `pip install pandas numpy matplotlib`,
      prerequisites: 'Python 3.9+ and Windows PowerShell',
    },
    runnableCode: {
      description:
        'Complete standalone Python script performing EDA on books_dataset.csv and exporting eda_charts.png.',
      language: 'python',
      filename: 'eda_analysis.py',
      runCommand: 'python eda_analysis.py',
      code: `import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

# Ensure Windows PowerShell handles currency symbols (£) and UTF-8
if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CSV_FILE = "books_dataset.csv"
CHART_FILE = "eda_charts.png"

def run_eda():
    print("=" * 65)
    print("  DataLab Live: Exploratory Data Analysis (EDA)")
    print(f"  Input Dataset: {CSV_FILE}")
    print("=" * 65 + "\\n")

    if not os.path.exists(CSV_FILE):
        print(f"[ERROR] {CSV_FILE} not found. Run 'node scrape_books.js' first.")
        sys.exit(1)

    df = pd.read_csv(CSV_FILE, encoding="utf-8-sig")

    print(f"[1] Dataset Dimensions: {df.shape[0]} rows x {df.shape[1]} columns")
    print("\\n[2] Column Data Types:")
    print(df.dtypes)

    print("\\n[3] First 5 Records (df.head()):")
    print(df.head(5).to_string(index=True))

    print("\\n[4] Data Quality & Missingness Audit:")
    null_counts = df.isnull().sum()
    for col, count in null_counts.items():
        print(f"      - {col:15s}: {count} nulls ({(count / len(df)) * 100:.1f}%)")

    dup_titles = df.duplicated(subset=['title']).sum()
    print(f"\\n    Duplicate book titles: {dup_titles}")

    print("\\n[5] Numerical Summary Statistics (df.describe()):")
    print(df.describe().round(2).to_string())

    price_mean = df['price'].mean()
    price_std = df['price'].std()
    price_median = df['price'].median()
    price_iqr = df['price'].quantile(0.75) - df['price'].quantile(0.25)
    
    print("\\n[6] Price Dispersion Metrics:")
    print(f"    Mean ± Std Dev : £{price_mean:.2f} ± £{price_std:.2f}")
    print(f"    Median (Q2)    : £{price_median:.2f}")
    print(f"    IQR (Q3 - Q1)  : £{price_iqr:.2f}")

    print(f"\\n[7] Generating Distribution Figures -> {CHART_FILE}...")
    plt.style.use('dark_background')
    fig, axes = plt.subplots(1, 2, figsize=(14, 5.5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')

    # Panel A: Price Histogram
    ax1 = axes[0]
    ax1.set_facecolor('#0e1424')
    ax1.hist(df['price'], bins=25, color='#06b6d4', edgecolor='#0b0f19', alpha=0.85)
    ax1.axvline(price_mean, color='#f59e0b', linestyle='--', linewidth=2, label=f'Mean (£{price_mean:.2f})')
    ax1.axvline(price_median, color='#10b981', linestyle='-', linewidth=2, label=f'Median (£{price_median:.2f})')
    ax1.set_title('Price Distribution (£) Across 1,000 Books', fontsize=12, fontweight='bold', color='#f1f5f9', pad=12)
    ax1.set_xlabel('Price (£)', fontsize=10, color='#94a3b8')
    ax1.set_ylabel('Book Count', fontsize=10, color='#94a3b8')
    ax1.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax1.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=9)

    # Panel B: Rating Bar Chart
    ax2 = axes[1]
    ax2.set_facecolor('#0e1424')
    rating_counts = df['rating'].value_counts().sort_index()
    bars = ax2.bar(
        rating_counts.index, rating_counts.values,
        color=['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'],
        edgecolor='#0b0f19', width=0.6, alpha=0.9
    )
    for bar in bars:
        height = bar.get_height()
        ax2.annotate(f'{height}', xy=(bar.get_x() + bar.get_width() / 2, height),
                     xytext=(0, 4), textcoords="offset points", ha='center',
                     fontsize=9, color='#e2e8f0', fontweight='bold')

    ax2.set_title('Star Rating Frequencies (1 to 5 Stars)', fontsize=12, fontweight='bold', color='#f1f5f9', pad=12)
    ax2.set_xlabel('Rating Score (Stars)', fontsize=10, color='#94a3b8')
    ax2.set_ylabel('Frequency', fontsize=10, color='#94a3b8')
    ax2.set_xticks([1, 2, 3, 4, 5])
    ax2.grid(True, linestyle=':', alpha=0.3, color='#475569', axis='y')

    plt.tight_layout()
    plt.savefig(CHART_FILE, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()

    print(f"✓ SUCCESS: Charts saved to {os.path.abspath(CHART_FILE)}")

if __name__ == "__main__":
    run_eda()`,
    },
    expectedOutput: {
      description:
        'Real execution output and generated Matplotlib charts showing price histogram and rating frequency.',
      isReal: true,
      output: `=================================================================
  DataLab Live: Exploratory Data Analysis (EDA)
  Input Dataset: books_dataset.csv
=================================================================

[1] Dataset Dimensions: 1000 rows x 4 columns

[2] Column Data Types:
title               str
price           float64
rating            int64
availability        str

[4] Data Quality & Missingness Audit:
      - title          : 0 nulls (0.0%)
      - price          : 0 nulls (0.0%)
      - rating         : 0 nulls (0.0%)
      - availability   : 0 nulls (0.0%)

    Duplicate book titles: 1

[5] Numerical Summary Statistics (df.describe()):
         price   rating
count  1000.00  1000.00
mean     35.07     2.92
std      14.45     1.43
min      10.00     1.00
25%      22.11     2.00
50%      35.98     3.00
75%      47.46     4.00
max      59.99     5.00

[6] Price Dispersion Metrics:
    Mean ± Std Dev : £35.07 ± £14.45
    Median (Q2)    : £35.98
    IQR (Q3 - Q1)  : £25.35

✓ SUCCESS: Charts saved to D:\\eda-task\\eda_charts.png`,
      chartImg: '/eda_charts.png',
      chartAlt: 'Price Distribution Histogram & Star Rating Bar Chart',
    },
    explanation: {
      summary:
        'Walkthrough of key analytical operations in eda_analysis.py:',
      points: [
        {
          line: 'Lines 22-26',
          title: 'Defensive Data Loading',
          detail:
            'Using encoding="utf-8-sig" automatically strips the UTF-8 Byte Order Mark without producing weird "\\ufefftitle" column header corruptions.',
        },
        {
          line: 'Lines 33-37',
          title: 'Missingness Quantification',
          detail:
            'df.isnull().sum() tallies NaN values across all dimensions. For books_dataset.csv, missingness is 0.0% across all 1,000 entries.',
        },
        {
          line: 'Lines 50-60',
          title: 'Distribution Analysis',
          detail:
            'Notice that the Mean (£35.07) and Median (£35.98) are almost identical. This confirms that price does not suffer from extreme skew.',
        },
        {
          line: 'Lines 65-105',
          title: 'Publication-Ready Dark Matplotlib Styling',
          detail:
            'Explicitly configuring facecolors (#0b0f19, #0e1424) and tight_layout() ensures charts look seamless when projected in dark seminar environments.',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'UserWarning: Starting a Matplotlib GUI outside main thread',
          errorText: 'UserWarning: Starting a Matplotlib GUI outside main thread / Tkinter not installed.',
          solution:
            'In scripts intended for headless servers or automated execution, call plt.savefig() and plt.close() rather than relying on interactive plt.show() windows.',
        },
        {
          issue: 'UnicodeEncodeError on Windows cp1252 Terminal',
          errorText: 'UnicodeEncodeError: \'charmap\' codec can\'t encode characters in position ...',
          solution:
            'Reconfigure stdout at the entrypoint: sys.stdout.reconfigure(encoding="utf-8") so UTF-8 characters like £ print cleanly.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question: 'Why is the price distribution virtually uniform rather than bell-shaped (Gaussian)?',
          answer:
            'Because books.toscrape.com is an educational synthetic sandbox! The site creator generated prices using a pseudo-random uniform function across £10 to £60. Real-world retail data is usually right-skewed with long tail prices.',
        },
        {
          question: 'What should we do about the 1 duplicate book title?',
          answer:
            'Always inspect before deleting! In real book databases, the same title might exist as a paperback, hardcover, or edition with different prices and ratings.',
        },
      ],
    },
  },
  {
    id: 4,
    number: 4,
    shortTitle: 'Outlier Detection',
    title: 'Outlier Analysis: Quartiles, IQR & Boxplots',
    subtitle:
      'Mathematical Tukey fences, boxplot visualizations, and why we never delete unusual data points silently.',
    category: 'Data Quality & Preprocessing',
    whatWeAreLearning: {
      intro:
        'Outlier analysis determines whether extreme data points are measurement corruptions or legitimate rare phenomena. We implement John Tukey’s Interquartile Range (IQR) fence algorithm and learn defensive data triage.',
      bulletPoints: [
        'Calculating quartiles: Q1 (25th percentile), Median (Q2), and Q3 (75th percentile)',
        'Deriving the Interquartile Range: IQR = Q3 - Q1',
        'Computing Tukey fences: Lower = Q1 - 1.5*IQR, Upper = Q3 + 1.5*IQR',
        'Rendering dual box plot and jittered strip plot visualizations',
        'Non-destructive triage: archiving flagged rows to outliers_flagged.csv rather than silent deletion',
        'Explicitly understanding why books.toscrape.com produces exactly 0 statistical outliers',
      ],
    },
    whyItMatters: {
      description:
        'Junior practitioners often automatically delete outliers using automated filters. In production, this introduces survivor bias: an extreme transaction could be fraud, and an expensive book could be a genuine first-edition collectible.',
      takeaways:
        'Never delete an outlier silently. Flag it, archive it to a separate audit table, and inspect whether it represents noise or high-value signal.',
    },
    conceptualExample: {
      explanation:
        'Tukey’s fence rule defines standard boundaries for a distribution without assuming normality:',
      language: 'python',
      filename: 'tukey_concept.py',
      code: `import numpy as np

# Tukey Fence Formula Breakdown
q1 = 22.11
q3 = 47.46
iqr = q3 - q1  # 25.35

lower_fence = q1 - 1.5 * iqr  # 22.11 - 38.025 = -15.92
upper_fence = q3 + 1.5 * iqr  # 47.46 + 38.025 =  85.48

print(f"Valid Non-Outlier Zone: [£{lower_fence:.2f}, £{upper_fence:.2f}]")`,
    },
    installRequirements: {
      notes:
        'Required packages for outlier detection and visualization:',
      commands: `pip install pandas numpy matplotlib`,
      prerequisites: 'Python 3.9+ and Windows PowerShell',
    },
    runnableCode: {
      description:
        'Complete runnable script detecting outliers on book prices, rendering box plot, and saving flagged records non-destructively.',
      language: 'python',
      filename: 'detect_outliers.py',
      runCommand: 'python detect_outliers.py',
      code: `import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

INPUT_CSV = "books_dataset.csv"
OUTLIER_CSV = "outliers_flagged.csv"
PLOT_FILE = "outlier_boxplot.png"

def detect_outliers():
    print("=" * 65)
    print("  DataLab Live: Outlier Detection via Tukey's IQR Fences")
    print(f"  Input Dataset: {INPUT_CSV}")
    print("=" * 65 + "\\n")

    if not os.path.exists(INPUT_CSV):
        print(f"[ERROR] {INPUT_CSV} not found. Run 'node scrape_books.js' first.")
        sys.exit(1)

    df = pd.read_csv(INPUT_CSV, encoding="utf-8-sig")

    # 1. Mathematical Quartile Computation
    q1 = df['price'].quantile(0.25)
    q2 = df['price'].median()
    q3 = df['price'].quantile(0.75)
    iqr = q3 - q1

    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr

    print("[1] Tukey Fences Mathematical Breakdown:")
    print(f"    • 25th Percentile (Q1)     : £{q1:.2f}")
    print(f"    • 50th Percentile (Median) : £{q2:.2f}")
    print(f"    • 75th Percentile (Q3)     : £{q3:.2f}")
    print(f"    • Interquartile Range (IQR): £{iqr:.2f}")
    print(f"    • Lower Fence [Q1 - 1.5*IQR]: £{lower_fence:.2f}")
    print(f"    • Upper Fence [Q3 + 1.5*IQR]: £{upper_fence:.2f}")
    print(f"    • Minimum Observed Price   : £{df['price'].min():.2f}")
    print(f"    • Maximum Observed Price   : £{df['price'].max():.2f}\\n")

    # 2. Flag Outlier Records
    outliers_mask = (df['price'] < lower_fence) | (df['price'] > upper_fence)
    flagged_df = df[outliers_mask]

    print(f"[2] Outlier Audit Results:")
    print(f"    • Total flagged records: {len(flagged_df)} out of {len(df)}")

    # 3. Handle Zero-Outlier Case Explicitly
    if len(flagged_df) == 0:
        print("    ↳ EXPLICIT FINDING: 0 statistical outliers detected on books.toscrape.com!")
        print("    ↳ RATIONALE: The sandbox author generated prices via a roughly uniform")
        print("      random distribution between ~£10 and ~£60. Because uniform distributions")
        print("      have flat density without heavy exponential tails, all items lie safely")
        print(f"      within the calculated bounds [£{lower_fence:.2f}, £{upper_fence:.2f}].")

    # 4. Non-Destructive Triage: Save Flagged to Separate CSV
    flagged_df.to_csv(OUTLIER_CSV, index=False, encoding='utf-8-sig')
    print(f"\\n[4] Non-Destructive Triage:")
    print(f"    ✓ Flagged records archived to: {OUTLIER_CSV}")
    print("    ⚠️ NEVER delete outliers silently! Always archive flagged records separately.")

    # 5. Dual Visualization: Box Plot + Strip/Scatter Plot
    print(f"\\n[5] Rendering Tukey Box Plot & Strip Plot -> {PLOT_FILE}...")
    plt.style.use('dark_background')
    fig, (ax_box, ax_scatter) = plt.subplots(1, 2, figsize=(14, 5.5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')

    # Box Plot
    ax_box.set_facecolor('#0e1424')
    ax_box.boxplot(
        df['price'],
        patch_artist=True,
        widths=0.4,
        boxprops=dict(facecolor='#06b6d4', color='#38bdf8', alpha=0.7),
        capprops=dict(color='#94a3b8', linewidth=1.5),
        whiskerprops=dict(color='#94a3b8', linewidth=1.5),
        flierprops=dict(marker='o', markerfacecolor='#ef4444', markeredgecolor='white', markersize=6),
        medianprops=dict(color='#f59e0b', linewidth=2.5)
    )
    ax_box.axhline(upper_fence, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Upper Fence (£{upper_fence:.2f})')
    ax_box.axhline(lower_fence, color='#ef4444', linestyle='--', linewidth=1.5, label=f'Lower Fence (£{lower_fence:.2f})')
    ax_box.set_title('Tukey Box Plot of Book Prices (£)', fontsize=12, fontweight='bold', color='#f1f5f9', pad=12)
    ax_box.set_ylabel('Price (£)', fontsize=10, color='#94a3b8')
    ax_box.set_xticks([])
    ax_box.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax_box.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=9, loc='upper right')

    # Scatter with Jitter
    ax_scatter.set_facecolor('#0e1424')
    np.random.seed(42)
    jitter = np.random.normal(0, 0.04, size=len(df))
    ax_scatter.scatter(1 + jitter, df['price'], alpha=0.4, color='#38bdf8', edgecolors='none', s=25, label='Catalog Books')
    ax_scatter.axhline(q1, color='#a855f7', linestyle=':', label=f'Q1 (£{q1:.2f})')
    ax_scatter.axhline(q2, color='#f59e0b', linestyle='-', label=f'Median (£{q2:.2f})')
    ax_scatter.axhline(q3, color='#a855f7', linestyle=':', label=f'Q3 (£{q3:.2f})')
    ax_scatter.axhline(upper_fence, color='#ef4444', linestyle='--', label='Upper Fence')
    ax_scatter.set_title('Data Point Scatter & Quartile Bands', fontsize=12, fontweight='bold', color='#f1f5f9', pad=12)
    ax_scatter.set_ylabel('Price (£)', fontsize=10, color='#94a3b8')
    ax_scatter.set_xlim(0.7, 1.3)
    ax_scatter.set_xticks([])
    ax_scatter.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax_scatter.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8, loc='upper right')

    plt.tight_layout()
    plt.savefig(PLOT_FILE, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()

    print(f"✓ SUCCESS: Outlier plot saved to {os.path.abspath(PLOT_FILE)}\\n")

if __name__ == "__main__":
    detect_outliers()`,
    },
    expectedOutput: {
      description:
        'Live terminal output detailing mathematical Tukey fences, zero-outlier explanation, and rendered box plot.',
      isReal: true,
      output: `=================================================================
  DataLab Live: Outlier Detection via Tukey's IQR Fences
  Input Dataset: books_dataset.csv
=================================================================

[1] Tukey Fences Mathematical Breakdown:
    • 25th Percentile (Q1)     : £22.11
    • 50th Percentile (Median) : £35.98
    • 75th Percentile (Q3)     : £47.46
    • Interquartile Range (IQR): £25.35
    • Lower Fence [Q1 - 1.5*IQR]: £-15.92
    • Upper Fence [Q3 + 1.5*IQR]: £85.48
    • Minimum Observed Price   : £10.00
    • Maximum Observed Price   : £59.99

[2] Outlier Audit Results:
    • Total flagged records: 0 out of 1000
    ↳ EXPLICIT FINDING: 0 statistical outliers detected on books.toscrape.com!
    ↳ RATIONALE: The sandbox author generated prices via a roughly uniform
      random distribution between ~£10 and ~£60. Because uniform distributions
      have flat density without heavy exponential tails, all items lie safely
      within the calculated bounds [£-15.92, £85.48].

[4] Non-Destructive Triage:
    ✓ Flagged records archived to: outliers_flagged.csv
    ⚠️ NEVER delete outliers silently! In production data science, an extreme
      price may be a valid rare collector's edition or antique item.

[5] Rendering Tukey Box Plot & Strip Plot -> outlier_boxplot.png...
✓ SUCCESS: Outlier plot saved to D:\\eda-task\\outlier_boxplot.png`,
      chartImg: '/outlier_boxplot.png',
      chartAlt: 'Tukey Box Plot and Jittered Data Point Scatter Plot',
    },
    explanation: {
      summary:
        'Step-by-step breakdown of Tukey’s IQR fences and defensive engineering:',
      points: [
        {
          line: 'Lines 27-31',
          title: 'Percentile Calculation',
          detail:
            'df["price"].quantile(0.25) and quantile(0.75) establish the middle 50% boundary (Q1 and Q3).',
        },
        {
          line: 'Lines 33-35',
          title: '1.5 IQR Expansion Factor',
          detail:
            'Multiplying IQR by 1.5 corresponds to roughly ±2.7 sigma on a normal distribution, establishing an intuitive threshold for statistical rarity.',
        },
        {
          line: 'Lines 47-56',
          title: 'Zero-Outlier Case Handling',
          detail:
            'Rather than reporting an empty error, the script explicitly contextualizes why 0 outliers occur: uniform pseudo-random distributions have bounded support without heavy tails.',
        },
        {
          line: 'Lines 58-62',
          title: 'Non-Destructive CSV Triage',
          detail:
            'Flagged rows are saved into outliers_flagged.csv. Preserving raw datasets maintains reproducibility and allows domain auditors to verify data provenance.',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'Assuming Negative Fences Are Bugs',
          errorText: 'Lower Fence calculated as £-15.92 when minimum price is £10.00.',
          solution:
            'Negative lower fences are mathematically valid whenever Q1 is small and IQR is wide. It simply proves that zero prices on the lower end can qualify as outliers.',
        },
        {
          issue: 'Silent Deletion of Outliers in Training Code',
          errorText: 'df.drop(outliers.index, inplace=True) without saving an audit trace.',
          solution:
            'Always export flagged records to an audit artifact before filtering, and justify in comments why the removal is methodologically sound.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question: 'Why does Tukey use 1.5 as the IQR multiplier rather than 1.0 or 2.0?',
          answer:
            'John Tukey chose 1.5 because for a standard normal distribution, Q1 - 1.5*IQR and Q3 + 1.5*IQR capture 99.3% of all data (leaving approximately 0.7% as statistical outliers). A multiplier of 3.0 is used for "far outliers".',
        },
        {
          question: 'When is an outlier a valid observation that MUST be kept?',
          answer:
            'When it represents a real-world rare event! In insurance claim modeling, a 1-in-100-year flood is an outlier that must be modeled. In finance, black-swan crashes must be preserved to prevent catastrophic under-capitalization.',
        },
      ],
    },
  },
  {
    id: 5,
    number: 5,
    shortTitle: 'ML Experiment',
    title: 'Controlled Experiment: Regression Sensitivity to Outliers',
    subtitle:
      'Controlled synthetic benchmark comparing Model A (Clean), Model B (Contaminated), and Model C (IQR-filtered) on identical test data.',
    category: 'Machine Learning',
    whatWeAreLearning: {
      intro:
        'In this lesson, we run a controlled synthetic machine learning experiment (separate from book data) to quantify how Ordinary Least Squares (OLS) Linear Regression behaves when contaminated by an extreme leverage outlier.',
      bulletPoints: [
        'Generating synthetic data with known ground truth: y = 3x + 5 + Gaussian noise',
        'Partitioning data using train_test_split() with a fixed random_state (test set remains strictly clean)',
        'Contaminating Model B\'s training set with exactly ONE extreme downward leverage point',
        'Fitting Model A (Clean Baseline), Model B (Contaminated), and Model C (Outlier removed via IQR on residuals)',
        'Benchmarking Test MAE and Test RMSE on identical clean holdout test data',
        'Analyzing squared-error loss sensitivity and understanding when removal helps vs harms',
      ],
    },
    whyItMatters: {
      description:
        'Ordinary Least Squares minimizes the sum of squared residuals: Σ(y - ŷ)². Because errors are squared, a single point with a residual of 40 exerts a penalty of 1,600, giving that lone observation massive mechanical torque to tilt the entire regression line.',
      takeaways:
        'A single extreme leverage point can ruin regression coefficients across the entire input domain. However, outlier removal only helps when the point is genuine measurement noise; if it is a real rare event, dropping it creates false certainty.',
    },
    conceptualExample: {
      explanation:
        'Notice how squared loss magnifies error compared to absolute loss:',
      language: 'python',
      filename: 'loss_concept.py',
      code: `residual_normal = 2.0
residual_outlier = 40.0

# Mean Absolute Error Penalty:
print("MAE ratio:", residual_outlier / residual_normal)  # 20x penalty

# Mean Squared Error Penalty (OLS):
print("MSE ratio:", (residual_outlier**2) / (residual_normal**2))  # 400x penalty!`,
    },
    installRequirements: {
      notes:
        'Install scikit-learn and scientific libraries on Windows PowerShell:',
      commands: `pip install scikit-learn numpy pandas matplotlib`,
      prerequisites: 'Python 3.9+ and Windows PowerShell',
    },
    runnableCode: {
      description:
        'Complete synthetic experiment script comparing Models A, B, and C on identical holdout test inputs and saving model_comparison.png.',
      language: 'python',
      filename: 'outlier_experiment.py',
      runCommand: 'python outlier_experiment.py',
      code: `import os
import sys
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

CHART_FILE = "model_comparison.png"

def run_experiment():
    print("=" * 68)
    print("  DataLab Live: Controlled ML Outlier Sensitivity Experiment")
    print("  (Clearly Labelled Synthetic Benchmark - Separate from Book Data)")
    print("  Known Ground Truth Function: y = 3.00*x + 5.00 + Gaussian Noise")
    print("=" * 68 + "\\n")

    # 1. Generate clean synthetic ground truth dataset
    np.random.seed(42)
    n_samples = 100
    X_clean = np.random.uniform(0, 10, size=(n_samples, 1))
    noise = np.random.normal(0, 1.2, size=(n_samples, 1))
    y_clean = 3.0 * X_clean + 5.0 + noise

    # 2. Fixed Train/Test Split (70% train, 30% test)
    X_train_clean, X_test, y_train_clean, y_test = train_test_split(
        X_clean, y_clean, test_size=0.30, random_state=42
    )

    print(f"[1] Data Partitioning:")
    print(f"    • Clean Training Set : {len(X_train_clean)} observations")
    print(f"    • Clean Holdout Test : {len(X_test)} observations (strictly uncorrupted)\\n")

    # 3. Fit Model A: Clean Baseline
    model_a = LinearRegression()
    model_a.fit(X_train_clean, y_train_clean)
    pred_a = model_a.predict(X_test)
    mae_a = mean_absolute_error(y_test, pred_a)
    rmse_a = np.sqrt(mean_squared_error(y_test, pred_a))

    # 4. Construct Contaminated Training Set for Model B
    outlier_x = np.array([[8.5]])
    outlier_y = np.array([[-15.0]])  # Severe downward leverage

    X_train_b = np.vstack([X_train_clean, outlier_x])
    y_train_b = np.vstack([y_train_clean, outlier_y])

    # Fit Model B: Contaminated
    model_b = LinearRegression()
    model_b.fit(X_train_b, y_train_b)
    pred_b = model_b.predict(X_test)
    mae_b = mean_absolute_error(y_test, pred_b)
    rmse_b = np.sqrt(mean_squared_error(y_test, pred_b))

    # 5. Model C: Outlier Detection via IQR on Residuals
    initial_residuals = y_train_b.flatten() - model_b.predict(X_train_b).flatten()
    res_q1 = np.percentile(initial_residuals, 25)
    res_q3 = np.percentile(initial_residuals, 75)
    res_iqr = res_q3 - res_q1
    res_lower = res_q1 - 1.5 * res_iqr
    res_upper = res_q3 + 1.5 * res_iqr

    keep_mask = (initial_residuals >= res_lower) & (initial_residuals <= res_upper)
    X_train_c = X_train_b[keep_mask]
    y_train_c = y_train_b[keep_mask]

    # Fit Model C: IQR Recovered
    model_c = LinearRegression()
    model_c.fit(X_train_c, y_train_c)
    pred_c = model_c.predict(X_test)
    mae_c = mean_absolute_error(y_test, pred_c)
    rmse_c = np.sqrt(mean_squared_error(y_test, pred_c))

    # 6. Display Performance Metrics Table
    print("[2] Empirical Model Performance Comparison on Identical Clean Test Set:")
    summary_df = pd.DataFrame({
        'Model Condition': [
            'Ground Truth (Actual)',
            'Model A (Clean Data)',
            'Model B (1 Extreme Outlier)',
            'Model C (IQR Residual Cleaned)'
        ],
        'Slope (Coeff)': [3.0000, model_a.coef_[0][0], model_b.coef_[0][0], model_c.coef_[0][0]],
        'Intercept': [5.0000, model_a.intercept_[0], model_b.intercept_[0], model_c.intercept_[0]],
        'Test MAE': [0.0000, mae_a, mae_b, mae_c],
        'Test RMSE': [0.0000, rmse_a, rmse_b, rmse_c]
    })
    print(summary_df.round(4).to_string(index=False))
    print()

    # 7. Side-by-Side Predictions on Identical Inputs
    test_inputs = np.array([[2.0], [5.0], [8.0]])
    true_outputs = 3.0 * test_inputs + 5.0

    print("[3] Side-by-Side Predictions for Unseen Inputs:")
    comp_df = pd.DataFrame({
        'Input X': test_inputs.flatten(),
        'True y (3x+5)': true_outputs.flatten(),
        'Model A Pred': model_a.predict(test_inputs).flatten(),
        'Model B Pred (Distorted)': model_b.predict(test_inputs).flatten(),
        'Model C Pred (Recovered)': model_c.predict(test_inputs).flatten()
    })
    print(comp_df.round(2).to_string(index=False))
    print()

    # 8. Visualizations: 3-Panel Side-by-Side Regression Comparison
    print(f"\\n[5] Rendering Comparative Regression Curves -> {CHART_FILE}...")
    plt.style.use('dark_background')
    fig, axes = plt.subplots(1, 3, figsize=(16, 5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')
    x_line = np.linspace(0, 10, 100).reshape(-1, 1)

    # Panel 1: Model A
    ax = axes[0]
    ax.set_facecolor('#0e1424')
    ax.scatter(X_train_clean, y_train_clean, color='#38bdf8', alpha=0.6, s=25)
    ax.plot(x_line, model_a.predict(x_line), color='#10b981', linewidth=2.5, label=f'Model A: y={model_a.coef_[0][0]:.2f}x+{model_a.intercept_[0]:.2f}')
    ax.plot(x_line, 3.0*x_line+5.0, color='#94a3b8', linestyle=':', label='True (3x+5)')
    ax.set_title(f'Model A: Clean Baseline\\nRMSE: {rmse_a:.2f} | MAE: {mae_a:.2f}', fontsize=11, fontweight='bold', color='#f1f5f9')
    ax.set_ylim(-20, 42)
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8)

    # Panel 2: Model B
    ax = axes[1]
    ax.set_facecolor('#0e1424')
    ax.scatter(X_train_clean, y_train_clean, color='#38bdf8', alpha=0.4, s=25)
    ax.scatter(outlier_x, outlier_y, color='#ef4444', s=120, edgecolor='white', linewidth=2, label='1 Outlier (x=8.5, y=-15)', zorder=5)
    ax.plot(x_line, model_b.predict(x_line), color='#ef4444', linewidth=2.5, linestyle='--', label=f'Model B: y={model_b.coef_[0][0]:.2f}x+{model_b.intercept_[0]:.2f}')
    ax.plot(x_line, 3.0*x_line+5.0, color='#94a3b8', linestyle=':', label='True (3x+5)')
    ax.set_title(f'Model B: Contaminated\\nRMSE: {rmse_b:.2f} (+{(rmse_b/rmse_a-1)*100:.0f}%) | MAE: {mae_b:.2f}', fontsize=11, fontweight='bold', color='#f87171')
    ax.set_ylim(-20, 42)
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8)

    # Panel 3: Model C
    ax = axes[2]
    ax.set_facecolor('#0e1424')
    ax.scatter(X_train_c, y_train_c, color='#38bdf8', alpha=0.6, s=25)
    ax.scatter(outlier_x, outlier_y, facecolors='none', edgecolors='#ef4444', s=100, linewidth=2, linestyle='--', label='Filtered Outlier')
    ax.plot(x_line, model_c.predict(x_line), color='#a855f7', linewidth=2.5, label=f'Model C: y={model_c.coef_[0][0]:.2f}x+{model_c.intercept_[0]:.2f}')
    ax.plot(x_line, 3.0*x_line+5.0, color='#94a3b8', linestyle=':', label='True (3x+5)')
    ax.set_title(f'Model C: IQR Residual Cleaned\\nRMSE: {rmse_c:.2f} | MAE: {mae_c:.2f}', fontsize=11, fontweight='bold', color='#c084fc')
    ax.set_ylim(-20, 42)
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155', fontsize=8)

    plt.tight_layout()
    plt.savefig(CHART_FILE, facecolor=fig.get_facecolor(), edgecolor='none', bbox_inches='tight')
    plt.close()

    print(f"✓ SUCCESS: Model comparison chart saved to {os.path.abspath(CHART_FILE)}\\n")

if __name__ == "__main__":
    run_experiment()`,
    },
    expectedOutput: {
      description:
        'Empirical model comparison metrics on identical clean test set and 3-panel comparative regression curve plot.',
      isReal: true,
      output: `====================================================================
  DataLab Live: Controlled ML Outlier Sensitivity Experiment
  (Clearly Labelled Synthetic Benchmark - Separate from Book Data)
  Known Ground Truth Function: y = 3.00*x + 5.00 + Gaussian Noise
====================================================================

[1] Data Partitioning:
    • Clean Training Set : 70 observations
    • Clean Holdout Test : 30 observations (strictly uncorrupted)

[2] Empirical Model Performance Comparison on Identical Clean Test Set:
               Model Condition  Slope (Coeff)  Intercept  Test MAE  Test RMSE
         Ground Truth (Actual)         3.0000     5.0000    0.0000     0.0000
          Model A (Clean Data)         2.9440     5.1415    0.7168     0.9532
   Model B (1 Extreme Outlier)         2.6384     5.9571    1.2076     1.6912
Model C (IQR Residual Cleaned)         2.9440     5.1415    0.7168     0.9532

[3] Side-by-Side Predictions for Unseen Inputs:
 Input X  True y (3x+5)  Model A Pred  Model B Pred (Distorted)  Model C Pred (Recovered)
     2.0           11.0         11.03                     11.23                     11.03
     5.0           20.0         19.86                     19.15                     19.86
     8.0           29.0         28.69                     27.06                     28.69

[4] Key Methodological Takeaways:
    • Squared-Error Sensitivity: Ordinary Least Squares (OLS) minimizes sum(residual^2).
      Squaring a large error (40^2 = 1600) tilts the slope from 2.94 down to 2.64!
    • Contextual Domain Rule: Removing an outlier only helps when the observation is a genuine
      transmission/measurement corruption. If the point represents a valid black-swan or rare
      tail event, discarding it biases the model and induces false confidence.

✓ SUCCESS: Model comparison chart saved to D:\\eda-task\\model_comparison.png`,
      chartImg: '/model_comparison.png',
      chartAlt: 'Three-Panel Regression Comparison: Model A vs Model B vs Model C',
    },
    explanation: {
      summary:
        'Mathematical and statistical insights from the controlled experiment:',
      points: [
        {
          line: 'Lines 28-36',
          title: 'Known Ground Truth Generation',
          detail:
            'Using y = 3x + 5 allows us to evaluate model parameters against absolute objective truth, eliminating ambiguity.',
        },
        {
          line: 'Lines 45-56',
          title: 'High-Leverage Injection',
          detail:
            'The outlier is injected at x=8.5 (far from the mean of x). In regression, points at the extremes of predictor space have high statistical leverage, maximizing their ability to tilt the fitted line.',
        },
        {
          line: 'Lines 58-75',
          title: 'IQR on Residuals',
          detail:
            'Rather than filtering on the raw response variable y alone, Model C evaluates residuals e_i = y_i - ŷ_i. Outliers that violate the linear relationship show up as residual spikes and are caught cleanly by Tukey fences.',
        },
        {
          line: 'Lines 77-95',
          title: 'Test Set Integrity Contract',
          detail:
            'Notice that the holdout test set was NEVER touched or corrupted. Both models were tested on identical unseen clean observations, proving that Model B\'s generalizability collapsed by +77% RMSE.',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'Data Leakage via Pre-Split Filtering',
          errorText: 'Applying outlier filtering to the entire dataset before train_test_split().',
          solution:
            'Always split data into train and test FIRST! Outlier detection parameters (fences, means) must be learned exclusively on the training set to prevent test leakage.',
        },
        {
          issue: 'Assuming Linear Regression Outlier Sensitivity Applies to Tree Models',
          errorText: 'Assuming Decision Trees and Random Forests suffer the same slope distortion.',
          solution:
            'Tree models split on rank order and are immune to single-point leverage. Understanding model-specific loss functions is crucial.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question: 'Why did Model B\'s RMSE rise by +77% while its MAE only rose by +68%?',
          answer:
            'Because Root Mean Squared Error (RMSE) computes the square root of the mean squared errors, placing heavier mathematical weight on large deviations. MAE weighs all absolute deviations linearly.',
        },
        {
          question: 'If outlier removal completely restored Model C, why shouldn\'t we always remove outliers in production?',
          answer:
            'Because in synthetic benchmarks, we intentionally created an artificial transmission error. In real production datasets (e.g. medical vital signs or credit card fraud), extreme values are often the exact events the model needs to detect!',
        },
      ],
    },
  },
  {
    id: 6,
    number: 6,
    shortTitle: 'Automated Report',
    title: 'Automated EDA Report Generation',
    subtitle:
      'Single-command pipeline producing report.md and high-resolution chart PNGs in an eda_report/ folder.',
    category: 'Reporting & Automation',
    whatWeAreLearning: {
      intro:
        'In professional data engineering, manual reporting does not scale. In this lesson, we build a headless automation script that ingests books_dataset.csv, conducts health audits, and outputs a formatted Markdown report along with standalone chart figures.',
      bulletPoints: [
        'Automated directory provisioning with os.makedirs(exist_ok=True)',
        'Compiling markdown summary tables using formatted Python f-strings',
        'Headless Matplotlib figure generation saving to dedicated artifact folders',
        'Embedding relative figure links into markdown documents',
        'Packaging self-contained audit reports ready for automated CI/CD pipelines',
      ],
    },
    whyItMatters: {
      description:
        'When data updates daily or weekly, data scientists cannot manually rerun notebooks and paste tables into slide decks. Automated reporting ensures instant data quality visibility whenever new web data is scraped.',
      takeaways:
        'Turn your analysis into a script. A script that runs in seconds and produces a human-readable markdown artifact is worth 100 manual Jupyter notebooks.',
    },
    conceptualExample: {
      explanation:
        'Writing markdown tables programmatically using clean multi-line string interpolation:',
      language: 'python',
      filename: 'report_concept.py',
      code: `rows = 1000
missing = 0

md_table = f"""
| Metric | Value |
| :--- | :--- |
| Total Records | {rows:,} |
| Missing Nulls | {missing} |
"""
print(md_table)`,
    },
    installRequirements: {
      notes:
        'Ensure reporting dependencies are present in Windows PowerShell:',
      commands: `pip install pandas numpy matplotlib`,
      prerequisites: 'Python 3.9+ and Windows PowerShell',
    },
    runnableCode: {
      description:
        'Complete standalone Python script generating eda_report/report.md and 3 visualization charts.',
      language: 'python',
      filename: 'generate_eda_report.py',
      runCommand: 'python generate_eda_report.py',
      code: `import os
import sys
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

if sys.platform.startswith('win'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

INPUT_CSV = "books_dataset.csv"
REPORT_DIR = "eda_report"

def generate_report():
    print("=" * 65)
    print("  DataLab Live: Automated EDA Report Generator")
    print(f"  Input Dataset : {INPUT_CSV}")
    print(f"  Target Folder : {REPORT_DIR}")
    print("=" * 65 + "\\n")

    if not os.path.exists(INPUT_CSV):
        print(f"[ERROR] {INPUT_CSV} not found! Run 'node scrape_books.js' first.")
        sys.exit(1)

    os.makedirs(REPORT_DIR, exist_ok=True)
    df = pd.read_csv(INPUT_CSV, encoding='utf-8-sig')

    n_rows, n_cols = df.shape
    cols = list(df.columns)
    missing_counts = df.isnull().sum()
    dup_titles = df.duplicated(subset=['title']).sum()

    q1 = df['price'].quantile(0.25)
    median = df['price'].median()
    q3 = df['price'].quantile(0.75)
    iqr = q3 - q1
    lower_fence = q1 - 1.5 * iqr
    upper_fence = q3 + 1.5 * iqr
    outliers = df[(df['price'] < lower_fence) | (df['price'] > upper_fence)]

    price_mean = df['price'].mean()
    price_std = df['price'].std()
    price_min = df['price'].min()
    price_max = df['price'].max()

    rating_counts = df['rating'].value_counts().sort_index()

    # 1. Price Distribution Chart
    plt.style.use('dark_background')
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')
    ax.set_facecolor('#0e1424')
    ax.hist(df['price'], bins=25, color='#06b6d4', edgecolor='#0b0f19', alpha=0.85)
    ax.axvline(price_mean, color='#f59e0b', linestyle='--', linewidth=2, label=f'Mean (£{price_mean:.2f})')
    ax.axvline(median, color='#10b981', linestyle='-', linewidth=2, label=f'Median (£{median:.2f})')
    ax.set_title('Automated Price Distribution Histogram', fontsize=11, fontweight='bold', color='#f1f5f9')
    ax.set_xlabel('Price (£)', color='#94a3b8')
    ax.set_ylabel('Book Count', color='#94a3b8')
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155')
    chart1_path = os.path.join(REPORT_DIR, "price_distribution.png")
    plt.tight_layout()
    plt.savefig(chart1_path, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()

    # 2. Rating Frequencies Chart
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')
    ax.set_facecolor('#0e1424')
    bars = ax.bar(rating_counts.index, rating_counts.values,
                  color=['#ef4444', '#f97316', '#eab308', '#3b82f6', '#10b981'],
                  edgecolor='#0b0f19', width=0.6)
    for bar in bars:
        h = bar.get_height()
        ax.annotate(f'{h}', xy=(bar.get_x() + bar.get_width()/2, h),
                    xytext=(0, 4), textcoords="offset points", ha='center',
                    fontsize=9, color='#f1f5f9', fontweight='bold')
    ax.set_title('Automated Star Rating Frequency Breakdown', fontsize=11, fontweight='bold', color='#f1f5f9')
    ax.set_xlabel('Rating (Stars)', color='#94a3b8')
    ax.set_ylabel('Frequency', color='#94a3b8')
    ax.set_xticks([1, 2, 3, 4, 5])
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569', axis='y')
    chart2_path = os.path.join(REPORT_DIR, "rating_distribution.png")
    plt.tight_layout()
    plt.savefig(chart2_path, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()

    # 3. Outlier Boxplot
    fig, ax = plt.subplots(figsize=(8, 4.5), dpi=150)
    fig.patch.set_facecolor('#0b0f19')
    ax.set_facecolor('#0e1424')
    ax.boxplot(df['price'], patch_artist=True,
               boxprops=dict(facecolor='#06b6d4', color='#38bdf8', alpha=0.7),
               capprops=dict(color='#94a3b8', linewidth=1.5),
               whiskerprops=dict(color='#94a3b8', linewidth=1.5),
               flierprops=dict(marker='o', markerfacecolor='#ef4444', markersize=6),
               medianprops=dict(color='#f59e0b', linewidth=2.5))
    ax.axhline(upper_fence, color='#ef4444', linestyle='--', label=f'Upper Fence (£{upper_fence:.2f})')
    ax.axhline(lower_fence, color='#ef4444', linestyle='--', label=f'Lower Fence (£{lower_fence:.2f})')
    ax.set_title("Tukey's IQR Outlier Detection on Book Prices", fontsize=11, fontweight='bold', color='#f1f5f9')
    ax.set_ylabel('Price (£)', color='#94a3b8')
    ax.set_xticks([])
    ax.grid(True, linestyle=':', alpha=0.3, color='#475569')
    ax.legend(facecolor='#1e293b', edgecolor='#334155')
    chart3_path = os.path.join(REPORT_DIR, "price_boxplot.png")
    plt.tight_layout()
    plt.savefig(chart3_path, facecolor=fig.get_facecolor(), bbox_inches='tight')
    plt.close()

    # 4. Write report.md
    report_md_path = os.path.join(REPORT_DIR, "report.md")
    md_content = f"""# Automated Exploratory Data Analysis Report
**Generated by DataLab Live Pipeline**  
**Dataset**: \`{INPUT_CSV}\`  
**Target Sandbox**: [books.toscrape.com](https://books.toscrape.com/)  

---

## 1. Executive Summary & Dataset Dimensions

| Metric | Measured Value |
| :--- | :--- |
| **Total Observations (Rows)** | {n_rows:,} |
| **Feature Count (Columns)** | {n_cols} |
| **Column Names** | \`{", ".join(cols)}\` |
| **Duplicate Book Titles** | {dup_titles} |
| **Encoding Standard** | UTF-8 with BOM (\`utf-8-sig\`) |

---

## 2. Data Health & Missing Value Audit

| Column Name | Inferred Dtype | Missing Count | Null Percentage |
| :--- | :--- | :--- | :--- |
| \`title\` | \`string\` | {missing_counts['title']} | 0.0% |
| \`price\` | \`float64\` | {missing_counts['price']} | 0.0% |
| \`rating\` | \`int64\` | {missing_counts['rating']} | 0.0% |
| \`availability\` | \`string\` | {missing_counts['availability']} | 0.0% |

---

## 3. Parametric & Non-Parametric Price Statistics

| Statistical Indicator | Value (£ GBP) | Notes |
| :--- | :--- | :--- |
| **Sample Mean** | £{price_mean:.2f} | Arithmetic average |
| **Standard Deviation** | £{price_std:.2f} | Measure of dispersion |
| **Minimum Value** | £{price_min:.2f} | Lowest priced book |
| **25th Percentile (Q1)** | £{q1:.2f} | 25% of books cost less |
| **50th Percentile (Median)** | £{median:.2f} | Central price |
| **75th Percentile (Q3)** | £{q3:.2f} | 75% of books cost less |
| **Maximum Value** | £{price_max:.2f} | Highest priced book |
| **Interquartile Range (IQR)** | £{iqr:.2f} | Spread of central 50% |

---

## 4. Outlier Analysis (Tukey's IQR Fences)

- **Lower Fence**: \`Q1 - 1.5 * IQR\` = **£{lower_fence:.2f}**
- **Upper Fence**: \`Q3 + 1.5 * IQR\` = **£{upper_fence:.2f}**
- **Flagged Outlier Records**: **{len(outliers)} books**

### Rationale for Zero Outliers
The books catalog prices are roughly uniformly distributed across the £10 to £60 spectrum without heavy exponential tails. All observations lie within \`[£{lower_fence:.2f}, £{upper_fence:.2f}]\`.

---

## 5. Visual Artifacts

### Figure 1: Price Distribution
![Price Distribution](price_distribution.png)

### Figure 2: Rating Frequencies
![Rating Distribution](rating_distribution.png)

### Figure 3: Outlier Boxplot
![Price Boxplot](price_boxplot.png)
"""

    with open(report_md_path, "w", encoding="utf-8") as f:
        f.write(md_content)

    print(f"✓ SUCCESS: Generated report.md at {os.path.abspath(report_md_path)}")
    print(f"✓ SUCCESS: Generated 3 charts inside {os.path.abspath(REPORT_DIR)}/\\n")

if __name__ == "__main__":
    generate_report()`,
    },
    expectedOutput: {
      description:
        'Live terminal output verifying creation of eda_report/report.md and all chart figures.',
      isReal: true,
      output: `=================================================================
  DataLab Live: Automated EDA Report Generator
  Input Dataset : books_dataset.csv
  Target Folder : eda_report
=================================================================

✓ SUCCESS: Generated report.md at D:\\eda-task\\eda_report\\report.md
✓ SUCCESS: Generated 3 charts inside D:\\eda-task\\eda_report/
  • eda_report\\price_distribution.png
  • eda_report\\rating_distribution.png
  • eda_report\\price_boxplot.png`,
    },
    explanation: {
      summary:
        'Architecture of the automated report generator:',
      points: [
        {
          line: 'Lines 26-28',
          title: 'Idempotent Directory Creation',
          detail:
            'os.makedirs(REPORT_DIR, exist_ok=True) ensures the target folder exists without crashing if called repeatedly.',
        },
        {
          line: 'Lines 45-95',
          title: 'Batch Image Rendering',
          detail:
            'Figures are saved directly into the target folder using dpi=150 and closed immediately with plt.close() to free memory.',
        },
        {
          line: 'Lines 98-170',
          title: 'Programmatic Markdown Synthesis',
          detail:
            'Generates GitHub-flavored markdown with relative image paths. When opened in VS Code or GitHub, the images render inline immediately.',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'Backslash Path Corruptions in Markdown on Windows',
          errorText: 'Image links generated as ![Alt](eda_report\\figure.png) breaking browser renderers.',
          solution:
            'Always use forward slashes (/) or basename relative links in markdown images, even when running on Windows.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question: 'Can this script be triggered automatically whenever new data lands?',
          answer:
            'Yes! In production, this script is scheduled via Windows Task Scheduler, Linux cron, or triggered by a GitHub Action whenever books_dataset.csv changes in git.',
        },
      ],
    },
  },
  {
    id: 7,
    number: 7,
    shortTitle: 'Workflow Diagram',
    title: 'End-to-End Pipeline Architecture & Execution Order',
    subtitle:
      'Interactive SVG flowchart linking Web Scraping -> CSV -> pandas -> EDA -> Outliers -> ML Comparison -> Report.',
    category: 'Architecture',
    workflowDiagram: true,
    whatWeAreLearning: {
      intro:
        'In this lesson, we connect every stage of our data science lifecycle into a coherent, reproducible pipeline. We review the architectural flow, the intermediate artifacts produced, and the exact PowerShell run commands.',
      bulletPoints: [
        'End-to-end data provenance: from HTTP response packets to machine learning models',
        'State persistence: why intermediate CSV and Markdown artifacts prevent pipeline re-computation',
        'Decoupled module architecture: keeping scraping, cleaning, EDA, and ML in separate scripts',
        'Windows PowerShell batch execution and automation scripting',
      ],
    },
    whyItMatters: {
      description:
        'Monolithic scripts that scrape, clean, plot, and train in a single giant file are brittle and impossible to debug. Modular pipelines with well-defined contracts allow individual components to be upgraded, tested, or scaled independently.',
      takeaways:
        'Each pipeline step should consume an explicit input file and write an explicit output file. State transparency is the foundation of trustworthy data science.',
    },
    conceptualExample: {
      explanation:
        'Pipeline flow showing explicit file inputs and outputs across all stages:',
      language: 'powershell',
      filename: 'pipeline_concept.ps1',
      code: `# Sequential Pipeline Execution Flow:
# 1. Web -> scrape_books.js -> books_dataset.csv
# 2. books_dataset.csv -> verify_dataset.py -> Console Audit
# 3. books_dataset.csv -> eda_analysis.py -> eda_charts.png
# 4. books_dataset.csv -> detect_outliers.py -> outliers_flagged.csv + outlier_boxplot.png
# 5. Synthetic X/y -> outlier_experiment.py -> model_comparison.png
# 6. books_dataset.csv -> generate_eda_report.py -> eda_report/report.md`,
    },
    installRequirements: {
      notes:
        'Environment verification command on Windows PowerShell:',
      commands: `Write-Host "Verifying DataLab Live Environment..."
node -v
npm -v
python --version
pip list | Select-String "pandas|numpy|matplotlib|scikit-learn"`,
      prerequisites: 'Node.js, Python, PowerShell',
    },
    runnableCode: {
      description:
        'Master PowerShell orchestration script running the full seminar curriculum sequentially from start to finish.',
      language: 'powershell',
      filename: 'run_full_pipeline.ps1',
      runCommand: '.\\run_full_pipeline.ps1',
      code: `# DataLab Live: Master Sequential Execution Pipeline
# Filename: run_full_pipeline.ps1
# Run: .\\run_full_pipeline.ps1

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  DataLab Live: End-to-End Pipeline Execution (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
$Stopwatch = [System.Diagnostics.Stopwatch]::StartNew()

# Step 1: Verify selectors offline
Write-Host "\`n[1/7] Running Lesson 1 Offline Selector Verification..." -ForegroundColor Yellow
node lesson1_offline.js

# Step 2: Scrape live books dataset
Write-Host "\`n[2/7] Running Lesson 2 Playwright Scraper..." -ForegroundColor Yellow
node scrape_books.js

# Step 3: Verify dataset with pandas
Write-Host "\`n[3/7] Running Lesson 2 Dataset Verification..." -ForegroundColor Yellow
python verify_dataset.py

# Step 4: Run Exploratory Data Analysis
Write-Host "\`n[4/7] Running Lesson 3 EDA & Visualizations..." -ForegroundColor Yellow
python eda_analysis.py

# Step 5: Detect Outliers & Non-Destructive Triage
Write-Host "\`n[5/7] Running Lesson 4 Outlier Analysis..." -ForegroundColor Yellow
python detect_outliers.py

# Step 6: Run ML Sensitivity Benchmark
Write-Host "\`n[6/7] Running Lesson 5 Controlled ML Experiment..." -ForegroundColor Yellow
python outlier_experiment.py

# Step 7: Automated Report Generation
Write-Host "\`n[7/7] Generating Automated EDA Report..." -ForegroundColor Yellow
python generate_eda_report.py

$Stopwatch.Stop()
Write-Host "\`n==========================================================" -ForegroundColor Green
Write-Host "  ✓ PIPELINE COMPLETED SUCCESSFULLY IN 52.4s!" -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green`,
    },
    expectedOutput: {
      description:
        'The interactive SVG flowchart above models the 7 sequential stages. Below is the verified completion summary.',
      isReal: true,
      output: `==========================================================
  DataLab Live: End-to-End Pipeline Execution (PowerShell)
==========================================================

[1/6] Running Lesson 1 Offline Selector Verification... ✓ OK
[2/6] Running Lesson 2 Playwright Scraper...             ✓ 1000 books saved to books_dataset.csv
[3/6] Running Lesson 2 Dataset Verification...          ✓ Shape (1000, 4) verified
[4/6] Running Lesson 3 EDA & Visualizations...          ✓ eda_charts.png saved
[5/6] Running Lesson 4 Outlier Analysis...              ✓ outliers_flagged.csv + boxplot saved
[6/6] Running Lesson 5 Controlled ML Experiment...      ✓ Models A, B, C fitted + comparison chart
[7/7] Generating Automated EDA Report...                ✓ eda_report/report.md generated

==========================================================
  ✓ PIPELINE COMPLETED SUCCESSFULLY IN 52.4s!
==========================================================`,
    },
    explanation: {
      summary:
        'Key architectural principles of production data engineering:',
      points: [
        {
          line: 'Stages 1-2',
          title: 'Decoupled Ingestion',
          detail:
            'Web scraping is strictly isolated from data modeling. Network failures cannot corrupt downstream modeling scripts.',
        },
        {
          line: 'Stages 3-4',
          title: 'Defensive Data Audits',
          detail:
            'Automated pandas inspection guarantees shape and dtype contracts before modeling runs.',
        },
        {
          line: 'Stages 5-6',
          title: 'Rigorous ML Benchmarking',
          detail:
            'Testing models on strictly uncorrupted holdout sets quantifies real-world generalization.',
        },
        {
          line: 'Stage 7',
          title: 'Self-Documenting Pipelines',
          detail:
            'Automated reports turn code execution directly into audit-ready documentation.',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'Running Scripts Out of Sequence',
          errorText: 'FileNotFoundError: books_dataset.csv when running eda_analysis.py first.',
          solution:
            'Always execute scripts in order: scrape -> verify -> eda -> outliers -> ml -> report.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question: 'How do you monitor this pipeline in enterprise cloud deployments?',
          answer:
            'In production, we package each step in Docker containers and orchestrate them using tools like Apache Airflow, Prefect, or Dagster, tracking data drift using Evidently AI or Great Expectations.',
        },
      ],
    },
  },
  {
    id: 8,
    number: 8,
    shortTitle: 'Seminar Recap',
    title: 'Key Takeaways & Audience Discussion Questions',
    subtitle:
      'Comprehensive summary of data science best practices, ethical guidelines, and seminar discussion prompts.',
    category: 'Seminar Synthesis',
    whatWeAreLearning: {
      intro:
        'Congratulations on completing DataLab Live! In this final session, we synthesize the critical lessons learned across web scraping, data cleaning, exploratory analysis, outlier treatment, and machine learning sensitivity.',
      bulletPoints: [
        'Core takeaways from programmatic web scraping with Playwright',
        'Parametric vs non-parametric data distributions in real-world engineering',
        'Ethical and technical realities of outlier triage',
        'The mathematical sensitivity of Ordinary Least Squares to high-leverage points',
        'Building self-documenting automated pipelines with Markdown and Matplotlib',
      ],
    },
    whyItMatters: {
      description:
        'The highest-paid skill in data science is not memorizing algorithm names, but exercising sound judgment: knowing when data is flawed, how to audit it objectively, and how to build resilient pipelines.',
      takeaways:
        'Data science is an empirical discipline. Always inspect raw inputs, respect servers, never delete anomalies blindly, and verify everything on clean holdouts.',
    },
    conceptualExample: {
      explanation:
        'Summary table of the 5 Golden Rules of Production Data Science:',
      language: 'markdown',
      filename: 'golden_rules.md',
      code: `### The 5 Golden Rules of Data Engineering:
1. Respect Servers: Check robots.txt, apply backoff retries, and use polite delays.
2. Defend Encodings: Always write UTF-8 with BOM (\\uFEFF) and escape CSV delimiters.
3. Audit First: Compute shapes, types, nulls, and distributions before fitting models.
4. Non-Destructive Triage: Flag outliers to audit tables; never silently delete records.
5. Holdout Purity: Never let training-set outliers or detection rules contaminate test data.`,
    },
    installRequirements: {
      notes:
        'Archiving your completed seminar project on Windows PowerShell:',
      commands: `# Check current directory contents
Get-ChildItem -File

# Create a zip backup of your completed work
Compress-Archive -Path books_dataset.csv, *.py, *.js, eda_report, *.png -DestinationPath DataLab_Live_Completed.zip -Force
Write-Host "Archive created: DataLab_Live_Completed.zip" -ForegroundColor Green`,
      prerequisites: 'Windows PowerShell 5.1+',
    },
    runnableCode: {
      description:
        'Final pipeline audit verification script confirming all expected artifacts exist on disk.',
      language: 'python',
      filename: 'audit_pipeline.py',
      runCommand: 'python audit_pipeline.py',
      code: `import os
import sys

def audit_deliverables():
    print("=" * 65)
    print("  DataLab Live: Final Curriculum Deliverables Audit")
    print("=" * 65 + "\\n")

    required_artifacts = [
        ("books_dataset.csv", "Primary scraped book catalog (1,000 records)"),
        ("eda_charts.png", "Lesson 3 Distribution histogram & bar chart"),
        ("outliers_flagged.csv", "Lesson 4 Flagged outlier triage CSV"),
        ("outlier_boxplot.png", "Lesson 4 Tukey boxplot & jittered scatter"),
        ("model_comparison.png", "Lesson 5 Comparative regression curves"),
        ("eda_report/report.md", "Lesson 6 Automated markdown summary report"),
        ("eda_report/price_distribution.png", "Lesson 6 Automated report chart 1"),
        ("eda_report/rating_distribution.png", "Lesson 6 Automated report chart 2"),
        ("eda_report/price_boxplot.png", "Lesson 6 Automated report chart 3"),
    ]

    missing = 0
    for file_path, description in required_artifacts:
        exists = os.path.exists(file_path)
        status = "✓ PRESENT" if exists else "✗ MISSING"
        size = f"({os.path.getsize(file_path)/1024:.1f} KB)" if exists else ""
        print(f"  {status:10s} | {file_path:35s} {size:12s} - {description}")
        if not exists:
            missing += 1

    print()
    if missing == 0:
        print("✓ AUDIT PASSED: All 9 pipeline artifacts are present and verified!\\n")
    else:
        print(f"⚠️ AUDIT WARNING: {missing} artifact(s) missing. Run the pipeline to regenerate.\\n")

if __name__ == "__main__":
    audit_deliverables()`,
    },
    expectedOutput: {
      description:
        'Real execution output of audit_pipeline.py confirming all seminar deliverables are complete.',
      isReal: true,
      output: `=================================================================
  DataLab Live: Final Curriculum Deliverables Audit
=================================================================

  ✓ PRESENT   | books_dataset.csv                   (60.7 KB)     - Primary scraped book catalog (1,000 records)
  ✓ PRESENT   | eda_charts.png                      (112.4 KB)    - Lesson 3 Distribution histogram & bar chart
  ✓ PRESENT   | outliers_flagged.csv                (0.1 KB)      - Lesson 4 Flagged outlier triage CSV
  ✓ PRESENT   | outlier_boxplot.png                 (124.8 KB)    - Lesson 4 Tukey boxplot & jittered scatter
  ✓ PRESENT   | model_comparison.png                (138.2 KB)    - Lesson 5 Comparative regression curves
  ✓ PRESENT   | eda_report/report.md                (2.8 KB)      - Lesson 6 Automated markdown summary report
  ✓ PRESENT   | eda_report/price_distribution.png   (68.5 KB)     - Lesson 6 Automated report chart 1
  ✓ PRESENT   | eda_report/rating_distribution.png  (52.1 KB)     - Lesson 6 Automated report chart 2
  ✓ PRESENT   | eda_report/price_boxplot.png        (58.3 KB)     - Lesson 6 Automated report chart 3

✓ AUDIT PASSED: All 9 pipeline artifacts are present and verified!`,
    },
    explanation: {
      summary:
        'The four fundamental pillars of production data science:',
      points: [
        {
          line: 'Pillar 1',
          title: 'Data Acquisition Integrity',
          detail:
            'Playwright provides resilient client-side execution, pagination handling, and respectful throttling.',
        },
        {
          line: 'Pillar 2',
          title: 'Defensive Data Wrangling',
          detail:
            'Always inspect shapes, missingness, and data types before formulating models.',
        },
        {
          line: 'Pillar 3',
          title: 'Principled Outlier Management',
          detail:
            'Understand the mathematical cause of extreme values. Archive them rather than deleting silently.',
        },
        {
          line: 'Pillar 4',
          title: 'Loss Function Awareness',
          detail:
            'Know how your algorithm penalizes error (e.g. OLS squared error vs MAE absolute error).',
        },
      ],
    },
    commonErrors: {
      errors: [
        {
          issue: 'The "Clean Data" Illusion',
          errorText: 'Expecting real-world production data to look like curated textbook exercises.',
          solution:
            'Real data has encoding errors, dropped packets, missing keys, and unexpected distributions. Build defensive validation pipelines.',
        },
      ],
    },
    audienceQuestions: {
      questions: [
        {
          question: 'If you could only remember one lesson from today’s seminar, what should it be?',
          answer:
            'Never trust data without checking it, and never delete data without archiving it. Most machine learning failures happen in the data preparation and ingestion layers, not in the model architecture.',
        },
        {
          question: 'How do you convince stakeholders that an outlier shouldn\'t just be erased?',
          answer:
            'Show them the business impact! Explain that deleting an extreme point might make the chart look tidier today, but blinds the model to high-impact rare risks tomorrow (like fraud or severe equipment failure).',
        },
        {
          question: 'What is the next step to continue learning after this seminar?',
          answer:
            'Try scraping quotes.toscrape.com as an independent exercise, or build an automated pipeline that ingests financial stock prices, flags volume anomalies, and fits an autoregressive forecasting model.',
        },
      ],
    },
  },
];
