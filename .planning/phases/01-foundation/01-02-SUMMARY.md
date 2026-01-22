---
phase: 01-foundation
plan: 02
subsystem: data-layer
tags: [convex, database, schema, authentication, constraint-enforcement]

# Dependency graph
requires:
  - phase: 01-foundation
    plan: 01
    provides: "Convex backend integration configured"
provides:
  - "Database schema with users and businesses tables"
  - "Automatic user creation on first authentication"
  - "One-business-per-user constraint enforcement"
  - "Foundation test UI for constraint verification"
affects: [02-public-directory, 03-business-management]

# Tech tracking
tech-stack:
  added: []
  patterns: ["Schema-first development with Convex validators", "Indexed queries for constraint enforcement", "Auto user creation on first auth"]

key-files:
  created:
    - convex/schema.ts
    - convex/users.ts
    - convex/businesses.ts
  modified:
    - app/page.tsx

key-decisions:
  - "by_owner index enables efficient one-per-user constraint check"
  - "Status field uses lowercase literals for consistency"
  - "Contact and media fields optional for Phase 1, expanded in Phase 3"
  - "shortDescription auto-generated from first 100 chars of description"

patterns-established:
  - "Always use indexed queries for foreign key lookups"
  - "Check constraint before insert (fail fast with clear error)"
  - "Auto-create user record in useEffect after successful auth"

# Metrics
duration: 3min
completed: 2026-01-23
---

# Phase 01 Plan 02: Database Schema Summary

**Complete database schema with users/businesses tables and one-business-per-user constraint; testing pending Clerk credentials**

## Performance

- **Duration:** 3 min
- **Started:** 2026-01-23T15:23:51Z
- **Completed:** 2026-01-23T15:26:55Z
- **Tasks:** 3 of 3 (code complete, verification pending credentials)
- **Files created:** 3 (schema.ts, users.ts, businesses.ts)
- **Files modified:** 1 (page.tsx)

## Accomplishments
- Defined complete database schema for users and businesses with all required indexes
- Implemented user auto-creation on first authentication
- Enforced one-business-per-user constraint with indexed query check
- Created comprehensive test UI for constraint verification
- All code written and committed, ready for testing when credentials available

## Task Commits

All tasks completed with atomic commits:

1. **Task 1: Define database schema for users and businesses** - `682f967` (feat)
   - Added users table with clerkId, email, name, createdAt
   - Added businesses table with ownerId, name, category, description, address, status
   - Created indexes: by_clerk_id, by_email, by_owner, by_status, by_category, by_address
   - by_owner index enables efficient one-per-user constraint check

2. **Task 2: Implement user creation and one-business-per-user constraint** - `fb356a3` (feat)
   - Created convex/users.ts: createOrGetUser, getCurrentUser, getAuthStatus
   - Created convex/businesses.ts: createBusiness, getMyBusiness, canCreateBusiness
   - Enforces constraint via indexed query check before insert
   - Clear error message: "You already have a registered business. Each user can only register one business."

3. **Task 3: Create test UI for constraint enforcement** - `69fea34` (feat)
   - Replaced template homepage with foundation test UI
   - Auth Status section: shows Clerk user and Convex user ID
   - Business Status section: displays current business and canCreate check
   - Test Actions: Create Business and Test Constraint buttons
   - Success Criteria checklist with dynamic status indicators

## Files Created/Modified

**Database Schema:**
- `convex/schema.ts` - Users and businesses tables with comprehensive field definitions and indexes

**Backend Functions:**
- `convex/users.ts` - User creation and authentication status queries
- `convex/businesses.ts` - Business CRUD with one-per-user constraint enforcement

**Frontend:**
- `app/page.tsx` - Test UI for verifying authentication and constraint enforcement

## Decisions Made

**1. Schema design for constraint enforcement**
- Added `by_owner` index on businesses.ownerId for efficient unique check
- Rationale: Enables fast query to check if user already has a business before insert

**2. Status field lowercase literals**
- Used `v.literal("draft")` instead of `v.literal("DRAFT")`
- Rationale: Lowercase is more common in web apps, easier to type in tests

**3. Optional contact/media fields**
- All contact links and media fields marked `v.optional()`
- Rationale: Minimum viable business can be created with just name/category/description/address

**4. Auto-generate shortDescription**
- shortDescription = description.substring(0, 100) in createBusiness
- Rationale: Ensures consistency, reduces user input burden for v1

**5. Clear constraint error message**
- "You already have a registered business. Each user can only register one business."
- Rationale: User-friendly, explains both the current state and the limitation

## Deviations from Plan

None - plan executed exactly as written. All code completed as specified.

## Issues Encountered

None - schema and functions implemented without issues.

## Verification Status

**Code Complete:** All schema and functions written and committed.

**Testing Deferred:** The user is continuing without Clerk credentials configured yet.

**When credentials are available, verification steps are:**
1. Run `npx convex dev` to push schema and deploy functions
2. Run `npm run dev` to start Next.js app
3. Sign in with test Clerk account
4. Verify user record created in Convex (check UI: "Convex User ID" shows ID)
5. Click "Create Business" - should succeed
6. Verify business appears in Business Status section
7. Click "Test Constraint (Try Second)" - should fail with constraint error
8. Verify "Constraint working correctly!" message appears
9. Verify "Can create: No (Already has a business)" shows
10. All success criteria checkboxes should show green with checkmarks

**Expected Results:**
- First business creation succeeds
- Second business creation fails with "already have a registered business" error
- canCreateBusiness returns false after first business created
- Convex dashboard shows 1 user and 1 business record

## Next Phase Readiness

**Ready for Phase 2 after verification:**
- Database schema complete for users and businesses
- Constraint enforcement logic implemented
- Test UI ready for immediate verification
- All Phase 1 success criteria codified in test UI

**Blockers:**
- Verification pending Clerk credentials (from 01-01)
- Cannot push schema or test functions until `npx convex dev` runs

**Next Steps:**
1. User completes Clerk setup (if not done in 01-01 verification)
2. Run `npx convex dev` to push schema and functions
3. Run `npm run dev` and verify all test cases pass
4. Proceed to Phase 02 (Public Directory)

## Phase 1 Success Criteria Status

- [x] Database schema exists for businesses, users, and their relationships
- [x] User record creation logic implemented (auto-creates on first auth)
- [x] System enforces one business per user constraint (via indexed query check)
- [x] Constraint error message is user-friendly
- [x] Foundation ready for Phase 2 (all code complete)

**Note:** Checkboxes marked complete because code is written. Runtime verification pending credentials.

---
*Phase: 01-foundation*
*Code completed: 2026-01-23*
*Testing pending: Clerk credentials*
