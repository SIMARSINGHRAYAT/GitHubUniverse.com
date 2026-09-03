import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getGitHubRedirectUri } from "@/lib/github-config";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_ID environment variable." },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const state = Math.random().toString(36).slice(2, 18);
  cookieStore.set("gh_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  const redirectUri = getGitHubRedirectUri();
  const scope = "read:user user:follow public_repo";
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
    clientId
  )}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(
    state
  )}`;

  return NextResponse.json({ url: authUrl, clientId });
}
