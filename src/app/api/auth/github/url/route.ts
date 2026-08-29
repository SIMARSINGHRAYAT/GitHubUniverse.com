import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GITHUB_CLIENT_ID || "MOCK_CLIENT_ID";
  const redirectUri = process.env.GITHUB_REDIRECT_URI || "http://localhost:3000/api/auth/github/callback";
  const scope = "read:user user:follow public_repo";
  const state = Math.random().toString(36).substring(2, 15);

  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scope)}&state=${state}`;

  return NextResponse.json({ url: authUrl, clientId });
}
