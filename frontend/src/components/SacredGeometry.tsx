interface Props {
  size?: number;
  className?: string;
  spin?: boolean;
}

export default function SacredGeometry({ size = 200, className = "", spin = true }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.38;

  // Hexagram (Star of David) points
  const hex = (offset: number) =>
    Array.from({ length: 6 }, (_, i) => {
      const angle = (Math.PI / 3) * i + offset;
      return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    });

  const triangle = (pts: { x: number; y: number }[], indices: number[]) =>
    indices.map((i) => `${pts[i].x},${pts[i].y}`).join(" ");

  const pts = hex(0);
  const pts2 = hex(Math.PI / 3);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ filter: "drop-shadow(0 0 12px rgba(212,175,55,0.5))" }}
    >
      {/* Outer circle */}
      <circle cx={cx} cy={cy} r={r * 1.08} fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r={r * 0.55} fill="none" stroke="rgba(212,175,55,0.2)" strokeWidth="0.6" />

      {/* Triangle 1 */}
      <polygon
        points={triangle(pts, [0, 2, 4])}
        fill="none"
        stroke="rgba(212,175,55,0.7)"
        strokeWidth="1.2"
      />
      {/* Triangle 2 */}
      <polygon
        points={triangle(pts2, [0, 2, 4])}
        fill="none"
        stroke="rgba(167,139,250,0.6)"
        strokeWidth="1.2"
      />

      {/* Inner hexagon */}
      <polygon
        points={pts.map((p, i) => {
          const mid = pts2[i];
          return `${(p.x + mid.x) / 2},${(p.y + mid.y) / 2}`;
        }).join(" ")}
        fill="rgba(212,175,55,0.06)"
        stroke="rgba(212,175,55,0.4)"
        strokeWidth="0.8"
      />

      {/* Center dot */}
      <circle cx={cx} cy={cy} r={3} fill="rgba(212,175,55,0.9)" />

      {spin && (
        <style>{`
          svg { animation: spin 30s linear infinite; transform-origin: center; }
        `}</style>
      )}
    </svg>
  );
}
