# Flex Living Reviews Dashboard - Project Specifications & Implementation Guide

**Version**: 1.0
**Created**: For LLM Agent Implementation
**Purpose**: Source of truth for step-by-step development

---

## 🎯 Project Overview

### Core Objective

Build a comprehensive Reviews Dashboard for Flex Living property managers to assess property performance and manage guest review display.

### Key Success Metrics

- Normalize and display review data from multiple channels
- Provide intuitive filtering and approval workflow
- Replicate Flex Living's property page design
- Maintain 95+ Lighthouse performance score
- Ensure end-to-end type safety

---

## 📋 Technical Specifications

### Tech Stack (Non-Negotiable)

```json
{
  "framework": "Next.js 15 with App Router",
  "language": "TypeScript",
  "api": "tRPC (T3 Stack)",
  "database": "Drizzle + PostgreSQL (dev) / PostgreSQL (prod)",
  "styling": "Tailwind CSS",
  "components": "Shadcn/UI",
  "icons": "Lucide React"
}
```

### Environment Requirements

```bash
Node.js: >= 18.x
Package Manager: npm/yarn/pnpm
Database: PostgreSQL (development)
```

### Required Environment Variables

```env
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
DATABASE_URL="postgresql://postgres:yYV3InjsIQC1jO1H@localhost:5432/flex-living"
GOOGLE_PLACES_API_KEY=optional_for_research
NEXTAUTH_SECRET=generate_random_string
NEXTAUTH_URL=http://localhost:3000
```

---

## 🏗️ Project Structure (Exact Implementation)

```
└── flex-living
    └── drizzle
        └── meta
            ├── _journal.json
            ├── 0000_snapshot.json
        ├── 0000_volatile_hercules.sql
    └── public
        ├── favicon.ico
        ├── logo-slogan.png
        ├── logo.png
        ├── logo.svg
    └── src
        └── app
            └── _components
                ├── post.tsx
            └── api
                └── auth
                    └── [...nextauth]
                        ├── route.ts
                └── trpc
                    └── [trpc]
                        ├── route.ts
            └── privacy
                ├── page.tsx
            └── terms
                ├── page.tsx
            ├── .DS_Store
            ├── layout.tsx
            ├── page.tsx
        └── lib
            ├── utils.ts
        └── server
            └── api
                └── routers
                    ├── post.ts
                ├── root.ts
                ├── trpc.ts
            └── auth
                ├── config.ts
                ├── index.ts
            └── db
                ├── index.ts
                ├── schema.ts
        └── styles
            ├── globals.css
        └── trpc
            ├── query-client.ts
            ├── react.tsx
            ├── server.ts
        ├── .DS_Store
        ├── env.js
    ├── .env
    ├── .gitignore
    ├── bun.lock
    ├── components.json
    ├── drizzle.config.ts
    ├── eslint.config.js
    ├── next-env.d.ts
    ├── next.config.js
    ├── package.json
    ├── postcss.config.js
    ├── prettier.config.js
    ├── project-specifications-implementation-guide.md
    ├── README.md
    ├── start-database.sh
    └── tsconfig.json
```

---

## 📊 Data Models & Schema

### Drizzle Schema is in `src/server/db/schema.ts`

### TypeScript Interfaces

#### Core Review Interface

```typescript
interface NormalizedReview {
  id: string;
  externalId: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  rating: number | null;
  overallRating: number | null;
  comment: string;
  channel: "hostaway" | "google" | "airbnb";
  reviewType: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "draft";
  isApproved: boolean;
  submittedAt: Date;
  categories: ReviewCategory[];
}

interface ReviewCategory {
  id: string;
  category:
    | "cleanliness"
    | "communication"
    | "respect_house_rules"
    | "location"
    | "value";
  rating: number; // 1-10 scale from Hostaway, normalize to 1-5 if needed
}
```

#### Hostaway API Response

```typescript
interface HostawayApiResponse {
  status: "success" | "error";
  result: HostawayReview[];
}

interface HostawayReview {
  id: number;
  type: "host-to-guest" | "guest-to-host";
  status: "published" | "pending" | "draft";
  rating: number | null;
  publicReview: string;
  reviewCategory: Array<{
    category: string;
    rating: number;
  }>;
  submittedAt: string; // ISO date string
  guestName: string;
  listingName: string;
}
```

---

## 🚀 Implementation Phases

### Phase 1: Project Foundation (Tasks 1-6)

**Estimated Time**: 2-3 hours
**Goal**: Set up project structure and basic configuration

### Phase 2: API & Data Layer (Tasks 7-12)

**Estimated Time**: 3-4 hours
**Goal**: Implement tRPC, database, and Hostaway integration

### Phase 3: Manager Dashboard (Tasks 13-20)

**Estimated Time**: 4-5 hours
**Goal**: Build complete manager interface with filtering and approval

### Phase 4: Public Display (Tasks 21-25)

**Estimated Time**: 2-3 hours
**Goal**: Create property page with reviews section

### Phase 5: Research & Polish (Tasks 26-30)

**Estimated Time**: 2-3 hours
**Goal**: Google Reviews research and final improvements

---

## 📝 Detailed Task Breakdown

### **PHASE 1: PROJECT FOUNDATION**

#### Task 1: Initialize Next.js Project

```bash
npx create-next-app@latest flex-living-reviews --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
cd flex-living-reviews
```

#### Task 2: Install Dependencies

```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next @tanstack/react-query
npm install prisma @prisma/client
npm install zod
npm install @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-button @radix-ui/react-calendar @radix-ui/react-card @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-input @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-sheet @radix-ui/react-switch @radix-ui/react-table @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip
npm install lucide-react
npm install class-variance-authority clsx tailwind-merge
npm install date-fns
```

#### Task 3: Configure Shadcn/UI

```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label table select dialog toast tabs badge separator
```

#### Task 4: Set up Environment Configuration

**File**: `.env.local`

```env
HOSTAWAY_ACCOUNT_ID="61148"
HOSTAWAY_API_KEY="f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152"
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=http://localhost:3000
```

#### Task 5: Configure Tailwind CSS

**File**: `tailwind.config.js` - Add custom theme extensions for Flex Living brand colors

#### Task 6: Set up TypeScript Configuration

**File**: `tsconfig.json` - Ensure strict mode and proper path aliases

### **PHASE 2: API & DATA LAYER**

#### Task 7: Initialize Prisma

```bash
npx prisma init
npx prisma generate
```

#### Task 1: Create Database Schema

**File**: `src/server/db/schema.ts` - Implement the complete schema from specifications above

#### Task 9: Set up tRPC Configuration

**File**: `src/server/trpc.ts`

```typescript
import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

export const router = t.router;
export const publicProcedure = t.procedure;
```

#### Task 10: Create tRPC Root Router

**File**: `src/server/api/root.ts`

```typescript
import { createTRPCRouter } from "./trpc";
import { reviewsRouter } from "./routers/reviews";
import { propertiesRouter } from "./routers/properties";

export const appRouter = createTRPCRouter({
  reviews: reviewsRouter,
  properties: propertiesRouter,
});

export type AppRouter = typeof appRouter;
```

#### Task 11: Implement Hostaway API Integration

**File**: `src/lib/hostaway.ts`

```typescript
const HOSTAWAY_API_BASE = "https://api.hostaway.com/v1";

export async function fetchHostawayReviews() {
  const response = await fetch(`${HOSTAWAY_API_BASE}/reviews`, {
    headers: {
      Authorization: `Bearer ${process.env.HOSTAWAY_API_KEY}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    // Return mock data for development
    return getMockReviewData();
  }

  return response.json();
}

function getMockReviewData() {
  // Implementation with realistic mock data
}
```

#### Task 12: Create Required API Endpoint

**File**: `src/app/api/reviews/hostaway/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { fetchHostawayReviews } from "@/lib/hostaway";

export async function GET(request: NextRequest) {
  try {
    const reviews = await fetchHostawayReviews();
    const normalizedReviews = normalizeReviewData(reviews);

    return NextResponse.json({
      status: "success",
      data: normalizedReviews,
      count: normalizedReviews.length,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "error", message: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}
```

### **PHASE 3: MANAGER DASHBOARD**

#### Task 13: Create Reviews Router

**File**: `src/server/api/routers/reviews.ts`

```typescript
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const reviewsRouter = createTRPCRouter({
  getAll: publicProcedure
    .input(
      z.object({
        filters: z
          .object({
            rating: z.array(z.number()).optional(),
            channel: z.string().optional(),
            dateRange: z
              .object({
                from: z.date().optional(),
                to: z.date().optional(),
              })
              .optional(),
          })
          .optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      // Implementation
    }),

  approve: publicProcedure
    .input(
      z.object({
        reviewId: z.string(),
        isApproved: z.boolean(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      // Implementation
    }),
});
```

#### Task 14: Create Dashboard Layout Component

**File**: `src/components/dashboard/ReviewsDashboard.tsx`

- Header with title and sync button
- Filter controls section
- Performance metrics cards
- Reviews table with pagination

#### Task 15: Implement Filter Controls

**File**: `src/components/dashboard/FilterControls.tsx`

- Rating filter (1-5 stars)
- Channel filter dropdown
- Date range picker
- Property selector
- Clear filters button

#### Task 16: Build Reviews Table

**File**: `src/components/dashboard/ReviewsTable.tsx`

- Sortable columns: Date, Property, Guest, Rating, Status
- Approval toggle switches
- Bulk selection capabilities
- Row actions (view, approve, reject)

#### Task 17: Create Performance Metrics

**File**: `src/components/dashboard/PerformanceMetrics.tsx`

- Average rating by property
- Review volume trends
- Channel distribution
- Approval rate statistics

#### Task 18: Implement Dashboard Page

**File**: `src/app/dashboard/page.tsx`

```typescript
'use client';

import { ReviewsDashboard } from '@/components/dashboard/ReviewsDashboard';
import { api } from '@/lib/api';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <ReviewsDashboard />
    </div>
  );
}
```

#### Task 19: Add Loading and Error States

- Skeleton components for table rows
- Error boundaries with retry functionality
- Loading spinners for async operations

#### Task 20: Implement Bulk Actions

- Select all/none functionality
- Bulk approve/disapprove reviews
- Export selected reviews to CSV

### **PHASE 4: PUBLIC DISPLAY**

#### Task 21: Research Flex Living Design System

- Analyze existing property pages
- Extract color palette and typography
- Identify component patterns

#### Task 22: Create Property Layout Component

**File**: `src/components/property/PropertyLayout.tsx`

- Replicate Flex Living header structure
- Property details section
- Navigation breadcrumbs
- Responsive grid system

#### Task 23: Build Reviews Section

**File**: `src/components/property/ReviewsSection.tsx`

- Section header with average rating
- Review filtering (newest first, highest rated)
- Review cards grid
- Load more pagination

#### Task 24: Create Review Card Component

**File**: `src/components/property/ReviewCard.tsx`

- Guest name and date
- Star rating display
- Review comment
- Category ratings (if available)
- Responsive design

#### Task 25: Implement Property Page

**File**: `src/app/property/[id]/page.tsx`

```typescript
import { PropertyLayout } from '@/components/property/PropertyLayout';
import { ReviewsSection } from '@/components/property/ReviewsSection';
import { api } from '@/lib/api';

export default async function PropertyPage({ params }: { params: { id: string } }) {
  // Only show approved reviews
  return (
    <PropertyLayout propertyId={params.id}>
      <ReviewsSection propertyId={params.id} showOnlyApproved={true} />
    </PropertyLayout>
  );
}
```

### **PHASE 5: RESEARCH & POLISH**

#### Task 26: Google Places API Research

**File**: `src/lib/google-places.ts`

```typescript
// Research implementation for Google Places API
// Document findings in comments
async function fetchGoogleReviews(placeId: string) {
  // Implementation notes and limitations
}
```

#### Task 27: Create Documentation

**File**: `GOOGLE_REVIEWS_RESEARCH.md`

- API capabilities and limitations
- Implementation approach
- Rate limits and costs
- Integration recommendations

#### Task 28: Add Error Handling

- API error boundaries
- Fallback UI components
- User-friendly error messages
- Retry mechanisms

#### Task 29: Performance Optimization

- Image optimization for review avatars
- Lazy loading for review lists
- Database query optimization
- Bundle size analysis

#### Task 30: Final Testing & Validation

- Cross-browser testing
- Mobile responsiveness
- Accessibility audit
- Performance testing (Lighthouse)

---

## 🔍 Key Implementation Notes

### Data Normalization Rules

1. **Rating Scale**: Convert Hostaway 1-10 to 1-5 scale by dividing by 2
2. **Date Handling**: Parse ISO strings to Date objects
3. **Text Sanitization**: Clean HTML tags from review text
4. **Category Mapping**: Map Hostaway categories to standard categories

### UI/UX Guidelines

1. **Responsive Design**: Mobile-first approach with breakpoints at 768px, 1024px
2. **Accessibility**: ARIA labels, keyboard navigation, color contrast ratios
3. **Loading States**: Skeleton screens, progressive loading
4. **Error Handling**: Graceful degradation with user-friendly messages

### Performance Targets

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 250KB gzipped

---

## ✅ Success Criteria

### Functional Requirements

- [ ] All reviews display correctly in dashboard
- [ ] Filtering and sorting work as expected
- [ ] Approval system functions properly
- [ ] Public pages show only approved reviews
- [ ] Required API endpoint returns normalized data

### Technical Requirements

- [ ] Type-safe throughout (no `any` types)
- [ ] Responsive design works on all devices
- [ ] 95+ Lighthouse performance score
- [ ] Error handling covers all edge cases
- [ ] Database queries are optimized

### Code Quality

- [ ] Clean, readable code with proper comments
- [ ] Consistent naming conventions
- [ ] Proper error boundaries
- [ ] Comprehensive TypeScript types
- [ ] Efficient component structure

---

## 🚨 Critical Implementation Points

1. **Required Endpoint**: `/api/reviews/hostaway` MUST return the exact format specified, do not create /api/endpoint , use the TRPc routers instead
2. **Mock Data**: Use realistic mock data since Hostaway sandbox is empty
3. **Approval Flow**: Reviews default to unapproved, managers must explicitly approve
4. **Performance**: Optimize for large datasets (1000+ reviews)
5. **Type Safety**: Maintain end-to-end TypeScript coverage

---

This specification serves as the single source of truth for implementation. Each task should be completed in sequence, with validation before proceeding to the next phase.
