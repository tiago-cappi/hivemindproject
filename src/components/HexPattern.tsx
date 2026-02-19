const HexPattern = ({ className = "" }: { className?: string }) => (
  <svg
    className={`absolute pointer-events-none ${className}`}
    width="400"
    height="400"
    viewBox="0 0 400 400"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Hexagon grid */}
    {[0, 1, 2, 3, 4].map((row) =>
      [0, 1, 2, 3].map((col) => {
        const x = col * 90 + (row % 2 === 0 ? 0 : 45) + 20;
        const y = row * 78 + 20;
        return (
          <polygon
            key={`${row}-${col}`}
            points={`${x},${y - 30} ${x + 26},${y - 15} ${x + 26},${y + 15} ${x},${y + 30} ${x - 26},${y + 15} ${x - 26},${y - 15}`}
            stroke="hsl(43 90% 45%)"
            strokeWidth="0.5"
            fill="none"
            opacity={0.15 - row * 0.02}
          />
        );
      })
    )}
    {/* Circuit lines */}
    <line x1="50" y1="200" x2="350" y2="200" stroke="hsl(43 90% 45%)" strokeWidth="0.5" opacity="0.1" strokeDasharray="4 8" />
    <line x1="200" y1="50" x2="200" y2="350" stroke="hsl(43 90% 45%)" strokeWidth="0.5" opacity="0.08" strokeDasharray="4 8" />
    <circle cx="200" cy="200" r="3" fill="hsl(43 90% 45%)" opacity="0.2" />
    <circle cx="50" cy="200" r="2" fill="hsl(43 90% 45%)" opacity="0.15" />
    <circle cx="350" cy="200" r="2" fill="hsl(43 90% 45%)" opacity="0.15" />
  </svg>
);

export default HexPattern;
