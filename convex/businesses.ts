import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Create a new business (enforces one-per-user)
export const createBusiness = mutation({
  args: {
    name: v.string(),
    category: v.union(
      v.literal("Food"),
      v.literal("Beauty"),
      v.literal("Fusion"),
      v.literal("Services")
    ),
    description: v.string(),
    address: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthenticated");
    }

    // Get user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      throw new Error("User not found. Please refresh and try again.");
    }

    // CRITICAL: Check if user already has a business (one-per-user constraint)
    const existingBusiness = await ctx.db
      .query("businesses")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .unique();

    if (existingBusiness) {
      throw new Error("You already have a registered business. Each user can only register one business.");
    }

    // Create the business
    const now = Date.now();
    const businessId = await ctx.db.insert("businesses", {
      ownerId: user._id,
      name: args.name,
      category: args.category,
      description: args.description,
      shortDescription: args.description.substring(0, 100),
      address: args.address,
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });

    return businessId;
  },
});

// Get the current user's business
export const getMyBusiness = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return null;
    }

    return await ctx.db
      .query("businesses")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .unique();
  },
});

// Check if user can create a business
export const canCreateBusiness = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return { canCreate: false, reason: "Not authenticated" };
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) {
      return { canCreate: false, reason: "User not found" };
    }

    const existingBusiness = await ctx.db
      .query("businesses")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .unique();

    if (existingBusiness) {
      return { canCreate: false, reason: "Already has a business" };
    }

    return { canCreate: true, reason: null };
  },
});
