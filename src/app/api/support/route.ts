import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users, userSupportActions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { GITHUB_SUPPORT_OWNER, GITHUB_SUPPORT_REPOSITORY } from "@/lib/github-config";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "guest-pixel-coder";

    const record = await db
      .select()
      .from(userSupportActions)
      .where(eq(userSupportActions.userId, userId))
      .limit(1);

    if (record.length > 0) {
      return NextResponse.json({ support: record[0] });
    }

    return NextResponse.json({
      support: {
        userId,
        hasStarredRepo: false,
        hasFollowedMaintainer: false,
      },
    });
  } catch (err) {
    console.error("Support GET error:", err);
    return NextResponse.json({
      support: { hasStarredRepo: false, hasFollowedMaintainer: false },
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;
    const sessionUserId = (await cookies()).get("gh_universe_session")?.value;

    if (!sessionUserId) {
      return NextResponse.json({ error: "GitHub sign-in is required" }, { status: 401 });
    }

    const userQuery = await db.select().from(users).where(eq(users.id, sessionUserId)).limit(1);
    const user = userQuery[0];
    if (!user?.accessToken) {
      return NextResponse.json({ error: "GitHub authorization token is unavailable" }, { status: 401 });
    }

    let githubResponse: Response | null = null;
    if (action === "star") {
      githubResponse = await fetch(
        `https://api.github.com/user/starred/${GITHUB_SUPPORT_OWNER}/${GITHUB_SUPPORT_REPOSITORY}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${user.accessToken}`,
            "X-GitHub-Api-Version": "2022-11-28",
            "Content-Length": "0",
            "User-Agent": "GitHubUniverse-App",
          },
          signal: AbortSignal.timeout(15000),
        }
      );
    } else if (action === "follow") {
      githubResponse = await fetch(`https://api.github.com/user/following/${GITHUB_SUPPORT_OWNER}`, {
        method: "PUT",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${user.accessToken}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Length": "0",
          "User-Agent": "GitHubUniverse-App",
        },
        signal: AbortSignal.timeout(15000),
      });
    } else {
      return NextResponse.json({ error: "Unsupported support action" }, { status: 400 });
    }

    if (!githubResponse.ok) {
      console.error("GitHub support action failed:", githubResponse.status);
      return NextResponse.json({ error: "GitHub could not complete this support action" }, { status: 502 });
    }

    const existing = await db
      .select()
      .from(userSupportActions)
      .where(eq(userSupportActions.userId, sessionUserId))
      .limit(1);

    let hasStarred = existing[0]?.hasStarredRepo || false;
    let hasFollowed = existing[0]?.hasFollowedMaintainer || false;

    if (action === "star") {
      hasStarred = true;
    } else if (action === "follow") {
      hasFollowed = true;
    } else if (action === "unlock_all") {
      hasStarred = true;
      hasFollowed = true;
    }

    if (existing.length > 0) {
      const updated = await db
        .update(userSupportActions)
        .set({
          hasStarredRepo: hasStarred,
          hasFollowedMaintainer: hasFollowed,
          updatedAt: new Date(),
        })
        .where(eq(userSupportActions.id, existing[0].id))
        .returning();

      return NextResponse.json({ support: updated[0] });
    } else {
      const inserted = await db
        .insert(userSupportActions)
        .values({
          userId: sessionUserId,
          hasStarredRepo: hasStarred,
          hasFollowedMaintainer: hasFollowed,
        })
        .returning();

      return NextResponse.json({ support: inserted[0] });
    }
  } catch (err) {
    console.error("Support POST error:", err);
    return NextResponse.json({ error: "Failed to update support status" }, { status: 500 });
  }
}
