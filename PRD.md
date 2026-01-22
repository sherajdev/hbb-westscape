# 📘 Product Requirements Document (PRD)

## Product Name
**HBB@WestScape**  
*(Home-Based Businesses at WestScape)*

---

## 1. Product Overview

**HBB@WestScape** is a community-first digital directory and marketplace for home-based businesses operating within the WestScape estate.

The platform enables residents to easily discover, browse, and contact local home-based businesses, while allowing business owners to promote their products and services **without needing technical knowledge, a website, or payment setup**.

The project is designed to:
- Be free to use for basic business listings
- Support non-technical business owners
- Be estate-specific (starting with WestScape)
- Serve as a reusable template for future estates

---

## 2. Problem Statement

Many home-based businesses:
- Operate informally
- Rely solely on Instagram, WhatsApp, or word-of-mouth
- Lack the skills or resources to build a website
- Struggle with visibility even within their own estate
- Cannot leverage AI tools for content creation

Residents:
- Are unaware of businesses operating nearby
- Want to support local sellers but don’t know where to find them

There is currently **no simple, trusted, estate-level platform** to bridge this gap.

---

## 3. Product Vision

To create a trusted local discovery platform that:
- Helps home-based businesses gain visibility
- Encourages residents to support local entrepreneurs
- Requires minimal effort and zero technical skills from business owners
- Can scale estate-by-estate using the same core system

---

## 4. Target Users

### 4.1 Primary Users – Business Owners
Home-based business owners in WestScape who:
- Run food, beauty, fusion, or service-based businesses
- Do not have a website
- Are not tech-savvy
- Want more local exposure

### 4.2 Secondary Users – Visitors / Residents
Residents and visitors who:
- Want to discover nearby businesses
- Prefer local, trusted services
- Want fast access to contact channels

---

## 5. Core Value Proposition

### For Business Owners
> Promote your home-based business online—no website, no tech skills, no cost.

### For Residents
> Discover and support trusted home-based businesses right in your estate.

---

## 6. Scope & Estate Strategy

### Initial Scope
- The first deployment is exclusive to **WestScape**
- Only businesses tagged to WestScape are visible

### Future Scope
- Same platform reused for other estates
- Each estate has its own business listings
- Single codebase, configurable per estate

---

## 7. Business Categories

Supported categories:
- Food
- Beauty
- Fusion
- Services

---

## 8. Core Features (MVP)

### 8.1 Public Business Directory
- No login required
- Displays all approved businesses in WestScape
- Shows:
  - Business name
  - Category
  - Short description
  - Badges (New / Popular)
- Category filtering available

---

### 8.2 Business Profile Page
Each business has a dedicated page displaying:
- Business name
- Category
- Description
- Photo gallery
- Video (if available)
- Contact button

---

### 8.3 Contact Modal (Key UX Feature)

- A single **Contact** button per business
- Opens a mini modal with icon-based links:
  - Phone
  - WhatsApp
  - Instagram
  - TikTok
  - Facebook
  - Carousell
  - Website (optional)

**Design Goals**
- Simple
- Mobile-friendly
- Clean UI
- Clear call-to-action

---

### 8.4 Business Owner Accounts

Business owners can:
- Sign up / log in
- Register one business
- Edit business details
- Upload media
- Manage contact links

**Default rule**
- One user → one business
- One business per address

Additional businesses per address:
- Require admin approval
- May become a premium feature in the future

---

### 8.5 Business Registration & Admin Approval

#### Registration Flow
1. Business owner signs up
2. Completes business registration form
3. Submits for approval
4. Admin reviews submission
5. Approved businesses go live

#### Business Statuses
- Draft
- Pending Approval
- Approved
- Pending Verification
- Rejected

---

### 8.6 Profile Editing & Verification Rules

#### Editable Anytime (Instant Live)
- Business description
- Photos
- Videos
- Product / service details

#### Requires Admin Verification
- Address
- Phone number
- WhatsApp number
- Primary contact links

**Behaviour**
- Old verified contact details remain visible
- New details go live only after admin approval

---

### 8.7 Media Rules

**Free Tier**
- Unlimited photos
- 1 video per business

**Premium (Future)**
- Additional videos

---

## 9. Discovery & Ranking Logic

### 9.1 New Business Tag
- Automatically applied to businesses registered within the last **30 days**
- Displayed on directory cards and profile pages

---

### 9.2 Popular Businesses

- Top **3 businesses per category**
- Determined by engagement score
- Displayed with a **Popular** badge

#### Engagement Weighting
| Action | Score |
|------|------|
| Profile page view | +1 |
| Contact button click | +3 |

- Scores calculated over a rolling time window (e.g. 30 days)
- Contact intent weighted higher than browsing

---

## 10. Admin Features (Hidden)

### Admin Access
- Hidden admin routes
- Login required
- Only Admin-role users can access

### Admin Capabilities
- Review new business registrations
- Approve or reject listings
- Verify contact detail changes
- Manage edge cases (e.g. multiple businesses per address)

---

## 11. Monetization Strategy (Future)

### Free Tier
- Business listing
- Media uploads (within limits)
- Contact links
- Directory visibility

### Premium Subscription (Optional)
- AI-powered content generation:
  - Product descriptions
  - Instagram captions
  - Promotional text
- Additional videos
- Possible future priority features (not paid ranking)

**Goal:** Cover AI API costs, not restrict platform access.

---

## 12. Non-Goals (v1)

The MVP will **not** include:
- In-app checkout
- User messaging
- Reviews or ratings
- Delivery or logistics
- Paid commissions
- Advanced analytics dashboards

---

## 13. Technical Stack (High-Level)

- Frontend: Next.js
- Backend & Database: Convex
- Authentication & Roles: Clerk
- Media Storage: Cloud storage
- Payments (Premium): Stripe (future)
- AI Features: External LLM APIs (future)

---

## 14. Success Metrics

- Number of registered businesses
- Number of approved listings
- Visitor traffic
- Contact button click rate
- Feedback from business owners
- Engagement growth over time

---

## 15. Guiding Principles

- Community-first
- Trust and verification over speed
- Simple UX over feature overload
- Learn-by-building
- Real value before monetization

---

## 16. Why This Project Matters

### For the Community
- Supports local entrepreneurship
- Improves visibility and trust

### For the Builder
- Real-world full-stack experience
- Strong portfolio project
- Practical learning with modern tools
- Foundation for future SaaS ideas
