/**
 * Generate a LinkedIn lead magnet flyer image using Playwright.
 *
 * Usage:
 *   node generate-flyer.js <input-json-path> <output-png-path>
 *
 * Input JSON format:
 * {
 *   "title": "7 AI Agent Patterns",
 *   "subtitle": "That actually work in production",
 *   "items": ["Pattern 1 — description", "Pattern 2 — description", ...],
 *   "footer": "ChaseAI | Full breakdown in video"
 * }
 */

const fs = require("fs");
const path = require("path");

// Resolve playwright from global @playwright/cli install
const { chromium } = require(
  require.resolve("playwright", {
    paths: [
      path.join(process.env.APPDATA || "", "npm/node_modules/@playwright/cli/node_modules"),
      path.join(process.env.APPDATA || "", "npm/node_modules"),
    ],
  })
);

const inputPath = process.argv[2];
const outputPath = process.argv[3];

if (!inputPath || !outputPath) {
  console.error("Usage: node generate-flyer.js <input.json> <output.png>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1080px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: #0a0a0a;
    color: #f5f5f5;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .card {
    width: 1000px;
    min-height: 900px;
    padding: 64px;
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Subtle gradient accent */
  .accent-bar {
    position: absolute;
    top: 0;
    left: 64px;
    right: 64px;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa);
    border-radius: 0 0 4px 4px;
  }

  .header {
    margin-bottom: 48px;
    margin-top: 16px;
  }

  .title {
    font-size: 52px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: #ffffff;
    margin-bottom: 16px;
  }

  .subtitle {
    font-size: 22px;
    font-weight: 400;
    color: #a1a1aa;
    line-height: 1.4;
  }

  .items {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-bottom: 48px;
  }

  .item {
    display: flex;
    align-items: flex-start;
    gap: 20px;
  }

  .item-number {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    background: rgba(99, 102, 241, 0.15);
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    font-weight: 700;
    color: #a78bfa;
    margin-top: 2px;
  }

  .item-text {
    font-size: 22px;
    font-weight: 500;
    line-height: 1.45;
    color: #e4e4e7;
  }

  .item-text strong {
    color: #ffffff;
    font-weight: 700;
  }

  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 32px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .footer-brand {
    font-size: 20px;
    font-weight: 700;
    color: #6366f1;
    letter-spacing: 0.02em;
  }

  .footer-cta {
    font-size: 17px;
    font-weight: 500;
    color: #71717a;
  }

  /* Background decoration */
  .bg-glow {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }
</style>
</head>
<body>
  <div class="card">
    <div class="accent-bar"></div>
    <div class="bg-glow"></div>

    <div class="header">
      <div class="title">${escapeHtml(data.title)}</div>
      ${data.subtitle ? `<div class="subtitle">${escapeHtml(data.subtitle)}</div>` : ""}
    </div>

    <div class="items">
      ${data.items
        .map((item, i) => {
          // Split on first " — " or " - " to bold the label
          const dashMatch = item.match(/^(.+?)(?:\s[—–-]\s)(.+)$/);
          const text = dashMatch
            ? `<strong>${escapeHtml(dashMatch[1])}</strong> — ${escapeHtml(dashMatch[2])}`
            : escapeHtml(item);
          return `<div class="item">
            <div class="item-number">${i + 1}</div>
            <div class="item-text">${text}</div>
          </div>`;
        })
        .join("\n")}
    </div>

    <div class="footer">
      <div class="footer-brand">${escapeHtml(data.footer?.split("|")[0]?.trim() || "your brand")}</div>
      <div class="footer-cta">${escapeHtml(data.footer?.split("|")[1]?.trim() || "Full breakdown in video")}</div>
    </div>
  </div>
</body>
</html>`;

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 },
  });

  await page.setContent(html, { waitUntil: "networkidle" });

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  await page.screenshot({
    path: outputPath,
    type: "png",
    clip: { x: 0, y: 0, width: 1080, height: 1080 },
  });

  await browser.close();
  console.log(`Flyer saved to: ${outputPath}`);
})();
