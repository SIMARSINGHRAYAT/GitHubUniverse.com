import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getGitHubRedirectUri } from "@/lib/github-config";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookieStore = await cookies();
  const expectedState = cookieStore.get("gh_oauth_state")?.value;

  if (url.searchParams.get("error")) {
    cookieStore.delete("gh_oauth_state");
    return NextResponse.redirect(new URL("/?error=oauth_cancelled", req.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", req.url));
  }

  if (!state || !expectedState || state !== expectedState) {
    cookieStore.delete("gh_oauth_state");
    return NextResponse.redirect(new URL("/?error=invalid_state", req.url));
  }

  cookieStore.delete("gh_oauth_state");

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(new URL("/?error=oauth_not_configured", req.url));
  }

  try {
    const githubRequest = (input: string, init: RequestInit = {}) =>
      fetch(input, { ...init, signal: AbortSignal.timeout(15000) });

    const tokenRes = await githubRequest("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: getGitHubRedirectUri(req.url),
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error || !tokenData.access_token) {
      return NextResponse.redirect(new URL(`/?error=${encodeURIComponent(tokenData?.error || "token_exchange_failed")}`, req.url));
    }

    const accessToken = tokenData.access_token;

    const userRes = await githubRequest("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "GitHubUniverse-App",
      },
    });

    if (!userRes.ok) {
      return NextResponse.redirect(new URL("/?error=github_user_lookup_failed", req.url));
    }

    const githubUser = await userRes.json();

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.githubId, githubUser.id.toString()))
      .limit(1);

    let userId: string;

    if (existing.length > 0) {
      userId = existing[0].id;
      await db
        .update(users)
        .set({
          username: githubUser.login,
          displayName: githubUser.name || githubUser.login,
          avatarUrl: githubUser.avatar_url,
          bio: githubUser.bio,
          accessToken,
          updatedAt: new Date(),
        })
        .where(eq(users.id, userId));
    } else {
      const inserted = await db
        .insert(users)
        .values({
          githubId: githubUser.id.toString(),
          username: githubUser.login,
          displayName: githubUser.name || githubUser.login,
          avatarUrl: githubUser.avatar_url,
          bio: githubUser.bio,
          accessToken,
        })
        .returning();
      userId = inserted[0].id;
    }

    const response = NextResponse.redirect(new URL("/?auth=success", req.url));
    response.cookies.set("gh_universe_session", userId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (err) {
    console.error("GitHub OAuth Callback error:", err);
    const errorCode = err instanceof Error && err.name === "TimeoutError"
      ? "github_request_timeout"
      : "database_error";
    return NextResponse.redirect(new URL(`/?error=${errorCode}`, req.url));
  }
}
