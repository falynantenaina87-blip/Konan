import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    password: v.string(), // In a real app, use auth provider, this is for demo simplicity
    name: v.string(),
    role: v.union(v.literal("student"), v.literal("teacher")),
  }).index("by_email", ["email"]),

  messages: defineTable({
    user_id: v.id("users"),
    content: v.string(),
    created_at: v.number(),
  }),

  announcements: defineTable({
    title: v.string(),
    content: v.string(),
    priority: v.union(v.literal("normal"), v.literal("urgent")),
    created_at: v.number(),
  }),

  schedule: defineTable({
    day: v.string(),
    time: v.string(),
    subject: v.string(),
    room: v.string(),
  }),

  quiz_results: defineTable({
    user_id: v.id("users"),
    score: v.number(),
    total: v.number(),
    topic: v.string(),
    created_at: v.number(),
  }),
});