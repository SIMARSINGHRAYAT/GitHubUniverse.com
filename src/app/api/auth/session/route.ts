import { NextResponse } from "next/server";
import { db } from "@/db";
import { users, userSupportActions } from "@/db/schema";
import { eq } from "drizzle-orm";

const MOCK_USER = {
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
    const userId = url.searchParams.get("userId") || MOCK_USER.id;

    // Fetch support actions for user
    const support = await db
      .select()
      .from(userSupportActions)
      .where(eq(userSupportActions.userId, userId))
      .limit(1);

    const supportData = support[0] || { hasStarredRepo: false, hasFollowedMaintainer: false };

    if (userId === MOCK_USER.id) {
      return NextResponse.json({
        user: {
          ...MOCK_USER,
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

    return NextResponse.json({ user: MOCK_USER });
  } catch (err) {
    console.error("Session GET error:", err);
    return NextResponse.json({ user: MOCK_USER });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, username, displayName } = body;

    if (action === "mock_login") {
      const newUser = {
        ...MOCK_USER,
        username: username || "pixel_coder",
        displayName: displayName || username || "Pixel Coder 8Bit",
      };
      return NextResponse.json({ user: newUser });
    }

    if (action === "logout") {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: MOCK_USER });
  } catch (err) {
    console.error("Session POST error:", err);
    return NextResponse.json({ error: "Failed to update session" }, { status: 500 });
  }
}
