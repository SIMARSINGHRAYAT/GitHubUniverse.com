"use client";

import React, { useState, useEffect } from "react";
import { Star, UserPlus, CheckCircle2, Lock, Unlock, Sparkles, ArrowRight } from "lucide-react";
import { PixelButton } from "./PixelButton";
import { soundManager } from "@/lib/sound";
import { GITHUB_MAINTAINER_PROFILE_URL, STARTER_REPOSITORY_URL } from "@/lib/github-config";

interface SupportScreenProps {
  userId: string;
  hasStarred: boolean;
  hasFollowed: boolean;
  onStar: () => Promise<void>;
  onFollow: () => Promise<void>;
  onContinue: () => void;
}

export const SupportScreen: React.FC<SupportScreenProps> = ({
  userId,
  hasStarred,
  hasFollowed,
  onStar,
  onFollow,
  onContinue,
}) => {
  const [starring, setStarring] = useState(false);
  const [following, setFollowing] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const isUnlocked = hasStarred && hasFollowed;

  useEffect(() => {
    if (isUnlocked && !justUnlocked) {
      setJustUnlocked(true);
      soundManager.playUnlock();
    }
  }, [isUnlocked, justUnlocked]);

  const handleStarClick = async () => {
    soundManager.playStar();
    window.open(STARTER_REPOSITORY_URL, "_blank", "noopener,noreferrer");
    setStarring(true);
    await onStar();
    setStarring(false);
  };

  const handleFollowClick = async () => {
    soundManager.playClick();
    window.open(GITHUB_MAINTAINER_PROFILE_URL, "_blank", "noopener,noreferrer");
    setFollowing(true);
    await onFollow();
    setFollowing(false);
  };

  return (
    <div className="relative z-10 min-h-[calc(100vh-2.5rem)] flex flex-col items-center justify-center p-6 text-center select-none font-pixel-mono">
      <div className="pixel-panel max-w-xl w-full p-8 sm:p-10 relative bg-[#0a0c12]/95 border-3 border-[#ffcc00] shadow-[10px_10px_0px_#000000]">
        
        {/* Header Badge */}
        <div className="inline-block bg-[#ffcc00]/10 border border-[#ffcc00] text-[#ffcc00] px-3 py-1 text-xs font-pixel-heading mb-4">
          STEP 02 // COMMUNITY SUPPORT
        </div>

        <h2 className="text-2xl sm:text-3xl font-pixel-heading text-white mb-2">
          SUPPORT THE PROJECT
        </h2>

        <p className="text-sm font-bold text-[#ffcc00] font-pixel-mono mb-2">
          HELP US GROW THE COMMUNITY
        </p>

        <p className="text-xs text-gray-300 font-pixel-mono mb-8 max-w-md mx-auto leading-relaxed">
          STAR OUR REPOSITORY AND FOLLOW THE MAINTAINER TO SHOW YOUR SUPPORT.
        </p>

        {/* Support Action Cards */}
        <div className="space-y-4 mb-8 text-left">
          {/* Action 1: Star Repo */}
          <div
            className={`p-4 border-2 transition-all ${
              hasStarred
                ? "bg-[#00ff66]/10 border-[#00ff66]"
                : "bg-[#121620] border-gray-800 hover:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 border ${
                    hasStarred
                      ? "bg-[#00ff66] text-black border-[#00ff66]"
                      : "bg-gray-900 border-gray-700 text-[#ffcc00]"
                  }`}
                >
                  <Star className={`w-5 h-5 ${hasStarred ? "fill-current" : ""}`} />
                </div>
                <div>
                  <h4 className="text-xs font-pixel-heading text-white">1. STAR THE REPOSITORY</h4>
                  <span className="text-[11px] text-gray-400 font-pixel-terminal">
                    gitcrazy/git-crazy on GitHub
                  </span>
                </div>
              </div>

              {hasStarred ? (
                <span className="text-xs font-pixel-heading text-[#00ff66] flex items-center space-x-1 bg-[#00ff66]/20 border border-[#00ff66] px-2 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ STARRED</span>
                </span>
              ) : (
                <PixelButton
                  variant="yellow"
                  size="sm"
                  onClick={handleStarClick}
                  disabled={starring}
                >
                  {starring ? "VERIFYING..." : "[ STAR REPO ]"}
                </PixelButton>
              )}
            </div>
          </div>

          {/* Action 2: Follow Maintainer */}
          <div
            className={`p-4 border-2 transition-all ${
              hasFollowed
                ? "bg-[#00ff66]/10 border-[#00ff66]"
                : "bg-[#121620] border-gray-800 hover:border-gray-700"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 border ${
                    hasFollowed
                      ? "bg-[#00ff66] text-black border-[#00ff66]"
                      : "bg-gray-900 border-gray-700 text-[#00e5ff]"
                  }`}
                >
                  <UserPlus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-pixel-heading text-white">2. FOLLOW THE MAINTAINER</h4>
                  <span className="text-[11px] text-gray-400 font-pixel-terminal">
                    @gitcrazy maintainer profile
                  </span>
                </div>
              </div>

              {hasFollowed ? (
                <span className="text-xs font-pixel-heading text-[#00ff66] flex items-center space-x-1 bg-[#00ff66]/20 border border-[#00ff66] px-2 py-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>✓ FOLLOWED</span>
                </span>
              ) : (
                <PixelButton
                  variant="cyan"
                  size="sm"
                  onClick={handleFollowClick}
                  disabled={following}
                >
                  {following ? "VERIFYING..." : "[ FOLLOW ]"}
                </PixelButton>
              )}
            </div>
          </div>
        </div>

        {/* Continue to Dashboard Button */}
        <div>
          <PixelButton
            variant={isUnlocked ? "green" : "outline"}
            size="lg"
            onClick={onContinue}
            disabled={!isUnlocked}
            className={`w-full font-pixel-heading flex items-center justify-center space-x-2 transition-all ${
              isUnlocked ? "animate-bounce" : ""
            }`}
          >
            {isUnlocked ? (
              <>
                <Unlock className="w-4 h-4 text-black" />
                <span>[ CONTINUE TO DASHBOARD ]</span>
                <ArrowRight className="w-4 h-4 text-black ml-1" />
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 text-gray-500" />
                <span>[ CONTINUE TO DASHBOARD ] (LOCKED)</span>
              </>
            )}
          </PixelButton>
        </div>
      </div>
    </div>
  );
};
