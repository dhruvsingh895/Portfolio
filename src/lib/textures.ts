import * as THREE from "three";

/* ── Proven noise + color helpers ──────────────────────── */
export const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export const lerpC = (a: number[], b: number[], t: number) =>
  a.map((v, i) => v + (b[i] - v) * t);

export function fbm(x: number, y: number) {
  return (
    0.5 * Math.sin(x * 3.1 + 1.3) * Math.sin(y * 3.3) +
    0.28 * Math.sin(x * 6.7 - 2.1) * Math.sin(y * 7.1) +
    0.14 * Math.sin(x * 13.7 + 0.7) * Math.sin(y * 14.3) +
    0.07 * Math.sin(x * 29.3) * Math.sin(y * 27.7)
  );
}

function textureFromCanvas(canvas: HTMLCanvasElement, srgb = true): THREE.CanvasTexture {
  const tex = new THREE.CanvasTexture(canvas);
  if (srgb) tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/* ── Earth ─────────────────────────────────────────────── */
export function makeEarthTexture(size = 1024, colorful = false): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;

  const ocean = ctx.createLinearGradient(0, 0, 0, size / 2);
  ocean.addColorStop(0, colorful ? "#0d2b52" : "#17171a");
  ocean.addColorStop(0.5, colorful ? "#0a1f3d" : "#0e0e11");
  ocean.addColorStop(1, colorful ? "#0d2b52" : "#17171a");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, size, size / 2);

  const img = ctx.getImageData(0, 0, size, size / 2);
  const d = img.data;
  for (let y = 0; y < size / 2; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const n = fbm(x * 0.004, y * 0.008) + (y / (size / 2)) * 0.55;
      const lat = Math.abs(y - size / 4) / (size / 4);
      if (n > 0.12) {
        const shade = 0.85 + fbm(x * 0.012, y * 0.024) * 0.25;
        if (lat > 0.82) {
          d[i] = (colorful ? 220 : 222) * shade;
          d[i + 1] = (colorful ? 226 : 222) * shade;
          d[i + 2] = (colorful ? 235 : 222) * shade;
        } else if (n > 0.32) {
          d[i] = (colorful ? 66 : 92) * shade;
          d[i + 1] = (colorful ? 98 : 92) * shade;
          d[i + 2] = (colorful ? 56 : 92) * shade;
        } else {
          d[i] = (colorful ? 138 : 132) * shade;
          d[i + 1] = (colorful ? 128 : 130) * shade;
          d[i + 2] = (colorful ? 92 : 128) * shade;
        }
      } else {
        d[i] = colorful ? 10 : 16;
        d[i + 1] = colorful ? 28 : 16;
        d[i + 2] = colorful ? 62 : 18;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return textureFromCanvas(canvas);
}

export function makeCloudTexture(size = 1024): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, size, size / 2);

  for (let i = 0; i < 380; i++) {
    const x = Math.random() * size;
    const y = Math.random() * (size / 2);
    const w = 40 + Math.random() * 140;
    const h = 6 + Math.random() * 18;
    const a = 0.12 + Math.random() * 0.22;
    const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(w, h) / 2);
    g.addColorStop(0, `rgba(255,255,255,${a})`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(Math.random() * 0.6 - 0.3);
    ctx.scale(1.6, 1);
    ctx.beginPath();
    ctx.ellipse(0, 0, w / 2, h / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  return textureFromCanvas(canvas, false);
}

/* ── Sun: granulated photosphere with sunspots ─────────── */
export function makeSunTexture(size = 512, colorful = true): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = colorful ? "rgb(255,158,61)" : "rgb(255,255,255)";
  ctx.fillRect(0, 0, size, size / 2);

  const img = ctx.getImageData(0, 0, size, size / 2);
  const d = img.data;
  for (let y = 0; y < size / 2; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const gran = fbm(x * 0.02 + 1.3, y * 0.04 + 0.7) * 0.5 + 0.5;
      const cell = Math.sin(x * 110) * Math.sin(y * 130) * Math.sin((x + y) * 60) * 0.06;
      const spot = fbm(x * 0.015 + 4.1, y * 0.03 - 2.2);
      let r = colorful ? 255 : 255;
      let g = colorful ? 159 : 255;
      let b = colorful ? 61 : 255;
      r *= (colorful ? 0.88 : 0.94) + gran * (colorful ? 0.22 : 0.08) + cell;
      g *= (colorful ? 0.84 : 0.94) + gran * (colorful ? 0.24 : 0.08) + cell;
      b *= (colorful ? 0.8 : 0.94) + gran * (colorful ? 0.28 : 0.08) + cell;
      if (spot > 0.6) {
        const k = clamp01((spot - 0.6) * 2.2);
        r = 255 * (1 - k * (colorful ? 0.72 : 0.8));
        g = (colorful ? 159 : 255) * (1 - k * (colorful ? 0.7 : 0.8));
        b = (colorful ? 61 : 255) * (1 - k * (colorful ? 0.62 : 0.8));
      }
      d[i] = clamp01(r / 255) * 255;
      d[i + 1] = clamp01(g / 255) * 255;
      d[i + 2] = clamp01(b / 255) * 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return textureFromCanvas(canvas);
}

/* ── Latitude-banded gas giants ────────────────────────── */
export interface ColorStop {
  t: number;
  c: number[];
}

export function makeLatBandedTexture(
  size: number,
  stops: ColorStop[],
  swirl = 1,
  spot?: { u: number; v: number; rw: number; rh: number; c: number[] },
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size / 2);

  const sample = (t: number) => {
    if (t <= stops[0].t) return stops[0].c;
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i];
      const b = stops[i + 1];
      if (t >= a.t && t <= b.t) return lerpC(a.c, b.c, (t - a.t) / (b.t - a.t));
    }
    return stops[stops.length - 1].c;
  };

  const img = ctx.getImageData(0, 0, size, size / 2);
  const d = img.data;
  const h = size / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      const u = y / h;
      const wob = fbm(x * 0.006, u * 20 + 3.3) * 0.05 * swirl + Math.sin(x * 0.02) * 0.02 * swirl;
      const ripple = 1 + fbm(x * 0.012, u * 9 + 1.7) * 0.1;
      const col = sample(clamp01(u + wob));
      let r = Math.min(255, col[0] * ripple);
      let g = Math.min(255, col[1] * ripple);
      let b = Math.min(255, col[2] * ripple);
      if (spot) {
        const du = x / size - spot.u;
        const dv = y / h - spot.v;
        const di = (du * du) / (spot.rw * spot.rw) + (dv * dv) / (spot.rh * spot.rh);
        if (di < 1) {
          const k = 1 - Math.sqrt(di);
          r += (spot.c[0] - r) * k;
          g += (spot.c[1] - g) * k;
          b += (spot.c[2] - b) * k;
        }
      }
      d[i] = r;
      d[i + 1] = g;
      d[i + 2] = b;
    }
  }
  ctx.putImageData(img, 0, 0);
  return textureFromCanvas(canvas, false);
}

/* ── Rocky / cratered surfaces ─────────────────────────── */
export function makeCraterTexture(size: number, baseTop: string, baseBottom: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, size / 2);
  g.addColorStop(0, baseTop);
  g.addColorStop(1, baseBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size / 2);

  for (let i = 0; i < 260; i++) {
    const cx = Math.random() * size;
    const cy = Math.random() * (size / 2);
    const r = 2 + Math.random() * 14;
    const dark = ctx.createRadialGradient(cx, cy, r * 0.15, cx, cy, r);
    dark.addColorStop(0, "rgba(16,16,16,0.45)");
    dark.addColorStop(0.7, "rgba(16,16,16,0.12)");
    dark.addColorStop(1, "rgba(240,240,240,0.12)");
    ctx.fillStyle = dark;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }
  return textureFromCanvas(canvas);
}

export type Blob = [number, number, number, number];

export function makeBlobTexture(
  size: number,
  baseTop: string,
  baseBottom: string,
  blobs: Blob[],
  caps = false,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size / 2;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 0, size / 2);
  g.addColorStop(0, baseTop);
  g.addColorStop(1, baseBottom);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size / 2);

  for (const [r, gg, b, a] of blobs) {
    const cx = Math.random() * size;
    const cy = Math.random() * (size / 2);
    const rad = 30 + Math.random() * 90;
    const rg = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
    rg.addColorStop(0, `rgba(${r},${gg},${b},${a})`);
    rg.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = rg;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  if (caps) {
    const capTop = ctx.createLinearGradient(0, 0, 0, 14);
    capTop.addColorStop(0, "rgba(240,240,240,0.95)");
    capTop.addColorStop(1, "rgba(240,240,240,0)");
    ctx.fillStyle = capTop;
    ctx.fillRect(0, 0, size, 14);
    const capBottom = ctx.createLinearGradient(0, size / 2, 0, size / 2 - 14);
    capBottom.addColorStop(0, "rgba(240,240,240,0.9)");
    capBottom.addColorStop(1, "rgba(240,240,240,0)");
    ctx.fillStyle = capBottom;
    ctx.fillRect(0, size / 2 - 14, size, 14);
  }
  return textureFromCanvas(canvas);
}

/* ── Color band templates ──────────────────────────────── */
export const JUPITER_STOPS_MONO: ColorStop[] = [
  { t: 0.0, c: [222, 224, 231] },
  { t: 0.08, c: [162, 162, 162] },
  { t: 0.16, c: [226, 228, 226] },
  { t: 0.24, c: [140, 140, 140] },
  { t: 0.34, c: [184, 184, 184] },
  { t: 0.45, c: [232, 226, 216] },
  { t: 0.55, c: [134, 134, 134] },
  { t: 0.64, c: [174, 174, 174] },
  { t: 0.74, c: [232, 226, 216] },
  { t: 0.84, c: [146, 146, 146] },
  { t: 0.92, c: [222, 224, 231] },
  { t: 1.0, c: [196, 196, 196] },
];

export const JUPITER_STOPS_COLORFUL: ColorStop[] = [
  { t: 0.0, c: [222, 224, 231] },
  { t: 0.08, c: [196, 160, 118] },
  { t: 0.16, c: [226, 228, 226] },
  { t: 0.24, c: [180, 130, 100] },
  { t: 0.34, c: [216, 178, 150] },
  { t: 0.45, c: [232, 226, 216] },
  { t: 0.55, c: [174, 122, 94] },
  { t: 0.64, c: [206, 168, 138] },
  { t: 0.74, c: [232, 226, 216] },
  { t: 0.84, c: [184, 136, 108] },
  { t: 0.92, c: [222, 224, 231] },
  { t: 1.0, c: [210, 194, 178] },
];

export const SATURN_STOPS_MONO: ColorStop[] = [
  { t: 0.0, c: [192, 192, 192] },
  { t: 0.25, c: [211, 211, 211] },
  { t: 0.45, c: [175, 175, 175] },
  { t: 0.65, c: [206, 206, 206] },
  { t: 0.85, c: [168, 168, 168] },
  { t: 1.0, c: [199, 199, 199] },
];

export const SATURN_STOPS_COLORFUL: ColorStop[] = [
  { t: 0.0, c: [206, 194, 170] },
  { t: 0.25, c: [226, 214, 188] },
  { t: 0.45, c: [196, 176, 142] },
  { t: 0.65, c: [222, 208, 184] },
  { t: 0.85, c: [190, 168, 136] },
  { t: 1.0, c: [214, 200, 178] },
];

export function makePlanetTexture(id: string, colorful = false): THREE.CanvasTexture {
  switch (id) {
    case "mercury":
      return makeCraterTexture(512, "rgb(148,148,156)", "rgb(96,96,106)");
    case "venus":
      return colorful
        ? makeBlobTexture(512, "rgb(224,202,150)", "rgb(180,156,108)", [
            [216, 188, 134, 0.35],
            [196, 168, 116, 0.3],
            [232, 212, 160, 0.25],
          ])
        : makeBlobTexture(512, "rgb(214,214,214)", "rgb(162,162,162)", [
            [208, 208, 208, 0.35],
            [178, 178, 178, 0.3],
            [216, 216, 216, 0.25],
          ]);
    case "earth":
      return makeEarthTexture(768, colorful);
    case "mars":
      return colorful
        ? makeBlobTexture(512, "rgb(209,117,73)", "rgb(107,55,32)", [
            [92, 46, 28, 0.5],
            [72, 36, 22, 0.35],
            [150, 82, 52, 0.3],
          ], true)
        : makeBlobTexture(512, "rgb(190,190,190)", "rgb(92,92,92)", [
            [84, 84, 84, 0.5],
            [66, 66, 66, 0.35],
            [118, 118, 118, 0.3],
          ], true);
    case "jupiter":
      return makeLatBandedTexture(768, colorful ? JUPITER_STOPS_COLORFUL : JUPITER_STOPS_MONO, 1, {
        u: 0.62,
        v: 0.5,
        rw: 0.07,
        rh: 0.05,
        c: colorful ? [176, 86, 58] : [120, 120, 120],
      });
    case "saturn":
      return makeLatBandedTexture(768, colorful ? SATURN_STOPS_COLORFUL : SATURN_STOPS_MONO, 0.7);
    default:
      return makeBlobTexture(256, "rgb(150,150,160)", "rgb(150,150,160)", []);
  }
}