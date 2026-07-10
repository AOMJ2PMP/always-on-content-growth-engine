import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

function parseArgs(argv) {
  const options = { backgrounds: [] };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (!options.input && !value.startsWith("--")) options.input = value;
    else if (value === "--background") options.backgrounds.push(argv[++index]);
    else if (value === "--output") options.output = argv[++index];
  }
  return options;
}

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function imageDataUrl(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const mime = extension === ".jpg" || extension === ".jpeg" ? "image/jpeg" : "image/png";
  const data = await readFile(filePath);
  return `data:${mime};base64,${data.toString("base64")}`;
}

function slideDocument({ slide, index, count, background, topic, product }) {
  const isLast = index === count - 1;
  return `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <style>
        * { box-sizing: border-box; }
        html, body {
          margin: 0;
          width: 1080px;
          height: 1080px;
          overflow: hidden;
          background: #f8fbff;
          color: #07164a;
          font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif;
        }
        .slide {
          position: relative;
          width: 1080px;
          height: 1080px;
          overflow: hidden;
          background: linear-gradient(145deg, #ffffff 0%, #f7fbff 58%, #eef7ff 100%);
        }
        .visual {
          position: absolute;
          z-index: 0;
          width: 950px;
          right: -220px;
          bottom: 40px;
          opacity: 0.82;
          filter: saturate(1.03) contrast(0.98);
        }
        .wash {
          position: absolute;
          inset: 0;
          z-index: 1;
          background:
            linear-gradient(90deg, rgba(255,255,255,0.99) 0%, rgba(255,255,255,0.94) 36%, rgba(255,255,255,0.55) 62%, rgba(255,255,255,0.08) 100%),
            linear-gradient(0deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.1) 46%, rgba(255,255,255,0) 78%);
        }
        .grid {
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: 0.26;
          background-image: radial-gradient(rgba(0,82,217,0.18) 1.5px, transparent 1.7px);
          background-size: 19px 19px;
          mask-image: linear-gradient(135deg, transparent 0%, transparent 66%, #000 100%);
        }
        .content {
          position: relative;
          z-index: 3;
          height: 100%;
          padding: 78px 76px 70px;
          display: flex;
          flex-direction: column;
        }
        .kicker {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 36px;
          color: #0052d9;
          font-size: 22px;
          line-height: 1;
          font-weight: 750;
        }
        .number {
          display: grid;
          place-items: center;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          color: white;
          background: linear-gradient(135deg, #0052d9, #16c5df);
          box-shadow: 0 17px 34px rgba(0,82,217,0.22);
          font-weight: 850;
        }
        h1 {
          width: 730px;
          margin: 0;
          font-size: ${isLast ? 80 : 86}px;
          line-height: 0.98;
          letter-spacing: 0;
          font-weight: 760;
        }
        .support {
          width: 560px;
          margin: 30px 0 0;
          color: #314266;
          font-size: 34px;
          line-height: 1.18;
          font-weight: 560;
        }
        .example {
          width: fit-content;
          max-width: 680px;
          margin-top: 50px;
          padding: 21px 27px 23px;
          border: 1px solid rgba(0,82,217,0.16);
          border-radius: 8px;
          background: rgba(255,255,255,0.82);
          box-shadow: 0 22px 54px rgba(19,50,108,0.11);
          backdrop-filter: blur(10px);
        }
        .example-label {
          margin-bottom: 9px;
          color: #0052d9;
          font-size: 17px;
          line-height: 1;
          font-weight: 800;
          text-transform: uppercase;
        }
        .example-text {
          color: ${isLast ? "#0052d9" : "#07164a"};
          font-size: 32px;
          line-height: 1.14;
          font-weight: 700;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-top: auto;
          color: #0052d9;
          font-size: 22px;
          font-weight: 800;
        }
        .brand::before {
          content: "";
          width: 5px;
          height: 44px;
          border-radius: 99px;
          background: linear-gradient(#0052d9, #16c5df);
        }
        .brand span { color: #5b6b8a; font-weight: 550; }
        .page {
          position: absolute;
          right: 72px;
          bottom: 74px;
          z-index: 4;
          color: #7383a4;
          font-size: 22px;
          font-weight: 800;
        }
      </style>
    </head>
    <body>
      <main class="slide">
        <img class="visual" src="${background}" alt="" />
        <div class="wash"></div>
        <div class="grid"></div>
        <section class="content">
          <div class="kicker"><span class="number">${String(index + 1).padStart(2, "0")}</span>${escapeHtml(topic)}</div>
          <h1>${escapeHtml(slide.title)}</h1>
          <p class="support">${escapeHtml(slide.support)}</p>
          <div class="example">
            <div class="example-label">${isLast ? "Next" : "Example"}</div>
            <div class="example-text">${escapeHtml(slide.example)}</div>
          </div>
          <div class="brand">Tencent Cloud <span>${escapeHtml(product)}</span></div>
        </section>
        <div class="page">${String(index + 1).padStart(2, "0")}/${String(count).padStart(2, "0")}</div>
      </main>
    </body>
  </html>`;
}

function contactSheetDocument(images) {
  const height = Math.ceil(images.length / 2) * 540;
  return {
    height,
    html: `<!doctype html><html><head><meta charset="utf-8" /><style>
      * { box-sizing: border-box; }
      html, body { margin: 0; width: 1080px; height: ${height}px; background: #dfe8f5; }
      main { display: grid; grid-template-columns: 540px 540px; }
      img { width: 540px; height: 540px; object-fit: cover; display: block; }
    </style></head><body><main>${images.map((src) => `<img src="${src}" alt="" />`).join("")}</main></body></html>`,
  };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  if (!options.input || options.backgrounds.length === 0) {
    throw new Error("Usage: node scripts/render-carousel.mjs <scored-candidate.json> --background image.png [--background image2.png] [--output dir]");
  }

  const inputPath = path.resolve(options.input);
  const candidate = JSON.parse(await readFile(inputPath, "utf8"));
  const slides = candidate.contentPackage?.carousel ?? [];
  if (slides.length < 2) throw new Error("Candidate must contain at least two carousel slides.");

  const outputDir = path.resolve(options.output ?? path.join(path.dirname(inputPath), `${candidate.candidateId}-carousel`));
  await mkdir(outputDir, { recursive: true });
  const backgrounds = await Promise.all(options.backgrounds.map((item) => imageDataUrl(path.resolve(item))));
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
  const files = [];

  for (let index = 0; index < slides.length; index += 1) {
    const html = slideDocument({
      slide: slides[index],
      index,
      count: slides.length,
      background: backgrounds[index % backgrounds.length],
      topic: candidate.tencentCloudAngle.topic,
      product: candidate.tencentCloudAngle.products.join(" + "),
    });
    await page.setContent(html, { waitUntil: "load" });
    await page.evaluate(() => document.fonts.ready);
    const filePath = path.join(outputDir, `slide-${String(index + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: filePath });
    files.push(filePath);
  }

  const imageUrls = await Promise.all(files.map(imageDataUrl));
  const contactSheet = contactSheetDocument(imageUrls);
  await page.setViewportSize({ width: 1080, height: contactSheet.height });
  await page.setContent(contactSheet.html, { waitUntil: "load" });
  const contactSheetPath = path.join(outputDir, "contact-sheet.png");
  await page.screenshot({ path: contactSheetPath, fullPage: true });
  await browser.close();

  const manifest = {
    candidateId: candidate.candidateId,
    source: inputPath,
    backgrounds: options.backgrounds.map((item) => path.resolve(item)),
    slides: files,
    contactSheet: contactSheetPath,
  };
  await writeFile(path.join(outputDir, "render-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(manifest, null, 2)}\n`);
}

await main();
