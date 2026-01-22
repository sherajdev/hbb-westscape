# HBB@WestScape

## What This Is

A community directory for home-based businesses in the WestScape estate. Residents can discover and contact local businesses, while business owners can list their services without needing technical skills, a website, or payment setup. Starting with WestScape, designed to be reusable for other estates.

## Core Value

Residents can discover and contact home-based businesses in their estate through a simple, trusted directory.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Public directory displays approved businesses with category filtering
- [ ] Business profile pages show name, category, description, photos, video, and contact links
- [ ] Contact modal displays business owner's contact links (Phone, WhatsApp, Instagram, TikTok, Facebook, Carousell, Website)
- [ ] "New" badge auto-applied to businesses registered within 30 days
- [ ] Business owners can sign up and register one business
- [ ] Business owners can edit their listing (description, photos, video, contact links)
- [ ] Admin can review and approve/reject business registrations
- [ ] One business per user, one business per address (manual verification)
- [ ] Business statuses: Draft, Pending Approval, Approved, Rejected
- [ ] Media upload: unlimited photos, 1 video per business
- [ ] Contact links: minimum 1-2 required; if only 1, must be Phone or WhatsApp

### Out of Scope

- Engagement scoring / Popular badges — deferred to v2, adds tracking complexity
- Contact edit verification flow — v1 edits go live immediately
- Multi-admin support — single admin (you) for v1
- Premium features / AI content generation — future monetization
- In-app checkout — not a marketplace
- User messaging — use existing channels (WhatsApp, etc.)
- Reviews or ratings — adds moderation burden
- Delivery or logistics — not in scope

## Context

**Target users:**
- Business owners: Non-technical, run food/beauty/fusion/service businesses, currently rely on Instagram/WhatsApp/word-of-mouth
- Residents: Want to discover and support local businesses in the estate

**Business categories:** Food, Beauty, Fusion, Services

**Estate strategy:** Single codebase, configurable per estate. WestScape first, expandable later.

**Existing PRD:** Full PRD available at `PRD.md` with detailed feature specs and future roadmap.

## Constraints

- **Tech stack**: Next.js + Convex + Clerk + Convex file storage — learning goals, non-negotiable
- **Single admin**: Only one admin (you) for v1
- **Estate-specific**: v1 is WestScape only, but architecture should support multi-estate
- **Non-technical users**: Business owners have no technical skills — UX must be simple

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js + Convex + Clerk stack | Learning goals — want to gain experience with these tools | — Pending |
| Convex file storage for media | Simplest option, built into Convex | — Pending |
| No engagement tracking in v1 | Reduces complexity, can add later with real usage data | — Pending |
| Edits go live immediately | Simplifies v1, verification flow adds state complexity | — Pending |
| Manual address verification | Sufficient for single-estate v1, can automate later | — Pending |

---
*Last updated: 2026-01-22 after initialization*
