# Product Requirements Document (PRD)
## E-commerce Analytics System

---

## 1. Project Overview

### 1.1 Purpose
Build a full-stack analytics dashboard that synchronizes e-commerce data from external APIs and visualizes key business metrics in real-time.

### 1.2 Tech Stack
- **Frontend**: Next.js 14 (App Router) + React + TypeScript
- **Backend**: Next.js API Routes + Trigger.dev
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Charts**: Recharts
- **UI Components**: Reusable components from existing codebase
- **Styling**: TailwindCSS
- **Deployment**: Vercel / Railway

---

## 2. Backend Requirements

### 2.1 Database Setup
**Priority: P0**

- Set up Supabase PostgreSQL database
- Configure Prisma schema with 4 main models:
  - Products
  - Orders
  - OrderItems
  - SyncLogs (optional)
- Implement proper relations between models
- Add indexes for performance optimization

**Acceptance Criteria:**
- Prisma schema is defined and migrated
- Database connection is established
- All relations work correctly

### 2.2 API Integration Layer
**Priority: P0**

Create API service layer to interact with external e-commerce APIs:

**Endpoints to integrate:**
- Products API: `https://fake-store-api.mock.beeceptor.com/api/products`
- Orders API: `https://fake-store-api.mock.beeceptor.com/api/orders`

**Requirements:**
- Type-safe API client using TypeScript
- Error handling and retry logic
- Response validation

**Acceptance Criteria:**
- Successfully fetch data from both endpoints
- Parse and validate API responses
- Handle network errors gracefully

### 2.3 Trigger.dev Job Orchestration
**Priority: P0**

**Scheduled Sync Job:**
- Job name: `sync-ecommerce-data`
- Schedule: Every 1 hour
- Tasks:
  1. Fetch products from API
  2. Fetch orders from API
  3. Upsert products to database
  4. Upsert orders and order items to database
  5. Log sync results

**Upsert Logic:**
- Use Prisma's `upsert` operation
- Match on unique identifier (id)
- Update existing records, insert new ones
- Add `synced_at` timestamp on each sync

**Acceptance Criteria:**
- Trigger.dev job is configured and deployed
- Job runs every 1 hour automatically
- Data is properly upserted (no duplicates)
- Sync logs are created for monitoring

### 2.4 API Routes (Next.js)
**Priority: P0**

**Dashboard Data API:**
```
GET /api/analytics/metrics
- Returns: Total Revenue, Order Count, Average Order Value, Average Product Rating

GET /api/analytics/orders-by-status
- Returns: Order count grouped by status

GET /api/analytics/products-by-category
- Returns: Product count grouped by category

GET /api/analytics/recent-orders
- Returns: Latest 5 orders with details

GET /api/analytics/top-products
- Returns: 5 highest priced products

GET /api/analytics/custom-insight
- Returns: Revenue by category (or custom metric)
```

**Manual Sync Trigger (Optional):**
```
POST /api/sync/trigger
- Manually trigger a sync job
```

**Acceptance Criteria:**
- All API routes return correct data
- Responses are properly typed
- Error handling is implemented
- Query performance is optimized

---

## 3. Frontend Requirements

### 3.1 Dashboard Page
**Priority: P0**

**Route:** `/dashboard` or `/`

**Layout Structure:**
```
┌─────────────────────────────────────────────────┐
│  Header (with title and sync status)           │
├─────────────────────────────────────────────────┤
│  Metric Cards (4 cards in a row)               │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │ Rev  │ │Orders│ │ AOV  │ │Rating│          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
├─────────────────────────────────────────────────┤
│  Charts Section (2 charts side by side)        │
│  ┌──────────────┐  ┌──────────────┐           │
│  │ Orders by    │  │ Products by  │           │
│  │ Status (Pie) │  │ Category(Bar)│           │
│  └──────────────┘  └──────────────┘           │
├─────────────────────────────────────────────────┤
│  Data Tables Section                            │
│  ┌──────────────────────────────────────┐      │
│  │ Recent Orders (Table)                │      │
│  └──────────────────────────────────────┘      │
│  ┌──────────────────────────────────────┐      │
│  │ Top Products (Table)                 │      │
│  └──────────────────────────────────────┘      │
├─────────────────────────────────────────────────┤
│  Custom Insight Chart                           │
│  ┌──────────────────────────────────────┐      │
│  │ Revenue by Category (Bar Chart)      │      │
│  └──────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

### 3.2 Components to Build/Reuse

**Reuse from existing codebase:**
- `SummaryCards` → Adapt for 4 metric cards
- `CategoryPieChart` → Adapt for Orders by Status
- `TimelineColumnChart` → Adapt for Products by Category
- `TableContainer` → Use for data tables
- `LoadingSpinner` → Loading states
- `ErrorAlert` → Error handling
- `Sidebar` + `Header` → Layout components

**New components to create:**
- `MetricCard` - Individual metric display
- `OrdersStatusChart` - Pie/Donut chart for order status
- `ProductsCategoryChart` - Bar chart for product categories
- `RecentOrdersTable` - Table showing latest orders
- `TopProductsTable` - Table showing top products
- `RevenueInsightChart` - Custom insight visualization

### 3.3 Data Fetching Strategy
**Priority: P0**

- Use React Server Components for initial data fetch
- Implement loading states with Suspense
- Add error boundaries for error handling
- Optional: Add auto-refresh every 5 minutes (client-side)

**Acceptance Criteria:**
- Dashboard loads with all data
- Loading states are shown during fetch
- Errors are handled gracefully
- Data updates reflect latest sync

### 3.4 Responsive Design
**Priority: P1**

- Mobile-first approach
- Metric cards: 1 column on mobile, 2 on tablet, 4 on desktop
- Charts: Stack vertically on mobile, side-by-side on desktop
- Tables: Horizontal scroll on mobile

**Acceptance Criteria:**
- Dashboard is usable on mobile (375px width)
- Tablet view (768px) looks good
- Desktop view (1024px+) is optimal

### 3.5 Dark Mode Support
**Priority: P2 (Nice to have)**

- Reuse existing dark mode implementation
- Ensure all charts work in dark mode
- Proper color contrast

---

## 4. Data Transformations

### 4.1 Metric Calculations

**Total Revenue:**
```typescript
SUM(orders.total_amount) WHERE status != 'cancelled'
```

**Total Order Count:**
```typescript
COUNT(orders) WHERE status != 'cancelled'
```

**Average Order Value:**
```typescript
Total Revenue / Total Order Count
```

**Average Product Rating:**
```typescript
AVG(products.rating) WHERE rating IS NOT NULL
```

### 4.2 Chart Data Transformations

**Orders by Status:**
```typescript
GROUP BY orders.status
COUNT(*) for each status
Format: [{ name: 'pending', value: 10 }, ...]
```

**Products by Category:**
```typescript
GROUP BY products.category
COUNT(*) for each category
Format: [{ category: 'Electronics', count: 15 }, ...]
```

**Revenue by Category (Custom Insight):**
```typescript
JOIN orders -> order_items -> products
GROUP BY products.category
SUM(order_items.price * order_items.quantity)
Format: [{ category: 'Electronics', revenue: 50000 }, ...]
```

---

## 5. Project Structure

```
e-commerce-analytics-system/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/
│   │   │       └── page.tsx
│   │   ├── api/
│   │   │   ├── analytics/
│   │   │   │   ├── metrics/route.ts
│   │   │   │   ├── orders-by-status/route.ts
│   │   │   │   ├── products-by-category/route.ts
│   │   │   │   ├── recent-orders/route.ts
│   │   │   │   ├── top-products/route.ts
│   │   │   │   └── custom-insight/route.ts
│   │   │   └── sync/
│   │   │       └── trigger/route.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── MetricCard.tsx
│   │   │   ├── OrdersStatusChart.tsx
│   │   │   ├── ProductsCategoryChart.tsx
│   │   │   ├── RecentOrdersTable.tsx
│   │   │   ├── TopProductsTable.tsx
│   │   │   └── RevenueInsightChart.tsx
│   │   ├── common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── ErrorAlert.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       └── Sidebar.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   ├── ecommerce.ts (API client)
│   │   │   └── analytics.ts (Analytics queries)
│   │   ├── types/
│   │   │   ├── product.ts
│   │   │   ├── order.ts
│   │   │   └── analytics.ts
│   │   └── utils/
│   │       └── prisma.ts (Prisma client singleton)
│   └── jobs/
│       └── sync-ecommerce-data.ts (Trigger.dev job)
├── .env.example
├── .env.local
├── ERD.md
├── PRD.md
└── package.json
```

---

## 6. Implementation Phases

### Phase 1: Setup & Infrastructure (Day 1, Hours 1-4)
- [ ] Set up Supabase database
- [ ] Configure Prisma schema
- [ ] Run migrations
- [ ] Set up Trigger.dev account and project
- [ ] Configure environment variables
- [ ] Clean up existing codebase (remove unused pages/components)

### Phase 2: Backend Development (Day 1, Hours 5-8 + Day 2, Hours 1-4)
- [ ] Create API client for external e-commerce APIs
- [ ] Build Trigger.dev sync job
- [ ] Test upsert logic
- [ ] Create Next.js API routes for analytics
- [ ] Test all endpoints

### Phase 3: Frontend Development (Day 2, Hours 5-8 + Day 3, Hours 1-4)
- [ ] Build metric cards component
- [ ] Build charts components (reuse existing)
- [ ] Build data tables
- [ ] Build custom insight chart
- [ ] Assemble dashboard page
- [ ] Add loading and error states
- [ ] Test responsive design

### Phase 4: Testing & Polish (Day 3, Hours 5-6)
- [ ] End-to-end testing
- [ ] Fix bugs
- [ ] Performance optimization
- [ ] Code cleanup

### Phase 5: Deployment & Documentation (Day 3, Hours 7-8)
- [ ] Deploy to Vercel/Railway
- [ ] Verify Trigger.dev job runs in production
- [ ] Create video demo
- [ ] Prepare submission

---

## 7. Success Metrics

- [ ] Trigger.dev job successfully runs every hour
- [ ] All 4 metric cards display correct values
- [ ] 2 standard charts render correctly
- [ ] 2 data tables show accurate data
- [ ] 1 custom insight chart provides business value
- [ ] Dashboard is responsive on mobile/tablet/desktop
- [ ] No console errors or warnings
- [ ] Application deploys successfully
- [ ] Video demo clearly explains architecture and decisions

---

## 8. Risk & Mitigation

**Risk 1:** External API returns unexpected data structure
- **Mitigation:** Add robust error handling and data validation with Zod schemas

**Risk 2:** Trigger.dev job fails silently
- **Mitigation:** Implement sync logs table and monitoring

**Risk 3:** Performance issues with large datasets
- **Mitigation:** Add database indexes, use pagination for tables, optimize queries

**Risk 4:** Deployment issues
- **Mitigation:** Test locally first, use environment variables properly, deploy early

---

## 9. Out of Scope

- User authentication (not required for this test)
- Data export functionality
- Advanced filtering/search
- Real-time updates (WebSockets)
- Multiple dashboard views
- Email notifications
- Unit/integration tests (optional but not required)
