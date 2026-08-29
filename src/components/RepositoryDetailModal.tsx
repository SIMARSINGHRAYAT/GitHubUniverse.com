"use client";

import React, { useState } from "react";
import { GitHubRepository } from "@/lib/types";
import { X, Star, GitFork, AlertCircle, ExternalLink, Bookmark, Pin, Share2, Shield, Calendar, Code, Check } from "lucide-react";
import { PixelButton } from "./PixelButton";
import { soundManager } from "@/lib/sound";

interface RepositoryDetailModalProps {
  repo: GitHubRepository | null;
  onClose: () => void;
  onToggleSave: (repo: GitHubRepository) => void;
  onTogglePin: (repo: GitHubRepository) => void;
  isSaved?: boolean;
  isPinned?: boolean;
}

export const RepositoryDetailModal: React.FC<RepositoryDetailModalProps> = ({
  repo,
  onClose,
  onToggleSave,
  onTogglePin,
  isSaved = false,
  isPinned = false,
}) => {
  const [copied, setCopied] = useState(false);

  if (!repo) return null;

  const handleShare = () => {
    soundManager.playClick();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(repo.htmlUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-pixel-mono">
      <div className="pixel-panel w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0a0c12] border-3 border-[#00ff66] shadow-[8px_8px_0px_#000000]">
        {/* Header */}
        <div className="bg-[#121620] p-4 border-b-2 border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={repo.owner.avatarUrl}
              alt={repo.owner.login}
              className="w-10 h-10 border-2 border-[#00ff66] bg-gray-900 object-cover"
            />
            <div>
              <span className="text-xs text-gray-400 block font-pixel-mono">
                {repo.owner.login} /
              </span>
              <h2 className="text-lg font-pixel-heading text-[#00ff66] tracking-wide">
                {repo.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-red-600/80 border border-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Scroll */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-sm">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gray-900/90 border-2 border-gray-800 p-3 text-center">
              <span className="text-xs text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <Star className="w-3.5 h-3.5 text-[#ffcc00] fill-current" />
                <span>STARS</span>
              </span>
              <span className="text-lg font-pixel-heading text-[#ffcc00]">
                {repo.stargazersCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-900/90 border-2 border-gray-800 p-3 text-center">
              <span className="text-xs text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <GitFork className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>FORKS</span>
              </span>
              <span className="text-lg font-pixel-heading text-[#00e5ff]">
                {repo.forksCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-900/90 border-2 border-gray-800 p-3 text-center">
              <span className="text-xs text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
                <span>ISSUES</span>
              </span>
              <span className="text-lg font-pixel-heading text-pink-400">
                {repo.openIssuesCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-gray-900/90 border-2 border-gray-800 p-3 text-center">
              <span className="text-xs text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <Code className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>LANGUAGE</span>
              </span>
              <span className="text-sm font-bold text-[#00ff66] truncate block mt-1">
                {repo.language || "N/A"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-950 border-2 border-gray-800 p-4">
            <h3 className="text-xs font-pixel-heading text-gray-400 mb-2">PROJECT DESCRIPTION</h3>
            <p className="text-sm text-gray-200 font-pixel-terminal leading-relaxed">
              {repo.description || "No detailed description provided for this repository."}
            </p>
          </div>

          {/* Topics & Tags */}
          {repo.topics && repo.topics.length > 0 && (
            <div>
              <h3 className="text-xs font-pixel-heading text-gray-400 mb-2">TOPICS</h3>
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-900 border border-[#00ff66]/40 text-[#00ff66] px-2 py-1 text-xs font-pixel-terminal"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-pixel-terminal text-gray-300">
            <div className="flex items-center space-x-2 bg-gray-900/50 p-2.5 border border-gray-800">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>
                LICENSE: <strong className="text-white">{repo.license?.name || "None / Not specified"}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-gray-900/50 p-2.5 border border-gray-800">
              <Calendar className="w-4 h-4 text-yellow-400" />
              <span>
                UPDATED:{" "}
                <strong className="text-white">
                  {new Date(repo.updatedAt).toLocaleDateString()}
                </strong>
              </span>
            </div>
          </div>

          {/* Code README Quick Preview snippet */}
          <div className="bg-black border-2 border-[#00ff66]/30 p-4 font-mono text-xs text-green-400 space-y-2 overflow-x-auto">
            <div className="flex items-center justify-between text-[10px] text-gray-500 border-b border-gray-800 pb-1">
              <span>README.md Quick Preview</span>
              <span>BRANCH: {repo.defaultBranch || "main"}</span>
            </div>
            <pre className="text-[11px] leading-relaxed font-pixel-terminal text-green-300">
              {`# ${repo.name}\n\n${repo.description || "A GitHub open-source repository."}\n\n## Getting Started\n\ngit clone ${repo.htmlUrl}.git\ncd ${repo.name}\n\n# Discover more famous repositories on GIT CRAZY platform 👾`}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#121620] p-4 border-t-2 border-gray-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <PixelButton
              variant={isSaved ? "cyan" : "outline"}
              size="sm"
              onClick={() => onToggleSave(repo)}
            >
              <Bookmark className={`w-3.5 h-3.5 mr-1 inline-block ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "SAVED" : "SAVE TO COLLECTION"}
            </PixelButton>

            <PixelButton
              variant={isPinned ? "yellow" : "outline"}
              size="sm"
              onClick={() => onTogglePin(repo)}
            >
              <Pin className={`w-3.5 h-3.5 mr-1 inline-block ${isPinned ? "fill-current" : ""}`} />
              {isPinned ? "PINNED" : "PIN REPO"}
            </PixelButton>

            <PixelButton variant="outline" size="sm" onClick={handleShare}>
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 mr-1 inline-block text-green-400" />
                  COPIED!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 mr-1 inline-block" />
                  SHARE
                </>
              )}
            </PixelButton>
          </div>

          <a
            href={repo.htmlUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => soundManager.playClick()}
            className="pixel-btn pixel-btn-green text-xs flex items-center space-x-1.5"
          >
            <span>OPEN ON GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
