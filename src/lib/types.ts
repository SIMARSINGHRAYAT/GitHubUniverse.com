export interface GitHubRepository {
  id: string | number;
  name: string;
  fullName: string;
  owner: {
    login: string;
    avatarUrl: string;
    htmlUrl?: string;
    type?: string;
  };
  description: string | null;
  htmlUrl: string;
  stargazersCount: number;
  forksCount: number;
  openIssuesCount: number;
  subscribersCount?: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  createdAt: string;
  license?: {
    key: string;
    name: string;
    spdxId?: string;
  } | null;
  defaultBranch?: string;
  weeklyGrowthStars?: number;
  isSaved?: boolean;
  isPinned?: boolean;
  collectionId?: string | null;
}

export interface Collection {
  id: string;
  userId: string;
  name: string;
  description?: string | null;
  color: string;
  icon?: string;
  createdAt: string;
  itemCount?: number;
}

export interface SavedRepository {
  id: string;
  userId: string;
  collectionId?: string | null;
  repoId: string;
  fullName: string;
  repoData: GitHubRepository;
  isPinned: boolean;
  pinnedAt?: string | null;
  createdAt: string;
}

export interface UserSession {
  id: string;
  githubId?: string | null;
  username: string;
  displayName?: string | null;
  avatarUrl?: string;
  bio?: string | null;
  isMock: boolean;
  starredRepo?: boolean;
  followedMaintainer?: boolean;
}

export interface AppSettings {
  soundEnabled: boolean;
  crtEnabled: boolean;
  animationsEnabled: boolean;
  rainSpeed: number; // 0: slow, 1: normal, 2: fast
  theme: string;
  useLiveApi: boolean;
}

export type CategoryKey =
  | "TRENDING"
  | "MOST_STARRED"
  | "MOST_FORKED"
  | "FAST_GROWING"
  | "NEW_INTERESTING"
  | "AI_ML"
  | "WEB_DEV"
  | "DEV_TOOLS"
  | "OPEN_SOURCE"
  | "MOBILE"
  | "SYSTEMS"
  | "GAME_DEV";

export type RankingAlgorithm =
  | "TRENDING"
  | "TOP_STARRED"
  | "FASTEST_GROWING"
  | "RECENTLY_UPDATED"
  | "NEW_PROJECTS"
  | "EDITORS_PICKS";

export interface SearchFilters {
  query: string;
  category: CategoryKey | "ALL";
  language: string;
  minStars: number;
  sortBy: "stars" | "forks" | "updated" | "growth" | "name";
  license?: string;
}
