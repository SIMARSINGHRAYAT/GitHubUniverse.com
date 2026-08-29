import { NextResponse } from "next/server";
import { db } from "@/db";
import { collections, savedRepositories } from "@/db/schema";
import { eq, and, count } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "guest-pixel-coder";

    const userCollections = await db
      .select()
      .from(collections)
      .where(eq(collections.userId, userId));

    // Calculate count of repos for each collection
    const result = await Promise.all(
      userCollections.map(async (col) => {
        const repoCountResult = await db
          .select({ value: count() })
          .from(savedRepositories)
          .where(and(eq(savedRepositories.userId, userId), eq(savedRepositories.collectionId, col.id)));
        const itemCount = repoCountResult[0]?.value || 0;
        return {
          ...col,
          itemCount,
        };
      })
    );

    return NextResponse.json({ collections: result });
  } catch (err) {
    console.error("Collections GET error:", err);
    return NextResponse.json({ collections: [] });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = "guest-pixel-coder", name, description, color = "#00ff66", icon = "folder" } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Collection name is required" }, { status: 400 });
    }

    const inserted = await db
      .insert(collections)
      .values({
        userId,
        name: name.trim().toUpperCase(),
        description: description?.trim() || null,
        color,
        icon,
      })
      .returning();

    return NextResponse.json({ collection: inserted[0] });
  } catch (err) {
    console.error("Collections POST error:", err);
    return NextResponse.json({ error: "Failed to create collection" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    const userId = url.searchParams.get("userId") || "guest-pixel-coder";

    if (!id) {
      return NextResponse.json({ error: "Collection ID required" }, { status: 400 });
    }

    await db.delete(collections).where(and(eq(collections.id, id), eq(collections.userId, userId)));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Collections DELETE error:", err);
    return NextResponse.json({ error: "Failed to delete collection" }, { status: 500 });
  }
}
