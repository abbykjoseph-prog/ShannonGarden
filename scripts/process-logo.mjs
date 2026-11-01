// Turns the white-background master logo into transparent web versions.
// Usage: npm run logo   (reads "Garden Logo Long.png", never modifies it)
import sharp from "sharp";

const SRC = "Garden Logo Long.png";
const WIDTH = 1800;

// Downscale first so the per-pixel work is cheap.
const { data, info } = await sharp(SRC)
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
const brand = [0, 1, 2].map((k) => median(greens.map((c) => c[k])));
const hex = "#" + brand.map((c) => c.toString(16).padStart(2, "0")).join("").toUpperCase();
console.log("Sampled brand green:", hex, `(${greens.length} px)`);

const pad = 8;
const crop = {
  left: Math.max(0, minX - pad),
  top: Math.max(0, minY - pad),
  width: Math.min(width, maxX + pad) - Math.max(0, minX - pad),
  height: Math.min(height, maxY + pad) - Math.max(0, minY - pad),
};

const save = (buf, file) =>
  sharp(buf, { raw: { width, height, channels: 4 } })
    .extract(crop)
    .resize({ width: WIDTH })
    .png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 })
    .toFile(file)
    .then((i) => console.log(file, `${i.width}x${i.height}`, `${(i.size / 1024).toFixed(0)}KB`));

await save(out, "public/logo-long.png");

// Light variant for the dark footer: green -> pale sage, black script -> off-white.
const SAGE = [0xc9, 0xd8, 0xbf];
const OFF_WHITE = [0xf6, 0xf1, 0xe6];
const light = Buffer.from(out);
for (let i = 0; i < px; i++) {
  const o = i * 4;
  if (!light[o + 3]) continue;
  const r = light[o], g = light[o + 1], b = light[o + 2];
  // How "green" vs "black" this pixel is, blended for anti-aliased edges.
  const greenness = Math.max(0, Math.min(1, (g - Math.max(r, b)) / (brand[1] - Math.max(brand[0], brand[2]))));
  for (let k = 0; k < 3; k++) light[o + k] = Math.round(SAGE[k] * greenness + OFF_WHITE[k] * (1 - greenness));
}
await save(light, "public/logo-long-light.png");
