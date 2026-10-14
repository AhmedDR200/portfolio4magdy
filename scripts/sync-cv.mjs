// Downloads the compiled CV PDF from its Overleaf "Anyone with the link → Viewer"
// share link. Overleaf has no public PDF URL, so this opens the share link in a
// headless browser (logged out), waits for the viewer to load the PDF, and
// re-requests that file with the page's session.
//
// Usage: OVERLEAF_SHARE_URL=... node sync-cv.mjs <out.pdf>
// Runs in .github/workflows/sync-cv.yml; needs the `playwright` package.
import { writeFileSync } from "node:fs";
import { chromium } from "playwright";

const shareUrl = process.env.OVERLEAF_SHARE_URL;
const outPath = process.argv[2];
if (!shareUrl || !outPath) {
  console.error("Usage: OVERLEAF_SHARE_URL=... node sync-cv.mjs <out.pdf>");
  process.exit(2);
}

// CHROMIUM_PATH lets a local run reuse an existing browser binary.
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  const context = await browser.newContext();
  const page = await context.newPage();
  const pdfResponse = page.waitForResponse((r) => /\/output\.pdf/.test(r.url()), {
    timeout: 120_000,
  });
  await page.goto(shareUrl, { waitUntil: "domcontentloaded", timeout: 60_000 });
  const viewerResponse = await pdfResponse;

  // The viewer streams the PDF in ranges; fetch the whole file once.
  const res = await context.request.get(viewerResponse.url());
  const pdf = await res.body();
  if (!res.ok() || pdf.subarray(0, 5).toString() !== "%PDF-" || pdf.length < 10_000) {
    throw new Error(`Unexpected response: ${res.status()}, ${pdf.length} bytes`);
  }
  writeFileSync(outPath, pdf);
  console.log(`Saved ${outPath} (${pdf.length} bytes)`);
} finally {
  await browser.close();
}
