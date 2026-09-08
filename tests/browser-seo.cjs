const fs = require("node:fs");
const path = require("node:path");
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || "playwright");
const base = process.env.QA_BASE_URL || "http://localhost:3100";
const output = process.env.QA_OUTPUT || path.join(require("node:os").tmpdir(), "growbiz-seo-qa");
const publicRoutes = ["/", "/jobs", "/employers", "/recruitment-services", "/pricing", "/career-resources", "/career-plus", "/campus", "/about", "/contact", "/faq", "/report", "/privacy", "/terms", "/refund-policy", "/candidate-consent"];
(async () => {
  fs.mkdirSync(output, { recursive: true });
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [], results = [], links = new Set();
  page.on("pageerror", e => errors.push({ url: page.url(), error: e.message }));
  page.on("console", m => { if (m.type() === "error") errors.push({ url: page.url(), error: m.text(), location: m.location() }); });
  await page.goto(base + "/jobs");
  const jobs = new Set(await page.locator('a[href^="/jobs/"]').evaluateAll(nodes => nodes.map(n => n.getAttribute("href"))));
  const next = page.locator('a[rel="next"]');
  if (await next.count()) {
    await next.click();
    await page.waitForURL("**/jobs?page=2");
    await page.waitForLoadState("networkidle");
    for (const url of await page.locator('a[href^="/jobs/"]').evaluateAll(nodes => nodes.map(n => n.getAttribute("href")))) jobs.add(url);
  }
  const companies = new Set();
  for (const url of jobs) {
    await page.goto(base + url);
    for (const href of await page.locator('a[href^="/companies/"]').evaluateAll(nodes => nodes.map(n => n.getAttribute("href")))) companies.add(href);
  }
  const routes = [...publicRoutes, ...jobs, ...companies];
  for (const route of routes) {
    const response = await page.goto(base + route);
    await page.waitForLoadState("networkidle");
    const source = await response.text();
    const info = await page.evaluate(() => ({
      title: document.title, h1: [...document.querySelectorAll("h1")].map(n => n.textContent.trim()),
      headings: [...document.querySelectorAll("h1,h2,h3,h4")].map(n => ({ level: Number(n.tagName[1]), text: n.textContent.trim() })),
      description: document.querySelector('meta[name="description"]')?.content,
      canonical: document.querySelector('link[rel="canonical"]')?.href,
      robots: document.querySelector('meta[name="robots"]')?.content,
      schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map(n => JSON.parse(n.textContent)),
      links: [...document.querySelectorAll('a[href^="/"]')].map(n => n.getAttribute("href")),
    }));
    info.links.forEach(url => links.add(url)); delete info.links;
    const jumps = info.headings.filter((h,i,a) => i && h.level > a[i-1].level + 1);
    const views = [];
    for (const width of [320,390,430,768,1024,1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.evaluate(() => document.fonts.ready);
      views.push(await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        overflow: [...document.querySelectorAll("main *")].filter(el => {
          const r = el.getBoundingClientRect(), s = getComputedStyle(el);
          return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && !el.closest('[aria-hidden="true"]') && (r.right > innerWidth + 1 || r.left < -1);
        }).slice(0,6).map(el => ({ tag: el.tagName, text: el.textContent.slice(0,70), class: el.className })),
      })));
    }
    const row = { route, status: response.status(), ssrH1: (source.match(/<h1[ >]/g) || []).length, ...info, jumps, views };
    results.push(row);
    if (["/", "/jobs", "/employers", "/recruitment-services", "/pricing", "/career-resources", "/campus", "/about", "/contact", [...jobs][0], [...companies][0]].includes(route)) {
      const name = route === "/" ? "home" : route.slice(1).replaceAll("/", "-");
      await page.screenshot({ path: path.join(output, name + "-desktop.png") });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.screenshot({ path: path.join(output, name + "-mobile.png") });
    }
    console.log(JSON.stringify({ route, status: row.status, h1: row.h1.length, ssrH1: row.ssrH1, jumps: jumps.length, overflow: views.filter(v => v.overflow.length || v.scrollWidth > v.width).map(v => v.width) }));
  }
  const httpChecks = [];
  for (const route of ["/jobs?page=2", "/jobs?experience=fresher", "/jobs?sort=newest", "/jobs?page=999", "/jobs?page=-1", "/jobs/not-a-job", "/companies/not-a-company", "/not-a-page", "/sitemap.xml", "/sitemaps/jobs.xml", "/sitemaps/companies.xml", "/sitemaps/content.xml", "/robots.txt", "/candidate/dashboard", "/employer/dashboard", "/recruiter", "/admin", "/login", "/signup", "/employer/jobs"]) {
    const response = await context.request.get(base + route, { maxRedirects: 0 });
    const html = await response.text();
    httpChecks.push({ route, status: response.status(), robotsHeader: response.headers()["x-robots-tag"], location: response.headers().location,
      canonical: html.match(/<link rel="canonical" href="([^"]+)"/)?.[1], robots: html.match(/<meta name="robots" content="([^"]+)"/)?.[1] });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(base + "/jobs");
  await page.getByRole("button", { name: /^Filters/ }).click();
  const filterVisible = await page.getByRole("dialog").isVisible();
  await page.keyboard.press("Escape");
  const filterClosed = !(await page.getByRole("dialog").count());
  fs.writeFileSync(path.join(output, "results.json"), JSON.stringify({ results, errors, httpChecks, interactions: { filterVisible, filterClosed }, links: [...links] }, null, 2));
  await browser.close();
  const assert = require("node:assert/strict");
  assert.equal(errors.length, 0, "Browser console/runtime errors");
  assert.equal(new Set(results.map(r => r.title)).size, results.length, "Duplicate titles");
  assert.equal(new Set(results.map(r => r.description)).size, results.length, "Duplicate descriptions");
  for (const r of results) {
    assert.equal(r.status, 200, r.route);
    assert.equal(r.h1.length, 1, r.route);
    assert.equal(r.ssrH1, 1, r.route);
    assert.equal(r.jumps.length, 0, r.route);
    assert.ok(r.canonical, r.route);
    for (const v of r.views) assert.ok(!v.overflow.length && v.scrollWidth <= v.width, `${r.route} at ${v.width}`);
  }
  for (const r of httpChecks.filter(r => r.route.includes("not-") || r.route.includes("999") || r.route.includes("=-1"))) assert.ok(r.robots?.includes("noindex"), r.route);
  assert.ok(filterVisible && filterClosed, "Mobile filter drawer");
  console.log(JSON.stringify({ output, routes: results.length, errors: errors.length, filterVisible, filterClosed }));
})().catch(error => { console.error(error); process.exitCode = 1; });
