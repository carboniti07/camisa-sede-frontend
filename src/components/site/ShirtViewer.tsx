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

const AUTOPLAY_MS = 850;
const RESUME_AFTER_MS = 2500;
const DRAG_SENSITIVITY = 32;

type ShirtViewerProps = {
  className?: string;
};

export function ShirtViewer({ className = "" }: ShirtViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const imagesRef = useRef<HTMLImageElement[]>([]);
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
    const image = imagesRef.current[currentFrameRef.current];

    if (!canvas || !ctx || !image) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    if (!canvasWidth || !canvasHeight) return;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    const imageWidth = image.naturalWidth || image.width;
    const imageHeight = image.naturalHeight || image.height;

    if (!imageWidth || !imageHeight) return;

    /*
      Importante:
      Não recorta transparência.
      Não recalcula pelo conteúdo visível.
      Desenha todos os PNGs inteiros dentro do mesmo quadro.
      Isso impede a camisa de crescer, diminuir ou "pular" a cada frame.
    */
    const padding = canvasWidth * 0.02;

    const scale = Math.min(
      (canvasWidth - padding * 2) / imageWidth,
      (canvasHeight - padding * 2) / imageHeight
    );

    const drawWidth = imageWidth * scale;
    const drawHeight = imageHeight * scale;

    const x = (canvasWidth - drawWidth) / 2;
    const y = (canvasHeight - drawHeight) / 2;

    ctx.drawImage(image, x, y, drawWidth, drawHeight);
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
      const loadedImages = await Promise.all(
        FRAME_SOURCES.map(
          (src) =>
            new Promise<HTMLImageElement>((resolve) => {
              const image = new Image();
              image.decoding = "async";

              image.onload = () => resolve(image);

              image.onerror = () => resolve(image);

              image.src = src;
            })
        )
      );

      if (cancelled) return;

      imagesRef.current = loadedImages;
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
      // Evita erro caso o navegador recuse a captura.
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
      // Evita erro caso o pointer já tenha sido solto.
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