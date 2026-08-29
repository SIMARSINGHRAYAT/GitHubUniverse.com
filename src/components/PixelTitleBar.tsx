"use client";

import React, { useState } from "react";
import { Volume2, VolumeX, Tv, Monitor, Minus, Square, X, ShieldCheck } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface PixelTitleBarProps {
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  crtEnabled: boolean;
  setCrtEnabled: (val: boolean) => void;
  onOpenMsixInfo: () => void;
  username?: string;
}

export const PixelTitleBar: React.FC<PixelTitleBarProps> = ({
  soundEnabled,
  setSoundEnabled,
  crtEnabled,
  setCrtEnabled,
  onOpenMsixInfo,
  username,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setEnabled(next);
    if (next) soundManager.playToggle();
  };

  const toggleCrt = () => {
    setCrtEnabled(!crtEnabled);
    soundManager.playToggle();
  };

  return (
    <header className="w-full bg-[#0a0c12] border-b-2 border-[#1f2937] px-3 py-1.5 flex items-center justify-between z-50 text-xs font-pixel-mono select-none sticky top-0">
      {/* Left App Brand */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5 bg-[#00ff66]/10 text-[#00ff66] border border-[#00ff66]/40 px-2 py-0.5 rounded-none">
          <span className="text-sm font-bold">👾</span>
          <span className="font-pixel-heading text-[10px] tracking-widest text-[#00ff66]">
            GITHUB UNIVERSE
          </span>
        </div>

        <button
          onClick={onOpenMsixInfo}
          className="hidden sm:flex items-center space-x-1 bg-blue-950/60 hover:bg-blue-900 border border-blue-500/50 text-blue-300 px-2 py-0.5 text-[10px] transition-all"
          title="Windows MSIX Packaging Info"
        >
          <ShieldCheck className="w-3 h-3 text-blue-400" />
          <span>MSIX x64 Ready</span>
        </button>
      </div>

      {/* Middle Status / User badge */}
      <div className="hidden md:flex items-center space-x-2 text-gray-400 text-[11px]">
        <span className="inline-block w-2 h-2 rounded-full bg-[#00ff66] animate-pulse" />
        <span>SYS.ONLINE</span>
        {username && (
          <>
            <span className="text-gray-600">|</span>
            <span className="text-[#00e5ff]">@{username}</span>
          </>
        )}
      </div>

      {/* Right Titlebar Controls */}
      <div className="flex items-center space-x-2">
        {/* Sound Toggle */}
        <button
          onClick={toggleSound}
          className={`p-1 border transition-colors ${
            soundEnabled
              ? "bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66]"
              : "bg-gray-800/50 border-gray-600 text-gray-500"
          }`}
          title={soundEnabled ? "Audio Effects: ON" : "Audio Effects: OFF"}
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
        </button>

        {/* CRT Scanline Toggle */}
        <button
          onClick={toggleCrt}
          className={`p-1 border transition-colors ${
            crtEnabled
              ? "bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff]"
              : "bg-gray-800/50 border-gray-600 text-gray-500"
          }`}
          title={crtEnabled ? "CRT Scanlines: ON" : "CRT Scanlines: OFF"}
        >
          {crtEnabled ? <Tv className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
        </button>

        {/* Simulated Windows Controls */}
        <div className="flex items-center space-x-1 pl-2 border-l border-gray-800">
          <button
            onClick={() => soundManager.playClick()}
            className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white"
            title="Minimize"
          >
            <Minus className="w-3 h-3" />
          </button>
          <button
            onClick={() => {
              soundManager.playClick();
              setIsMaximized(!isMaximized);
            }}
            className="p-1 hover:bg-gray-800 text-gray-400 hover:text-white"
            title={isMaximized ? "Restore Window" : "Maximize Window"}
          >
            <Square className="w-3 h-3" />
          </button>
          <button
            onClick={() => soundManager.playClick()}
            className="p-1 hover:bg-red-600 text-gray-400 hover:text-white"
            title="Close Application"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </header>
  );
};
