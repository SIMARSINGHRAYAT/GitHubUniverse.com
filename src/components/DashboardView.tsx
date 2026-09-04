"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  GitHubRepository,
  Collection,
  SavedRepository,
  CategoryKey,
  RankingAlgorithm,
  UserSession,
  AppSettings,
} from "@/lib/types";
import { RepositoryCard } from "./RepositoryCard";
import { RepositoryDetailModal } from "./RepositoryDetailModal";
import { CollectionsView } from "./CollectionsView";
import { ExplorerView } from "./ExplorerView";
import { GitHubRepositoryService } from "@/lib/github-api";
import {
  Search,
  Flame,
  Star,
  Bookmark,
  Compass,
  Settings as SettingsIcon,
  SlidersHorizontal,
} from "lucide-react";
import { soundManager } from "@/lib/sound";

interface DashboardViewProps {
  userSession: UserSession;
  appSettings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onLogout: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  userSession,
  appSettings,
  onUpdateSettings,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<"HOME" | "EXPLORE" | "COLLECTIONS">("HOME");
  const [category, setCategory] = useState<CategoryKey | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("ALL");
  const [sortBy, setSortBy] = useState<"stars" | "forks" | "growth" | "updated">("stars");

  // Data State
  const [repos, setRepos] = useState<GitHubRepository[]>([]);
  const [explorerRepos, setExplorerRepos] = useState<GitHubRepository[]>([]);
  const [explorerRanking, setExplorerRanking] = useState<RankingAlgorithm>("TRENDING");
  const [collections, setCollections] = useState<Collection[]>([]);
  const [savedRepos, setSavedRepos] = useState<SavedRepository[]>([]);
  const [loading, setLoading] = useState(true);
  const [explorerLoading, setExplorerLoading] = useState(false);
  const [selectedRepoModal, setSelectedRepoModal] = useState<GitHubRepository | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);

  // Debounce search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Load user's Collections and Saved Repos from backend API
  const loadUserData = useCallback(async () => {
    try {
      const colRes = await fetch(`/api/collections?userId=${encodeURIComponent(userSession.id)}`);
      if (colRes.ok) {
        const colData = await colRes.json();
        setCollections(colData.collections || []);
      }

      const savedRes = await fetch(`/api/saved-repos?userId=${encodeURIComponent(userSession.id)}`);
      if (savedRes.ok) {
        const savedData = await savedRes.json();
        setSavedRepos(savedData.savedRepositories || []);
      }
    } catch (err) {
      console.error("Failed to load user collections/saved repos:", err);
    }
  }, [userSession.id]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadUserData();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [loadUserData]);

  // Fetch Repositories for HOME view based on Category & Search
  useEffect(() => {
    let isMounted = true;
    const fetchHomeRepos = async () => {
      setLoading(true);
      const res = await GitHubRepositoryService.getRepositories({
        category,
        query: debouncedQuery,
        language: selectedLanguage,
        useLiveApi: true,
      });
      if (isMounted) {
        setRepos(res.repos);
        setLoading(false);
      }
    };

    fetchHomeRepos();
    return () => {
      isMounted = false;
    };
  }, [category, debouncedQuery, selectedLanguage, appSettings.useLiveApi, retryNonce]);

  // Fetch Repositories for EXPLORE view based on Ranking Algorithm
  useEffect(() => {
    let isMounted = true;
    const fetchExploreRepos = async () => {
      if (activeTab !== "EXPLORE") return;
      setExplorerLoading(true);
      const res = await GitHubRepositoryService.getRepositories({
        ranking: explorerRanking,
        useLiveApi: true,
      });
      if (isMounted) {
        setExplorerRepos(res.repos);
        setExplorerLoading(false);
      }
    };

    fetchExploreRepos();
    return () => {
      isMounted = false;
    };
  }, [explorerRanking, activeTab, appSettings.useLiveApi, retryNonce]);

  // Save / Unsave Repo
  const handleToggleSave = async (repo: GitHubRepository) => {
    soundManager.playStar();
    try {
      const res = await fetch("/api/saved-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userSession.id,
          repo,
          action: "save",
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.removed) {
          setSavedRepos((current) => current.filter((item) => item.repoId !== repo.id.toString()));
        } else if (data.savedRepo) {
          setSavedRepos((current) => [
            ...current.filter((item) => item.repoId !== repo.id.toString()),
            data.savedRepo,
          ]);
        }
      }
    } catch (err) {
      console.error("Error toggling save:", err);
    }
  };

  // Pin / Unpin Repo
  const handleTogglePin = async (repo: GitHubRepository) => {
    soundManager.playStar();
    try {
      const res = await fetch("/api/saved-repos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userSession.id,
          repo,
          action: "toggle_pin",
        }),
      });
      if (res.ok) {
        await loadUserData();
      }
    } catch (err) {
      console.error("Error toggling pin:", err);
    }
  };

  // Create Collection
  const handleCreateCollection = async (name: string, description?: string) => {
    try {
      const res = await fetch("/api/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userSession.id,
          name,
          description,
        }),
      });
      if (res.ok) {
        await loadUserData();
      }
    } catch (err) {
      console.error("Error creating collection:", err);
    }
  };

  // Delete Collection
  const handleDeleteCollection = async (id: string) => {
    try {
      const res = await fetch(`/api/collections?id=${encodeURIComponent(id)}&userId=${encodeURIComponent(userSession.id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await loadUserData();
      }
    } catch (err) {
      console.error("Error deleting collection:", err);
    }
  };

  const savedRepoIds = new Set(savedRepos.map((s) => s.repoId));
  const pinnedRepoIds = new Set(savedRepos.filter((s) => s.isPinned).map((s) => s.repoId));

  const categories: { key: CategoryKey | "ALL"; label: string }[] = [
    { key: "ALL", label: "ALL DISCOVERIES" },
    { key: "TRENDING", label: "TRENDING" },
    { key: "MOST_STARRED", label: "MOST STARRED" },
    { key: "FAST_GROWING", label: "FAST GROWING" },
    { key: "TOP_REPOSITORY_OF_DAY", label: "NUMBER ONE REPOSITORY OF THE DAY" },
    { key: "OPEN_SOURCE", label: "OPEN SOURCE" },
  ];

  return (
    <div className="relative z-10 flex min-h-dvh w-full flex-col pb-12 font-pixel-mono text-white">
      {/* Primary Desktop Top Bar Navigation */}
      <nav className="sticky top-0 z-40 flex h-16 w-full min-w-0 flex-nowrap items-center gap-4 overflow-visible border-b border-white/10 bg-black/75 px-5 backdrop-blur-sm">
        {/* Navigation Tabs */}
        <div className="flex min-w-0 shrink-0 items-center gap-1.5 overflow-x-auto">
          {[
            { key: "HOME", label: "HOME", icon: <Flame className="w-3.5 h-3.5 text-orange-400" /> },
            { key: "EXPLORE", label: "EXPLORE", icon: <Compass className="w-3.5 h-3.5 text-[#00ff66]" /> },
            {
              key: "COLLECTIONS",
              label: `COLLECTION (${savedRepos.length})`,
              icon: <Bookmark className="w-3.5 h-3.5 text-[#00e5ff]" />,
            },
          ].map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab.key as any);
                }}
                  className={`px-3 py-2 text-sm font-pixel-mono border-2 transition-all flex items-center space-x-1.5 flex-shrink-0 ${
                  isSelected
                    ? "bg-[#00ff66]/20 border-[#00ff66] text-[#00ff66]"
                        : "bg-black/60 border-white/15 text-gray-400 hover:border-gray-500 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Global Search Bar Input */}
        <div className="flex min-w-[180px] flex-1 items-center space-x-2">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="SEARCH THE GITHUB UNIVERSE..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-white/20 bg-black/70 pl-9 pr-3 py-2 text-sm text-[#00ff66] font-pixel-mono focus:border-[#00ff66] outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-2 text-xs text-gray-500 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowUserMenu((current) => !current)}
            className="flex items-center gap-2 border border-white/20 bg-black/60 px-3 py-2 text-xs text-gray-300 transition-colors hover:border-[#00ff66] hover:text-[#00ff66]"
            aria-expanded={showUserMenu}
            aria-label="Open profile settings"
          >
            {userSession.avatarUrl ? (
              <img src={userSession.avatarUrl} alt="" className="h-5 w-5 border border-[#00ff66] object-cover" />
            ) : (
              <SettingsIcon className="h-4 w-4" />
            )}
            <span className="hidden lg:inline">@{userSession.username}</span>
            <SettingsIcon className="h-4 w-4" />
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-full mt-2 w-56 border border-white/20 bg-black/95 p-2 shadow-[4px_4px_0_#00ff66]">
              <button
                type="button"
                onClick={() => window.location.assign(`https://github.com/${encodeURIComponent(userSession.username)}`)}
                className="mb-1 flex w-full items-center gap-3 border-b border-white/10 px-3 py-3 text-left transition-colors hover:bg-white/10"
              >
                {userSession.avatarUrl && (
                  <img src={userSession.avatarUrl} alt="" className="h-9 w-9 border border-[#00ff66] object-cover" />
                )}
                <span className="truncate text-sm text-white">@{userSession.username}</span>
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-gray-300 transition-colors hover:bg-[#00ff66] hover:text-black"
              >
                <span>LOG OUT</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-[1800px] flex-1 space-y-8 px-5 py-6 sm:px-8 lg:px-12">
        {/* HOME VIEW */}
        {activeTab === "HOME" && (
          <div className="space-y-6">
            {/* Category Sub-Navigation Scrollbar */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-gray-800/80">
              {categories.map((cat) => {
                const isSelected = category === cat.key;
                return (
                  <button
                    key={cat.key}
                    onClick={() => {
                      soundManager.playClick();
                      setCategory(cat.key);
                    }}
                    className={`px-3 py-2 text-sm font-pixel-heading whitespace-nowrap transition-all border ${
                      isSelected
                        ? "bg-[#00ff66] text-black border-[#00ff66] font-bold"
                        : "bg-black/60 text-gray-300 border-white/15 hover:border-gray-500"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Language & Sorting Filters Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-black/60 p-4 text-sm">
              <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400 font-pixel-heading flex items-center space-x-1">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span>FILTER:</span>
                </span>

                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="bg-black border border-gray-700 text-gray-200 px-2 py-1 outline-none font-pixel-mono"
                >
                  <option value="ALL">ALL LANGUAGES</option>
                  <option value="TypeScript">TypeScript</option>
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Rust">Rust</option>
                  <option value="Go">Go</option>
                  <option value="C++">C++</option>
                  <option value="Zig">Zig</option>
                  <option value="Dart">Dart</option>
                </select>
              </div>

              <div className="text-[11px] text-gray-400 font-pixel-terminal">
                SHOWING <strong className="text-[#00ff66]">{repos.length}</strong> PROJECTS IN{" "}
                <span className="text-white font-bold">{category}</span>
              </div>
            </div>

            {/* Repositories Cards Grid */}
            {loading ? (
              <div className="p-16 text-center bg-black/65 border border-white/15">
                <div className="inline-block w-8 h-8 border-3 border-[#00ff66] border-t-transparent animate-spin mb-3" />
                <h3 className="text-xs font-pixel-heading text-[#00ff66] animate-pulse">
                  LOADING GITHUB DATA...
                </h3>
                <p className="text-xs text-gray-500 font-pixel-terminal mt-1">
                  Querying worldwide repository index
                </p>
              </div>
            ) : repos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {repos.map((repo) => (
                  <RepositoryCard
                    key={repo.id}
                    repo={repo}
                    onViewDetails={(r) => setSelectedRepoModal(r)}
                    onToggleSave={handleToggleSave}
                    onTogglePin={handleTogglePin}
                    isSaved={savedRepoIds.has(repo.id.toString())}
                    isPinned={pinnedRepoIds.has(repo.id.toString())}
                  />
                ))}
              </div>
            ) : (
              <div className="p-16 text-center bg-black/65 border border-white/15 space-y-2">
                <h3 className="text-sm font-pixel-heading text-gray-300">NO REPOSITORIES FOUND</h3>
                <p className="text-xs text-gray-500 font-pixel-terminal">
                  THE GITHUB UNIVERSE IS QUIET HERE FOR &quot;{debouncedQuery || category}&quot;.
                </p>
                <button
                  onClick={() => {
                    setRetryNonce((value) => value + 1);
                  }}
                  className="pixel-btn bg-black/70 text-sm mt-3 inline-block"
                >
                  SEARCH AGAIN
                </button>
              </div>
            )}
          </div>
        )}

        {/* EXPLORE VIEW */}
        {activeTab === "EXPLORE" && (
          <ExplorerView
            repos={explorerRepos}
            ranking={explorerRanking}
            onSelectRanking={setExplorerRanking}
            onViewDetails={(r) => setSelectedRepoModal(r)}
            onToggleSave={handleToggleSave}
            onTogglePin={handleTogglePin}
            savedRepoIds={savedRepoIds}
            pinnedRepoIds={pinnedRepoIds}
            loading={explorerLoading}
            onRetry={() => setRetryNonce((value) => value + 1)}
          />
        )}

        {/* COLLECTIONS VIEW */}
        {activeTab === "COLLECTIONS" && (
          <CollectionsView
            collections={collections}
            savedRepos={savedRepos}
            onCreateCollection={handleCreateCollection}
            onDeleteCollection={handleDeleteCollection}
            onViewDetails={(r) => setSelectedRepoModal(r)}
            onToggleSave={handleToggleSave}
            onTogglePin={handleTogglePin}
          />
        )}

      </main>

      {/* Repository Details Modal */}
      <RepositoryDetailModal
        repo={selectedRepoModal}
        onClose={() => setSelectedRepoModal(null)}
        onToggleSave={handleToggleSave}
        onTogglePin={handleTogglePin}
        isSaved={selectedRepoModal ? savedRepoIds.has(selectedRepoModal.id.toString()) : false}
        isPinned={selectedRepoModal ? pinnedRepoIds.has(selectedRepoModal.id.toString()) : false}
      />
    </div>
  );
};
