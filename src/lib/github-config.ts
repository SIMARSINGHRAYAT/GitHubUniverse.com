export const GITHUB_MAINTAINER_PROFILE_URL = "https://github.com/SIMARSINGHRAYAT";
export const STARTER_REPOSITORY_URL = "https://github.com/SIMARSINGHRAYAT/GitHubUniverse.com";
export const GITHUB_SUPPORT_OWNER = "SIMARSINGHRAYAT";
export const GITHUB_SUPPORT_REPOSITORY = "GitHubUniverse.com";

export function getGitHubRedirectUri(requestUrl?: string): string {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (siteUrl) {
    try {
      const url = new URL(siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`);
      url.pathname = "/api/auth/github/callback";
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    } catch {
      // Fall through to the explicit callback URL.
    }
  }

  const configured = (process.env.GITHUB_REDIRECT_URI || process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI)?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      url.pathname = "/api/auth/github/callback";
      url.search = "";
      url.hash = "";
      return url.toString().replace(/\/$/, "");
    } catch {
      // Ignore malformed environment values and resolve from the request URL.
    }
  }

  if (typeof requestUrl === "string" && requestUrl) {
    try {
      const url = new URL(requestUrl);
      return `${url.origin}/api/auth/github/callback`;
    } catch {
      // fall through to default
    }
  }

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    const base = vercelUrl.startsWith("http") ? vercelUrl : `https://${vercelUrl}`;
    return `${base.replace(/\/$/, "")}/api/auth/github/callback`;
  }

  return "http://localhost:3000/api/auth/github/callback";
}
