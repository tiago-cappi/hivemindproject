import React, { useRef, useEffect } from 'react';

interface Point {
  x: number;
  y: number;
}

interface HexCell {
  center: Point;
  corners: Point[];
  id: string;
}

interface Pulse {
  id: string;
  path: Point[];
  progress: number;
  speed: number;
  edgePath: { start: Point; end: Point }[];
}

interface BeeParticle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  progress: number;
}

interface BeeSwarm {
  id: string;
  centerX: number;
  centerY: number;
  particles: BeeParticle[];
  phase: 'converging' | 'formed' | 'dissolving';
  lifetime: number;
}

const HiveMindBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const hexGridRef = useRef<HexCell[]>([]);
  const pulsesRef = useRef<Pulse[]>([]);
  const swarmsRef = useRef<BeeSwarm[]>([]);
  const timeRef = useRef<number>(0);

  const hexSize = 50;
  const pulseColor = '#eab308';

  const createHexagonalGrid = (width: number, height: number): HexCell[] => {
    const cells: HexCell[] = [];
    const hexWidth = hexSize * 2;
    const hexHeight = Math.sqrt(3) * hexSize;
    const cols = Math.ceil(width / (hexWidth * 0.75)) + 2;
    const rows = Math.ceil(height / hexHeight) + 2;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const x = col * hexWidth * 0.75;
        const y = row * hexHeight + (col % 2 === 1 ? hexHeight / 2 : 0);

        const corners: Point[] = [];
        for (let i = 0; i < 6; i++) {
          const angle = (Math.PI / 3) * i;
          corners.push({
            x: x + hexSize * Math.cos(angle),
            y: y + hexSize * Math.sin(angle),
          });
        }

        cells.push({
          center: { x, y },
          corners,
          id: `hex-${row}-${col}`,
        });
      }
    }

    return cells;
  };

  const createPulse = (hexCells: HexCell[]): Pulse => {
    const startCell = hexCells[Math.floor(Math.random() * hexCells.length)];
    const pathLength = 6 + Math.floor(Math.random() * 10);
    const path: Point[] = [];
    const edgePath: { start: Point; end: Point }[] = [];

    let currentCell = startCell;
    const visited = new Set<string>([currentCell.id]);

    const startCornerIndex = Math.floor(Math.random() * 6);
    const startCorner = currentCell.corners[startCornerIndex];
    path.push(startCorner);

    for (let i = 0; i < pathLength; i++) {
      const hexWidth = hexSize * 2;
      const hexHeight = Math.sqrt(3) * hexSize;

      const neighbors = hexCells.filter((cell) => {
        if (visited.has(cell.id)) return false;
        const dx = Math.abs(cell.center.x - currentCell.center.x);
        const dy = Math.abs(cell.center.y - currentCell.center.y);
        const isAdjacent =
          (dx < hexWidth * 0.8 && dy < hexHeight * 0.6) ||
          (dx < hexWidth * 0.4 && dy < hexHeight * 1.1);
        return isAdjacent;
      });

      if (neighbors.length > 0) {
        const nextCell = neighbors[Math.floor(Math.random() * neighbors.length)];
        visited.add(nextCell.id);

        const currentCorner = path[path.length - 1];

        const currentCellCornerIndex = currentCell.corners.findIndex(
          (c) => Math.hypot(c.x - currentCorner.x, c.y - currentCorner.y) < 1
        );

        const sharedCorners: Point[] = [];
        currentCell.corners.forEach((corner) => {
          nextCell.corners.forEach((nextCorner) => {
            if (Math.hypot(corner.x - nextCorner.x, corner.y - nextCorner.y) < 2) {
              sharedCorners.push(corner);
            }
          });
        });

        if (sharedCorners.length >= 2) {
          const targetSharedCorner =
            sharedCorners.find(
              (sc) => Math.hypot(sc.x - currentCorner.x, sc.y - currentCorner.y) > 1
            ) || sharedCorners[0];

          const targetCornerIndex = currentCell.corners.findIndex(
            (c) => Math.hypot(c.x - targetSharedCorner.x, c.y - targetSharedCorner.y) < 1
          );

          let direction = targetCornerIndex - currentCellCornerIndex;
          if (direction > 3) direction -= 6;
          if (direction < -3) direction += 6;

          const step = direction > 0 ? 1 : -1;
          const stepsNeeded = Math.abs(direction);

          for (let s = 1; s <= stepsNeeded; s++) {
            const idx = (currentCellCornerIndex + step * s + 6) % 6;
            const corner = currentCell.corners[idx];
            const prevCorner = path[path.length - 1];
            edgePath.push({ start: prevCorner, end: corner });
            path.push(corner);
          }
        }

        currentCell = nextCell;
      } else {
        break;
      }
    }

    return {
      id: `pulse-${Date.now()}-${Math.random()}`,
      path,
      edgePath,
      progress: 0,
      speed: 0.0015 + Math.random() * 0.002,
    };
  };

  const createBeeSwarm = (hexCells: HexCell[]): BeeSwarm => {
    const targetHex = hexCells[Math.floor(Math.random() * hexCells.length)];
    const centerX = targetHex.center.x;
    const centerY = targetHex.center.y;
    const particleCount = 20 + Math.floor(Math.random() * 15);

    const particles: BeeParticle[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + Math.random() * 0.3;
      const distance = 80 + Math.random() * 120;
      particles.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        targetX: centerX + (Math.random() - 0.5) * 20,
        targetY: centerY + (Math.random() - 0.5) * 20,
        progress: 0,
      });
    }

    return {
      id: `swarm-${Date.now()}`,
      centerX,
      centerY,
      particles,
      phase: 'converging',
      lifetime: 0,
    };
  };

  const drawHexagon = (ctx: CanvasRenderingContext2D, corners: Point[]) => {
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const drawPulse = (ctx: CanvasRenderingContext2D, pulse: Pulse) => {
    if (pulse.edgePath.length === 0) return;

    const totalEdges = pulse.edgePath.length;
    const currentEdge = pulse.progress * totalEdges;
    const edgeIndex = Math.floor(currentEdge);
    const edgeProgress = currentEdge - edgeIndex;

    if (edgeIndex >= totalEdges) return;

    ctx.shadowBlur = 15;
    ctx.shadowColor = pulseColor;
    ctx.strokeStyle = pulseColor;
    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (let i = 0; i < edgeIndex; i++) {
      const edge = pulse.edgePath[i];
      ctx.beginPath();
      ctx.moveTo(edge.start.x, edge.start.y);
      ctx.lineTo(edge.end.x, edge.end.y);
      ctx.stroke();
    }

    if (edgeIndex < totalEdges) {
      const edge = pulse.edgePath[edgeIndex];
      const x = edge.start.x + (edge.end.x - edge.start.x) * edgeProgress;
      const y = edge.start.y + (edge.end.y - edge.start.y) * edgeProgress;

      ctx.beginPath();
      ctx.moveTo(edge.start.x, edge.start.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    ctx.shadowBlur = 0;
  };

  const drawBeeShape = (ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);

    ctx.shadowBlur = 20;
    ctx.shadowColor = pulseColor;

    // Corpo principal (abdômen e tórax)
    ctx.fillStyle = pulseColor;
    ctx.beginPath();
    ctx.ellipse(0, 5, 10, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Listras pretas
    ctx.fillStyle = 'rgba(30, 30, 30, 0.4)';
    ctx.fillRect(-10, 0, 20, 3);
    ctx.fillRect(-10, 8, 20, 3);
    ctx.fillRect(-10, 16, 20, 3);

    // Cabeça
    ctx.fillStyle = pulseColor;
    ctx.beginPath();
    ctx.arc(0, -8, 8, 0, Math.PI * 2);
    ctx.fill();

    // Olhos
    ctx.fillStyle = 'rgba(30, 30, 30, 0.6)';
    ctx.beginPath();
    ctx.arc(-3, -8, 2.5, 0, Math.PI * 2);
    ctx.arc(3, -8, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // Antenas
    ctx.strokeStyle = pulseColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-3, -14);
    ctx.lineTo(-5, -20);
    ctx.moveTo(3, -14);
    ctx.lineTo(5, -20);
    ctx.stroke();

    // Asas (com transparência)
    ctx.fillStyle = 'rgba(234, 179, 8, 0.3)';
    ctx.strokeStyle = pulseColor;
    ctx.lineWidth = 1;

    // Asa esquerda
    ctx.beginPath();
    ctx.ellipse(-8, -2, 14, 8, -Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Asa direita
    ctx.beginPath();
    ctx.ellipse(8, -2, 14, 8, Math.PI / 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.shadowBlur = 0;
    ctx.restore();
  };

  const drawSwarm = (ctx: CanvasRenderingContext2D, swarm: BeeSwarm) => {
    if (swarm.phase === 'converging' || swarm.phase === 'dissolving') {
      swarm.particles.forEach((particle) => {
        const x = particle.x + (particle.targetX - particle.x) * particle.progress;
        const y = particle.y + (particle.targetY - particle.y) * particle.progress;

        ctx.fillStyle = pulseColor;
        ctx.shadowBlur = 8;
        ctx.shadowColor = pulseColor;
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    } else if (swarm.phase === 'formed') {
      const fadeInDuration = 20;
      const fadeOutStart = 160;
      let opacity = 1;

      if (swarm.lifetime < fadeInDuration) {
        opacity = swarm.lifetime / fadeInDuration;
      } else if (swarm.lifetime > fadeOutStart) {
        opacity = 1 - (swarm.lifetime - fadeOutStart) / (180 - fadeOutStart);
      }

      ctx.globalAlpha = opacity;
      drawBeeShape(ctx, swarm.centerX, swarm.centerY, 1.8);
      ctx.globalAlpha = 1;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      hexGridRef.current = createHexagonalGrid(canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 20; i++) {
      pulsesRef.current.push(createPulse(hexGridRef.current));
    }

    const animate = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(64, 64, 64, 0.12)';
      ctx.lineWidth = 0.8;
      hexGridRef.current.forEach((hex) => {
        drawHexagon(ctx, hex.corners);
      });

      pulsesRef.current.forEach((pulse, index) => {
        pulse.progress += pulse.speed;
        if (pulse.progress >= 1) {
          pulsesRef.current[index] = createPulse(hexGridRef.current);
        } else {
          drawPulse(ctx, pulse);
        }
      });

      if (Math.random() < 0.008 && swarmsRef.current.length < 4) {
        swarmsRef.current.push(createBeeSwarm(hexGridRef.current));
      }

      swarmsRef.current = swarmsRef.current.filter((swarm) => {
        swarm.lifetime++;

        if (swarm.phase === 'converging') {
          swarm.particles.forEach((particle) => {
            particle.progress = Math.min(1, particle.progress + 0.015);
          });

          if (swarm.particles.every((p) => p.progress >= 1)) {
            swarm.phase = 'formed';
            swarm.lifetime = 0;
          }
        } else if (swarm.phase === 'formed') {
          if (swarm.lifetime > 180) {
            swarm.phase = 'dissolving';
            swarm.lifetime = 0;
            swarm.particles.forEach((particle) => {
              const angle = Math.random() * Math.PI * 2;
              const distance = 80 + Math.random() * 120;
              particle.x = particle.targetX;
              particle.y = particle.targetY;
              particle.targetX = swarm.centerX + Math.cos(angle) * distance;
              particle.targetY = swarm.centerY + Math.sin(angle) * distance;
              particle.progress = 0;
            });
          }
        } else if (swarm.phase === 'dissolving') {
          swarm.particles.forEach((particle) => {
            particle.progress = Math.min(1, particle.progress + 0.02);
          });

          if (swarm.particles.every((p) => p.progress >= 1)) {
            return false;
          }
        }

        drawSwarm(ctx, swarm);
        return true;
      });

      timeRef.current++;
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
};

export default HiveMindBackground;
