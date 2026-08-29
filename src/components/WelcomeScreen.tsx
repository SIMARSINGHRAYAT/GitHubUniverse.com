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
    <div className="relative z-10 min-h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center p-6 text-center select-none font-pixel-mono">
      {/* Container Panel */}
      <div className="pixel-panel max-w-2xl w-full p-8 sm:p-12 relative overflow-hidden backdrop-blur-md border-3 border-[#00ff66] bg-[#0a0c12]/90 shadow-[10px_10px_0px_#000000]">
        
        {/* Pixel Corner Accents */}
        <div className="absolute top-2 left-2 text-[#00ff66] text-xs">┌</div>
        <div className="absolute top-2 right-2 text-[#00ff66] text-xs">┐</div>
        <div className="absolute bottom-2 left-2 text-[#00ff66] text-xs">└</div>
        <div className="absolute bottom-2 right-2 text-[#00ff66] text-xs">┘</div>

        {/* Small Motto */}
        <div className="inline-flex items-center space-x-2 bg-[#00ff66]/10 border border-[#00ff66]/50 px-3 py-1 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#00ff66] animate-spin" style={{ animationDuration: '4s' }} />
          <span className="text-[11px] font-pixel-heading text-[#00ff66] tracking-widest">
            DISCOVER. COLLECT. BUILD.
          </span>
        </div>

        {/* Large Centered Title */}
        <h1 className="text-4xl sm:text-6xl font-pixel-heading text-white tracking-wider mb-6 animate-pixel-glow">
          GITHUB UNIVERSE
        </h1>

        {/* Motivational GitHub Quote Box */}
        <div className="bg-[#121620] border-2 border-gray-800 p-5 mb-8 relative group">
          <p className="text-sm sm:text-base font-pixel-terminal text-green-300 italic mb-3 leading-relaxed">
            "{currentQuote.quote}"
          </p>
          <div className="text-xs text-gray-400 font-pixel-mono flex items-center justify-between pt-2 border-t border-gray-800/80">
            <span>— {currentQuote.author} <span className="text-gray-500">({currentQuote.role})</span></span>
            <button
              onClick={handleNextQuote}
              className="text-gray-500 hover:text-[#00ff66] p-1 transition-colors flex items-center space-x-1"
              title="Next Verified Quote"
            >
              <RefreshCw className="w-3 h-3" />
              <span className="text-[10px]">NEXT</span>
            </button>
          </div>
        </div>

        {/* Get Started Button */}
        <div>
          <PixelButton
            variant="green"
            size="lg"
            onClick={onGetStarted}
            className="w-full sm:w-auto tracking-widest font-pixel-heading"
          >
            [ GET STARTED ]
          </PixelButton>
        </div>

        {/* Footnote */}
        <div className="mt-8 text-[10px] text-gray-500 font-pixel-terminal">
          WINDOWS DESKTOP MSIX EDITION • V1.0.0 • WORLDWIDE REPOSITORY PLATFORM
        </div>
      </div>
    </div>
  );
};
