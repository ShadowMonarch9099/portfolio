/**
 * Canvas drawing for map labels and project cards, using the site's own
 * fonts (read from the next/font CSS variables) so the 3D text matches the UI.
 */

export interface Fonts {
  heading: string;
  pixel: string;
}

let fontsPromise: Promise<Fonts> | null = null;

export function loadFonts(): Promise<Fonts> {
  fontsPromise ??= (async () => {
    const css = getComputedStyle(document.documentElement);
    const heading = css.getPropertyValue("--font-heading").trim() || "sans-serif";
    const pixel = css.getPropertyValue("--font-px").trim() || "monospace";
    try {
      await Promise.all([document.fonts.load(`800 64px ${heading}`), document.fonts.load(`400 32px ${pixel}`)]);
    } catch {
      // Use whatever is available.
    }
    return { heading, pixel };
  })();
  return fontsPromise;
}

function notchPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, n: number) {
  ctx.beginPath();
  ctx.moveTo(x + n, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - n);
  ctx.lineTo(x + w - n, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + n);
  ctx.closePath();
}

/** A map label in a notched box, drawn in its own colour. Returns width/height ratio. */
export function drawLabel(canvas: HTMLCanvasElement, text: string, fonts: Fonts, ink: boolean, color: string) {
  const ctx = canvas.getContext("2d")!;
  const size = 34;
  ctx.font = `400 ${size}px ${fonts.pixel}`;
  const w = Math.ceil(ctx.measureText(text).width) + 48;
  canvas.width = w;
  canvas.height = 64;
  ctx.font = `400 ${size}px ${fonts.pixel}`;
  notchPath(ctx, 2, 2, w - 4, 60, 12);
  ctx.fillStyle = ink ? "rgba(242,237,228,0.9)" : "rgba(8,9,14,0.72)";
  ctx.fill();
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = color;
  ctx.stroke();
  ctx.fillStyle = color;
  ctx.textBaseline = "middle";
  ctx.fillText(text, 24, 34);
  return w / 64;
}

/** Project card: screenshot with a title strip, in a notched frame. */
export function drawCard(
  canvas: HTMLCanvasElement,
  title: string,
  sub: string,
  color: string,
  fonts: Fonts,
  ink: boolean,
  image?: HTMLImageElement,
) {
  const W = 640;
  const H = 470;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const edge = ink ? "#1a1714" : color;
  notchPath(ctx, 6, 6, W - 12, H - 12, 22);
  ctx.fillStyle = ink ? "rgba(242,237,228,0.95)" : "rgba(8,9,14,0.82)";
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = edge;
  if (!ink) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
  }
  ctx.stroke();
  ctx.shadowBlur = 0;
  const ix = 24;
  const iy = 24;
  const iw = W - 48;
  const ih = 330;
  if (image) {
    ctx.save();
    notchPath(ctx, ix, iy, iw, ih, 14);
    ctx.clip();
    const s = Math.max(iw / image.width, ih / image.height);
    ctx.drawImage(image, ix + (iw - image.width * s) / 2, iy + (ih - image.height * s) / 2, image.width * s, image.height * s);
    ctx.restore();
  }
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = ink ? "#b3380a" : color;
  ctx.font = `400 22px ${fonts.pixel}`;
  ctx.fillText(sub, ix, H - 70);
  ctx.fillStyle = ink ? "#1a1714" : "#fff6ee";
  ctx.font = `800 46px ${fonts.heading}`;
  ctx.fillText(title, ix, H - 26);
}
