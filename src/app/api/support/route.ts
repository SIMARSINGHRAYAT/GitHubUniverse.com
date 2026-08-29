import { NextResponse } from "next/server";
import { db } from "@/db";
import { userSupportActions } from "@/db/schema";
import { eq } from "drizzle-orm";

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
    const { userId = "guest-pixel-coder", action, value = true } = body;

    const existing = await db
      .select()
      .from(userSupportActions)
      .where(eq(userSupportActions.userId, userId))
      .limit(1);

    let hasStarred = existing[0]?.hasStarredRepo || false;
    let hasFollowed = existing[0]?.hasFollowedMaintainer || false;

    if (action === "star") {
      hasStarred = value;
    } else if (action === "follow") {
      hasFollowed = value;
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
          userId,
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
