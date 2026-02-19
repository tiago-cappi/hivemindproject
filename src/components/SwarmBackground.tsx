import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  baseOpacity: number;
  pulsePhase: number;
}

const SwarmBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const timeRef = useRef(0);

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    const spacing = 90;
    for (let row = 0; row < h / spacing + 2; row++) {
      for (let col = 0; col < w / spacing + 2; col++) {
        const x = col * spacing + (row % 2 === 0 ? 0 : spacing / 2);
        const y = row * (spacing * 0.866);
        particles.push({
          x, y, baseX: x, baseY: y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: 12 + Math.random() * 6,
          opacity: 0.03 + Math.random() * 0.03,
          baseOpacity: 0.03 + Math.random() * 0.03,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    }
    particlesRef.current = particles;
  }, []);

  const drawHex = useCallback((ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, opacity: number, glow: boolean) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.closePath();
    if (glow) {
      ctx.strokeStyle = `hsla(43, 90%, 45%, ${Math.min(opacity * 3, 0.35)})`;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = "hsla(43, 90%, 45%, 0.3)";
      ctx.shadowBlur = 8;
    } else {
      ctx.strokeStyle = `hsla(43, 90%, 45%, ${opacity})`;
      ctx.lineWidth = 0.5;
      ctx.shadowBlur = 0;
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = document.documentElement.scrollHeight;
      initParticles(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY + window.scrollY };
    };
    window.addEventListener("mousemove", onMouseMove);

    const onScroll = () => {
      mouseRef.current = { ...mouseRef.current, y: mouseRef.current.y };
    };
    window.addEventListener("scroll", onScroll);

    const animate = () => {
      timeRef.current += 0.016;
      const t = timeRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;
      const mouse = mouseRef.current;
      const mouseRadius = 200;

      // Update & draw particles
      for (const p of particles) {
        // Drift
        p.x += p.vx;
        p.y += p.vy;
        // Spring back
        p.x += (p.baseX - p.x) * 0.005;
        p.y += (p.baseY - p.y) * 0.005;
        // Pulse
        const pulse = Math.sin(t * 0.8 + p.pulsePhase) * 0.01;
        
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const isNear = dist < mouseRadius;
        
        p.opacity = p.baseOpacity + pulse + (isNear ? (1 - dist / mouseRadius) * 0.15 : 0);
        drawHex(ctx, p.x, p.y, p.size, p.opacity, isNear && dist < mouseRadius * 0.6);
      }

      // Draw connection lines between nearby glowing particles
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        const dxA = mouse.x - a.x;
        const dyA = mouse.y - a.y;
        const distA = Math.sqrt(dxA * dxA + dyA * dyA);
        if (distA > mouseRadius) continue;

        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dxB = mouse.x - b.x;
          const dyB = mouse.y - b.y;
          const distB = Math.sqrt(dxB * dxB + dyB * dyB);
          if (distB > mouseRadius) continue;

          const abDist = Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
          if (abDist < 120) {
            const lineOpacity = (1 - abDist / 120) * (1 - distA / mouseRadius) * 0.25;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `hsla(43, 90%, 45%, ${lineOpacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Data pulse bits traveling along grid lines
      const bitCount = 8;
      for (let i = 0; i < bitCount; i++) {
        const phase = (t * 0.3 + i * 1.7) % 6;
        const pIdx = Math.floor((i * 37) % particles.length);
        const p1 = particles[pIdx];
        const p2 = particles[(pIdx + 1) % particles.length];
        if (!p1 || !p2) continue;
        const frac = phase % 1;
        const bx = p1.x + (p2.x - p1.x) * frac;
        const by = p1.y + (p2.y - p1.y) * frac;
        const bitOpacity = Math.sin(frac * Math.PI) * 0.4;
        
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(43, 90%, 55%, ${bitOpacity})`;
        ctx.shadowColor = "hsla(43, 100%, 55%, 0.5)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, [initParticles, drawHex]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
      style={{ opacity: 1 }}
    />
  );
};

export default SwarmBackground;
