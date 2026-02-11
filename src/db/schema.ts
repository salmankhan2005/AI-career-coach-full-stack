import { pgTable, text, timestamp, uuid, jsonb, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  subscriptionPlan: text("subscription_plan").default("Free"),
  credits: integer("credits").default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const chats = pgTable("chats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.firebaseUid).notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const resumes = pgTable("resumes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.firebaseUid).notNull(),
  fileName: text("file_name").notNull(),
  analysis: jsonb("analysis").notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const roadmaps = pgTable("roadmaps", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.firebaseUid).notNull(),
  position: text("position").notNull(),
  nodes: jsonb("nodes").notNull(),
  edges: jsonb("edges"),
  type: text("type").default("linear"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const coverLetters = pgTable("cover_letters", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").references(() => users.firebaseUid).notNull(),
  jobTitle: text("job_title").notNull(),
  company: text("company").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
