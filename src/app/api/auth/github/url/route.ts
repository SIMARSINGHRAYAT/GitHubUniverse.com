import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createOAuthState } from "@/lib/github-oauth-state";

export async function GET(req: Request) {
  const clientId = process.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_ID environment variable." },
      { status: 500 }
    );
  }

  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  if (!clientSecret) {
    return NextResponse.json(
      { error: "Missing GITHUB_CLIENT_SECRET environment variable." },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  const state = createOAuthState(clientSecret);
  cookieStore.set("gh_oauth_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 10,
  });

  const scope = "read:user user:follow public_repo";
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(
    clientId
  )}&scope=${encodeURIComponent(scope)}&state=${encodeURIComponent(
    state
  )}`;

  return NextResponse.json({ url: authUrl, clientId });
}
