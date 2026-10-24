import { chromium, firefox, webkit } from "@playwright/test";

// The dev servers compile pages (and their imports) on first request;
// load each one before tests run so the first tests don't time out waiting for them
const URLS = [
  "http://localhost:3010/list",
  "http://localhost:3010/grid",
  "http://localhost:3010/list-dynamic",
  "http://localhost:3011/list",
  "http://localhost:3011/grid",
  "http://localhost:3011/list-dynamic",
  // All Vite routes are bundled together, so one page loads them all
  "http://localhost:3012/list"
];

const TIMEOUT = 120_000;

async function waitForServer(url: string) {
  const deadline = Date.now() + TIMEOUT;
  while (true) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // Not listening yet
    }
    if (Date.now() > deadline) {
      throw new Error(`Timed out waiting for ${url}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
}

export default async function globalSetup() {
  await Promise.all(URLS.map(waitForServer));

  // CI only installs the browser being tested, so use whichever one is available
  for (const browserType of [chromium, firefox, webkit]) {
    let browser;
    try {
      browser = await browserType.launch();
    } catch {
      continue;
    }
    try {
      const page = await browser.newPage();
      for (const url of URLS) {
        await page.goto(url, { timeout: TIMEOUT });
        await page.waitForSelector('[role="list"], [role="grid"]', {
          timeout: TIMEOUT
        });
      }
    } finally {
      await browser.close();
    }
    return;
  }
}
