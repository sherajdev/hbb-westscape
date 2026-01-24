# Phase 2: Public Directory - Research

**Researched:** 2026-01-24
**Domain:** Public-facing business directory with Next.js App Router, Convex, and React
**Confidence:** HIGH

## Summary

Phase 2 builds public-facing pages for browsing businesses without authentication. The research focused on Next.js 16 App Router patterns for public pages, Convex public query patterns, responsive UI components with Tailwind CSS, image/video handling, modal dialogs, and filtering interfaces.

**Key findings:**
- Next.js App Router uses Server Components by default, ideal for public directory pages
- Convex queries are public by default; authentication checks are optional within handlers
- Native HTML5 `<dialog>` element is now the recommended approach for modals (2024+)
- Next.js Image component handles optimization automatically but requires configuration for external URLs
- Tailwind CSS grid utilities provide responsive card layouts with breakpoint-specific columns
- Dynamic routes use `[param]` folders with async params access in Server Components

**Primary recommendation:** Use Server Components for all directory/profile pages, Client Components only for interactive elements (filter buttons, modal triggers). Keep component tree mostly server-rendered for optimal performance.

## Standard Stack

The established libraries/tools for this domain:

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Next.js | 16.1.4 | App Router framework | Already in use, handles SSR/SSG/routing |
| Convex | 1.31.6 | Backend/database | Already in use, real-time queries |
| React | 19.2.3 | UI library | Required by Next.js |
| Tailwind CSS | 4.1.18 | Styling | Already configured, utility-first CSS |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| lucide-react | Latest | Icon library | Contact modal icons, UI accents |
| react-player | Latest | Video embedding | Business profile video display |
| yet-another-react-lightbox | Latest | Image gallery lightbox | Photo gallery viewing (optional enhancement) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| lucide-react | heroicons | Heroicons designed for Tailwind, but Lucide has more icons and better tree-shaking docs |
| react-player | Native `<video>` | react-player handles multiple formats/platforms; native works for simple local videos |
| yet-another-react-lightbox | react-image-lightbox | YARL is more actively maintained (react-image-lightbox less so as of 2023) |
| Native `<dialog>` | Modal library | Native dialog has excellent browser support (2024+), no dependencies needed |

**Installation:**
```bash
npm install lucide-react react-player
# Optional for enhanced gallery:
npm install yet-another-react-lightbox
```

## Architecture Patterns

### Recommended Project Structure
```
app/
├── page.tsx                    # Homepage (can redirect to /directory or be landing page)
├── directory/
│   └── page.tsx               # Business listing page (Server Component)
└── business/
    └── [businessId]/
        └── page.tsx           # Business profile page (Server Component)

components/
├── directory/
│   ├── BusinessCard.tsx       # Server Component (card display)
│   ├── CategoryFilter.tsx     # Client Component (interactive filter)
│   └── BusinessGrid.tsx       # Server Component (grid layout)
└── business/
    ├── ContactModal.tsx       # Client Component (dialog interaction)
    ├── PhotoGallery.tsx       # Client Component (if using lightbox) or Server (if basic grid)
    └── VideoPlayer.tsx        # Client Component (react-player is client-side)

convex/
└── businesses.ts              # Add public queries
```

### Pattern 1: Public Convex Queries
**What:** Queries without authentication that filter for approved businesses only
**When to use:** Directory listing, business profile viewing
**Example:**
```typescript
// convex/businesses.ts
import { query } from "./_generated/server";
import { v } from "convex/values";

// Public query - no auth check, filters for approved only
export const listApprovedBusinesses = query({
  args: {
    category: v.optional(v.union(
      v.literal("Food"),
      v.literal("Beauty"),
      v.literal("Fusion"),
      v.literal("Services")
    )),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("businesses")
      .withIndex("by_status", (q) => q.eq("status", "approved"));

    const businesses = await q.collect();

    // Filter by category in code (since we need composite filtering)
    if (args.category) {
      return businesses.filter(b => b.category === args.category);
    }

    return businesses;
  },
});

export const getBusinessById = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);

    // Only return if approved (public safety)
    if (!business || business.status !== "approved") {
      return null;
    }

    return business;
  },
});
```

### Pattern 2: Server Component with Convex Query
**What:** Next.js Server Component using Convex for data fetching
**When to use:** Directory page, business profile page
**Example:**
```typescript
// app/directory/page.tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import BusinessGrid from "@/components/directory/BusinessGrid";

export default async function DirectoryPage() {
  // Fetch data in Server Component
  const businesses = await fetchQuery(api.businesses.listApprovedBusinesses, {});

  return (
    <main>
      <h1>Business Directory</h1>
      <BusinessGrid businesses={businesses} />
    </main>
  );
}
```

### Pattern 3: Client Component Filter with URL State
**What:** Client-side filter that updates URL params for shareable links
**When to use:** Category filtering in directory
**Example:**
```typescript
// components/directory/CategoryFilter.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "All";

  const categories = ["All", "Food", "Beauty", "Fusion", "Services"];

  const handleFilter = (category: string) => {
    if (category === "All") {
      router.push("/directory");
    } else {
      router.push(`/directory?category=${category}`);
    }
  };

  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => handleFilter(cat)}
          className={currentCategory === cat ? "active" : ""}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
```

### Pattern 4: Native Dialog Modal
**What:** HTML5 `<dialog>` element for contact modal
**When to use:** Contact button interaction
**Example:**
```typescript
// components/business/ContactModal.tsx
"use client";
import { useRef } from "react";
import { Phone, MessageCircle, Instagram, Music } from "lucide-react";

export default function ContactModal({
  contactInfo
}: {
  contactInfo: { phone?: string; whatsapp?: string; instagram?: string; }
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const openModal = () => dialogRef.current?.showModal();
  const closeModal = () => dialogRef.current?.close();

  return (
    <>
      <button onClick={openModal}>Contact</button>

      <dialog ref={dialogRef} onClick={(e) => {
        // Close on backdrop click
        if (e.target === dialogRef.current) closeModal();
      }}>
        <div className="p-6">
          <h2>Contact Us</h2>
          <div className="space-y-3">
            {contactInfo.phone && (
              <a href={`tel:${contactInfo.phone}`} className="flex items-center gap-2">
                <Phone size={20} />
                <span>Call</span>
              </a>
            )}
            {contactInfo.whatsapp && (
              <a
                href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MessageCircle size={20} />
                <span>WhatsApp</span>
              </a>
            )}
            {/* More contact links */}
          </div>
          <button onClick={closeModal}>Close</button>
        </div>
      </dialog>
    </>
  );
}
```

### Pattern 5: Convex Storage Image URLs
**What:** Generate public URLs for images stored in Convex
**When to use:** Displaying business photos
**Example:**
```typescript
// convex/businesses.ts
export const getBusinessWithImages = query({
  args: { businessId: v.id("businesses") },
  handler: async (ctx, args) => {
    const business = await ctx.db.get(args.businessId);
    if (!business || business.status !== "approved") return null;

    // Generate URLs for images
    const imageUrls = business.imageStorageIds
      ? await Promise.all(
          business.imageStorageIds.map(id => ctx.storage.getUrl(id))
        )
      : [];

    const videoUrl = business.videoStorageId
      ? await ctx.storage.getUrl(business.videoStorageId)
      : null;

    return {
      ...business,
      imageUrls,
      videoUrl,
    };
  },
});
```

### Pattern 6: Dynamic Route with Params
**What:** Business profile page with dynamic ID
**When to use:** Individual business pages
**Example:**
```typescript
// app/business/[businessId]/page.tsx
import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

type Params = Promise<{ businessId: string }>;

export default async function BusinessPage({ params }: { params: Params }) {
  const { businessId } = await params;

  const business = await fetchQuery(api.businesses.getBusinessWithImages, {
    businessId: businessId as Id<"businesses">,
  });

  if (!business) {
    return <div>Business not found</div>;
  }

  return (
    <main>
      <h1>{business.name}</h1>
      {/* Profile content */}
    </main>
  );
}
```

### Pattern 7: Responsive Grid Layout
**What:** Tailwind CSS grid that adapts to screen size
**When to use:** Business card grid
**Example:**
```typescript
// components/directory/BusinessGrid.tsx
export default function BusinessGrid({ businesses }: { businesses: any[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {businesses.map((business) => (
        <BusinessCard key={business._id} business={business} />
      ))}
    </div>
  );
}
```

### Pattern 8: "New" Badge with Timestamp Logic
**What:** Display badge if business registered within 30 days
**When to use:** Business cards
**Example:**
```typescript
// components/directory/BusinessCard.tsx
function isNew(createdAt: number): boolean {
  const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
  return createdAt > thirtyDaysAgo;
}

export default function BusinessCard({ business }: { business: any }) {
  const showNewBadge = isNew(business.createdAt);

  return (
    <div className="border rounded-lg p-4">
      {showNewBadge && <span className="badge">New</span>}
      <h3>{business.name}</h3>
      {/* Card content */}
    </div>
  );
}
```

### Anti-Patterns to Avoid
- **Using Client Components everywhere:** Default to Server Components, only use "use client" for interactivity
- **Fetching in useEffect:** Use Server Components with async/await for data fetching
- **Not filtering approved status:** Always filter for status: "approved" in public queries
- **Missing alt text on images:** Every Next.js Image must have descriptive alt text
- **Hardcoding image dimensions without responsive handling:** Use Next.js Image with proper sizing strategy
- **Not validating dynamic route params:** Always check if business exists and is approved

## Don't Hand-Roll

Problems that look simple but have existing solutions:

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Video player controls | Custom HTML5 video controls | react-player | Handles multiple formats, platforms (YouTube, Vimeo), HLS/DASH, accessibility |
| Image optimization | Manual srcset/sizes | Next.js Image component | Automatic WebP conversion, lazy loading, blur placeholder, responsive sizing |
| Modal accessibility | Custom modal with div overlay | Native `<dialog>` element | Built-in focus trap, ESC key handling, backdrop, a11y attributes |
| Icon SVGs | Copy/paste SVG code | lucide-react or heroicons | Tree-shakeable, consistent sizing, typed React components |
| Timestamp formatting | Date.now() - createdAt math | Date calculations or date-fns | Time zones, edge cases, localization |
| Cursor pagination | Manual offset/limit | Convex .paginate() | Real-time updates, cursor management, optimal performance |
| URL schema handling | String concatenation for links | Standard URL schemas (tel:, https://wa.me/) | Cross-platform compatibility, proper encoding |

**Key insight:** Modern React/Next.js ecosystem has mature solutions for common UI patterns. Custom implementations add maintenance burden and miss edge cases (accessibility, browser compatibility, performance optimization).

## Common Pitfalls

### Pitfall 1: Hydration Mismatch with Modals
**What goes wrong:** Rendering modal in Server Component causes hydration error
**Why it happens:** Modal state (open/closed) differs between server and client initial render
**How to avoid:**
- Use Client Component for modal (mark with "use client")
- Don't render modal content on server (use `useEffect` or state to control visibility)
- Or use native `<dialog>` with `showModal()` called only on client
**Warning signs:** Console error "Text content does not match server-rendered HTML" or "Hydration failed"

### Pitfall 2: Missing Next.js Image Configuration for Convex URLs
**What goes wrong:** Next.js Image component rejects Convex storage URLs
**Why it happens:** Next.js requires allowlist for external image domains (security)
**How to avoid:**
```typescript
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.convex.cloud',
        pathname: '/**',
      },
    ],
  },
};
```
**Warning signs:** Error "Invalid src prop" or images not displaying

### Pitfall 3: Using Client Hooks in Server Components
**What goes wrong:** useState, useEffect, useRouter in Server Component causes error
**Why it happens:** Server Components don't support client-side React hooks
**How to avoid:**
- Add "use client" directive at top of file for components using hooks
- Keep Server Components for data fetching, Client Components for interactivity
- Split components: Server parent passes data to Client child
**Warning signs:** Error "You're importing a component that needs useState"

### Pitfall 4: Not Awaiting Params in Dynamic Routes
**What goes wrong:** Accessing params.businessId directly instead of awaiting
**Why it happens:** In Next.js 16 App Router, params is a Promise
**How to avoid:**
```typescript
// WRONG
export default function Page({ params }: { params: { id: string } }) {
  const id = params.id; // Error!
}

// CORRECT
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
}
```
**Warning signs:** TypeScript error or runtime error accessing params

### Pitfall 5: Fetching Too Much Data Without Filtering
**What goes wrong:** Querying all businesses then filtering in React component
**Why it happens:** Not using Convex indexes or filtering in query
**How to avoid:**
- Use `.withIndex("by_status")` to filter approved businesses in database
- For category filtering, either add to query or use `.filter()` in Convex handler
- Don't `.collect()` unbounded queries; use `.take()` or `.paginate()`
**Warning signs:** Slow page loads, Convex dashboard showing large query results

### Pitfall 6: WhatsApp URL Format Errors
**What goes wrong:** WhatsApp link doesn't open app correctly
**Why it happens:** Phone number includes spaces, dashes, or missing country code
**How to avoid:**
```typescript
// WRONG
<a href={`https://wa.me/${contactWhatsApp}`}>WhatsApp</a>

// CORRECT - strip non-digits, ensure international format
const cleanPhone = contactWhatsApp.replace(/[^0-9]/g, '');
<a href={`https://wa.me/${cleanPhone}`}>WhatsApp</a>
```
**Warning signs:** Link opens browser instead of WhatsApp app

### Pitfall 7: Filter State Not Synced with URL
**What goes wrong:** Filtering works but URL doesn't update; can't share filtered view
**Why it happens:** Filter state stored in useState instead of URL params
**How to avoid:**
```typescript
// Use searchParams and router to sync with URL
const searchParams = useSearchParams();
const router = useRouter();
const category = searchParams.get("category") || "All";

const handleFilter = (cat: string) => {
  const params = new URLSearchParams(searchParams);
  if (cat === "All") {
    params.delete("category");
  } else {
    params.set("category", cat);
  }
  router.push(`/directory?${params.toString()}`);
};
```
**Warning signs:** Browser back/forward doesn't update filter; URL doesn't show filter state

### Pitfall 8: Missing Image Alt Text
**What goes wrong:** Accessibility issues, SEO penalties, console warnings
**Why it happens:** Forgetting alt prop on Next.js Image component
**How to avoid:**
- Always provide descriptive alt text: `alt={business.name + " business photo"}`
- For decorative images, use empty string: `alt=""`
- Never use placeholder text like "image" or "photo"
**Warning signs:** Console warning "Image elements must have an alt prop"

## Code Examples

Verified patterns from official sources:

### Responsive Image with Next.js
```typescript
// Source: https://nextjs.org/docs/app/api-reference/components/image
import Image from 'next/image';

export default function BusinessPhoto({ src, alt }: { src: string; alt: string }) {
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
```

### Convex Paginated Query
```typescript
// Source: https://docs.convex.dev/database/pagination
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const listBusinessesPaginated = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("businesses")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .paginate(args.paginationOpts);
  },
});
```

### Tailwind Responsive Grid
```typescript
// Source: https://tailwindcss.com/docs/grid-template-columns
// Tailwind utility classes for responsive card grid
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  {/* Cards auto-flow into grid */}
</div>
```

### Category Filter Pills
```typescript
// Source: Tailwind CSS category filter patterns
<div className="flex gap-2 overflow-x-auto pb-2">
  {categories.map((category) => (
    <button
      key={category}
      onClick={() => handleFilter(category)}
      className={`
        px-4 py-2 rounded-full whitespace-nowrap transition-colors
        ${selected === category
          ? 'bg-blue-600 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }
      `}
    >
      {category}
    </button>
  ))}
</div>
```

### Contact Links with Icons
```typescript
// Source: lucide-react documentation
import { Phone, MessageCircle, Instagram, Music, Facebook, Globe } from 'lucide-react';

const contactLinks = [
  { type: 'phone', icon: Phone, href: `tel:${phone}`, label: 'Call' },
  { type: 'whatsapp', icon: MessageCircle, href: `https://wa.me/${whatsapp}`, label: 'WhatsApp' },
  { type: 'instagram', icon: Instagram, href: instagram, label: 'Instagram' },
  { type: 'tiktok', icon: Music, href: tiktok, label: 'TikTok' },
  { type: 'facebook', icon: Facebook, href: facebook, label: 'Facebook' },
  { type: 'website', icon: Globe, href: website, label: 'Website' },
];

<div className="space-y-3">
  {contactLinks.map(({ type, icon: Icon, href, label }) => (
    href && (
      <a
        key={type}
        href={href}
        target={type !== 'phone' ? '_blank' : undefined}
        rel={type !== 'phone' ? 'noopener noreferrer' : undefined}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50"
      >
        <Icon size={24} />
        <span>{label}</span>
      </a>
    )
  ))}
</div>
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Custom modal libraries | Native `<dialog>` element | 2024 | No dependencies, built-in a11y, focus trap |
| Client-side data fetching (useEffect) | Server Components with async/await | Next.js 13+ (2022) | Better SEO, faster initial load, less client JS |
| Image srcset manual | Next.js Image component | Next.js 10+ (2020) | Automatic optimization, WebP, lazy loading |
| Offset/limit pagination | Cursor-based pagination | Modern APIs (2020+) | Real-time safe, no duplicate/missing items |
| Context + reducer for filters | URL searchParams | Modern React Router (2021+) | Shareable links, browser history works |
| priority prop for LCP images | preload prop | Next.js 16 (2025) | Renamed for clarity |

**Deprecated/outdated:**
- **react-modal library:** Native `<dialog>` element preferred (as of 2024 with broad browser support)
- **getStaticProps/getServerSideProps:** Use Server Components in App Router instead
- **next/legacy/image:** Use next/image (modern component)
- **styled-jsx for Image styling:** Doesn't work with Next.js Image; use className or style prop
- **Image priority prop:** Renamed to preload in Next.js 16

## Open Questions

Things that couldn't be fully resolved:

1. **Photo Gallery Lightbox Library Choice**
   - What we know: yet-another-react-lightbox is well-maintained, react-image-lightbox less so
   - What's unclear: Whether project needs full lightbox or simple grid is sufficient
   - Recommendation: Start with simple grid (click to open in new tab), add lightbox in later phase if needed

2. **Video Player vs Native Video Element**
   - What we know: react-player handles multiple formats/platforms; native `<video>` simpler
   - What's unclear: Whether businesses will upload only MP4 or need YouTube/Vimeo support
   - Recommendation: Use react-player for flexibility; if all videos are MP4 from Convex storage, could simplify to native

3. **Pagination Necessity**
   - What we know: Convex has excellent pagination support
   - What's unclear: Expected number of businesses (if < 100, pagination not needed initially)
   - Recommendation: Start with .collect() or .take(100), add pagination if directory grows beyond comfortable limit

4. **Image Placeholder Strategy**
   - What we know: Next.js Image supports blur placeholders
   - What's unclear: Whether to show placeholder image for businesses without photos or require minimum 1 photo
   - Recommendation: Define in requirements; likely show placeholder with camera icon

## Sources

### Primary (HIGH confidence)
- [Convex File Storage](https://docs.convex.dev/file-storage/serve-files) - Image URL generation, access control
- [Convex Authentication](https://docs.convex.dev/auth) - Public query patterns
- [Convex Pagination](https://docs.convex.dev/database/pagination) - Cursor-based pagination
- [Next.js Image Component](https://nextjs.org/docs/app/api-reference/components/image) - Props, usage, configuration
- [Next.js Dynamic Routes](https://nextjs.org/docs/app/api-reference/file-conventions/dynamic-routes) - Params handling, async access
- lucide-react (npm documentation) - Icon library usage

### Secondary (MEDIUM confidence)
- [Croct: Best React Modal Libraries 2026](https://blog.croct.com/post/best-react-modal-dialog-libraries) - Native dialog recommendation
- [Vercel: Common Next.js App Router Mistakes](https://vercel.com/blog/common-mistakes-with-the-next-js-app-router-and-how-to-fix-them) - Server/Client Component pitfalls
- [Stack Convex: Authorization Best Practices](https://stack.convex.dev/authorization) - Public function patterns
- [Tailwind CSS Grid Documentation](https://tailwindcss.com/docs/grid-template-columns) - Responsive grid patterns
- [Croct: Best React Video Libraries 2026](https://blog.croct.com/post/best-react-video-libraries) - react-player recommendation

### Tertiary (LOW confidence)
- WebSearch results for WhatsApp URL schema - Verified https://wa.me/ format but marked LOW for comprehensive best practices
- WebSearch results for timestamp libraries - Multiple options (react-time-ago, date-fns) but implementation details need verification

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use or well-documented official libraries
- Architecture: HIGH - Patterns verified from official Next.js, Convex, React documentation
- Pitfalls: HIGH - Based on official documentation and verified community sources (Vercel blog)
- Code examples: HIGH - All examples from official documentation or verified sources

**Research date:** 2026-01-24
**Valid until:** 2026-02-23 (30 days - Next.js/React ecosystem is relatively stable)

**Notes:**
- Next.js 16 released recently (blog post dated Jan 6, 2026); params Promise pattern is current
- Native `<dialog>` element achieved broad support in 2024; safe to use
- Convex patterns verified from official documentation dated 2026
- Tailwind CSS 4.x uses new @import syntax (already in project's globals.css)
