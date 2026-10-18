// Ordered (Bayer) dithering shared by every dithered element on the site.

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

// Colour ordered dithering in place: each channel is reduced to `levels` steps,
// with the Bayer matrix deciding which way each pixel rounds. The image stays
// recognisable but every pixel lands on a small fixed palette.
export function ditherColor(image: ImageData, levels: number) {
  const { data, width, height } = image;
  const steps = Math.max(1, levels - 1);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const t = threshold(x, y);
      const i = (y * width + x) * 4;
      for (let k = 0; k < 3; k++) {
        const v = data[i + k] / 255;
        data[i + k] = (Math.min(steps, Math.floor(v * steps + t)) / steps) * 255;
      }
      data[i + 3] = 255;
    }
  }
}
