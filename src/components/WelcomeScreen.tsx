"use client";

import React, { useState, useEffect } from "react";
import { VERIFIED_QUOTES } from "@/lib/seed-repos";
import { PixelButton } from "./PixelButton";
import { soundManager } from "@/lib/sound";
import { RefreshCw, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  onGetStarted: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onGetStarted }) => {
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    // Pick random quote on load
    setQuoteIdx(Math.floor(Math.random() * VERIFIED_QUOTES.length));
  }, []);

  const handleNextQuote = () => {
    soundManager.playClick();
    setQuoteIdx((prev) => (prev + 1) % VERIFIED_QUOTES.length);
  };

  const currentQuote = VERIFIED_QUOTES[quoteIdx];

  return (
    <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-8 text-center select-none font-pixel-mono">
      <div className="w-full max-w-3xl border border-[#00ff66]/35 bg-[#06080b]/70 backdrop-blur-sm shadow-[0_0_0_1px_rgba(0,255,102,0.15),0_30px_80px_rgba(0,0,0,0.75)] px-6 py-8 sm:px-10 sm:py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(0,255,102,0.08),_transparent_52%)]" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 border border-[#00ff66]/40 bg-[#00ff66]/10 px-3 py-1.5 mb-6 text-[10px] uppercase tracking-[0.32em] text-[#00ff66] font-pixel-heading">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Discover • Collect • Build</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-pixel-heading tracking-[0.12em] text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">
            GITHUB UNIVERSE
          </h1>

          <div className="mt-6 flex flex-col items-center gap-2 text-[11px] sm:text-sm text-gray-300 uppercase tracking-[0.22em] font-pixel-mono">
            <span className="text-[#dfe6e9]">Discover</span>
            <span className="text-[#dfe6e9]">Collect</span>
            <span className="text-[#dfe6e9]">Build</span>
          </div>

          <div className="mt-6 text-[13px] sm:text-base text-[#00e5ff] tracking-[0.2em] uppercase font-pixel-heading">
            GitHub Universe Desktop
          </div>

          <div className="mt-8 border border-gray-800 bg-[#11151d]/80 p-4 sm:p-5 text-left">
            <p className="text-sm sm:text-base font-pixel-terminal text-[#d1fae5] italic leading-relaxed">
              “{currentQuote.quote}”
            </p>
            <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-800 pt-3 text-[10px] sm:text-xs text-gray-400 font-pixel-mono">
              <span>
                — {currentQuote.author} <span className="text-gray-500">({currentQuote.role})</span>
              </span>
              <button
                onClick={handleNextQuote}
                className="flex items-center gap-1 text-gray-400 transition-colors hover:text-[#00ff66]"
                title="Next Verified Quote"
              >
                <RefreshCw className="h-3 w-3" />
                <span>NEXT</span>
              </button>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <PixelButton
              variant="green"
              size="lg"
              onClick={onGetStarted}
              className="w-full sm:w-auto min-w-[220px] tracking-[0.18em] font-pixel-heading"
            >
              [ GET STARTED ]
            </PixelButton>
          </div>

          <div className="mt-8 text-[9px] sm:text-[10px] uppercase tracking-[0.22em] text-gray-500 font-pixel-terminal">
            Windows Desktop MSIX Edition • v1.0.0 • Global Repository Platform
          </div>
        </div>
      </div>
    </div>
  );
};
