"use client";

import React, { useState } from "react";
import { VERIFIED_QUOTES } from "@/lib/seed-repos";
import { PRIVACY_POLICY_URL } from "@/lib/github-config";
import { PixelButton } from "./PixelButton";

interface WelcomeScreenProps {
  onGetStarted: () => void;
  errorMessage?: string | null;
  isSigningIn?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onGetStarted,
  errorMessage,
  isSigningIn = false,
}) => {
  const [quoteIdx] = useState(() => Math.floor(Math.random() * VERIFIED_QUOTES.length));

  const currentQuote = VERIFIED_QUOTES[quoteIdx];

  return (
    <div className="relative z-10 flex min-h-dvh w-full items-center justify-center px-4 py-12 text-center select-none">
      <div className="relative z-10 w-full max-w-3xl">
        {errorMessage && (
          <p className="mb-5 text-xs sm:text-sm uppercase tracking-[0.16em] text-red-400 font-pixel-mono">
            {errorMessage}
          </p>
        )}

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-pixel-heading tracking-[0.12em] text-white leading-none">
          GitHub Universe
        </h1>

        <div className="mt-8 flex items-center justify-center gap-3 text-sm sm:text-lg font-pixel-mono uppercase tracking-[0.14em] text-gray-300">
          <span>Discover</span>
          <span className="text-gray-500">•</span>
          <span>Collect</span>
          <span className="text-gray-500">•</span>
          <span>Build</span>
        </div>

        <div className="mt-8 mx-auto max-w-2xl text-center">
          <p className="text-base sm:text-lg font-pixel-terminal text-[#d1fae5] italic leading-relaxed">
            “{currentQuote.quote}”
          </p>
          <p className="mt-3 text-sm sm:text-base font-pixel-mono text-gray-400">
            — {currentQuote.author} <span className="text-gray-500">({currentQuote.role})</span>
          </p>
        </div>

        <div className="mt-10 flex justify-center">
          <PixelButton
            variant="green"
            size="lg"
            onClick={onGetStarted}
            disabled={isSigningIn}
            className="min-w-[240px] text-base tracking-[0.1em] font-pixel-heading"
          >
            {isSigningIn ? "Connecting..." : "Get Started"}

        <a
          href={PRIVACY_POLICY_URL}
          className="mt-8 inline-block text-xs uppercase tracking-[0.12em] text-gray-400 underline underline-offset-4 hover:text-[#00e5ff]"
        >
          Privacy Policy
        </a>
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
