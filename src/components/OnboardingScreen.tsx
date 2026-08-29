"use client";

import React, { useState } from "react";
import { PixelButton } from "./PixelButton";
import { soundManager } from "@/lib/sound";
import { ShieldAlert, ArrowRight, UserCheck } from "lucide-react";

interface OnboardingScreenProps {
  onSignInMock: (username: string) => void;
  onSignInRealOAuth: () => void;
  onBack: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({
  onSignInMock,
  onSignInRealOAuth,
  onBack,
}) => {
  const [authMode, setAuthMode] = useState<"mock" | "oauth">("mock");
  const [customUsername, setCustomUsername] = useState("pixel_coder");

  const handleSignIn = () => {
    soundManager.playClick();
    if (authMode === "mock") {
      onSignInMock(customUsername.trim() || "pixel_coder");
    } else {
      onSignInRealOAuth();
    }
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center p-6 text-center select-none font-pixel-mono">
      <div className="pixel-panel max-w-xl w-full p-8 sm:p-10 relative bg-[#0a0c12]/95 border-3 border-[#00e5ff] shadow-[10px_10px_0px_#000000]">
        
        {/* Header */}
        <div className="inline-block bg-[#00e5ff]/10 border border-[#00e5ff] text-[#00e5ff] px-3 py-1 text-xs font-pixel-heading mb-4">
          STEP 01 // IDENTITY
        </div>

        <h2 className="text-2xl sm:text-3xl font-pixel-heading text-white mb-2">
          WELCOME ABOARD
        </h2>

        <p className="text-xs sm:text-sm text-[#00e5ff] font-pixel-mono mb-6 tracking-wide">
          YOUR GLOBAL GITHUB DISCOVERY JOURNEY STARTS HERE.
        </p>

        {/* Auth Mode Toggle */}
        <div className="bg-[#121620] border-2 border-gray-800 p-4 mb-6 text-left">
          <label className="text-[11px] font-pixel-heading text-gray-400 block mb-3">
            AUTHENTICATION METHOD
          </label>

          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={() => {
                soundManager.playToggle();
                setAuthMode("mock");
              }}
              className={`p-3 text-xs text-left border-2 font-pixel-mono transition-all ${
                authMode === "mock"
                  ? "bg-[#00ff66]/10 border-[#00ff66] text-[#00ff66]"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600"
              }`}
            >
              <div className="font-bold mb-1 font-pixel-heading text-[10px]">MOCK DEV SESSION</div>
              <div className="text-[10px] text-gray-400">Instant access without OAuth keys</div>
            </button>

            <button
              onClick={() => {
                soundManager.playToggle();
                setAuthMode("oauth");
              }}
              className={`p-3 text-xs text-left border-2 font-pixel-mono transition-all ${
                authMode === "oauth"
                  ? "bg-[#00e5ff]/10 border-[#00e5ff] text-[#00e5ff]"
                  : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-600"
              }`}
            >
              <div className="font-bold mb-1 font-pixel-heading text-[10px]">REAL GITHUB OAUTH</div>
              <div className="text-[10px] text-gray-400">Secure redirect to GitHub.com</div>
            </button>
          </div>

          {authMode === "mock" ? (
            <div>
              <label className="text-[10px] text-gray-400 block mb-1 font-pixel-mono">
                ENTER HANDLE / USERNAME:
              </label>
              <input
                type="text"
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                placeholder="e.g. pixel_coder"
                className="w-full bg-black border-2 border-gray-700 p-2 text-xs font-pixel-mono text-[#00ff66] focus:border-[#00ff66] outline-none"
              />
            </div>
          ) : (
            <div className="text-[11px] text-gray-300 font-pixel-terminal bg-black/60 p-2.5 border border-gray-800 flex items-start space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#00e5ff] flex-shrink-0 mt-0.5" />
              <span>
                Redirects securely to GitHub OAuth endpoint. Tokens stored in Windows Secure Credential Store.
              </span>
            </div>
          )}
        </div>

        {/* Main Sign In Action Button */}
        <div className="space-y-3">
          <PixelButton
            variant={authMode === "mock" ? "green" : "cyan"}
            size="lg"
            onClick={handleSignIn}
            className="w-full font-pixel-heading flex items-center justify-center space-x-2"
          >
            <UserCheck className="w-4 h-4" />
            <span>[ SIGN IN VIA GITHUB ]</span>
          </PixelButton>

          <button
            onClick={() => {
              soundManager.playClick();
              onBack();
            }}
            className="text-xs text-gray-500 hover:text-gray-300 underline font-pixel-terminal block mx-auto"
          >
            ← BACK TO WELCOME
          </button>
        </div>
      </div>
    </div>
  );
};
