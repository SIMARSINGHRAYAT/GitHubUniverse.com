import { GitHubRepository, CategoryKey, RankingAlgorithm } from "./types";
import { MOCK_REPOSITORIES } from "./seed-repos";

const GITHUB_API_BASE = "https://api.github.com";

// Simple in-memory cache
const apiCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL_MS = 1000 * 60 * 5;

export class GitHubRepositoryService {
  /**
   * Fetch repositories by category, query, or ranking algorithm.
   */
  static async getRepositories(options: {
    category?: CategoryKey | "ALL";
    query?: string;
    ranking?: RankingAlgorithm;
    language?: string;
    useLiveApi?: boolean;
    token?: string;
  }): Promise<{ repos: GitHubRepository[]; source: "live" | "mock" | "cache"; isRateLimited?: boolean }> {
    const { category = "ALL", query = "", ranking = "TRENDING", language, useLiveApi = false, token } = options;
    const cacheKey = `repos_${category}_${query}_${ranking}_${language}_${useLiveApi}`;

    // Check cache
    const cached = apiCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return { repos: cached.data as GitHubRepository[], source: "cache" };
    }

    if (!useLiveApi) {
      const filtered = this.filterMockData(category, query, ranking, language);
      apiCache.set(cacheKey, { data: filtered, timestamp: Date.now() });
      return { repos: filtered, source: "mock" };
    }

    try {
      const recentDate = new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString().slice(0, 10);
      let searchQuery = query.trim() || "stars:>1000";

      if (!query.trim()) {
        if (category === "TRENDING") {
          searchQuery = `stars:>100 pushed:>=${recentDate}`;
        } else if (category === "FAST_GROWING") {
          searchQuery = `stars:>100 pushed:>=${recentDate}`;
        } else if (category === "TOP_REPOSITORY_OF_DAY") {
          searchQuery = `stars:>100 pushed:>=${new Date().toISOString().slice(0, 10)}`;
        } else if (category === "OPEN_SOURCE") {
          searchQuery = "stars:>1000 license:mit";
        } else if (category === "MOST_STARRED" || category === "ALL") {
          searchQuery = "stars:>1000";
        }
      }

      if (language && language !== "ALL") {
        searchQuery += ` language:${language}`;
      }

      let sortParam = "stars";
      let orderParam = "desc";
      if (category === "TRENDING" || ranking === "TRENDING") {
        sortParam = "forks";
      } else if (category === "FAST_GROWING" || ranking === "FASTEST_GROWING" || ranking === "RECENTLY_UPDATED") {
        sortParam = "updated";
      } else if (ranking === "NEW_PROJECTS") {
        sortParam = "created";
      }

      const headers: Record<string, string> = {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "GitHubUniverse-App",
      };
      if (token) {
        headers["Authorization"] = `token ${token}`;
      }

      const url = `${GITHUB_API_BASE}/search/repositories?q=${encodeURIComponent(
        searchQuery
      )}&sort=${sortParam}&order=${orderParam}&per_page=30`;

      const res = await fetch(url, { headers });

      if (res.status === 403 || res.status === 429) {
        return { repos: [], source: "live", isRateLimited: true };
      }

      if (!res.ok) {
        throw new Error(`GitHub API HTTP ${res.status}`);
      }

      const data = await res.json();
      const items = data.items || [];

      // Transform raw GitHub API item to GitHubRepository interface
      const repos: GitHubRepository[] = items.map((item: any) => ({
        id: item.id.toString(),
        name: item.name,
        fullName: item.full_name,
        owner: {
          login: item.owner.login,
          avatarUrl: item.owner.avatar_url,
          htmlUrl: item.owner.html_url,
        },
        description: item.description,
        htmlUrl: item.html_url,
        stargazersCount: item.stargazers_count,
        forksCount: item.forks_count,
        openIssuesCount: item.open_issues_count,
        subscribersCount: item.watchers_count,
        language: item.language,
        topics: item.topics || [],
        updatedAt: item.updated_at,
        createdAt: item.created_at,
        license: item.license
          ? { key: item.license.key, name: item.license.name, spdxId: item.license.spdx_id }
          : null,
        defaultBranch: item.default_branch,
        weeklyGrowthStars: Math.floor(item.stargazers_count * 0.02) + 50,
      }));

      apiCache.set(cacheKey, { data: repos, timestamp: Date.now() });
      return { repos, source: "live" };
    } catch (err) {
      console.warn("GitHub API error:", err);
      return { repos: [], source: "live" };
    }
  }

  private static filterMockData(
    category: CategoryKey | "ALL",
    query: string,
    ranking?: RankingAlgorithm,
    language?: string
  ): GitHubRepository[] {
    let result = [...MOCK_REPOSITORIES];

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.fullName.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          r.topics.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (language && language !== "ALL") {
      result = result.filter((r) => r.language?.toLowerCase() === language.toLowerCase());
    }

    if (category !== "ALL") {
      switch (category) {
        case "TRENDING":
        case "FAST_GROWING":
          result = result.sort((a, b) => (b.weeklyGrowthStars || 0) - (a.weeklyGrowthStars || 0));
          break;
        case "MOST_STARRED":
          result = result.sort((a, b) => b.stargazersCount - a.stargazersCount);
          break;
        case "TOP_REPOSITORY_OF_DAY":
          result = result.sort((a, b) => b.stargazersCount - a.stargazersCount);
          break;
        case "OPEN_SOURCE":
          result = result.filter((r) => r.license !== null);
          break;
      }
    }

    if (ranking) {
      if (ranking === "TOP_STARRED") {
        result = result.sort((a, b) => b.stargazersCount - a.stargazersCount);
      } else if (ranking === "FASTEST_GROWING") {
        result = result.sort((a, b) => (b.weeklyGrowthStars || 0) - (a.weeklyGrowthStars || 0));
      } else if (ranking === "RECENTLY_UPDATED") {
        result = result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
      } else if (ranking === "NEW_PROJECTS") {
        result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  }

  static clearCache() {
    apiCache.clear();
  }
}

export class GitHubAuthService {
  static getOAuthUrl(clientId?: string): string {
    const configuredClientId = clientId || process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || process.env.GITHUB_CLIENT_ID;
    if (!configuredClientId) {
      throw new Error("GITHUB_CLIENT_ID is not configured.");
    }

    const redirectUri = typeof window !== "undefined" ? `${window.location.origin}/api/auth/github/callback` : "";
    const scope = "read:user user:follow public_repo";
    const state = Math.random().toString(36).substring(7);

    return `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
      configuredClientId
    )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(
      state
    )}`;
  }
}
