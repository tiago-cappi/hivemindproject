import { MeshGradient } from "@paper-design/shaders-react";
import { useEffect, useMemo, useRef, useState } from "react";

interface AmberCell {
  q: number;
  r: number;
  fillProgress: number;
  dripProgress: number;
  lifetime: number;
  state: "filling" | "dripping" | "fading";
}

const HiveMindShaderBackground = () => {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const amberCellsRef = useRef<AmberCell[]>([]);
  const dimensionsRef = useRef({ width: 1920, height: 1080 });
  const cellsRef = useRef<Array<{ q: number; r: number; x: number; y: number }>>([]);
  const cellLookupRef = useRef(new Map<string, { q: number; r: number; x: number; y: number }>());
  const gridCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef(0);
  const isPageVisibleRef = useRef(true);

  const meshProps = useMemo(
    () => ({
      colors: ["#EAB308", "#B8860B", "#141414", "#050505", "#8A6A00"],
      distortion: 0.42,
      swirl: 0.32,
      grainMixer: 0,
      grainOverlay: 0,
      speed: 0.12,
      offsetX: 0.05,
    }),
    []
  );

  useEffect(() => {
    setMounted(true);
    let resizeFrame = 0;

    const update = () => {
      const dims = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      dimensionsRef.current = dims;
      setDimensions((current) =>
        current.width === dims.width && current.height === dims.height ? current : dims
      );
    };

    const handleResize = () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("resize", handleResize, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    const handleVisibilityChange = () => {
      isPageVisibleRef.current = document.visibilityState === "visible";
      if (isPageVisibleRef.current) {
        lastFrameTimeRef.current = 0;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(resizeFrame);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const hexSize = 44;
    const hexWidth = hexSize * 2;
    const hexHeight = Math.sqrt(3) * hexSize;
    const offscreen = document.createElement("canvas");
    offscreen.width = dimensions.width;
    offscreen.height = dimensions.height;
    const ctx = offscreen.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Pre-compute hex corner offsets once
    const hexOffsets: { dx: number; dy: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      hexOffsets.push({
        dx: hexSize * Math.cos(angle),
        dy: hexSize * Math.sin(angle),
      });
    }

    const drawHexagon = (
      x: number,
      y: number,
      size: number,
      strokeStyle: string,
      lineWidth: number,
      fill?: string | CanvasGradient
    ) => {
      ctx.beginPath();
      if (size === hexSize) {
        ctx.moveTo(x + hexOffsets[0].dx, y + hexOffsets[0].dy);
        for (let i = 1; i < 6; i++) {
          ctx.lineTo(x + hexOffsets[i].dx, y + hexOffsets[i].dy);
        }
      } else {
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + size * Math.cos(angle);
          const hy = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();

      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const hexToPixel = (q: number, r: number) => {
      const x = hexSize * ((3 / 2) * q);
      const y = hexSize * ((Math.sqrt(3) / 2) * q + Math.sqrt(3) * r);
      return { x, y };
    };

    const cols = Math.ceil(dimensions.width / (hexWidth * 0.75)) + 2;
    const rows = Math.ceil(dimensions.height / hexHeight) + 2;
    const offsetXGrid = dimensions.width / 2 - (cols * hexWidth * 0.75) / 2;
    const offsetYGrid = dimensions.height / 2 - (rows * hexHeight) / 2;
    const visibleCells: Array<{ q: number; r: number; x: number; y: number }> = [];
    const cellLookup = new Map<string, { q: number; r: number; x: number; y: number }>();

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);
    for (let q = -2; q < cols; q++) {
      for (let r = -2; r < rows; r++) {
        const { x, y } = hexToPixel(q, r);
        const adjustedX = x + offsetXGrid;
        const adjustedY = y + offsetYGrid;

        if (
          adjustedX < -hexSize ||
          adjustedX > dimensions.width + hexSize ||
          adjustedY < -hexSize ||
          adjustedY > dimensions.height + hexSize
        ) {
          continue;
        }

        visibleCells.push({ q, r, x: adjustedX, y: adjustedY });
        cellLookup.set(`${q}:${r}`, { q, r, x: adjustedX, y: adjustedY });
        drawHexagon(adjustedX, adjustedY, hexSize, "rgba(234, 179, 8, 0.12)", 0.65);
      }
    }

    cellsRef.current = visibleCells;
    cellLookupRef.current = cellLookup;
    gridCanvasRef.current = offscreen;
  }, [mounted, dimensions]);

  useEffect(() => {
    if (!mounted || !overlayCanvasRef.current) return;

    const canvas = overlayCanvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const hexSize = 44;

    const hexOffsets: { dx: number; dy: number }[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      hexOffsets.push({
        dx: hexSize * Math.cos(angle),
        dy: hexSize * Math.sin(angle),
      });
    }

    const drawHexagon = (
      x: number,
      y: number,
      size: number,
      strokeStyle: string,
      lineWidth: number,
      fill?: string | CanvasGradient
    ) => {
      ctx.beginPath();
      if (size === hexSize) {
        ctx.moveTo(x + hexOffsets[0].dx, y + hexOffsets[0].dy);
        for (let i = 1; i < 6; i++) {
          ctx.lineTo(x + hexOffsets[i].dx, y + hexOffsets[i].dy);
        }
      } else {
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          const hx = x + size * Math.cos(angle);
          const hy = y + size * Math.sin(angle);
          if (i === 0) ctx.moveTo(hx, hy);
          else ctx.lineTo(hx, hy);
        }
      }
      ctx.closePath();

      if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
      }

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const fpsInterval = 1000 / 30;
    let time = 0;
    let lastAmberSpawn = 0;

    const animate = (timestamp: number) => {
      frameRef.current = requestAnimationFrame(animate);

      if (!isPageVisibleRef.current) {
        return;
      }

      if (timestamp - lastFrameTimeRef.current < fpsInterval) {
        return;
      }

      lastFrameTimeRef.current = timestamp;
      time += 0.016;
      const dims = dimensionsRef.current;
      const mousePos = mousePosRef.current;
      ctx.clearRect(0, 0, dims.width, dims.height);

      const gridCanvas = gridCanvasRef.current;
      if (gridCanvas) {
        ctx.globalAlpha = 0.9;
        ctx.drawImage(gridCanvas, 0, 0);
        ctx.globalAlpha = 1;
      }

      // 1. Draw localized proximity glow only for nearby cells
      ctx.save();
      const visibleCells = cellsRef.current;
      for (let i = 0; i < visibleCells.length; i++) {
        const cell = visibleCells[i];
        const dx = mousePos.x - cell.x;
        const dy = mousePos.y - cell.y;
        const distSq = dx * dx + dy * dy;
        if (distSq >= 19600) {
          continue;
        }

        const glowIntensity = 1 - Math.sqrt(distSq) / 140;
        drawHexagon(cell.x, cell.y, hexSize, `rgba(234, 179, 8, ${glowIntensity * 0.5})`, 1.15);
      }
      ctx.restore();

      // 2. Draw Amber Cells (Oozing Effect)
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      if (time - lastAmberSpawn > 3.5 && Math.random() < 0.015 && visibleCells.length > 0) {
        const sourceCell = visibleCells[Math.floor(Math.random() * visibleCells.length)];
        amberCellsRef.current.push({
          q: sourceCell.q,
          r: sourceCell.r,
          fillProgress: 0,
          dripProgress: 0,
          lifetime: 0,
          state: "filling",
        });
        lastAmberSpawn = time;
      }

      amberCellsRef.current = amberCellsRef.current.filter((cell) => {
        cell.lifetime += 0.016;
        if (cell.lifetime > 12) return false;

        const matchingCell = cellLookupRef.current.get(`${cell.q}:${cell.r}`);

        if (!matchingCell) {
          return false;
        }

        const adjustedX = matchingCell.x;
        const adjustedY = matchingCell.y;

        if (cell.state === "filling") {
          cell.fillProgress = Math.min(1, cell.fillProgress + 0.015);

          const gradient = ctx.createLinearGradient(
            adjustedX,
            adjustedY + hexSize,
            adjustedX,
            adjustedY - hexSize
          );
          gradient.addColorStop(0, "rgba(218, 165, 32, 0.6)");
          gradient.addColorStop(0.5, "rgba(234, 179, 8, 0.8)");
          gradient.addColorStop(1, "rgba(255, 215, 0, 0.4)");

          ctx.save();
          ctx.beginPath();
          for (let i = 0; i < 6; i++) {
            ctx.lineTo(
              adjustedX + hexOffsets[i].dx,
              adjustedY + hexOffsets[i].dy
            );
          }
          ctx.closePath();
          ctx.clip();

          const fillHeight = hexSize * 2 * cell.fillProgress;
          ctx.fillStyle = gradient;
          ctx.fillRect(
            adjustedX - hexSize,
            adjustedY + hexSize - fillHeight,
            hexSize * 2,
            fillHeight
          );
          ctx.restore();

          if (cell.fillProgress >= 1) {
            cell.state = "dripping";
          }
        } else if (cell.state === "dripping") {
          cell.dripProgress = Math.min(1, cell.dripProgress + 0.012);

          const gradient = ctx.createLinearGradient(
            adjustedX,
            adjustedY + hexSize,
            adjustedX,
            adjustedY - hexSize
          );
          gradient.addColorStop(0, "rgba(218, 165, 32, 0.6)");
          gradient.addColorStop(0.5, "rgba(234, 179, 8, 0.8)");
          gradient.addColorStop(1, "rgba(255, 215, 0, 0.4)");

          drawHexagon(
            adjustedX,
            adjustedY,
            hexSize,
            "rgba(255, 215, 0, 0.3)",
            1,
            gradient
          );

          // Draw drip using bezier curve
          const dripY = adjustedY + hexSize + cell.dripProgress * 60;
          const dripStretch = Math.sin(cell.dripProgress * Math.PI) * 8;

          ctx.beginPath();
          ctx.moveTo(adjustedX, adjustedY + hexSize);
          ctx.bezierCurveTo(
            adjustedX - dripStretch,
            adjustedY +
              hexSize +
              (dripY - adjustedY - hexSize) * 0.3,
            adjustedX + dripStretch,
            adjustedY +
              hexSize +
              (dripY - adjustedY - hexSize) * 0.6,
            adjustedX,
            dripY
          );
          ctx.strokeStyle = `rgba(234, 179, 8, ${
            (1 - cell.dripProgress) * 0.8
          })`;
          ctx.lineWidth = 3 - cell.dripProgress * 2;
          ctx.stroke();

          // Draw drip tip
          ctx.beginPath();
          ctx.arc(
            adjustedX,
            dripY,
            2 - cell.dripProgress * 1.5,
            0,
            Math.PI * 2
          );
          ctx.fillStyle = `rgba(255, 215, 0, ${
            (1 - cell.dripProgress) * 0.9
          })`;
          ctx.fill();

          if (cell.dripProgress >= 1) {
            cell.state = "fading";
          }
        }

        return true;
      });
      ctx.restore();
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [mounted]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 w-screen h-screen overflow-hidden">
      {mounted && (
        <>
          <MeshGradient
            width={dimensions.width}
            height={dimensions.height}
            {...meshProps}
          />
          <div className="absolute inset-0 pointer-events-none bg-black/42" />
          <canvas
            ref={overlayCanvasRef}
            width={dimensions.width}
            height={dimensions.height}
            className="absolute inset-0 w-full h-full pointer-events-none opacity-80"
          />
        </>
      )}
    </div>
  );
};

export default HiveMindShaderBackground;
