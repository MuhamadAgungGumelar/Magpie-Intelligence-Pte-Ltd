# E-commerce Analytics System

A full-stack analytics dashboard that synchronizes e-commerce data from external APIs and visualizes key business metrics in real-time.

## Tech Stack

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript
- **Job Orchestration**: Trigger.dev
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Charts**: Recharts
- **Styling**: TailwindCSS
- **Deployment**: Vercel / Railway

## Features

### Data Pipeline (Trigger.dev)
- Scheduled job runs every 1 hour
- Fetches data from mock e-commerce APIs:
  - Orders: `https://fake-store-api.mock.beeceptor.com/api/orders`
  - Products: `https://fake-store-api.mock.beeceptor.com/api/products`
- Upserts data to PostgreSQL with proper sync tracking

### Dashboard Analytics
- **4 Metric Cards**:
  - Total Revenue
  - Total Order Count
  - Average Order Value
  - Average Product Rating

- **2 Standard Charts**:
  - Orders by Status (Pie/Donut Chart)
  - Products by Category (Bar Chart)

- **2 Data Tables**:
  - Recent Orders (Latest 5)
  - Top Products (5 Highest Priced)

- **1 Custom Insight Chart**:
  - Revenue by Category

## Project Structure

```
ecommerce-analytics-system/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── (dashboard)/
│   │   │   └── dashboard/     # Main dashboard page
│   │   ├── api/               # API routes
│   │   │   ├── analytics/     # Analytics endpoints
│   │   │   └── sync/          # Manual sync trigger
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── dashboard/         # Dashboard-specific components
│   │   ├── common/            # Reusable common components
│   │   └── layout/            # Layout components
│   ├── lib/
│   │   ├── api/               # API client & queries
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Utility functions
│   └── jobs/
│       └── sync-ecommerce-data.ts  # Trigger.dev sync job
├── ERD.md                     # Entity Relationship Diagram
├── PRD.md                     # Product Requirements Document
├── .env.example               # Environment variables template
└── package.json
```

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (Supabase account)
- Trigger.dev account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ecommerce-analytics-system
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in the required environment variables:
- `DATABASE_URL`: Your Supabase PostgreSQL connection string
- `TRIGGER_API_KEY`: Your Trigger.dev API key
- `TRIGGER_API_URL`: Trigger.dev API URL

4. Set up the database:
```bash
npm run prisma:push
```

5. Generate Prisma Client:
```bash
npm run prisma:generate
```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### Trigger.dev Setup

1. Create a Trigger.dev account at [trigger.dev](https://trigger.dev)
2. Create a new project
3. Copy your API key and add it to `.env.local`
4. Deploy your Trigger.dev job:
```bash
npx trigger.dev@latest dev
```

### Database Management

View your database with Prisma Studio:
```bash
npm run prisma:studio
```

Create a new migration:
```bash
npm run prisma:migrate
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Railway

1. Create a new project on Railway
2. Connect your GitHub repository
3. Add environment variables
4. Deploy

## Database Schema

See [ERD.md](./ERD.md) for detailed entity relationship diagram and schema documentation.

## Product Requirements

See [PRD.md](./PRD.md) for detailed product requirements and implementation phases.

## API Endpoints

### Analytics

- `GET /api/analytics/metrics` - Get all metrics (revenue, orders, etc.)
- `GET /api/analytics/orders-by-status` - Orders grouped by status
- `GET /api/analytics/products-by-category` - Products grouped by category
- `GET /api/analytics/recent-orders` - Latest 5 orders
- `GET /api/analytics/top-products` - Top 5 highest priced products
- `GET /api/analytics/custom-insight` - Revenue by category

### Sync

- `POST /api/sync/trigger` - Manually trigger data sync

## Key Features & Design Decisions

1. **Upsert Pattern**: Uses Prisma upsert to handle both new and existing records efficiently
2. **Timestamp Tracking**: Three types of timestamps for complete audit trail
3. **Normalized Schema**: Separate OrderItems table for proper product-order relationships
4. **Performance**: Database indexes on frequently queried fields
5. **Error Handling**: Comprehensive error handling with sync logs
6. **Responsive Design**: Mobile-first approach with TailwindCSS

## Testing the Sync Job

To manually trigger a sync:
```bash
curl -X POST http://localhost:3000/api/sync/trigger
```

## Troubleshooting

### Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Ensure Supabase database is accessible
- Check if Prisma Client is generated

### Trigger.dev Job Not Running
- Verify your `TRIGGER_API_KEY` is correct
- Check Trigger.dev dashboard for job status
- Ensure you've deployed the job with `npx trigger.dev@latest dev`

### Charts Not Rendering
- Check browser console for errors
- Verify data is being fetched from API endpoints
- Ensure Recharts is properly installed

## Contributing

This project was created as a technical assessment for Magpie Intelligence Pte Ltd.

## License

Private - For assessment purposes only.
