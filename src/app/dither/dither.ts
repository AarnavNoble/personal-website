// Ordered (Bayer) dithering shared by the portrait and the section rules.

const BAYER_8 = [
  0, 32, 8, 40, 2, 34, 10, 42,
  48, 16, 56, 24, 50, 18, 58, 26,
  12, 44, 4, 36, 14, 46, 6, 38,
  60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41,
  51, 19, 59, 27, 49, 17, 57, 25,
  15, 47, 7, 39, 13, 45, 5, 37,
  63, 31, 55, 23, 61, 29, 53, 21,
].map((v) => (v + 0.5) / 64);

export function threshold(x: number, y: number) {
  return BAYER_8[(y & 7) * 8 + (x & 7)];
}

export type Rgb = [number, number, number];

export function parseColor(value: string): Rgb {
  const hex = value.trim().replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function readInk(el: Element): Rgb {
  return parseColor(getComputedStyle(el).getPropertyValue("--ink") || "#2a2cb4");
}

// Writes one pixel per cell: ink where the tone is darker than the Bayer threshold,
// otherwise nothing, so the page's paper (and anything under it) shows through.
// `tone` is 0 (paper) to 1 (ink).
export function paint(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  tone: (x: number, y: number) => number,
  ink: Rgb,
) {
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      if (tone(x, y) > threshold(x, y)) {
        data[i] = ink[0];
        data[i + 1] = ink[1];
        data[i + 2] = ink[2];
        data[i + 3] = 255;
      } else {
        data[i + 3] = 0;
      }
    }
  }
}
