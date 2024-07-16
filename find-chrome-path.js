const puppeteerCore = require('puppeteer-core');

(async () => {
  try {
    const browser = await puppeteerCore.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const executablePath = browser.process().spawnfile;
    console.log('Chrome executable path:', executablePath);

    await browser.close();
  } catch (error) {
    console.error('Error finding Chrome executable path:', error);
  }
})();
