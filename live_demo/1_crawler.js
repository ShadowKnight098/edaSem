/**
 * STEP 1: WEB CRAWLER — Playwright + Node.js
 * Target: https://books.toscrape.com/
 * Output: books_dataset.csv
 * Records: Exactly 20 books
 *
 * Run:
 *   npm install playwright
 *   npx playwright install chromium
 *   node 1_crawler.js
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = 'https://books.toscrape.com/catalogue/page-1.html';
const OUTPUT_FILE = path.resolve('books_dataset.csv');
const MAX_RECORDS = 20;
const POLITE_DELAY_MS = 150;

const RATING_MAP = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Escape CSV values safely.
function escapeCsv(value) {
  if (value === null || value === undefined) return '""';

  const str = String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

async function runCrawler() {
  console.log('============================================');
  console.log(' DataLab Live: Playwright Web Crawler');
  console.log(` Target records: ${MAX_RECORDS}`);
  console.log('============================================\n');

  const startTime = Date.now();
  let browser;

  const scrapedBooks = [];
  const visitedUrls = new Set();

  try {
    console.log('[1/4] Launching Chromium...');

    browser = await chromium.launch({ headless: true });

    const context = await browser.newContext({
      userAgent: 'DataLabSeminar/1.0 (Educational Scraping Demo)'
    });

    const page = await context.newPage();
    page.setDefaultTimeout(15000);

    let currentUrl = BASE_URL;

    console.log('[2/4] Scraping book records...\n');

    while (currentUrl && scrapedBooks.length < MAX_RECORDS) {
      if (visitedUrls.has(currentUrl)) {
        console.log('Already visited this page. Stopping pagination.');
        break;
      }

      visitedUrls.add(currentUrl);

      console.log(`Opening: ${currentUrl}`);

      await page.goto(currentUrl, {
        waitUntil: 'domcontentloaded',
        timeout: 30000
      });

      const bookCards = page.locator('article.product_pod');
      const booksOnPage = await bookCards.count();

      if (booksOnPage === 0) {
        console.log('No book records found on this page.');
        break;
      }

      for (
        let i = 0;
        i < booksOnPage && scrapedBooks.length < MAX_RECORDS;
        i++
      ) {
        const card = bookCards.nth(i);

        // Extract the full book title.
        let title = await card.locator('h3 a').getAttribute('title');

        if (!title) {
          title = await card.locator('h3 a').innerText();
        }

        title = title.trim();

        // Extract price as a number.
        const rawPrice = await card.locator('.price_color').innerText();

        const price = Number.parseFloat(
          rawPrice.replace(/[^0-9.]/g, '')
        );

        // Extract rating from its CSS class.
        const ratingClass =
          (await card.locator('.star-rating').getAttribute('class')) || '';

        const ratingWord = ratingClass
          .split(/\s+/)
          .find((word) => word !== 'star-rating')
          ?.toLowerCase();

        const rating = RATING_MAP[ratingWord] ?? 0;

        // Extract availability.
        const rawAvailability =
          await card.locator('.availability').innerText();

        const availability = rawAvailability
          .trim()
          .replace(/\s+/g, ' ');

        // Validate the extracted record.
        if (!title || !Number.isFinite(price)) {
          console.warn(`Skipping invalid record: ${title || 'Unknown'}`);
          continue;
        }

        scrapedBooks.push({
          title,
          price,
          rating,
          availability
        });

        console.log(
          `${String(scrapedBooks.length).padStart(2, '0')}. ` +
          `${title} | £${price.toFixed(2)} | ${rating} star(s)`
        );
      }

      console.log(
        `Page processed. Total records: ${scrapedBooks.length}\n`
      );

      // Stop immediately when 20 records have been collected.
      if (scrapedBooks.length >= MAX_RECORDS) {
        break;
      }

      // Find the next page.
      const nextButton = page.locator('li.next a');

      if ((await nextButton.count()) === 0) {
        currentUrl = null;
      } else {
        const nextHref = await nextButton.getAttribute('href');

        currentUrl = nextHref
          ? new URL(nextHref, currentUrl).href
          : null;

        if (currentUrl) {
          await sleep(POLITE_DELAY_MS);
        }
      }
    }

    if (scrapedBooks.length === 0) {
      throw new Error('No books were scraped. Check your internet connection.');
    }

    console.log('[3/4] Saving CSV file...');

    const header = [
      'title',
      'price',
      'rating',
      'availability'
    ].join(',');

    const rows = scrapedBooks.map((book) =>
      [
        escapeCsv(book.title),
        book.price.toFixed(2),
        book.rating,
        escapeCsv(book.availability)
      ].join(',')
    );

    // UTF-8 BOM helps Excel display text correctly.
    const csvContent =
      '\uFEFF' + [header, ...rows].join('\r\n');

    fs.writeFileSync(OUTPUT_FILE, csvContent, 'utf8');

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n[4/4] Scraping completed!');
    console.log(`Records collected: ${scrapedBooks.length}`);
    console.log(`CSV saved to: ${OUTPUT_FILE}`);
    console.log(`Time taken: ${elapsed} seconds`);

    if (scrapedBooks.length < MAX_RECORDS) {
      console.warn(
        `Only ${scrapedBooks.length} records were collected, not ${MAX_RECORDS}.`
      );
    }
  } catch (error) {
    console.error('\nCrawler error:', error.message);
    process.exitCode = 1;
  } finally {
    if (browser) {
      await browser.close();
      console.log('Browser closed.');
    }
  }
}

runCrawler();