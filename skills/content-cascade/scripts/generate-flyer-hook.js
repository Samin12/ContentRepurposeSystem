/**
 * Generate a bold, thumbnail-style LinkedIn lead magnet flyer.
 *
 * Usage:
 *   node generate-flyer-hook.js <input-json-path> <output-png-path>
 *
 * Input JSON format:
 * {
 *   "number": "10",
 *   "highlight": "MUST-KNOW",
 *   "headline": "CLAUDE CODE\nSKILLS",
 *   "badge": "FREE GUIDE",
 *   "icon": "cursor" | "rocket" | "bolt" | "brain" | "tools" | "layers",
 *   "accentColor": "#7c6bf5"
 * }
 */

const fs = require("fs");
const path = require("path");

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
  console.error("Usage: node generate-flyer-hook.js <input.json> <output.png>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const accent = data.accentColor || "#7c6bf5";
const accentRgb = hexToRgb(accent);

// SVG icons — simple, bold shapes
const icons = {
  cursor: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M30 15L30 90L50 70L75 105L90 95L65 60L95 55Z" fill="${accent}" opacity="0.85"/>
    <circle cx="85" cy="25" r="6" fill="#ef4444"/>
    <circle cx="45" cy="105" r="5" fill="#22c55e"/>
    <path d="M70 10 Q105 15 110 50" stroke="${accent}" stroke-width="3" stroke-dasharray="8 6" fill="none" opacity="0.4"/>
    <path d="M25 95 Q10 60 30 25" stroke="${accent}" stroke-width="3" stroke-dasharray="8 6" fill="none" opacity="0.25"/>
  </svg>`,
  rocket: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 10C60 10 45 35 45 65C45 80 52 95 60 105C68 95 75 80 75 65C75 35 60 10 60 10Z" fill="${accent}" opacity="0.85"/>
    <circle cx="60" cy="55" r="8" fill="#0a0a0a"/>
    <path d="M45 75L30 90L40 95L45 85Z" fill="${accent}" opacity="0.6"/>
    <path d="M75 75L90 90L80 95L75 85Z" fill="${accent}" opacity="0.6"/>
    <circle cx="60" cy="115" r="4" fill="#f59e0b" opacity="0.9"/>
    <circle cx="52" cy="112" r="3" fill="#ef4444" opacity="0.7"/>
    <circle cx="68" cy="112" r="3" fill="#ef4444" opacity="0.7"/>
  </svg>`,
  bolt: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M70 5L25 65H55L45 115L100 50H67Z" fill="${accent}" opacity="0.85"/>
    <circle cx="95" cy="20" r="5" fill="#f59e0b" opacity="0.6"/>
    <circle cx="20" cy="100" r="4" fill="#22c55e" opacity="0.5"/>
  </svg>`,
  brain: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 110V60" stroke="${accent}" stroke-width="4" opacity="0.5"/>
    <circle cx="60" cy="45" r="30" fill="none" stroke="${accent}" stroke-width="4" opacity="0.85"/>
    <path d="M60 15C60 15 40 25 40 45C40 55 48 60 60 60C72 60 80 55 80 45C80 25 60 15 60 15Z" fill="${accent}" opacity="0.3"/>
    <circle cx="50" cy="40" r="4" fill="#f5f5f5"/>
    <circle cx="70" cy="40" r="4" fill="#f5f5f5"/>
    <path d="M52 52Q60 58 68 52" stroke="#f5f5f5" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="30" cy="25" r="3" fill="#ef4444" opacity="0.6"/>
    <circle cx="90" cy="30" r="4" fill="#22c55e" opacity="0.5"/>
  </svg>`,
  tools: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="50" width="80" height="50" rx="8" fill="${accent}" opacity="0.25"/>
    <rect x="30" y="40" width="60" height="10" rx="4" fill="${accent}" opacity="0.5"/>
    <circle cx="45" cy="75" r="8" fill="${accent}" opacity="0.85"/>
    <circle cx="75" cy="75" r="8" fill="${accent}" opacity="0.85"/>
    <path d="M40 20L50 35H30Z" fill="#f59e0b" opacity="0.7"/>
    <path d="M80 15L85 35L75 35Z" fill="#22c55e" opacity="0.6"/>
    <rect x="55" y="18" width="6" height="20" rx="3" fill="#ef4444" opacity="0.6"/>
  </svg>`,
  layers: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 25L15 50L60 75L105 50Z" fill="${accent}" opacity="0.85"/>
    <path d="M15 65L60 90L105 65" stroke="${accent}" stroke-width="4" fill="none" opacity="0.5"/>
    <path d="M15 80L60 105L105 80" stroke="${accent}" stroke-width="4" fill="none" opacity="0.3"/>
    <circle cx="95" cy="30" r="5" fill="#f59e0b" opacity="0.6"/>
    <circle cx="20" cy="90" r="4" fill="#22c55e" opacity="0.5"/>
  </svg>`
};

const iconSvg = icons[data.icon] || icons.cursor;

// Split headline into lines
const headlineLines = (data.headline || "CLAUDE\nCODE").split("\n");

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;800;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    width: 1080px;
    height: 1080px;
    font-family: 'Inter', -apple-system, sans-serif;
    background: #0a0a0a;
    color: #f5f5f5;
    overflow: hidden;
    position: relative;
  }

  /* Subtle background texture */
  .bg-noise {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 70% 30%, rgba(${accentRgb}, 0.06) 0%, transparent 60%),
                radial-gradient(ellipse at 20% 80%, rgba(${accentRgb}, 0.04) 0%, transparent 50%);
    pointer-events: none;
  }

  .container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 72px 80px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  /* Big number in circle */
  .number-circle {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 32px;
    box-shadow: 0 0 60px rgba(${accentRgb}, 0.25);
  }

  .number-circle span {
    font-size: 80px;
    font-weight: 900;
    color: #0a0a0a;
    line-height: 1;
  }

  /* Highlight bar */
  .highlight {
    display: inline-block;
    background: ${accent};
    padding: 8px 24px;
    margin-bottom: 20px;
    font-size: 32px;
    font-weight: 800;
    letter-spacing: 0.08em;
    color: #ffffff;
  }

  /* Main headline */
  .headline {
    font-size: 108px;
    font-weight: 900;
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: #ffffff;
    text-transform: uppercase;
    max-width: 700px;
  }

  /* FREE GUIDE badge */
  .badge {
    position: absolute;
    top: 64px;
    right: 72px;
    background: #22c55e;
    color: #0a0a0a;
    font-size: 20px;
    font-weight: 800;
    padding: 10px 22px;
    border-radius: 6px;
    letter-spacing: 0.06em;
    box-shadow: 0 4px 20px rgba(34, 197, 94, 0.3);
  }

  /* Icon area */
  .icon-area {
    position: absolute;
    right: 40px;
    bottom: 80px;
    width: 320px;
    height: 320px;
    opacity: 0.9;
  }

  /* Brand */
  .brand {
    position: absolute;
    bottom: 48px;
    left: 80px;
    font-size: 22px;
    font-weight: 700;
    color: ${accent};
    letter-spacing: 0.04em;
  }

  /* Decorative dashed arc */
  .arc {
    position: absolute;
    right: 120px;
    top: 140px;
    width: 400px;
    height: 400px;
    border: 3px dashed rgba(${accentRgb}, 0.2);
    border-radius: 50%;
    pointer-events: none;
  }
</style>
</head>
<body>
  <div class="bg-noise"></div>
  <div class="arc"></div>

  <div class="container">
    ${data.number ? `<div class="number-circle"><span>${escapeHtml(data.number)}</span></div>` : ""}
    ${data.highlight ? `<div><span class="highlight">${escapeHtml(data.highlight)}</span></div>` : ""}
    <div class="headline">${headlineLines.map(l => escapeHtml(l)).join("<br>")}</div>
  </div>

  ${data.badge ? `<div class="badge">${escapeHtml(data.badge)}</div>` : ""}

  <div class="icon-area">
    ${iconSvg}
  </div>

  <div class="brand">your brand</div>
</body>
</html>`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1080, height: 1080 },
  });

  await page.setContent(html, { waitUntil: "networkidle" });

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
  console.log(`Hook flyer saved to: ${outputPath}`);
})();
