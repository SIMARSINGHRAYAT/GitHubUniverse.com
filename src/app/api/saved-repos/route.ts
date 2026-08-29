import { NextResponse } from "next/server";
import { db } from "@/db";
import { savedRepositories } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "guest-pixel-coder";
    const collectionId = url.searchParams.get("collectionId");
    const pinnedOnly = url.searchParams.get("pinned") === "true";

    let query = db.select().from(savedRepositories).where(eq(savedRepositories.userId, userId));

    const allSaved = await query;
    let filtered = allSaved;

    if (collectionId) {
      filtered = filtered.filter((r) => r.collectionId === collectionId);
    }

    if (pinnedOnly) {
      filtered = filtered.filter((r) => r.isPinned);
    }

    return NextResponse.json({ savedRepositories: filtered });
  } catch (err) {
    console.error("Saved repos GET error:", err);
    return NextResponse.json({ savedRepositories: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = "guest-pixel-coder", repo, collectionId = null, action = "save" } = body;

    if (!repo || !repo.id || !repo.fullName) {
      return NextResponse.json({ error: "Invalid repository payload" }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(savedRepositories)
      .where(
        and(
          eq(savedRepositories.userId, userId),
          eq(savedRepositories.repoId, repo.id.toString())
        )
      )
      .limit(1);

    if (action === "toggle_pin") {
      if (existing.length > 0) {
        const item = existing[0];
        const updated = await db
          .update(savedRepositories)
          .set({
            isPinned: !item.isPinned,
            pinnedAt: !item.isPinned ? new Date() : null,
          })
          .where(eq(savedRepositories.id, item.id))
          .returning();

        return NextResponse.json({ savedRepo: updated[0] });
      } else {
        // Save and pin simultaneously
        const inserted = await db
          .insert(savedRepositories)
          .values({
            userId,
            collectionId,
            repoId: repo.id.toString(),
            fullName: repo.fullName,
            repoData: repo,
            isPinned: true,
            pinnedAt: new Date(),
          })
          .returning();

        return NextResponse.json({ savedRepo: inserted[0] });
      }
    }

    if (existing.length > 0) {
      // Toggle saved off (remove)
      await db
        .delete(savedRepositories)
        .where(eq(savedRepositories.id, existing[0].id));

      return NextResponse.json({ savedRepo: null, removed: true });
    }

    const inserted = await db
      .insert(savedRepositories)
      .values({
        userId,
        collectionId,
        repoId: repo.id.toString(),
        fullName: repo.fullName,
        repoData: repo,
        isPinned: false,
      })
      .returning();

    return NextResponse.json({ savedRepo: inserted[0] });
  } catch (err) {
    console.error("Saved repos POST error:", err);
    return NextResponse.json({ error: "Failed to save repository" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId = "guest-pixel-coder", repoId, collectionId } = body;

    if (!repoId) {
      return NextResponse.json({ error: "repoId is required" }, { status: 400 });
    }

    const updated = await db
      .update(savedRepositories)
      .set({ collectionId: collectionId || null })
      .where(and(eq(savedRepositories.userId, userId), eq(savedRepositories.repoId, repoId.toString())))
      .returning();

    return NextResponse.json({ savedRepo: updated[0] || null });
  } catch (err) {
    console.error("Saved repos PUT error:", err);
    return NextResponse.json({ error: "Failed to move repository" }, { status: 500 });
  }
}
