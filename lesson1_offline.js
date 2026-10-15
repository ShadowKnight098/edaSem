import { chromium } from 'playwright';

/**
 * DataLab Live - Lesson 1: Web Scraping Concepts
 * Filename: lesson1_offline.js
 * Run command: node lesson1_offline.js
 * 
 * Demonstrates offline mock scraping with page.setContent()
 * to verify CSS selectors without network latency.
 */

async function runLesson1Demo() {
  console.log('[1/4] Launching headless Chromium browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('[2/4] Injecting mock HTML DOM content into memory...');
  await page.setContent(`
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
  `);

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
});
