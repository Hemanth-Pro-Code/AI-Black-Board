const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const iconsDir = path.join(__dirname, "..", "public", "icons");
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Standard 512x512 SVG for BlackBoard AI
const createSvg = (isMaskable = false) => {
  // For maskable, keep content within inner 80% safe zone
  const scale = isMaskable ? 0.78 : 1;
  const translate = isMaskable ? 56 : 0;

  return `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#14532d" />
      <stop offset="45%" stop-color="#0b3d2e" />
      <stop offset="100%" stop-color="#07251c" />
    </linearGradient>

    <linearGradient id="chalkLine" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="50%" stop-color="#86efac" stop-opacity="0.95" />
      <stop offset="100%" stop-color="#22c55e" stop-opacity="0.9" />
    </linearGradient>

    <linearGradient id="aiSparkle" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fde68a" />
      <stop offset="50%" stop-color="#86efac" />
      <stop offset="100%" stop-color="#22c55e" />
    </linearGradient>

    <filter id="chalkGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Base background (fills entire canvas for maskable compatibility) -->
  <rect width="512" height="512" rx="${isMaskable ? "0" : "104"}" fill="url(#bgGrad)" />

  <!-- Inner Content Group (scaled for maskable if needed) -->
  <g transform="translate(${translate}, ${translate}) scale(${scale})">
    <!-- Subtle Blackboard Frame -->
    <rect x="28" y="28" width="456" height="456" rx="80" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="3" stroke-dasharray="8 6" />

    <!-- Blackboard inner shadow rect -->
    <rect x="44" y="44" width="424" height="424" rx="64" fill="rgba(0,0,0,0.2)" stroke="rgba(255,255,255,0.06)" stroke-width="2" />

    <!-- Chalk math formula / graph curve in background -->
    <path d="M 80 290 Q 150 180, 220 280 T 360 220 T 430 250" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="4" stroke-dasharray="4 4" />
    <path d="M 80 340 L 430 340" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" />

    <!-- Center Blackboard Board Graphic: Chalk Crayon / Stylus & AI Brain Spark -->
    <g transform="translate(195, 120) rotate(28)">
      <!-- Chalk Body -->
      <rect x="-18" y="-70" width="36" height="130" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2" filter="url(#chalkGlow)" />
      <!-- Chalk Tip -->
      <polygon points="-18,60 0,92 18,60" fill="#22c55e" />
      <!-- Chalk Wrapper / Grip Band -->
      <rect x="-19" y="-20" width="38" height="40" rx="2" fill="#0f172a" />
      <text x="0" y="5" fill="#86efac" font-family="sans-serif" font-size="12" font-weight="900" text-anchor="middle">AI</text>
    </g>

    <!-- Glowing Dynamic Stroke Under Crayon -->
    <path d="M 120 370 C 180 320, 240 390, 310 330 C 350 295, 390 310, 420 290" fill="none" stroke="url(#chalkLine)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" filter="url(#chalkGlow)" />

    <!-- Sparkles / AI Intelligence Stars -->
    <path d="M 375 130 Q 375 155, 400 155 Q 375 155, 375 180 Q 375 155, 350 155 Q 375 155, 375 130 Z" fill="url(#aiSparkle)" filter="url(#chalkGlow)" />
    <path d="M 110 180 Q 110 195, 125 195 Q 110 195, 110 210 Q 110 195, 95 195 Q 110 195, 110 180 Z" fill="#fde68a" />
    <path d="M 400 360 Q 400 372, 412 372 Q 400 372, 400 384 Q 400 372, 388 372 Q 400 372, 400 360 Z" fill="#86efac" />

    <!-- Brand Typography "BLACKBOARD AI" -->
    <text x="256" y="425" fill="#f8fafc" font-family="'Segoe UI', Roboto, Helvetica, Arial, sans-serif" font-size="34" font-weight="800" letter-spacing="2" text-anchor="middle" filter="url(#chalkGlow)">
      BLACKBOARD AI
    </text>
  </g>
</svg>
`;
};

async function generate() {
  console.log("Generating PWA icons with BlackBoard AI branding...");

  const svgStandard = Buffer.from(createSvg(false));
  const svgMaskable = Buffer.from(createSvg(true));

  // Save SVG asset
  fs.writeFileSync(path.join(iconsDir, "icon.svg"), svgStandard);

  // 1. icon-512.png
  await sharp(svgStandard)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, "icon-512.png"));
  console.log("Generated public/icons/icon-512.png");

  // 2. icon-192.png
  await sharp(svgStandard)
    .resize(192, 192)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, "icon-192.png"));
  console.log("Generated public/icons/icon-192.png");

  // 3. icon-maskable-512.png
  await sharp(svgMaskable)
    .resize(512, 512)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, "icon-maskable-512.png"));
  console.log("Generated public/icons/icon-maskable-512.png");

  // 4. apple-touch-icon.png (180x180)
  await sharp(svgStandard)
    .resize(180, 180)
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(iconsDir, "apple-touch-icon.png"));
  console.log("Generated public/icons/apple-touch-icon.png");

  // 5. Favicon PNGs
  await sharp(svgStandard)
    .resize(32, 32)
    .png()
    .toFile(path.join(iconsDir, "favicon-32x32.png"));
  await sharp(svgStandard)
    .resize(16, 16)
    .png()
    .toFile(path.join(iconsDir, "favicon-16x16.png"));

  console.log("All icons generated successfully!");
}

generate().catch((err) => {
  console.error("Icon generation error:", err);
  process.exit(1);
});
