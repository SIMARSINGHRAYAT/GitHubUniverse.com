"use client";

import React from "react";
import { GitHubRepository } from "@/lib/types";
import { Star, GitFork, Pin, Bookmark, ExternalLink, AlertCircle, Share2, Sparkles } from "lucide-react";
import { soundManager } from "@/lib/sound";

interface RepositoryCardProps {
  repo: GitHubRepository;
  onViewDetails: (repo: GitHubRepository) => void;
  onToggleSave: (repo: GitHubRepository) => void;
  onTogglePin: (repo: GitHubRepository) => void;
  onStarRepo?: (repo: GitHubRepository) => void;
  isSaved?: boolean;
  isPinned?: boolean;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repo,
  onViewDetails,
  onToggleSave,
  onTogglePin,
  onStarRepo,
  isSaved = false,
  isPinned = false,
}) => {
  const getLanguageColor = (lang: string | null) => {
    if (!lang) return "#9ca3af";
    switch (lang.toLowerCase()) {
      case "typescript":
        return "#3178c6";
      case "javascript":
        return "#f7df1e";
      case "python":
        return "#3572A5";
      case "rust":
        return "#dea584";
      case "go":
        return "#00ADD8";
      case "c++":
      case "cpp":
        return "#f34b7d";
      case "c":
        return "#555555";
      case "zig":
        return "#ec915c";
      case "dart":
        return "#00B4AB";
      default:
        return "#00ff66";
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundManager.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(repo.htmlUrl);
      alert(`[COPIED REPO URL]: ${repo.htmlUrl}`);
    }
  };

  return (
    <div className="pixel-card min-h-[290px] bg-black/65 p-6 flex flex-col justify-between relative group text-left">
      {/* Top Header: Owner Avatar & Full Name & Pinned Badge */}
      <div>
        <div className="flex items-start justify-between mb-2 gap-2">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <img
              src={repo.owner.avatarUrl}
              alt={repo.owner.login}
              className="w-7 h-7 border-2 border-gray-700 bg-gray-900 object-cover flex-shrink-0"
              onError={(e) => {
                // Fallback avatar
                (e.target as HTMLImageElement).src = "https://avatars.githubusercontent.com/u/583231?v=4";
              }}
            />
            <div className="truncate">
              <span className="text-sm text-gray-400 block truncate font-pixel-mono">
                {repo.owner.login} /
              </span>
              <h3 className="text-base font-bold text-white group-hover:text-[#00ff66] transition-colors truncate font-pixel-mono">
                {repo.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-1 flex-shrink-0">
            {isPinned && (
              <span className="bg-[#ffcc00]/20 text-[#ffcc00] border border-[#ffcc00] px-1.5 py-0.5 text-[9px] font-pixel-heading flex items-center space-x-1">
                <Pin className="w-2.5 h-2.5 fill-current" />
                <span>PIN</span>
              </span>
            )}
            {isSaved && !isPinned && (
              <span className="bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff] px-1.5 py-0.5 text-[9px] font-pixel-heading">
                SAVED
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 mb-4 line-clamp-3 leading-relaxed font-pixel-terminal min-h-[3.5rem]">
          {repo.description || "No description provided for this GitHub project."}
        </p>

        {/* Topics / Tags */}
        {repo.topics && repo.topics.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {repo.topics.slice(0, 3).map((topic, i) => (
              <span
                key={i}
                className="bg-gray-900 border border-gray-800 text-gray-400 px-1.5 py-0.5 text-[10px] font-pixel-terminal hover:border-[#00ff66] hover:text-[#00ff66] transition-colors"
              >
                #{topic}
              </span>
            ))}
            {repo.topics.length > 3 && (
              <span className="text-[10px] text-gray-500 font-pixel-terminal pt-0.5">
                +{repo.topics.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Stats & Quick Actions */}
      <div className="pt-2 border-t border-gray-800/80">
        <div className="flex items-center justify-between text-xs font-pixel-terminal text-gray-400 mb-3">
          <div className="flex items-center space-x-3">
            {/* Stars */}
            <div className="flex items-center space-x-1 text-[#ffcc00]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="font-bold">{(repo.stargazersCount / 1000).toFixed(1)}k</span>
            </div>

            {/* Forks */}
            <div className="flex items-center space-x-1 text-gray-400">
              <GitFork className="w-3.5 h-3.5" />
              <span>{(repo.forksCount / 1000).toFixed(1)}k</span>
            </div>
          </div>

          {/* Primary Language */}
          {repo.language && (
            <div className="flex items-center space-x-1.5">
              <span
                className="w-2 h-2 rounded-none inline-block border border-black"
                style={{ backgroundColor: getLanguageColor(repo.language) }}
              />
              <span className="text-gray-300 text-[11px] font-pixel-mono">{repo.language}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-1 pt-1">
          <button
            onClick={() => {
              soundManager.playClick();
              onViewDetails(repo);
            }}
            className="col-span-1 bg-gray-900 hover:bg-[#00ff66] hover:text-black border border-gray-700 text-gray-300 py-1 px-1 text-[10px] font-pixel-mono transition-colors flex items-center justify-center space-x-1"
            title="View Details"
          >
            <span>VIEW</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(repo);
            }}
            className={`col-span-1 border py-1 px-1 text-[10px] font-pixel-mono transition-colors flex items-center justify-center space-x-1 ${
              isSaved
                ? "bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff]"
                : "bg-gray-900 hover:border-[#00e5ff] hover:text-[#00e5ff] border-gray-700 text-gray-300"
            }`}
            title={isSaved ? "Remove from Collection" : "Save to Collection"}
          >
            <Bookmark className={`w-3 h-3 ${isSaved ? "fill-current" : ""}`} />
            <span>{isSaved ? "SAVED" : "SAVE"}</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(repo);
            }}
            className={`col-span-1 border py-1 px-1 text-[10px] font-pixel-mono transition-colors flex items-center justify-center space-x-1 ${
              isPinned
                ? "bg-[#ffcc00]/20 border-[#ffcc00] text-[#ffcc00]"
                : "bg-gray-900 hover:border-[#ffcc00] hover:text-[#ffcc00] border-gray-700 text-gray-300"
            }`}
            title={isPinned ? "Unpin Repository" : "Pin Repository"}
          >
            <Pin className={`w-3 h-3 ${isPinned ? "fill-current" : ""}`} />
            <span>{isPinned ? "PINNED" : "PIN"}</span>
          </button>

          <button
            onClick={handleShare}
            className="col-span-1 bg-gray-900 hover:bg-purple-600 hover:text-white border border-gray-700 text-gray-300 py-1 px-1 text-[10px] font-pixel-mono transition-colors flex items-center justify-center"
            title="Share / Copy Link"
          >
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
