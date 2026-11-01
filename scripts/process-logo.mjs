// Turns the master logos into web versions. Never modifies the originals.
// Usage: npm run logo
import sharp from "sharp";

const LONG = "Garden Logo Long.png"; // RGB, solid white background
const SQUARE = "square logo.png"; // RGBA, black monogram on transparent
const WIDTH = 1800;

// Palette roles, kept in step with app/globals.css.
const LIMESTONE = [0xee, 0xf0, 0xe9];
const PALE_SAGE = [0xc5, 0xd1, 0xbf];
let GREEN = [0x39, 0x54, 0x37];

// ---- Long logo -------------------------------------------------------------

const { data, info } = await sharp(LONG)
  .removeAlpha()
  .resize({ width: WIDTH * 1.25, kernel: "lanczos3" })
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height } = info;
const px = width * height;
const out = Buffer.alloc(px * 4);

// White -> transparent: alpha = 1 - min(r,g,b)/255, then un-premultiply
// against white so edge pixels keep their true colour.
let minX = width, minY = height, maxX = 0, maxY = 0;
const greens = [];
for (let i = 0; i < px; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const a = 1 - Math.min(r, g, b) / 255;
  const o = i * 4;
  if (a < 0.02) continue;
  const un = (c) => Math.max(0, Math.min(255, Math.round((c - 255 * (1 - a)) / a)));
  out[o] = un(r); out[o + 1] = un(g); out[o + 2] = un(b); out[o + 3] = Math.round(a * 255);
  const x = i % width, y = (i / width) | 0;
  if (x < minX) minX = x; if (x > maxX) maxX = x;
  if (y < minY) minY = y; if (y > maxY) maxY = y;
  // Solid, clearly-green source pixels give the brand colour sample.
  if (g < 140 && g > r + 10 && g > b + 10) greens.push([r, g, b]);
}

const median = (arr) => arr.sort((p, q) => p - q)[arr.length >> 1];
GREEN = [0, 1, 2].map((k) => median(greens.map((c) => c[k])));
const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();
console.log("Sampled brand green:", hex(GREEN), `(${greens.length} px)`);

const pad = 8;
const crop = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(width, maxX + pad) - Math.max(0, minX - pad),
  height: Math.min(height, maxY + pad) - Math.max(0, minY - pad),
};

const report = (file) => (i) => console.log(file, `${i.width}x${i.height}`, `${(i.size / 1024).toFixed(0)}KB`);
const png = { compressionLevel: 9, palette: true, quality: 90, effort: 10 };

const saveLong = (buf, file) =>
  sharp(buf, { raw: { width, height, channels: 4 } })
    .extract(crop)
    .resize({ width: WIDTH })
    .png(png)
    .toFile(file)
    .then(report(file));

await saveLong(out, "public/logo-long.png");

// Light variant for the dark footer: green -> pale sage, black script -> limestone.
const light = Buffer.from(out);
for (let i = 0; i < px; i++) {
  const o = i * 4;
  if (!light[o + 3]) continue;
  const r = light[o], g = light[o + 1], b = light[o + 2];
  // How "green" vs "black" this pixel is, blended for anti-aliased edges.
  const greenness = Math.max(0, Math.min(1, (g - Math.max(r, b)) / (GREEN[1] - Math.max(GREEN[0], GREEN[2]))));
  for (let k = 0; k < 3; k++) light[o + k] = Math.round(PALE_SAGE[k] * greenness + LIMESTONE[k] * (1 - greenness));
}
await saveLong(light, "public/logo-long-light.png");

// ---- Square monogram -------------------------------------------------------

const tint = async (rgb, size) => {
  const { data: m, info: mi } = await sharp(SQUARE)
    .ensureAlpha()
    .trim({ threshold: 1 })
    .resize({ width: size, height: size, fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .raw()
    .toBuffer({ resolveWithObject: true });
  for (let i = 0; i < m.length; i += 4) [m[i], m[i + 1], m[i + 2]] = rgb;
  return sharp(m, { raw: { width: mi.width, height: mi.height, channels: 4 } }).png(png);
};

await (await tint(GREEN, 600)).toFile("public/monogram.png").then(report("public/monogram.png"));
await (await tint(LIMESTONE, 600)).toFile("public/monogram-light.png").then(report("public/monogram-light.png"));

// Home-screen icon: green monogram on limestone.
const bg = (w, h) => ({ create: { width: w, height: h, channels: 3, background: { r: LIMESTONE[0], g: LIMESTONE[1], b: LIMESTONE[2] } } });
await sharp(bg(180, 180))
  .composite([{ input: await (await tint(GREEN, 136)).toBuffer(), gravity: "center" }])
  .png()
  .toFile("app/apple-icon.png")
  .then(report("app/apple-icon.png"));

// Social share image: the long logo centred on limestone.
await sharp(bg(1200, 630))
  .composite([{ input: await sharp("public/logo-long.png").resize({ width: 940 }).toBuffer(), gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile("app/opengraph-image.png")
  .then(report("app/opengraph-image.png"));
