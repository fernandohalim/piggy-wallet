"use client";
import { useEffect, useRef, useState } from "react";

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });
}

// Load a Google font via the FontFace API (reliable for canvas text, unlike
// SVG-embedded @font-face). Uses the `latin` subset (last url in the css2 reply).
async function loadFont(family: string, weight: number, cssUrl: string) {
  const css = await (await fetch(cssUrl)).text();
  const urls = [...css.matchAll(/url\((https:\/\/[^)]+\.woff2)\)/g)];
  if (!urls.length) return;
  const url = urls[urls.length - 1][1];
  const face = new FontFace(family, `url(${url})`, { weight: String(weight) });
  await face.load();
  document.fonts.add(face);
}

async function ensureFonts() {
  await Promise.all([
    loadFont(
      "Outfit",
      800,
      "https://fonts.googleapis.com/css2?family=Outfit:wght@800",
    ),
    loadFont(
      "Plus Jakarta Sans",
      500,
      "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500",
    ),
  ]);
  await document.fonts.ready;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function draw(ctx: CanvasRenderingContext2D, icon: HTMLImageElement) {
  const W = 1200,
    H = 630;
  ctx.clearRect(0, 0, W, H);

  // background + soft brand glows
  ctx.fillStyle = "#F5F4FB";
  ctx.fillRect(0, 0, W, H);
  let g = ctx.createRadialGradient(0, 0, 0, 0, 0, 820);
  g.addColorStop(0, "rgba(91,91,214,0.18)");
  g.addColorStop(1, "rgba(91,91,214,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  g = ctx.createRadialGradient(W, 0, 0, W, 0, 820);
  g.addColorStop(0, "rgba(245,166,35,0.16)");
  g.addColorStop(1, "rgba(245,166,35,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);

  // huge donut bleeding off the top-right corner (background element)
  ctx.save();
  roundRect(ctx, 24, 24, 1152, 582, 40);
  ctx.clip();
  const cx = 1170,
    cy = -10,
    r = 300;
  ctx.lineWidth = 64;
  ctx.lineCap = "butt";
  ctx.globalAlpha = 0.85;
  const segs: [string, number][] = [
    ["#5B5BD6", 0.4],
    ["#F5A623", 0.25],
    ["#20C9A6", 0.2],
    ["#8B5CF6", 0.15],
  ];
  let a = -Math.PI / 2;
  for (const [color, p] of segs) {
    const a1 = a + p * Math.PI * 2;
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.arc(cx, cy, r, a, a1);
    ctx.stroke();
    a = a1;
  }
  ctx.globalAlpha = 1;
  ctx.restore();

  // inset frame
  roundRect(ctx, 24, 24, 1152, 582, 40);
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#E6E3F0";
  ctx.stroke();

  // app icon (left), rounded + shadow
  const ix = 110,
    iy = 237,
    isz = 156,
    ir = 36;
  ctx.save();
  ctx.shadowColor = "rgba(91,91,214,0.28)";
  ctx.shadowBlur = 36;
  ctx.shadowOffsetY = 14;
  roundRect(ctx, ix, iy, isz, isz, ir);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();
  ctx.save();
  roundRect(ctx, ix, iy, isz, isz, ir);
  ctx.clip();
  ctx.drawImage(icon, ix, iy, isz, isz);
  ctx.restore();

  // wordmark + tagline (left-aligned, centered with the icon)
  const tx = ix + isz + 46;
  ctx.textBaseline = "alphabetic";
  ctx.letterSpacing = "-1px";
  ctx.font = "800 70px Outfit, sans-serif";
  ctx.fillStyle = "#1E1B2E";
  ctx.fillText("Piggy", tx, 322);
  const pw = ctx.measureText("Piggy").width;
  ctx.fillStyle = "#5B5BD6";
  ctx.fillText(" Wallet", tx + pw, 322);

  ctx.letterSpacing = "0px";
  ctx.font = "500 28px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = "#6B6880";
  ctx.fillText("A simple, offline-first expense tracker.", tx, 368);
}

export default function PreviewPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await ensureFonts().catch(() => {}); // export still works on failure
      const icon = await loadImage("/icons/icon-512.png");
      if (cancelled) return;
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      draw(ctx, icon);
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement("a");
    a.download = "piggy-wallet-og.png";
    a.href = canvas.toDataURL("image/png");
    a.click();
  };

  return (
    <main className="min-h-dvh grid place-items-center gap-6 p-6">
      <div className="w-full max-w-[1200px] overflow-hidden rounded-2xl border border-border shadow-card">
        <canvas
          ref={canvasRef}
          width={1200}
          height={630}
          className="block w-full h-auto"
        />
      </div>
      <button
        onClick={download}
        disabled={!ready}
        className="rounded-full bg-primary text-white font-semibold px-6 py-3 shadow-pop active:scale-95 transition-transform disabled:opacity-60"
      >
        {ready ? "Download PNG (1200×630)" : "Rendering…"}
      </button>
    </main>
  );
}
