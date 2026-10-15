import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

/**
 * DataLab Live - Lesson 2: Full Dataset Scraper
 * Target: https://books.toscrape.com/
 * Optional Exercise Target: https://quotes.toscrape.com/
 * 
 * Features:
 * - Automated pagination traversal until 'next' is absent
 * - 3-attempt exponential backoff retry mechanism
 * - Polite delay between HTTP requests
 * - Clean numeric price parsing and rating word-to-integer mapping
 * - Proper CSV formatting with UTF-8 BOM (\uFEFF) and RFC 4180 field quoting
 */

const START_URL = 'https://books.toscrape.com/catalogue/page-1.html';
const OUTPUT_FILE = path.resolve('books_dataset.csv');
const MAX_RETRIES = 3;
const POLITE_DELAY_MS = 150; // 150ms respectful pause between page requests

// Word rating to integer map
const RATING_MAP = {
  'one': 1,
  'two': 2,
  'three': 3,
  'four': 4,
  'five': 5
};

// Helper for polite delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// CSV row escaper adhering strictly to RFC 4180
function escapeCsvField(field) {
  if (field === null || field === undefined) return '""';
  const stringVal = String(field);
  if (stringVal.includes(',') || stringVal.includes('"') || stringVal.includes('\n') || stringVal.includes('\r')) {
    return `"${stringVal.replace(/"/g, '""')}"`;
  }
  return `"${stringVal}"`;
}

// Fetch a single page with up to 3 retries
async function fetchPageWithRetry(page, url, maxRetries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      return true;
    } catch (err) {
      console.warn(`[WARN] Attempt ${attempt}/${maxRetries} failed for ${url}: ${err.message}`);
      if (attempt === maxRetries) {
        throw new Error(`Failed to load ${url} after ${maxRetries} attempts.`);
      }
      await sleep(1500 * attempt); // Progressive backoff
    }
  }
  return false;
}

async function scrapeBooksDataset() {
  console.log('================================================================');
  console.log('  DataLab Live: Headless Playwright Books Scraper');
  console.log(`  Target: https://books.toscrape.com/`);
  console.log(`  Output: ${OUTPUT_FILE}`);
  console.log('================================================================\n');

  const startTime = Date.now();
  let browser = null;
  const allBooks = [];

  try {
    console.log('[Init] Launching Chromium headless browser...');
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'DataLabSeminarBot/1.0 (+https://github.com/datalab-live/education-demo)'
    });
    const page = await context.newPage();

    let currentUrl = START_URL;
    let pageNumber = 1;

    while (currentUrl) {
      console.log(`[Page ${String(pageNumber).padStart(2, ' ')}] Fetching: ${currentUrl}`);
      
      await fetchPageWithRetry(page, currentUrl);

      // Extract all book cards on the current page
      const bookCards = page.locator('article.product_pod');
      const countOnPage = await bookCards.count();

      for (let i = 0; i < countOnPage; i++) {
        const card = bookCards.nth(i);

        // 1. Title: full title in the 'title' attribute of <h3><a>
        let title = await card.locator('h3 a').getAttribute('title');
        if (!title) {
          title = await card.locator('h3 a').innerText();
        }
        title = title.trim();

        // 2. Price: raw string like '£51.77' -> parsed float 51.77
        const rawPrice = await card.locator('.price_color').innerText();
        const price = parseFloat(rawPrice.replace(/[^0-9.]/g, ''));

        // 3. Rating: class 'star-rating Three' -> integer 3
        const ratingClasses = await card.locator('.star-rating').getAttribute('class') || '';
        const ratingWord = ratingClasses
          .split(' ')
          .find((c) => c.toLowerCase() !== 'star-rating')
          ?.toLowerCase() || '';
        const rating = RATING_MAP[ratingWord] || null;

        // 4. Availability: 'In stock' or 'Out of stock'
        const rawAvailability = await card.locator('.availability').innerText();
        const availability = rawAvailability.trim().replace(/\s+/g, ' ');

        allBooks.push({
          title,
          price,
          rating,
          availability
        });
      }

      console.log(`         ↳ Extracted ${countOnPage} books. Total so far: ${allBooks.length}`);

      // Check for pagination 'next' button
      const nextButton = page.locator('li.next a');
      const hasNext = (await nextButton.count()) > 0;

      if (hasNext) {
        const nextHref = await nextButton.getAttribute('href');
        currentUrl = new URL(nextHref, currentUrl).href;
        pageNumber++;
        await sleep(POLITE_DELAY_MS);
      } else {
        console.log('\n[Pagination] Reached last page. No next button found.');
        currentUrl = null;
      }
    }

    console.log(`\n[Export] Writing ${allBooks.length} records to ${OUTPUT_FILE}...`);
    
    // Write CSV with UTF-8 BOM (\uFEFF)
    const header = ['title', 'price', 'rating', 'availability'].join(',');
    const rows = allBooks.map((b) =>
      [
        escapeCsvField(b.title),
        b.price.toFixed(2),
        b.rating,
        escapeCsvField(b.availability)
      ].join(',')
    );

    const csvContent = '\uFEFF' + [header, ...rows].join('\r\n');
    fs.writeFileSync(OUTPUT_FILE, csvContent, 'utf8');

    const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`✓ SUCCESS: Exported ${allBooks.length} rows in ${durationSec}s to books_dataset.csv`);
    console.log(`  File size: ${(fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1)} KB`);

  } catch (error) {
    console.error('\n[FATAL ERROR] Scraping job failed:', error);
    process.exit(1);
  } finally {
    if (browser) {
      await browser.close();
      console.log('[Cleanup] Browser session closed cleanly.\n');
    }
  }
}

scrapeBooksDataset();
