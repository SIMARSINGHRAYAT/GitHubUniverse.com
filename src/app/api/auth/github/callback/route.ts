import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/?error=missing_code", req.url));
  }

  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    // Return mock successful auth redirect if secrets not provided in dev environment
    return NextResponse.redirect(new URL("/?auth=success&mock=true", req.url));
  }

  try {
    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return NextResponse.redirect(new URL(`/?error=${tokenData.error}`, req.url));
    }

    const accessToken = tokenData.access_token;

    // Fetch user profile from GitHub
    const userRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "User-Agent": "GitCrazy-App",
      },
    });

    const githubUser = await userRes.json();

    // Check existing user
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

    return NextResponse.redirect(new URL(`/?auth=success&userId=${userId}`, req.url));
  } catch (err) {
    console.error("GitHub OAuth Callback error:", err);
    return NextResponse.redirect(new URL("/?error=auth_failed", req.url));
  }
}
