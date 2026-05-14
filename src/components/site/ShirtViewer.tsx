import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";

import frame01 from "@/assets/camisa/360/frame-01.png";
import frame02 from "@/assets/camisa/360/frame-02.png";
import frame03 from "@/assets/camisa/360/frame-03.png";
import frame04 from "@/assets/camisa/360/frame-04.png";
import frame05 from "@/assets/camisa/360/frame-05.png";
import frame06 from "@/assets/camisa/360/frame-06.png";
import frame07 from "@/assets/camisa/360/frame-07.png";
import frame08 from "@/assets/camisa/360/frame-08.png";
import frame09 from "@/assets/camisa/360/frame-09.png";

const FRAME_SOURCES = [
  frame01,
  frame02,
  frame03,
  frame04,
  frame05,
  frame06,
  frame07,
  frame08,
  frame09,
];

const AUTOPLAY_MS = 900;
const RESUME_AFTER_MS = 2500;
const DRAG_SENSITIVITY = 34;

type ShirtViewerProps = {
  className?: string;
};

type FrameData = {
  image: HTMLImageElement;
  cropX: number;
  cropY: number;
  cropWidth: number;
  cropHeight: number;
};

function getVisibleBounds(image: HTMLImageElement) {
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  canvas.width = width;
  canvas.height = height;

  if (!ctx) {
    return {
      cropX: 0,
      cropY: 0,
      cropWidth: width,
      cropHeight: height,
    };
  }

  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(0, 0, width, height).data;

  let minX = width;
  let minY = height;
  let maxX = 0;
  let maxY = 0;
  let foundPixel = false;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const alpha = data[(y * width + x) * 4 + 3];

      if (alpha > 8) {
        foundPixel = true;
        if (x < minX) minX = x;
        if (y < minY) minY = y;
        if (x > maxX) maxX = x;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (!foundPixel) {
    return {
      cropX: 0,
      cropY: 0,
      cropWidth: width,
      cropHeight: height,
    };
  }

  const safetyPadding = 8;

  const cropX = Math.max(0, minX - safetyPadding);
  const cropY = Math.max(0, minY - safetyPadding);
  const cropWidth = Math.min(width - cropX, maxX - minX + safetyPadding * 2);
  const cropHeight = Math.min(height - cropY, maxY - minY + safetyPadding * 2);

  return {
    cropX,
    cropY,
    cropWidth,
    cropHeight,
  };
}

export function ShirtViewer({ className = "" }: ShirtViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const framesRef = useRef<FrameData[]>([]);
  const currentFrameRef = useRef(0);
  const loadedRef = useRef(false);

  const autoplayRef = useRef<number | null>(null);
  const resumeRef = useRef<number | null>(null);
  const resizeRafRef = useRef<number | null>(null);

  const draggingRef = useRef(false);
  const lastXRef = useRef(0);

  const [isLoaded, setIsLoaded] = useState(false);

  const stopAutoplay = useCallback(() => {
    if (autoplayRef.current !== null) {
      window.clearInterval(autoplayRef.current);
      autoplayRef.current = null;
    }
  }, []);

  const drawCurrentFrame = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const frame = framesRef.current[currentFrameRef.current];

    if (!canvas || !ctx || !frame) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (!canvasWidth || !canvasHeight) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const targetWidth = canvasWidth * 0.86;
    const targetHeight = canvasHeight * 0.86;

    const scale = Math.min(
      targetWidth / frame.cropWidth,
      targetHeight / frame.cropHeight
    );

    const drawWidth = frame.cropWidth * scale;
    const drawHeight = frame.cropHeight * scale;

    const x = (canvasWidth - drawWidth) / 2;
    const y = (canvasHeight - drawHeight) / 2;

    ctx.drawImage(
      frame.image,
      frame.cropX,
      frame.cropY,
      frame.cropWidth,
      frame.cropHeight,
      x,
      y,
      drawWidth,
      drawHeight
    );
  }, []);

  const resizeCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;

    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const nextWidth = Math.max(1, Math.round(rect.width * dpr));
    const nextHeight = Math.max(1, Math.round(rect.height * dpr));

    if (canvas.width !== nextWidth) {
      canvas.width = nextWidth;
    }

    if (canvas.height !== nextHeight) {
      canvas.height = nextHeight;
    }

    drawCurrentFrame();
  }, [drawCurrentFrame]);

  const requestResize = useCallback(() => {
    if (resizeRafRef.current !== null) {
      window.cancelAnimationFrame(resizeRafRef.current);
    }

    resizeRafRef.current = window.requestAnimationFrame(() => {
      resizeRafRef.current = null;
      resizeCanvas();
    });
  }, [resizeCanvas]);

  const goToFrame = useCallback(
    (index: number) => {
      const total = FRAME_SOURCES.length;
      currentFrameRef.current = ((index % total) + total) % total;
      drawCurrentFrame();
    },
    [drawCurrentFrame]
  );

  const startAutoplay = useCallback(() => {
    if (!loadedRef.current || draggingRef.current || autoplayRef.current !== null) return;

    autoplayRef.current = window.setInterval(() => {
      goToFrame(currentFrameRef.current + 1);
    }, AUTOPLAY_MS);
  }, [goToFrame]);

  const scheduleResume = useCallback(() => {
    if (resumeRef.current !== null) {
      window.clearTimeout(resumeRef.current);
    }

    resumeRef.current = window.setTimeout(() => {
      draggingRef.current = false;
      startAutoplay();
    }, RESUME_AFTER_MS);
  }, [startAutoplay]);

  useEffect(() => {
    let cancelled = false;

    async function preloadFrames() {
      const frames = await Promise.all(
        FRAME_SOURCES.map(
          (src) =>
            new Promise<FrameData>((resolve) => {
              const image = new Image();
              image.decoding = "async";

              image.onload = () => {
                const bounds = getVisibleBounds(image);

                resolve({
                  image,
                  ...bounds,
                });
              };

              image.onerror = () => {
                resolve({
                  image,
                  cropX: 0,
                  cropY: 0,
                  cropWidth: image.naturalWidth || image.width || 1,
                  cropHeight: image.naturalHeight || image.height || 1,
                });
              };

              image.src = src;
            })
        )
      );

      if (cancelled) return;

      framesRef.current = frames;
      loadedRef.current = true;
      setIsLoaded(true);

      window.requestAnimationFrame(() => {
        resizeCanvas();
        drawCurrentFrame();
        startAutoplay();
      });
    }

    preloadFrames();

    return () => {
      cancelled = true;
      stopAutoplay();

      if (resumeRef.current !== null) {
        window.clearTimeout(resumeRef.current);
      }

      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
      }
    };
  }, [drawCurrentFrame, resizeCanvas, startAutoplay, stopAutoplay]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      requestResize();
    });

    observer.observe(container);
    requestResize();

    return () => {
      observer.disconnect();

      if (resizeRafRef.current !== null) {
        window.cancelAnimationFrame(resizeRafRef.current);
      }
    };
  }, [requestResize]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!loadedRef.current) return;

    draggingRef.current = true;
    lastXRef.current = event.clientX;

    stopAutoplay();

    if (resumeRef.current !== null) {
      window.clearTimeout(resumeRef.current);
      resumeRef.current = null;
    }

    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // evita erro caso o navegador recuse a captura
    }
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current || !loadedRef.current) return;

    const deltaX = event.clientX - lastXRef.current;
    const steps = Math.trunc(deltaX / DRAG_SENSITIVITY);

    if (steps === 0) return;

    goToFrame(currentFrameRef.current - steps);
    lastXRef.current += steps * DRAG_SENSITIVITY;
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    if (!draggingRef.current) return;

    draggingRef.current = false;

    try {
      event.currentTarget.releasePointerCapture(event.pointerId);
    } catch {
      // evita erro caso o pointer já tenha sido solto
    }

    scheduleResume();
  }

  return (
    <div
      ref={containerRef}
      className={`shirt-viewer ${className}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      role="img"
      aria-label="Visualização 360 graus da camisa"
    >
      <div className="shirt-viewer__glow" aria-hidden="true" />

      <canvas
        ref={canvasRef}
        className="shirt-viewer__canvas"
        aria-hidden="true"
      />

      <div className="shirt-viewer__shadow" aria-hidden="true" />

      {!isLoaded && (
        <div className="shirt-viewer__loading">
          Carregando camisa
        </div>
      )}
    </div>
  );
}

export default ShirtViewer;