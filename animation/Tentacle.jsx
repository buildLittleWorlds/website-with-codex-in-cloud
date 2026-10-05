import React from 'react';
import {interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

// One complete wave fits the timeline, so the end flows back into the start.
export const Tentacle = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const phase = interpolate(frame, [0, durationInFrames], [0, Math.PI * 2]);
  const neckX = 150 + 22 * Math.sin(phase);
  const curlY = 178 + 12 * Math.sin(phase);
  const points = [];

  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    points.push({
      x: 242 + (neckX - 242) * t * t * (3 - 2 * t) + 38 * Math.sin(t * Math.PI * 2 - phase) * Math.pow(Math.sin(t * Math.PI), 2),
      y: 960 + (curlY + 60 - 960) * t,
      radius: 10 + 42 * Math.pow(1 - t, 0.8),
    });
  }

  for (let i = 1; i <= 36; i++) {
    const t = i / 36;
    const angle = Math.PI / 2 + Math.pow(t, 1.25) * (Math.PI * 1.8 + 0.22 * Math.sin(phase));
    const radius = 60 * (1 - 0.72 * t);
    points.push({
      x: neckX + Math.cos(angle) * radius,
      y: curlY + Math.sin(angle) * radius,
      radius: 9.2 * (1 - t) + 0.8,
    });
  }

  const sections = points.map((point, i) => {
    const before = points[Math.max(0, i - 1)];
    const after = points[Math.min(points.length - 1, i + 1)];
    const dx = after.x - before.x;
    const dy = after.y - before.y;
    const length = Math.hypot(dx, dy);
    return {...point, nx: -dy / length, ny: dx / length, angle: Math.atan2(dy, dx) * 180 / Math.PI + 90};
  });
  const edge = (side) => sections.map(({x, y, nx, ny, radius}) => [x + side * nx * radius, y + side * ny * radius]);
  const coordinates = (values) => values.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' L ');
  const outer = edge(1);
  const inner = edge(-1);
  const silhouette = `M ${coordinates(outer)} L ${coordinates([...inner].reverse())} Z`;

  return (
    <svg viewBox="0 0 260 900" preserveAspectRatio="none" style={{width: '100%', height: '100%', display: 'block'}}>
      <defs>
        <linearGradient id="tentacle-skin" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#203d37" />
          <stop offset="0.4" stopColor="#668f78" />
          <stop offset="0.65" stopColor="#3d6a59" />
          <stop offset="1" stopColor="#142f2b" />
        </linearGradient>
        <pattern id="tentacle-speckles" width="23" height="29" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="8" r="1.4" fill="#c6cab0" opacity=".2" />
          <circle cx="17" cy="23" r="2.3" fill="#081c19" opacity=".25" />
        </pattern>
      </defs>
      <path data-tentacle-body="" d={silhouette} fill="url(#tentacle-skin)" stroke="#78977d" strokeWidth="1.3" />
      <path d={silhouette} fill="url(#tentacle-speckles)" />
      <path d={`M ${coordinates(inner)}`} fill="none" stroke="#c6cab0" strokeOpacity=".24" strokeWidth="2" />
      {sections.filter((_, i) => i >= 4 && i < 92 && i % 4 === 0).map((point, i) => {
        const x = point.x - point.nx * point.radius * 0.53;
        const y = point.y - point.ny * point.radius * 0.53;
        return (
          <g key={i} transform={`translate(${x} ${y}) rotate(${point.angle})`}>
            <ellipse rx={point.radius * 0.29} ry={point.radius * 0.35} fill="#a8b69a" stroke="#365e4e" strokeWidth="1.5" />
            <ellipse rx={point.radius * 0.17} ry={point.radius * 0.23} fill="#203f35" />
            <ellipse cx={-point.radius * 0.04} rx={point.radius * 0.1} ry={point.radius * 0.15} fill="#102b25" />
          </g>
        );
      })}
    </svg>
  );
};
