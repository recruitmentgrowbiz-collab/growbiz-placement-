const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");

const base = process.env.QA_BASE_URL || "http://localhost:3102";
const output = process.env.QA_OUTPUT || "C:/temos/growbiz-hero-qa";

(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe",
    headless: true,
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (entry) => {
    if (entry.type() === "error") errors.push(entry.text());
  });

  for (const width of [320, 390, 430, 768, 1024, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(base, { waitUntil: "networkidle" });
    await page.waitForTimeout(1900);
    const data = await page.evaluate(() => {
      const hero = document.querySelector(".gb-hero-art");
      const card = document.querySelector(".gb-hero-card");
      const line = document.querySelector(".gb-hero-lines path");
      const node = document.querySelector(".gb-hero-node--center");
      const rect = hero.getBoundingClientRect();
      return {
        visible: rect.width > 0 && rect.height > 0,
        left: rect.left,
        right: rect.right,
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth,
        heroAnimation: getComputedStyle(hero).animationName,
        cardAnimation: getComputedStyle(card).animationName,
        lineAnimation: getComputedStyle(line).animationName,
        nodeAnimation: getComputedStyle(node).animationName,
      };
    });
    assert.ok(data.visible, `hero visible at ${width}`);
    assert.ok(data.left >= -1 && data.right <= width + 1, `hero bounds at ${width}`);
    assert.equal(data.scrollWidth, data.innerWidth, `no overflow at ${width}`);
    assert.match(data.heroAnimation, /gb-hero-group-in/);
    assert.match(data.cardAnimation, /gb-hero-card/);
    assert.match(data.lineAnimation, /gb-hero-line/);
    assert.match(data.nodeAnimation, /gb-hero-node/);
    if (width === 390 || width === 1440) {
      await page.screenshot({ path: path.join(output, `home-hero-${width}.png`), fullPage: width === 390 });
    }
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(base, { waitUntil: "networkidle" });
  await page.locator(".gb-hero-art").hover({ position: { x: 330, y: 80 } });
  await page.waitForTimeout(120);
  const vars = await page.locator(".gb-hero-art").evaluate((element) => ({
    x: getComputedStyle(element).getPropertyValue("--gb-parallax-x").trim(),
    y: getComputedStyle(element).getPropertyValue("--gb-parallax-y").trim(),
  }));
  assert.notEqual(vars.x, "0px");

  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload({ waitUntil: "networkidle" });
  const reduced = await page.locator(".gb-hero-card").first().evaluate((element) => getComputedStyle(element).animationName);
  assert.equal(reduced, "gb-hero-fade-in");

  await browser.close();
  assert.deepEqual(errors, []);
  console.log(JSON.stringify({ widths: 7, errors, vars, reduced, output }));
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
