# Phase 2: Public Directory - Context

**Gathered:** 2026-01-24
**Status:** Ready for planning

<domain>
## Phase Boundary

Public-facing business browsing and profiles. Visitors can:
- View list of approved businesses without login
- Filter by category (Food, Beauty, Fusion, Services)
- See business cards with name, category, short description, "New" badge
- Click into full profiles with photos, video, and all details
- Access contact links via modal

Registration, management, and admin features are separate phases.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion

User delegated all UI/UX decisions to Claude's judgment based on frontend best practices. The following guidelines apply:

**Listings Layout:**
- Responsive grid layout (cards)
- Each card shows: business image/placeholder, name, category badge, short description
- "New" badge for businesses registered within 30 days
- Clean, modern card design with subtle shadows and rounded corners

**Category Filtering:**
- Horizontal filter bar at top of listings
- Category pills/tabs: All, Food, Beauty, Fusion, Services
- Single-select (one category at a time)
- "All" selected by default

**Profile Page:**
- Hero section with photo gallery (or placeholder if no photos)
- Business name, category, full description prominently displayed
- Video section below description (if video exists)
- Contact button clearly visible (triggers modal)
- Address displayed

**Contact Modal:**
- Clean list of available contact links
- Icons for each contact type (Phone, WhatsApp, Instagram, TikTok, Facebook, Carousell, Website)
- Links open in new tab (external) or trigger appropriate action (tel:, etc.)
- Modal closes on backdrop click or X button

**General UI:**
- Mobile-first responsive design
- Consistent with modern directory/marketplace aesthetics
- Loading states and empty states handled gracefully

</decisions>

<specifics>
## Specific Ideas

No specific requirements — open to standard approaches. User trusts Claude to apply frontend best practices for a clean, modern directory experience.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

</deferred>

---

*Phase: 02-public-directory*
*Context gathered: 2026-01-24*
