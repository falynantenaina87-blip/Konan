import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// --- Users ---
export const login = mutation({
  args: { email: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (!user || user.password !== args.password) {
      return null;
    }
    return user;
  },
});

export const register = mutation({
  args: { email: v.string(), password: v.string(), name: v.string(), role: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    
    if (existing) throw new Error("Email already exists");

    const role = args.role === "teacher" ? "teacher" : "student";
    
    const id = await ctx.db.insert("users", {
      email: args.email,
      password: args.password,
      name: args.name,
      role: role,
    });
    return { _id: id, ...args, role };
  },
});

// --- Messages ---
export const listMessages = query({
  args: {},
  handler: async (ctx) => {
    const messages = await ctx.db.query("messages").order("desc").take(50);
    // Join with users pour afficher les noms
    const messagesWithUsers = await Promise.all(
      messages.map(async (msg) => {
        const user = await ctx.db.get(msg.user_id);
        // Gestion des utilisateurs supprimés
        return {
          ...msg,
          senderName: user ? user.name : "Fantôme",
          senderRole: user ? user.role : "student",
        };
      })
    );
    return messagesWithUsers.reverse();
  },
});

export const sendMessage = mutation({
  args: { user_id: v.id("users"), content: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user) throw new Error("User not found");

    await ctx.db.insert("messages", {
      user_id: args.user_id,
      content: args.content,
      created_at: Date.now(),
    });
  },
});

// --- Announcements (Admin Protected) ---
export const getAnnouncements = query({
  handler: async (ctx) => {
    return await ctx.db.query("announcements").order("desc").take(10);
  },
});

export const createAnnouncement = mutation({
  args: { 
    user_id: v.id("users"), 
    title: v.string(), 
    content: v.string(), 
    priority: v.union(v.literal("normal"), v.literal("urgent")) 
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user || user.role !== "teacher") {
      throw new Error("UNAUTHORIZED: Access restricted to SENSEI clearance level.");
    }

    await ctx.db.insert("announcements", {
      title: args.title,
      content: args.content,
      priority: args.priority,
      created_at: Date.now(),
    });
  },
});

// --- Schedule (Admin Protected) ---
export const getSchedule = query({
  handler: async (ctx) => {
    return await ctx.db.query("schedule").collect();
  },
});

export const createScheduleItem = mutation({
  args: {
    user_id: v.id("users"),
    day: v.string(),
    time: v.string(),
    subject: v.string(),
    room: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.user_id);
    if (!user || user.role !== "teacher") {
       throw new Error("UNAUTHORIZED: Access restricted to SENSEI clearance level.");
    }
    await ctx.db.insert("schedule", {
      day: args.day,
      time: args.time,
      subject: args.subject,
      room: args.room
    });
  }
});

// --- Quiz Results (User Isolation) ---
export const saveQuizResult = mutation({
  args: {
    user_id: v.id("users"),
    score: v.number(),
    total: v.number(),
    topic: v.string()
  },
  handler: async (ctx, args) => {
    // Vérification basique que l'user existe
    const user = await ctx.db.get(args.user_id);
    if (!user) throw new Error("User not found");

    await ctx.db.insert("quiz_results", {
      user_id: args.user_id,
      score: args.score,
      total: args.total,
      topic: args.topic,
      created_at: Date.now(),
    });
  }
});

export const getUserQuizResults = query({
  args: { user_id: v.id("users") },
  handler: async (ctx, args) => {
    // Isolation : On retourne uniquement les résultats de l'utilisateur demandé
    return await ctx.db
      .query("quiz_results")
      .filter((q) => q.eq(q.field("user_id"), args.user_id))
      .order("desc")
      .take(10);
  }
});