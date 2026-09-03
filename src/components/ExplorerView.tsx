"use client";

import React, { useState } from "react";
import { GitHubRepository, RankingAlgorithm } from "@/lib/types";
import { RepositoryCard } from "./RepositoryCard";
import { Compass, Flame, Star, TrendingUp, Clock, Sparkles, Award } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface ExplorerViewProps {
  repos: GitHubRepository[];
  ranking: RankingAlgorithm;
  onSelectRanking: (rank: RankingAlgorithm) => void;
  onViewDetails: (repo: GitHubRepository) => void;
  onToggleSave: (repo: GitHubRepository) => void;
  onTogglePin: (repo: GitHubRepository) => void;
  savedRepoIds: Set<string>;
  pinnedRepoIds: Set<string>;
  loading?: boolean;
}

export const ExplorerView: React.FC<ExplorerViewProps> = ({
  repos,
  ranking,
  onSelectRanking,
  onViewDetails,
  onToggleSave,
  onTogglePin,
  savedRepoIds,
  pinnedRepoIds,
  loading = false,
}) => {
  const algorithms: { key: RankingAlgorithm; label: string; icon: React.ReactNode; desc: string }[] = [
    { key: "TRENDING", label: "TRENDING", icon: <Flame className="w-4 h-4 text-orange-400" />, desc: "High velocity momentum" },
    { key: "TOP_STARRED", label: "TOP STARRED", icon: <Star className="w-4 h-4 text-yellow-400" />, desc: "All-time popular" },
    { key: "FASTEST_GROWING", label: "FASTEST GROWING", icon: <TrendingUp className="w-4 h-4 text-green-400" />, desc: "Rapid star velocity" },
    { key: "RECENTLY_UPDATED", label: "RECENTLY UPDATED", icon: <Clock className="w-4 h-4 text-cyan-400" />, desc: "Active commits today" },
    { key: "NEW_PROJECTS", label: "NEW PROJECTS", icon: <Sparkles className="w-4 h-4 text-purple-400" />, desc: "Fresh creations" },
    { key: "EDITORS_PICKS", label: "EDITOR'S PICKS", icon: <Award className="w-4 h-4 text-pink-400" />, desc: "Curated marvels" },
  ];

  return (
    <div className="space-y-6 font-pixel-mono">
      {/* Title */}
      <div className="bg-black/65 border border-[#00ff66]/70 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-pixel-heading text-[#00ff66] flex items-center space-x-2">
            <Compass className="w-5 h-5 text-[#00ff66]" />
            <span>GLOBAL REPOSITORY EXPLORER</span>
          </h2>
          <p className="text-sm text-gray-400 font-pixel-terminal mt-1">
            DISCOVER REMARKABLE OPEN-SOURCE PROJECTS AROUND THE WORLD
          </p>
        </div>

        <span className="text-xs font-pixel-mono bg-[#00ff66]/10 border border-[#00ff66] text-[#00ff66] px-3 py-1">
          {repos.length} DISCOVERED
        </span>
      </div>

      {/* Algorithm Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {algorithms.map((alg) => {
          const isSelected = ranking === alg.key;
          return (
            <button
              key={alg.key}
              onClick={() => {
                soundManager.playClick();
                onSelectRanking(alg.key);
              }}
              className={`p-3 text-left border-2 transition-all font-pixel-mono ${
                isSelected
                  ? "bg-[#00ff66]/15 border-[#00ff66] text-white"
                  : "bg-black/60 border-white/15 text-gray-400 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-1">
                {alg.icon}
                <span className="font-pixel-heading text-[10px] truncate">{alg.label}</span>
              </div>
              <p className="text-[10px] text-gray-500 font-pixel-terminal line-clamp-1">{alg.desc}</p>
            </button>
          );
        })}
      </div>

      {/* Loading or Cards Grid */}
      {loading ? (
        <div className="p-12 text-center bg-gray-950/80 border-2 border-gray-800">
          <div className="inline-block w-8 h-8 border-3 border-[#00ff66] border-t-transparent animate-spin mb-3" />
          <h3 className="text-xs font-pixel-heading text-[#00ff66] animate-pulse">
            SCANNING THE REPOSITORY UNIVERSE...
          </h3>
          <p className="text-xs text-gray-500 font-pixel-terminal mt-1">
            Applying ranking algorithms and fetching live GitHub metrics
          </p>
        </div>
      ) : repos.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {repos.map((repo) => (
            <RepositoryCard
              key={repo.id}
              repo={repo}
              onViewDetails={onViewDetails}
              onToggleSave={onToggleSave}
              onTogglePin={onTogglePin}
              isSaved={savedRepoIds.has(repo.id.toString())}
              isPinned={pinnedRepoIds.has(repo.id.toString())}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-gray-950/80 border-2 border-gray-800">
          <h3 className="text-xs font-pixel-heading text-gray-300">NO REPOSITORIES MATCHED</h3>
          <p className="text-xs text-gray-500 font-pixel-terminal mt-1">
            Try switching ranking algorithms or clearing search filters.
          </p>
        </div>
      )}
    </div>
  );
};
