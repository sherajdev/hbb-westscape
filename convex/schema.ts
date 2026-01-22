import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    createdAt: v.number(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  businesses: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    category: v.union(
      v.literal("Food"),
      v.literal("Beauty"),
      v.literal("Fusion"),
      v.literal("Services")
    ),
    description: v.string(),
    shortDescription: v.optional(v.string()),
    address: v.string(),
    status: v.union(
      v.literal("draft"),
      v.literal("pending"),
      v.literal("approved"),
      v.literal("rejected")
    ),
    // Contact links - will be expanded in Phase 3
    contactPhone: v.optional(v.string()),
    contactWhatsApp: v.optional(v.string()),
    contactInstagram: v.optional(v.string()),
    contactTikTok: v.optional(v.string()),
    contactFacebook: v.optional(v.string()),
    contactCarousell: v.optional(v.string()),
    contactWebsite: v.optional(v.string()),
    // Media - will be expanded in Phase 3
    imageStorageIds: v.optional(v.array(v.id("_storage"))),
    videoStorageId: v.optional(v.id("_storage")),
    // Timestamps
    createdAt: v.number(),
    updatedAt: v.number(),
    approvedAt: v.optional(v.number()),
    rejectedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_owner", ["ownerId"])
    .index("by_status", ["status"])
    .index("by_category", ["category"])
    .index("by_address", ["address"]),
});
