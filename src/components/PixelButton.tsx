"use client";

import React from "react";
import { soundManager } from "@/lib/sound";

interface PixelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "green" | "cyan" | "yellow" | "red" | "outline";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export const PixelButton: React.FC<PixelButtonProps> = ({
  variant = "green",
  size = "md",
  children,
  className = "",
  onClick,
  onMouseEnter,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      soundManager.playClick();
      onClick?.(e);
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      soundManager.playHover();
      onMouseEnter?.(e);
    }
  };

  let variantClass = "pixel-btn";
  if (variant === "cyan") variantClass = "pixel-btn pixel-btn-cyan";
  if (variant === "yellow") variantClass = "pixel-btn pixel-btn-yellow";
  if (variant === "red") variantClass = "pixel-btn pixel-btn-red";
  if (variant === "outline")
    variantClass =
      "px-3 py-1.5 font-pixel-mono text-gray-300 border-2 border-gray-700 bg-gray-900/80 hover:border-gray-400 hover:text-white transition-all shadow-[2px_2px_0px_#000]";

  let sizeClass = "text-xs py-2 px-4";
  if (size === "sm") sizeClass = "text-[10px] py-1 px-2.5";
  if (size === "lg") sizeClass = "text-sm py-3.5 px-6";

  return (
    <button
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      disabled={disabled}
      className={`${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
