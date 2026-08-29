import { pgTable, text, timestamp, boolean, integer, jsonb, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  githubId: text("github_id").unique(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  accessToken: text("access_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const collections = pgTable("collections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(), // Supports guest/mock user string or user UUID
  name: text("name").notNull(),
  description: text("description"),
  color: text("color").default("#00ff66"), // Hex color or pixel tag style
  icon: text("icon").default("folder"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedRepositories = pgTable("saved_repositories", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  collectionId: uuid("collection_id").references(() => collections.id, { onDelete: "cascade" }),
  repoId: text("repo_id").notNull(), // GitHub Repo ID or full_name key
  fullName: text("full_name").notNull(), // e.g. "facebook/react"
  repoData: jsonb("repo_data").notNull(), // Full cached repo payload
  isPinned: boolean("is_pinned").default(false).notNull(),
  pinnedAt: timestamp("pinned_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSupportActions = pgTable("user_support_actions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull(),
  hasStarredRepo: boolean("has_starred_repo").default(false).notNull(),
  hasFollowedMaintainer: boolean("has_followed_maintainer").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const appSettings = pgTable("app_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().unique(),
  soundEnabled: boolean("sound_enabled").default(true).notNull(),
  crtEnabled: boolean("crt_enabled").default(true).notNull(),
  animationsEnabled: boolean("animations_enabled").default(true).notNull(),
  rainSpeed: integer("rain_speed").default(1).notNull(), // 1 (normal), 2 (fast), 0 (slow)
  theme: text("theme").default("cyberpunk-green").notNull(),
  useLiveApi: boolean("use_live_api").default(false).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
