"use client";

import React from "react";
import { SavedRepository, GitHubRepository } from "@/lib/types";
import { RepositoryCard } from "./RepositoryCard";
import { Pin, Sparkles } from "lucide-react";

interface PinnedViewProps {
  savedRepos: SavedRepository[];
  onViewDetails: (repo: GitHubRepository) => void;
  onToggleSave: (repo: GitHubRepository) => void;
  onTogglePin: (repo: GitHubRepository) => void;
}

export const PinnedView: React.FC<PinnedViewProps> = ({
  savedRepos,
  onViewDetails,
  onToggleSave,
  onTogglePin,
}) => {
  const pinnedList = savedRepos.filter((item) => item.isPinned);

  return (
    <div className="space-y-6 font-pixel-mono">
      {/* Title Bar */}
      <div className="flex items-center justify-between bg-[#121620] border-2 border-[#ffcc00] p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00]">
            <Pin className="w-5 h-5 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-pixel-heading text-[#ffcc00]">PINNED REPOSITORIES</h2>
            <p className="text-xs text-gray-400 font-pixel-terminal mt-1">
              HIGH-PRIORITY PROJECTS YOU MONITOR REGULARLY
            </p>
          </div>
        </div>

        <span className="text-xs font-pixel-heading bg-[#ffcc00]/10 border border-[#ffcc00] text-[#ffcc00] px-3 py-1">
          {pinnedList.length} PINNED
        </span>
      </div>

      {/* Grid */}
      {pinnedList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pinnedList.map((item) => (
            <RepositoryCard
              key={item.id}
              repo={item.repoData}
              onViewDetails={onViewDetails}
              onToggleSave={onToggleSave}
              onTogglePin={onTogglePin}
              isSaved={true}
              isPinned={true}
            />
          ))}
        </div>
      ) : (
        <div className="pixel-panel p-12 text-center bg-gray-950/60 border-2 border-gray-800">
          <Pin className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-sm font-pixel-heading text-gray-300 mb-1">
            NO PINNED REPOSITORIES
          </h3>
          <p className="text-xs text-gray-500 font-pixel-terminal">
            Click [ PIN ] on any repository card to keep it pinned at the top of your radar.
          </p>
        </div>
      )}
    </div>
  );
};
