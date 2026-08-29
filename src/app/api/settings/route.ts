import { NextResponse } from "next/server";
import { db } from "@/db";
import { appSettings } from "@/db/schema";
import { eq } from "drizzle-orm";

const DEFAULT_SETTINGS = {
  soundEnabled: true,
  crtEnabled: true,
  animationsEnabled: true,
  rainSpeed: 1,
  theme: "cyberpunk-green",
  useLiveApi: false,
};

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId") || "guest-pixel-coder";

    const record = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.userId, userId))
      .limit(1);

    if (record.length > 0) {
      return NextResponse.json({ settings: record[0] });
    }

    return NextResponse.json({ settings: { ...DEFAULT_SETTINGS, userId } });
  } catch (err) {
    console.error("Settings GET error:", err);
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId = "guest-pixel-coder", settings } = body;

    const existing = await db
      .select()
      .from(appSettings)
      .where(eq(appSettings.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(appSettings)
        .set({
          ...settings,
          updatedAt: new Date(),
        })
        .where(eq(appSettings.id, existing[0].id))
        .returning();

      return NextResponse.json({ settings: updated[0] });
    } else {
      const inserted = await db
        .insert(appSettings)
        .values({
          userId,
          ...DEFAULT_SETTINGS,
          ...settings,
        })
        .returning();

      return NextResponse.json({ settings: inserted[0] });
    }
  } catch (err) {
    console.error("Settings POST error:", err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
