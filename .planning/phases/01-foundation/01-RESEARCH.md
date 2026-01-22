# Phase 1: Foundation - Research

**Researched:** 2026-01-22
**Domain:** Next.js + Convex + Clerk integration
**Confidence:** HIGH

## Summary

Phase 1 establishes a Next.js application with Convex backend and Clerk authentication. The standard approach involves using Next.js 15 App Router with official Convex and Clerk integrations that provide end-to-end type safety, real-time reactivity, and secure authentication flows.

The setup is well-documented with official templates and clear integration paths. Convex uses a schema-first approach with TypeScript validators that auto-generate types, while Clerk integrates via JWT tokens and custom providers. The one-business-per-user constraint must be enforced in application code using indexed queries and Convex's optimistic concurrency control, as Convex does not have built-in unique constraints.

**Primary recommendation:** Use `npm create convex@latest` to scaffold the project with the Next.js + Clerk template, which includes proper provider setup, middleware configuration, and folder structure conventions.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 15.x | Frontend framework with SSR | Industry standard for React apps, excellent DX |
| Convex | Latest | Backend database + serverless functions | Built-in real-time reactivity, type-safe, zero-config |
| Clerk | Latest | Authentication provider | Easy integration with Convex, JWT-based, good UX |
| TypeScript | 5.x | Type safety | Required for Convex type generation |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| convex-helpers | Latest | Relationship helpers, utilities | Optional but useful for complex relationships |
| Tailwind CSS | 3.x | Styling | Default in templates, simple for non-technical users |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Clerk | NextAuth.js, Supabase Auth | Clerk has better Convex integration docs, simpler JWT setup |
| Convex Ents | Manual relationship code | Ents is in maintenance mode, not recommended for production |

**Installation:**
```bash
# Recommended: Use official template
npm create convex@latest -- -t nextjs-clerk

# Or manual setup
npx create-next-app@latest my-app
cd my-app
npm install convex
npm install @clerk/nextjs
npx convex dev
```

## Architecture Patterns

### Recommended Project Structure
```
project-root/
├── app/                      # Next.js App Router pages and layouts
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage (client component)
│   └── (auth)/              # Route group for auth pages
├── components/              # Reusable React components
│   └── ConvexClientProvider.tsx  # Client provider wrapper
├── convex/                  # Convex backend code
│   ├── _generated/          # Auto-generated types (gitignored)
│   ├── schema.ts            # Database schema definition
│   ├── auth.config.ts       # Clerk JWT configuration
│   ├── users.ts             # User-related functions
│   ├── businesses.ts        # Business-related functions
│   └── http.ts              # HTTP actions (file uploads)
├── lib/                     # Shared utilities
├── public/                  # Static assets
├── middleware.ts            # Clerk middleware for auth
├── .env.local               # Environment variables
├── next.config.ts           # Next.js configuration
└── package.json
```

### Pattern 1: Provider Setup (Clerk + Convex)
**What:** Wrap the app with ClerkProvider (outer) and ConvexProviderWithClerk (inner)
**When to use:** Required for authentication to work properly
**Example:**
```typescript
// app/ConvexClientProvider.tsx
// Source: https://docs.convex.dev/auth/clerk
"use client";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return (
    <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./ConvexClientProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ClerkProvider>
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
```

### Pattern 2: Schema Definition with Relationships
**What:** Define database tables with validators and indexes
**When to use:** Always define schema before writing queries/mutations
**Example:**
```typescript
// convex/schema.ts
// Source: https://docs.convex.dev/database/schemas
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"]),

  businesses: defineTable({
    ownerId: v.id("users"),
    name: v.string(),
    address: v.string(),
    description: v.string(),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
  })
    .index("by_owner", ["ownerId"])
    .index("by_address", ["address"]),
});
```

### Pattern 3: Enforcing Unique Constraints
**What:** Use indexed queries to check uniqueness before insertion
**When to use:** For one-per-user constraints or unique fields
**Example:**
```typescript
// convex/businesses.ts
// Source: https://discord-questions.convex.dev/m/1130486747931877498
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createBusiness = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Get user record
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();
    if (!user) throw new Error("User not found");

    // Check if user already has a business (enforces one-per-user)
    const existing = await ctx.db
      .query("businesses")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .unique();

    if (existing) {
      throw new Error("User already has a registered business");
    }

    // Create the business
    return await ctx.db.insert("businesses", {
      ownerId: user._id,
      name: args.name,
      address: args.address,
      description: args.description,
      status: "pending",
    });
  },
});
```

### Pattern 4: Authentication in Backend Functions
**What:** Always verify authentication and get user identity in mutations/queries
**When to use:** Every function that accesses user-specific data
**Example:**
```typescript
// Source: https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs
export const getMyBusiness = query({
  args: {},
  handler: async (ctx) => {
    // ALWAYS check authentication
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) return null;

    return await ctx.db
      .query("businesses")
      .withIndex("by_owner", (q) => q.eq("ownerId", user._id))
      .unique();
  },
});
```

### Pattern 5: Client-Side Data Fetching
**What:** Use `useQuery` and `useMutation` hooks with proper authentication gating
**When to use:** All client components that need data
**Example:**
```typescript
// Source: https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs
"use client";
import { useQuery } from "convex/react";
import { useConvexAuth } from "convex/react";
import { api } from "@/convex/_generated/api";

export function MyBusinessCard() {
  const { isLoading, isAuthenticated } = useConvexAuth();
  const business = useQuery(
    api.businesses.getMyBusiness,
    isAuthenticated ? {} : "skip"
  );

  if (isLoading) return <div>Loading authentication...</div>;
  if (!isAuthenticated) return <div>Please sign in</div>;
  if (!business) return <div>No business registered</div>;

  return <div>{business.name}</div>;
}
```

### Anti-Patterns to Avoid

- **Using mutations for read operations:** Mutations are for writes only; use queries for reads to get real-time reactivity and caching
- **Not awaiting promises:** Always await `ctx.db` operations and `ctx.scheduler` calls; floating promises cause silent failures
- **Checking auth only client-side:** Authentication MUST be checked in every Convex function; client checks are UX only
- **Using `.collect()` on large datasets:** Collect returns all documents; use pagination or filtering for >1000 records
- **Deeply nested arrays:** Don't treat Convex like pure NoSQL; use relationships with IDs instead of nested arrays
- **Skipping indexes:** Create indexes for common query patterns upfront; full table scans don't scale
- **Multiple `ctx.runMutation()` calls:** Use single transactions with plain TypeScript functions instead of multiple mutation calls

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Unique field constraints | Custom locking/checking logic | Indexed query + OCC pattern | Convex's optimistic concurrency control handles race conditions automatically |
| User sync from Clerk | Webhook handlers | Convex JWT integration + create-on-first-auth pattern | Built-in JWT validation, no webhook complexity |
| Real-time updates | WebSocket polling | `useQuery` hook | Convex queries are reactive by default, auto-update on mutations |
| File uploads | Custom S3/storage integration | Convex file storage | Built-in with upload URLs, 20MB HTTP limit or unlimited with signed URLs |
| Type safety | Manual TypeScript interfaces | Convex schema validators | Auto-generates types from schema, runtime validation included |
| Authentication state | Manual JWT parsing | `ctx.auth.getUserIdentity()` | Verified identity from JWT, includes claims |
| Relationship traversal | Manual joins with multiple queries | Indexed queries + ID references | Convex queries are fast, write code instead of SQL joins |

**Key insight:** Convex is a "software-defined database" where you enforce constraints in code using indexes and transactions. The OCC system handles race conditions automatically through retries, making manual locking unnecessary.

## Common Pitfalls

### Pitfall 1: Authentication Race Conditions
**What goes wrong:** Queries execute before authentication completes, potentially exposing unauthorized data or causing errors
**Why it happens:** React hooks run concurrently; `useQuery` may start before `useConvexAuth()` finishes validation
**How to avoid:** Always gate queries with `isAuthenticated` check and pass `"skip"` when not authenticated
**Warning signs:** Intermittent "Unauthenticated" errors, data briefly visible before auth redirect

### Pitfall 2: Circular Schema References
**What goes wrong:** Schema validation fails when two tables reference each other without nullable fields
**Why it happens:** Both documents need the other's ID to exist first, creating impossible initialization order
**How to avoid:** Make one reference nullable: `v.union(v.id("table"), v.null())`, create first document, then link second
**Warning signs:** Schema push fails with circular dependency error

### Pitfall 3: Not Using Indexes for Queries
**What goes wrong:** Queries become slow as data grows, eventually hitting performance limits
**Why it happens:** Without indexes, Convex does full table scans; filtering happens after reading all documents
**How to avoid:** Create indexes for every field used in `.withIndex()` queries; add them when defining schema
**Warning signs:** Dashboard shows high execution times, queries slow down as table size increases

### Pitfall 4: Floating Promises
**What goes wrong:** Database operations silently fail without errors, scheduled functions don't run
**Why it happens:** Not awaiting `ctx.db`, `ctx.scheduler`, or `ctx.storage` operations causes them to be ignored
**How to avoid:** Always `await` Convex operations; enable `typescript-eslint` `no-floating-promises` rule
**Warning signs:** Mutations seem to succeed but data doesn't change, scheduled functions never trigger

### Pitfall 5: Public vs Internal Functions
**What goes wrong:** Internal functions exposed to clients can be called by attackers, bypassing authorization
**Why it happens:** Using `api.foo.bar` instead of `internal.foo.bar` when calling from `ctx.runMutation()`
**How to avoid:** Mark functions only called within Convex as `internalMutation` or `internalQuery`; import from `internal.foo.bar`
**Warning signs:** Functions callable from client that shouldn't be, authorization bypassed

### Pitfall 6: Treating Convex Like NoSQL with Deep Nesting
**What goes wrong:** Updates become difficult, array limits hit, performance degrades
**Why it happens:** Storing arrays of objects instead of separate tables with relationships
**How to avoid:** Use separate tables with ID references; limit arrays to ~10 items maximum for bounded data
**Warning signs:** Difficulty updating specific items, hitting 8192 array entry limit

### Pitfall 7: Forgetting JWT Template Name
**What goes wrong:** Authentication fails silently or with cryptic errors
**Why it happens:** Clerk JWT template must be named exactly "convex" (not "Convex" or custom name)
**How to avoid:** Use the Convex template from Clerk dashboard without renaming it
**Warning signs:** `ctx.auth.getUserIdentity()` returns null despite user being authenticated in Clerk

### Pitfall 8: Client Components Without "use client"
**What goes wrong:** Hydration errors, hooks fail, Convex queries don't work
**Why it happens:** Next.js 15 uses server components by default; Convex hooks require client components
**How to avoid:** Add `"use client"` directive at top of any file using `useQuery`, `useMutation`, or `useConvexAuth`
**Warning signs:** "You're importing a component that needs useState..." error, hooks fail in server components

## Code Examples

Verified patterns from official sources:

### Setting Up Clerk Middleware
```typescript
// middleware.ts
// Source: https://clerk.com/docs/guides/development/integrations/databases/convex
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```

### Convex Auth Configuration
```typescript
// convex/auth.config.ts
// Source: https://docs.convex.dev/auth/clerk
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN!,
      applicationID: "convex",
    },
  ],
};
```

### User Creation on First Authentication
```typescript
// convex/users.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createOrGetUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existing) return existing._id;

    // Create new user
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email!,
      name: identity.name ?? "User",
    });
  },
});
```

### File Upload Pattern
```typescript
// convex/storage.ts
// Source: https://docs.convex.dev/file-storage/upload-files
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const saveImage = mutation({
  args: {
    storageId: v.id("_storage"),
    businessId: v.id("businesses"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");

    // Verify ownership
    const business = await ctx.db.get(args.businessId);
    if (!business) throw new Error("Business not found");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (business.ownerId !== user?._id) {
      throw new Error("Not authorized");
    }

    // Update business with image
    await ctx.db.patch(args.businessId, {
      imageStorageId: args.storageId,
    });
  },
});

// Client-side upload
// const uploadUrl = await generateUploadUrl();
// const result = await fetch(uploadUrl, {
//   method: "POST",
//   headers: { "Content-Type": file.type },
//   body: file,
// });
// const { storageId } = await result.json();
// await saveImage({ storageId, businessId });
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pages Router | App Router (default) | Next.js 13-15 | Server components by default, better performance, new routing conventions |
| Manual type definitions | Auto-generated from schema | Convex standard | End-to-end type safety, schema-first development |
| ClerkProvider alone | ConvexProviderWithClerk | Convex + Clerk | Proper JWT integration, auth state in Convex functions |
| Webhook-based user sync | JWT claims + on-demand creation | Current best practice | Simpler setup, no webhook infrastructure needed |
| v.union for optional | v.optional | Convex recent | Simpler nullable field syntax (but union still needed for literal unions) |
| Convex Ents | Manual relationship code | 2024 | Ents in maintenance mode, not recommended for production |

**Deprecated/outdated:**
- **Convex Ents:** Library is in maintenance mode; use manual indexed queries and relationship patterns instead
- **Pages Router:** Still supported but App Router is default; use App Router for new projects
- **@clerk/nextjs v5 or earlier:** Use v6+ for Next.js 15 compatibility with combined client/server provider

## Open Questions

Things that couldn't be fully resolved:

1. **Address uniqueness verification (AUTH-03)**
   - What we know: Manual admin verification is required; no automated geocoding/address normalization needed in Phase 1
   - What's unclear: How admin will verify addresses (UI workflow), whether soft or hard constraint
   - Recommendation: Store address as plain string in Phase 1; admin verification UI is a separate phase concern; add `verifiedAt` timestamp field for tracking

2. **File upload size limits for business images**
   - What we know: HTTP actions limited to 20MB; upload URLs support unlimited size with 2-minute timeout
   - What's unclear: Expected image sizes for business photos
   - Recommendation: Use upload URL pattern (unlimited) to avoid hitting 20MB limit; add client-side compression if needed

3. **Clerk pricing tier requirements**
   - What we know: Basic Clerk integration works on free tier
   - What's unclear: Whether user volume or feature needs require paid tier
   - Recommendation: Start with free tier; monitor monthly active users (MAU) limit

## Sources

### Primary (HIGH confidence)
- Convex official docs: https://docs.convex.dev/quickstart/nextjs
- Convex schema docs: https://docs.convex.dev/database/schemas
- Convex auth docs: https://docs.convex.dev/auth/clerk
- Clerk integration docs: https://clerk.com/docs/guides/development/integrations/databases/convex
- Convex file storage: https://docs.convex.dev/file-storage/upload-files
- Convex best practices: https://docs.convex.dev/understanding/best-practices

### Secondary (MEDIUM confidence)
- Authentication best practices article: https://stack.convex.dev/authentication-best-practices-convex-clerk-and-nextjs
- Relationship structures article: https://stack.convex.dev/relationship-structures-let-s-talk-about-schemas
- Authorization patterns: https://stack.convex.dev/authorization
- 10 tips for new Convex developers: https://www.schemets.com/blog/10-convex-developer-tips-pitfalls-productivity
- Official template repository: https://github.com/get-convex/template-nextjs-clerk

### Tertiary (LOW confidence)
- Unique constraints discussion: https://discord-questions.convex.dev/m/1130486747931877498 (verified with official docs)
- Convex Ents (not recommended): https://labs.convex.dev/convex-ents/schema (marked as maintenance mode)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official documentation and templates clearly establish Next.js 15 + Convex + Clerk as the standard integration
- Architecture: HIGH - Official examples and templates demonstrate consistent patterns for provider setup, schema definition, and function organization
- Pitfalls: HIGH - Documented in official best practices docs and verified through multiple authoritative sources

**Research date:** 2026-01-22
**Valid until:** ~30 days (stable ecosystem; Next.js 15 and Convex are mature; recheck if major version updates announced)
