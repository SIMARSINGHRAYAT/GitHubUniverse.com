"use client";

import React, { useState } from "react";
import { Collection, SavedRepository, GitHubRepository } from "@/lib/types";
import { RepositoryCard } from "./RepositoryCard";
import { FolderPlus, Folder, Trash2, Edit2, Bookmark, Plus, Tag, Search } from "lucide-react";
import { PixelButton } from "./PixelButton";
import { soundManager } from "@/lib/sound";

interface CollectionsViewProps {
  collections: Collection[];
  savedRepos: SavedRepository[];
  onCreateCollection: (name: string, description?: string) => Promise<void>;
  onDeleteCollection: (id: string) => Promise<void>;
  onViewDetails: (repo: GitHubRepository) => void;
  onToggleSave: (repo: GitHubRepository) => void;
  onTogglePin: (repo: GitHubRepository) => void;
}

export const CollectionsView: React.FC<CollectionsViewProps> = ({
  collections,
  savedRepos,
  onCreateCollection,
  onDeleteCollection,
  onViewDetails,
  onToggleSave,
  onTogglePin,
}) => {
  const [selectedColId, setSelectedColId] = useState<string | "ALL">("ALL");
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [newColDesc, setNewColNameDesc] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColName.trim()) return;
    soundManager.playStar();
    await onCreateCollection(newColName.trim(), newColDesc.trim());
    setNewColName("");
    setNewColNameDesc("");
    setIsCreating(false);
  };

  const filteredSaved = savedRepos.filter((item) => {
    const matchesCol = selectedColId === "ALL" || item.collectionId === selectedColId;
    const repo = item.repoData;
    const matchesSearch =
      !searchQuery.trim() ||
      repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repo.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCol && matchesSearch;
  });

  return (
    <div className="space-y-6 font-pixel-mono">
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-black/65 border border-white/15 p-5">
        <div>
          <h2 className="text-xl font-pixel-heading text-[#00e5ff] flex items-center space-x-2">
            <Bookmark className="w-5 h-5 text-[#00e5ff]" />
            <span>MY COLLECTIONS</span>
          </h2>
          <p className="text-xs text-gray-400 font-pixel-terminal mt-1">
            ORGANIZE AND BOOKMARK YOUR FAVORITE GITHUB REPOSITORIES
          </p>
        </div>

        <PixelButton
          variant="cyan"
          size="sm"
          onClick={() => {
            soundManager.playClick();
            setIsCreating(!isCreating);
          }}
        >
          <FolderPlus className="w-4 h-4 mr-1.5" />
          <span>+ NEW COLLECTION</span>
        </PixelButton>
      </div>

      {/* New Collection Form Modal / Drawer */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="bg-black/90 border-2 border-[#00e5ff] p-4 space-y-3 font-pixel-mono animate-fade-in"
        >
          <h3 className="text-xs font-pixel-heading text-[#00e5ff]">CREATE CUSTOM COLLECTION</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">COLLECTION NAME:</label>
              <input
                type="text"
                placeholder="e.g. AI TOOLS, WEB DEV, MY FAVORITES"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 p-2 text-xs text-white focus:border-[#00e5ff] outline-none"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 block mb-1">DESCRIPTION (OPTIONAL):</label>
              <input
                type="text"
                placeholder="Short description..."
                value={newColDesc}
                onChange={(e) => setNewColNameDesc(e.target.value)}
                className="w-full bg-gray-900 border border-gray-700 p-2 text-xs text-white focus:border-[#00e5ff] outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-gray-400 hover:text-white px-3 py-1"
            >
              CANCEL
            </button>
            <PixelButton variant="cyan" size="sm" type="submit">
              CREATE COLLECTION
            </PixelButton>
          </div>
        </form>
      )}

      {/* Collection Category Pills */}
      <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => {
            soundManager.playClick();
            setSelectedColId("ALL");
          }}
          className={`px-3 py-1.5 text-xs font-pixel-mono border-2 transition-all ${
            selectedColId === "ALL"
              ? "bg-[#00e5ff]/20 border-[#00e5ff] text-[#00e5ff]"
              : "bg-black/60 border-white/15 text-gray-400 hover:border-gray-500"
          }`}
        >
          ALL SAVED ({savedRepos.length})
        </button>

        {collections.map((col) => {
          const isSelected = selectedColId === col.id;
          return (
            <div key={col.id} className="flex items-center">
              <button
                onClick={() => {
                  soundManager.playClick();
                  setSelectedColId(col.id);
                }}
                className={`px-3 py-1.5 text-xs font-pixel-mono border-2 transition-all flex items-center space-x-1.5 ${
                  isSelected
                    ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]"
                    : "bg-black/60 border-white/15 text-gray-300 hover:border-gray-500"
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                <span>{col.name}</span>
                <span className="text-[10px] text-gray-500">({col.itemCount || 0})</span>
              </button>

              <button
                onClick={() => {
                  soundManager.playClick();
                  if (confirm(`Delete collection "${col.name}"? Saved items won't be lost.`)) {
                    onDeleteCollection(col.id);
                    if (selectedColId === col.id) setSelectedColId("ALL");
                  }
                }}
                className="p-1.5 text-gray-600 hover:text-red-400 bg-gray-900 border border-l-0 border-gray-800"
                title="Delete collection"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Filter / Search inside Collections */}
      <div className="relative">
        <Search className="w-4 h-4 text-gray-500 absolute left-3 top-3" />
        <input
          type="text"
          placeholder="Filter saved repositories by name or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-black/65 border border-white/15 pl-9 pr-4 py-3 text-sm font-pixel-mono text-white focus:border-[#00e5ff] outline-none"
        />
      </div>

      {/* Repository Cards Grid */}
      {filteredSaved.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredSaved.map((item) => (
            <RepositoryCard
              key={item.id}
              repo={item.repoData}
              onViewDetails={onViewDetails}
              onToggleSave={onToggleSave}
              onTogglePin={onTogglePin}
              isSaved={true}
              isPinned={item.isPinned}
            />
          ))}
        </div>
      ) : (
        <div className="pixel-panel p-12 text-center bg-gray-950/60 border-2 border-gray-800">
          <Bookmark className="w-10 h-10 text-gray-600 mx-auto mb-3" />
          <h3 className="text-sm font-pixel-heading text-gray-300 mb-1">
            NO SAVED REPOSITORIES HERE
          </h3>
          <p className="text-xs text-gray-500 font-pixel-terminal">
            Explore the repository universe and click [ SAVE ] on any project card to build your collection.
          </p>
        </div>
      )}
    </div>
  );
};
