# Roadmap: HBB@WestScape

## Overview

This roadmap delivers a community directory for home-based businesses in WestScape estate. Starting with foundation and authentication, we build the public-facing directory and profiles, then add business registration and management capabilities, and finally complete the admin approval workflow. Each phase delivers a coherent, verifiable capability.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3, 4, 5): Planned milestone work
- Decimal phases (e.g., 2.1): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation** - Project setup, database schema, and Clerk authentication
- [ ] **Phase 2: Public Directory** - Business listings, profiles, and contact modal
- [ ] **Phase 3: Business Registration** - Owner signup and registration form with media upload
- [ ] **Phase 4: Business Management** - Owner dashboard for editing listings
- [ ] **Phase 5: Admin** - Hidden admin routes for approving/rejecting businesses

## Phase Details

### Phase 1: Foundation
**Goal**: Project infrastructure is ready and users can authenticate
**Depends on**: Nothing (first phase)
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. Next.js app runs locally with Convex backend connected
  2. User can sign up and log in via Clerk
  3. Database schema exists for businesses, users, and their relationships
  4. System enforces one business per user constraint
**Plans**: TBD

Plans:
- [ ] 01-01: TBD
- [ ] 01-02: TBD

### Phase 2: Public Directory
**Goal**: Visitors can browse businesses and view profiles without logging in
**Depends on**: Phase 1
**Requirements**: DIR-01, DIR-02, DIR-03, DIR-04, PROF-01, PROF-02, PROF-03, PROF-04, PROF-05, CONT-01, CONT-02, CONT-03, CONT-04
**Success Criteria** (what must be TRUE):
  1. Visitor can view list of approved businesses without login
  2. Visitor can filter businesses by category (Food, Beauty, Fusion, Services)
  3. Business cards display name, category, short description, and "New" badge if applicable
  4. Visitor can click into a business profile and see full details, photos, and video
  5. Visitor can click Contact button and see modal with all business contact links
**Plans**: TBD

Plans:
- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

### Phase 3: Business Registration
**Goal**: Business owners can register their business and submit for approval
**Depends on**: Phase 2
**Requirements**: REG-01, REG-02, REG-03, REG-04, REG-05
**Success Criteria** (what must be TRUE):
  1. Logged-in user can access registration form
  2. User can fill out business details (name, category, description, address, contacts)
  3. User can upload photos and optionally one video
  4. User can submit registration (status changes to Pending Approval)
  5. Business statuses (Draft, Pending, Approved, Rejected) are tracked correctly
**Plans**: TBD

Plans:
- [ ] 03-01: TBD
- [ ] 03-02: TBD

### Phase 4: Business Management
**Goal**: Business owners can edit their approved listing
**Depends on**: Phase 3
**Requirements**: MGMT-01, MGMT-02, MGMT-03, MGMT-04, MGMT-05
**Success Criteria** (what must be TRUE):
  1. Business owner can access dashboard showing their business
  2. Owner can edit description, add/remove photos, and replace video
  3. Owner can edit contact links
  4. Edits go live immediately (no re-approval required)
**Plans**: TBD

Plans:
- [ ] 04-01: TBD
- [ ] 04-02: TBD

### Phase 5: Admin
**Goal**: Admin can review and approve/reject business registrations
**Depends on**: Phase 4
**Requirements**: ADM-01, ADM-02, ADM-03, ADM-04, ADM-05
**Success Criteria** (what must be TRUE):
  1. Admin routes are not visible in public navigation
  2. Admin must authenticate to access admin features
  3. Admin can view list of pending business registrations
  4. Admin can approve a business (appears in public directory)
  5. Admin can reject a business (owner notified, does not appear)
**Plans**: TBD

Plans:
- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 -> 2 -> 3 -> 4 -> 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/2 | Not started | - |
| 2. Public Directory | 0/3 | Not started | - |
| 3. Business Registration | 0/2 | Not started | - |
| 4. Business Management | 0/2 | Not started | - |
| 5. Admin | 0/2 | Not started | - |

---
*Roadmap created: 2026-01-22*
*Last updated: 2026-01-22*
