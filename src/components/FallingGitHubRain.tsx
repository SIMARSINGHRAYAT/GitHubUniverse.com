"use client";

import React, { useEffect, useRef } from "react";

interface FallingGitHubRainProps {
  speedMultiplier?: number;
  enabled?: boolean;
}

interface Drop {
  x: number;
  y: number;
  speed: number;
  size: number;
  opacity: number;
  charType: number; // 0: Octocat pixel, 1: Star, 2: Fork, 3: Code bracket
}

export const FallingGitHubRain: React.FC<FallingGitHubRainProps> = ({
  speedMultiplier = 1,
  enabled = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    // Spawn lanes to prevent chaotic overlapping
    const laneWidth = 28;
    const numLanes = Math.floor(width / laneWidth);
    const drops: Drop[] = [];

    // Initialize drops across lanes
    for (let i = 0; i < numLanes; i++) {
      if (Math.random() > 0.08) {
        drops.push({
          x: i * laneWidth + Math.random() * 10,
          y: Math.random() * -height,
          speed: (1.2 + Math.random() * 1.8) * speedMultiplier,
          size: 15 + Math.floor(Math.random() * 12),
          opacity: 0.25 + Math.random() * 0.65,
          charType: Math.floor(Math.random() * 6),
        });
      }
    }

    // Draw pixel octocat icon on canvas
    const drawOctocat = (
      x: number,
      y: number,
      size: number,
      opacity: number,
      charType: number
    ) => {
      ctx.save();
      ctx.globalAlpha = opacity;

      if (charType === 0) {
        // Octocat pixel head shape
        ctx.fillStyle = "#00ff66";
        const pixel = Math.max(2, Math.floor(size / 8));
        // Simple 8-bit octocat head bitmap
        const octoBitmap = [
          [0, 1, 1, 0, 0, 1, 1, 0],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [1, 0, 1, 1, 1, 1, 0, 1],
          [1, 1, 1, 1, 1, 1, 1, 1],
          [0, 1, 1, 1, 1, 1, 1, 0],
          [0, 0, 1, 0, 0, 1, 0, 0],
        ];

        octoBitmap.forEach((row, r) => {
          row.forEach((val, c) => {
            if (val === 1) {
              ctx.fillRect(x + c * pixel, y + r * pixel, pixel, pixel);
            }
          });
        });
      } else if (charType === 1) {
        // Pixel Star ★
        ctx.fillStyle = "#ffcc00";
        ctx.font = `${size}px 'Press Start 2P', monospace`;
        ctx.fillText("★", x, y);
      } else if (charType === 2) {
        // Pixel Fork / Code Symbol
        ctx.fillStyle = "#00e5ff";
        ctx.font = `${size}px 'Press Start 2P', monospace`;
        ctx.fillText("⑂", x, y);
      } else if (charType === 4) {
        ctx.fillStyle = "#ff007f";
        ctx.font = `${size}px 'VT323', monospace`;
        ctx.fillText("$>", x, y);
      } else if (charType === 5) {
        ctx.fillStyle = "#a7f3d0";
        ctx.font = `${size}px 'VT323', monospace`;
        ctx.fillText("{ }", x, y);
      } else {
        ctx.fillStyle = "#ffffff";
        ctx.font = `${size - 2}px 'VT323', monospace`;
        ctx.fillText("<git/>", x, y);
      }

      ctx.restore();
    };

    const render = () => {
      ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
      ctx.fillRect(0, 0, width, height);

      drops.forEach((drop) => {
        drawOctocat(drop.x, drop.y, drop.size, drop.opacity, drop.charType);

        drop.y += drop.speed;

        // Reset to top when off screen
        if (drop.y > height + 50) {
          drop.y = -50 - Math.random() * 100;
          drop.speed = (1.2 + Math.random() * 1.8) * speedMultiplier;
          drop.opacity = 0.25 + Math.random() * 0.65;
          drop.charType = Math.floor(Math.random() * 6);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speedMultiplier, enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ opacity: 0.85 }}
    />
  );
};
