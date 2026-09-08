const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");
const cache = new Map();
function load(file) {
  const absolute = path.resolve(file);
  if (cache.has(absolute)) return cache.get(absolute).exports;
  const module = { exports: {} };
  cache.set(absolute, module);
  const code = ts.transpileModule(fs.readFileSync(absolute, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const localRequire = name => name.startsWith("@/") ? load(`${name.slice(2)}.ts`) : require(name);
  new Function("require", "module", "exports", code)(localRequire, module, module.exports);
  return module.exports;
}
const { buildJobPostingSchema, jsonLd, pageMetadata } = load("lib/seo.ts");
const { isActiveJob } = load("features/jobs/utils/lifecycle.ts");
const { filterJobs } = load("features/jobs/utils/filters.ts");
const { segmentUrls } = load("lib/sitemaps.ts");
const publishedAt = new Date(Date.now() - 86400000).toISOString();
const expiresAt = new Date(Date.now() + 86400000).toISOString();
const job = { id: "test-role", title: "Engineer", company: "Test employer", about: "Role description", type: "Full-time", mode: "On-site", location: "Pune", address: { locality: "Pune", country: "IN" }, status: "published", publishedAt, expiresAt, responsibilities: ["Build"], mustHave: ["Skills"], niceToHave: [], tags: [], industry: "IT" };

test("schema uses only original dates and numeric salary data", () => {
  const schema = buildJobPostingSchema({ ...job, salary: "Undisclosed" });
  assert.equal(schema.datePosted, publishedAt);
  assert.equal(schema.validThrough, expiresAt);
  assert.equal(schema.baseSalary, undefined);
  assert.equal(schema.directApply, undefined);
  const pay = buildJobPostingSchema({ ...job, salary: "INR 600000-900000 per year", salaryDetails: { min: 600000, max: 900000, currency: "INR", unit: "YEAR" } });
  assert.equal(pay.baseSalary.value.minValue, 600000);
  assert.equal(buildJobPostingSchema({ ...job, expiresAt: undefined }).validThrough, undefined);
});
test("incomplete, demo, future and unavailable jobs never emit job schema", () => {
  for (const change of [{ isDemo: true }, { publishedAt: undefined }, { publishedAt: "today" }, { publishedAt: expiresAt }, { expiresAt: publishedAt }, { expiresAt: "invalid" }, { status: "draft" }, { status: "paused" }, { status: "closed" }, { address: undefined }]) assert.equal(buildJobPostingSchema({ ...job, ...change }), null);
});
test("remote eligibility is explicit and hybrid is not telecommute", () => {
  assert.equal(buildJobPostingSchema({ ...job, mode: "Remote" }), null);
  const remote = buildJobPostingSchema({ ...job, mode: "Remote", applicantCountries: ["IN"] });
  assert.equal(remote.jobLocationType, "TELECOMMUTE");
  assert.equal(remote.jobLocation, undefined);
  assert.equal(buildJobPostingSchema({ ...job, mode: "Hybrid" }).jobLocationType, undefined);
});
test("expiry and status exclude unavailable search inventory", () => {
  const closed = { ...job, expiresAt: publishedAt };
  assert.equal(isActiveJob(closed), false);
  assert.deepEqual(filterJobs([job, closed, { ...job, status: "paused" }], {}), [job]);
});
test("JSON-LD cannot close its script element", () => {
  const result = jsonLd({ name: "</script><script>alert(1)</script>" });
  assert.equal(result.includes("<"), false);
  assert.equal(JSON.parse(result).name, "</script><script>alert(1)</script>");
});
test("marketing canonical and pending policy noindex are explicit", () => {
  assert.equal(pageMetadata("/employers").alternates.canonical, "https://jobs.thegrowbiz.online/employers");
  assert.equal(pageMetadata("/employers").robots.index, true);
  assert.equal(pageMetadata("/privacy").robots.index, false);
});
test("sitemaps omit demo inventory and pending policies", async () => {
  assert.deepEqual(await segmentUrls("jobs"), []);
  assert.deepEqual(await segmentUrls("companies"), []);
  const content = await segmentUrls("content");
  assert.ok(content.includes("/jobs"));
  assert.ok(!content.includes("/privacy"));
  assert.ok(content.every(url => !url.includes("?") && !url.includes("dashboard")));
});
