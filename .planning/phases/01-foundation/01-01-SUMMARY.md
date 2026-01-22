---
phase: 01-foundation
plan: 01
subsystem: infra
tags: [nextjs, convex, clerk, authentication, react, tailwind]

# Dependency graph
requires:
  - phase: none
    provides: "Initial project structure"
provides:
  - "Next.js 15 project scaffolded with App Router"
  - "Convex backend integration configured"
  - "Clerk authentication provider setup (awaiting credentials)"
  - "Environment variable template for required keys"
affects: [02-database-schema, future-auth-flows]

# Tech tracking
tech-stack:
  added: [nextjs@15, convex@1.31.6, @clerk/nextjs@6.36.9, @clerk/clerk-react@5.59.5, tailwindcss@4.1.18]
  patterns: ["ClerkProvider wrapping ConvexProviderWithClerk", "App Router with server/client components"]

key-files:
  created:
    - package.json
    - app/layout.tsx
    - app/page.tsx
    - components/ConvexClientProvider.tsx
    - convex/schema.ts
    - convex/auth.config.ts
    - .env.example
  modified: []

key-decisions:
  - "Used official Convex + Next.js + Clerk template for proper integration"
  - "Created .env.example (committed) and .env.local (gitignored) for credential management"
  - "Deferred Task 3 (end-to-end auth verification) until Clerk credentials provided"

patterns-established:
  - "Provider nesting: ClerkProvider (outer) → ConvexProviderWithClerk (inner)"
  - "Environment variable pattern: .env.example committed, .env.local gitignored"

# Metrics
duration: 2.5min
completed: 2026-01-22
---

# Phase 01 Plan 01: Project Scaffold Summary

**Next.js 15 + Convex backend + Clerk auth scaffolded; awaiting Clerk credentials for verification**

## Performance

- **Duration:** 2.5 min
- **Started:** 2026-01-22T13:25:02Z
- **Completed:** 2026-01-22T13:27:29Z
- **Tasks:** 2 of 3 (Task 3 awaiting credentials)
- **Files modified:** 28 created

## Accomplishments
- Scaffolded complete Next.js 15 project with Convex and Clerk integration
- Established proper provider hierarchy (ClerkProvider → ConvexProviderWithClerk)
- Created environment variable template with clear instructions
- Set up gitignore patterns for credentials

## Task Commits

Tasks completed with atomic commits:

1. **Task 1: Scaffold project with Convex + Clerk template** - `0c10ded` (feat)
   - Ran `npm create convex@latest -- -t nextjs-clerk`
   - Created 28 files: Next.js app, Convex backend, Clerk provider
   - Configured Tailwind CSS, TypeScript, ESLint

2. **Task 2: Create .env.local with placeholder values** - `752de51` (chore)
   - Created .env.example (committed) documenting required variables
   - Created .env.local (gitignored) with REPLACE_WITH_YOUR_KEY placeholders
   - Verified .env* pattern in .gitignore

**Task 3 Status:** Pending - requires real Clerk credentials to:
- Create Clerk application
- Configure JWT template named "convex"
- Obtain publishable and secret keys
- Run `npx convex dev` and `npm run dev` for verification

## Files Created/Modified

**Core Application:**
- `app/layout.tsx` - Root layout with ClerkProvider wrapping ConvexClientProvider
- `app/page.tsx` - Home page template from Convex
- `components/ConvexClientProvider.tsx` - Convex client with Clerk auth integration

**Backend Configuration:**
- `convex/schema.ts` - Empty schema placeholder
- `convex/auth.config.ts` - Clerk JWT configuration (commented out, awaiting credentials)
- `convex/myFunctions.ts` - Example Convex functions

**Configuration:**
- `package.json` - Dependencies: Next.js 15, Convex 1.31.6, Clerk 6.36.9, Tailwind 4.1.18
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `.env.example` - Environment variable template (committed)
- `.env.local` - Placeholder credentials (gitignored)

## Decisions Made

**1. Template scaffolding approach**
- Used official `npm create convex@latest -- -t nextjs-clerk` template
- Rationale: Ensures correct provider setup, reduces integration errors

**2. Two-stage execution**
- Completed scaffolding (Tasks 1-2) now, deferred verification (Task 3)
- Rationale: User wants to add Clerk credentials manually before running dev servers

**3. .env.example pattern**
- Committed .env.example with documentation, gitignored .env.local with placeholders
- Rationale: Developers can copy example, fill real values, never commit secrets

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Scaffolded in temp directory then moved**
- **Found during:** Task 1 (scaffold command)
- **Issue:** `npm create convex` was not accepting stdin input properly for current directory
- **Fix:** Created in `/tmp/hbb-temp-scaffold/hbb-westscape/` then moved files
- **Files modified:** All scaffolded files moved to project root
- **Verification:** All template files present in correct locations
- **Committed in:** 0c10ded (Task 1 commit)

**2. [Rule 2 - Missing Critical] Added .env.example file**
- **Found during:** Task 2 (environment setup)
- **Issue:** .env.local gitignored means no committed record of required variables
- **Fix:** Created .env.example with same structure, force-added to bypass .gitignore
- **Files modified:** .env.example
- **Verification:** File committed and visible in repository
- **Committed in:** 752de51 (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 missing critical)
**Impact on plan:** Both fixes necessary for successful scaffolding and documentation. No scope creep.

## Issues Encountered

None - scaffolding completed successfully after workaround for stdin issue.

## User Setup Required

**External services require manual configuration.**

### Clerk Setup (Required for Task 3)

**Step 1: Create Clerk Application**
1. Visit https://dashboard.clerk.com
2. Create new application named "HBB@WestScape"
3. Copy the following from API Keys page:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...`
   - `CLERK_SECRET_KEY=sk_test_...`

**Step 2: Create JWT Template**
1. In Clerk Dashboard, go to JWT Templates
2. Click "New Template" → "Convex"
3. Name it exactly: `convex`
4. Copy the Issuer URL (format: `https://xxx.clerk.accounts.dev`)
5. Set `CLERK_JWT_ISSUER_DOMAIN=` with that URL

**Step 3: Update Environment**
1. Open `.env.local` in project root
2. Replace all `REPLACE_WITH_YOUR_KEY` placeholders with real values
3. Save file

**Step 4: Verification (Task 3)**
After credentials configured:
1. Run `npx convex dev` (auto-configures NEXT_PUBLIC_CONVEX_URL)
2. Run `npm run dev` in separate terminal
3. Visit http://localhost:3000
4. Verify Clerk sign-in UI appears
5. Test sign-up and sign-in flows

### Convex Setup

The Convex environment variables will be auto-configured when running `npx convex dev`:
- `NEXT_PUBLIC_CONVEX_URL` - Your deployment URL
- `CONVEX_DEPLOYMENT` - Deployment identifier

## Next Phase Readiness

**Ready after credentials:**
- Scaffolding complete, ready for Phase 01 Plan 02 (database schema)
- All dependencies installed
- Provider hierarchy established correctly

**Blockers:**
- Task 3 verification pending Clerk credentials
- Cannot proceed with auth-dependent features until verified

**Next Steps:**
1. User configures Clerk application and JWT template
2. User updates .env.local with real credentials
3. Execute verification (Task 3): run dev servers, test sign-in
4. Proceed to 01-02-PLAN.md (database schema)

---
*Phase: 01-foundation*
*Completed (partial): 2026-01-22*
