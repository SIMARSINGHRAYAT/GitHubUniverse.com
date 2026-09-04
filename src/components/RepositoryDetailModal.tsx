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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm animate-fade-in font-pixel-mono">
      <div className="pixel-panel flex h-full w-full flex-col bg-black/75 border border-[#00ff66] shadow-none">
        {/* Header */}
        <div className="bg-black/65 p-6 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={repo.owner.avatarUrl}
              alt={repo.owner.login}
              className="w-10 h-10 border-2 border-[#00ff66] bg-gray-900 object-cover"
            />
            <div>
              <span className="text-[18px] text-gray-400 block font-pixel-mono">
                {repo.owner.login} /
              </span>
              <h2 className="text-[30px] leading-tight font-pixel-heading text-[#00ff66] tracking-wide">
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
        <div className="p-8 overflow-y-auto flex-1 space-y-8 text-[20px]">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black/60 border border-white/15 p-4 text-center">
              <span className="text-[20px] text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <Star className="w-3.5 h-3.5 text-[#ffcc00] fill-current" />
                <span>STARS</span>
              </span>
              <span className="text-[30px] font-pixel-heading text-[#ffcc00]">
                {repo.stargazersCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-black/60 border border-white/15 p-4 text-center">
              <span className="text-[20px] text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <GitFork className="w-3.5 h-3.5 text-[#00e5ff]" />
                <span>FORKS</span>
              </span>
              <span className="text-[30px] font-pixel-heading text-[#00e5ff]">
                {repo.forksCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-black/60 border border-white/15 p-4 text-center">
              <span className="text-[20px] text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <AlertCircle className="w-3.5 h-3.5 text-pink-400" />
                <span>ISSUES</span>
              </span>
              <span className="text-[30px] font-pixel-heading text-pink-400">
                {repo.openIssuesCount.toLocaleString()}
              </span>
            </div>

            <div className="bg-black/60 border border-white/15 p-4 text-center">
              <span className="text-[20px] text-gray-400 block mb-1 flex items-center justify-center space-x-1">
                <Code className="w-3.5 h-3.5 text-[#00ff66]" />
                <span>LANGUAGE</span>
              </span>
              <span className="text-[20px] font-bold text-[#00ff66] truncate block mt-1">
                {repo.language || "N/A"}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="bg-black/60 border border-white/15 p-5">
            <h3 className="text-[20px] font-pixel-heading text-gray-400 mb-3">PROJECT DESCRIPTION</h3>
            <p className="text-[20px] text-gray-200 font-pixel-terminal leading-relaxed">
              {repo.description || "No detailed description provided for this repository."}
            </p>
          </div>

          {/* Topics & Tags */}
          {repo.topics && repo.topics.length > 0 && (
            <div>
              <h3 className="text-[20px] font-pixel-heading text-gray-400 mb-3">TOPICS</h3>
              <div className="flex flex-wrap gap-1.5">
                {repo.topics.map((t, idx) => (
                  <span
                    key={idx}
                    className="bg-black/60 border border-[#00ff66]/40 text-[#00ff66] px-3 py-2 text-[20px] font-pixel-terminal"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata Info Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[20px] font-pixel-terminal text-gray-300">
            <div className="flex items-center space-x-2 bg-black/60 p-3 border border-white/15">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>
                LICENSE: <strong className="text-white">{repo.license?.name || "None / Not specified"}</strong>
              </span>
            </div>

            <div className="flex items-center space-x-2 bg-black/60 p-3 border border-white/15">
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
          <div className="bg-black/60 border border-[#00ff66]/30 p-5 font-mono text-[20px] text-green-400 space-y-3 overflow-x-auto">
            <div className="flex items-center justify-between text-[20px] text-gray-500 border-b border-white/10 pb-2">
              <span>README.md Quick Preview</span>
              <span>BRANCH: {repo.defaultBranch || "main"}</span>
            </div>
            <pre className="text-[20px] leading-relaxed font-pixel-terminal text-green-300">
              {`# ${repo.name}\n\n${repo.description || "A GitHub open-source repository."}\n\n## Getting Started\n\ngit clone ${repo.htmlUrl}.git\ncd ${repo.name}\n\n# Discover more famous repositories on GIT CRAZY platform 👾`}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-black/65 p-5 border-t border-white/15 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <PixelButton
              variant={isSaved ? "cyan" : "outline"}
              size="sm"
              onClick={() => onToggleSave(repo)}
              className="bg-black/70 text-[20px]"
            >
              <Bookmark className={`w-3.5 h-3.5 mr-1 inline-block ${isSaved ? "fill-current" : ""}`} />
              {isSaved ? "SAVED" : "SAVE TO COLLECTION"}
            </PixelButton>

            <PixelButton
              variant={isPinned ? "yellow" : "outline"}
              size="sm"
              onClick={() => onTogglePin(repo)}
              className="bg-black/70 text-[20px]"
            >
              <Pin className={`w-3.5 h-3.5 mr-1 inline-block ${isPinned ? "fill-current" : ""}`} />
              {isPinned ? "PINNED" : "PIN REPO"}
            </PixelButton>

            <PixelButton variant="outline" size="sm" onClick={handleShare} className="bg-black/70 text-[20px]">
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
            className="pixel-btn bg-black/70 border-white/20 text-[20px] flex items-center space-x-1.5"
          >
            <span>OPEN ON GITHUB</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
