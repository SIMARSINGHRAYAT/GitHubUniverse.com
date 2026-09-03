import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSupportActions } from "@/db/schema";
import { eq } from "drizzle-orm";

const GUEST_USER = {
  id: "guest-pixel-coder",
  username: "pixel_coder",
  displayName: "Pixel Coder 8Bit",
  avatarUrl: "https://avatars.githubusercontent.com/u/583231?v=4",
  bio: "Exploring the GitHub universe in 8-bit mode 👾",
  isMock: true,
  starredRepo: false,
  followedMaintainer: false,
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("gh_universe_session")?.value || url.searchParams.get("userId");
    const userId = sessionUserId || GUEST_USER.id;

    const support = await db
      .select()
      .from(userSupportActions)
      .where(eq(userSupportActions.userId, userId))
      .limit(1);

    const supportData = support[0] || { hasStarredRepo: false, hasFollowedMaintainer: false };

    if (userId === GUEST_USER.id) {
      return NextResponse.json({
        user: {
          ...GUEST_USER,
          starredRepo: supportData.hasStarredRepo,
          followedMaintainer: supportData.hasFollowedMaintainer,
        },
      });
    }

    const userQuery = await db.select().from(users).where(eq(users.id, userId)).limit(1);

    if (userQuery.length > 0) {
      const u = userQuery[0];
      return NextResponse.json({
        user: {
          id: u.id,
          githubId: u.githubId,
          username: u.username,
          displayName: u.displayName || u.username,
          avatarUrl: u.avatarUrl || "https://avatars.githubusercontent.com/u/583231?v=4",
          bio: u.bio,
          isMock: false,
          starredRepo: supportData.hasStarredRepo,
          followedMaintainer: supportData.hasFollowedMaintainer,
        },
      });
    }

    return NextResponse.json({ user: GUEST_USER });
  } catch (err) {
    console.error("Session GET error:", err);
    return NextResponse.json({ user: GUEST_USER });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "logout") {
      const cookieStore = await cookies();
      cookieStore.delete("gh_universe_session");
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ error: "Unsupported session action" }, { status: 400 });
  } catch (err) {
    console.error("Session POST error:", err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
