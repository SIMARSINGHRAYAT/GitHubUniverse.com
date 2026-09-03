export const GITHUB_MAINTAINER_PROFILE_URL = "https://github.com/gitcrazy";
export const STARTER_REPOSITORY_URL = "https://github.com/gitcrazy/git-crazy";

export function getGitHubRedirectUri(requestUrl?: string): string {
  const configured = process.env.GITHUB_REDIRECT_URI || process.env.NEXT_PUBLIC_GITHUB_REDIRECT_URI;
  if (configured) return configured;

  if (typeof requestUrl === "string" && requestUrl) {
    try {
      const url = new URL(requestUrl);
      return `${url.origin}/api/auth/github/callback`;
    } catch {
      // fall through to default
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL;
  if (siteUrl) {
    const base = siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
    return `${base.replace(/\/$/, "")}/api/auth/github/callback`;
  }

  return "http://localhost:3000/api/auth/github/callback";
}
