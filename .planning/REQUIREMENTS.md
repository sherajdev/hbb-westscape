# Requirements: HBB@WestScape

**Defined:** 2026-01-22
**Core Value:** Residents can discover and contact home-based businesses in their estate through a simple, trusted directory.

## v1 Requirements

### Public Directory

- [ ] **DIR-01**: Visitor can view list of all approved businesses without login
- [ ] **DIR-02**: Visitor can filter businesses by category (Food, Beauty, Fusion, Services)
- [ ] **DIR-03**: Business cards display name, category, and short description
- [ ] **DIR-04**: "New" badge auto-displays on businesses registered within 30 days

### Business Profile

- [ ] **PROF-01**: Each business has a dedicated profile page
- [ ] **PROF-02**: Profile displays business name, category, and full description
- [ ] **PROF-03**: Profile displays photo gallery (unlimited photos)
- [ ] **PROF-04**: Profile displays video (1 max, optional)
- [ ] **PROF-05**: Profile has a single "Contact" button

### Contact Modal

- [ ] **CONT-01**: Contact button opens modal with business contact links
- [ ] **CONT-02**: Modal displays icon-based links (Phone, WhatsApp, Instagram, TikTok, Facebook, Carousell, Website)
- [ ] **CONT-03**: Modal is mobile-friendly with clear call-to-action
- [ ] **CONT-04**: Business must have 1-2 contact links minimum; if only 1, must be Phone or WhatsApp

### Business Owner Accounts

- [ ] **AUTH-01**: Business owner can sign up and log in via Clerk
- [ ] **AUTH-02**: One user can register one business only
- [ ] **AUTH-03**: One business per address (admin verifies manually)

### Business Registration

- [ ] **REG-01**: Business owner can complete registration form (name, category, description, address, contact links)
- [ ] **REG-02**: Business owner can upload photos during registration
- [ ] **REG-03**: Business owner can upload 1 video during registration (optional)
- [ ] **REG-04**: Business owner submits registration for admin approval
- [ ] **REG-05**: Business has statuses: Draft, Pending Approval, Approved, Rejected

### Business Management

- [ ] **MGMT-01**: Business owner can edit business description
- [ ] **MGMT-02**: Business owner can add/remove photos
- [ ] **MGMT-03**: Business owner can add/replace video (1 max)
- [ ] **MGMT-04**: Business owner can edit contact links
- [ ] **MGMT-05**: Edits go live immediately (no verification in v1)

### Admin

- [ ] **ADM-01**: Admin routes are hidden (not in public navigation)
- [ ] **ADM-02**: Admin must log in to access admin features
- [ ] **ADM-03**: Admin can view list of pending business registrations
- [ ] **ADM-04**: Admin can approve a business (status → Approved, appears in directory)
- [ ] **ADM-05**: Admin can reject a business (status → Rejected, owner notified)

## v2 Requirements

### Engagement & Discovery

- **ENG-01**: Track profile page views
- **ENG-02**: Track contact button clicks
- **ENG-03**: Calculate engagement score per business
- **ENG-04**: Display "Popular" badge on top 3 businesses per category

### Contact Verification

- **VER-01**: Contact link edits require admin verification
- **VER-02**: Old contact details stay visible until new ones approved

### Multi-Admin

- **ADM-06**: Multiple admin users supported
- **ADM-07**: Admin activity log

### Premium Features

- **PREM-01**: AI-generated product descriptions
- **PREM-02**: AI-generated Instagram captions
- **PREM-03**: Additional video slots

## Out of Scope

| Feature | Reason |
|---------|--------|
| In-app checkout | Not a marketplace — businesses handle transactions externally |
| User messaging | Use existing channels (WhatsApp, Instagram, etc.) |
| Reviews or ratings | Adds moderation burden, defer to v2+ |
| Delivery or logistics | Out of scope for directory |
| Multi-estate in v1 | Architecture supports it, but v1 is WestScape only |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DIR-01 | — | Pending |
| DIR-02 | — | Pending |
| DIR-03 | — | Pending |
| DIR-04 | — | Pending |
| PROF-01 | — | Pending |
| PROF-02 | — | Pending |
| PROF-03 | — | Pending |
| PROF-04 | — | Pending |
| PROF-05 | — | Pending |
| CONT-01 | — | Pending |
| CONT-02 | — | Pending |
| CONT-03 | — | Pending |
| CONT-04 | — | Pending |
| AUTH-01 | — | Pending |
| AUTH-02 | — | Pending |
| AUTH-03 | — | Pending |
| REG-01 | — | Pending |
| REG-02 | — | Pending |
| REG-03 | — | Pending |
| REG-04 | — | Pending |
| REG-05 | — | Pending |
| MGMT-01 | — | Pending |
| MGMT-02 | — | Pending |
| MGMT-03 | — | Pending |
| MGMT-04 | — | Pending |
| MGMT-05 | — | Pending |
| ADM-01 | — | Pending |
| ADM-02 | — | Pending |
| ADM-03 | — | Pending |
| ADM-04 | — | Pending |
| ADM-05 | — | Pending |

**Coverage:**
- v1 requirements: 31 total
- Mapped to phases: 0
- Unmapped: 31 (will be mapped during roadmap creation)

---
*Requirements defined: 2026-01-22*
*Last updated: 2026-01-22 after initial definition*
