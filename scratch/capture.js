const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  console.log('Launching puppeteer...');
  try {
    const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 1600 });
    
    console.log('Navigating to results...');
    await page.goto('http://localhost:5176/results', { waitUntil: 'networkidle2' });
    
    console.log('Scrolling to winners section...');
    // Scroll a bit so animations trigger
    await page.evaluate(() => {
      window.scrollTo(0, 800);
    });
    
    // Wait for animations to settle
    await new Promise(r => setTimeout(r, 2000));
    
    console.log('Taking screenshot...');
    await page.screenshot({ path: 'screenshot.png', fullPage: true });
    
    await browser.close();
    console.log('Screenshot saved to scratch/screenshot.png');
  } catch (err) {
    console.error('Failed:', err);
  }
})();
