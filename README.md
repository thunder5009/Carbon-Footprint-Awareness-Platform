# CarbonTrack

A science-backed, premium carbon footprint calculator and tracker. Understand your transport, energy, food, and waste emissions to discover the changes that matter most.

![CarbonTrack Architecture](https://via.placeholder.com/1200x630?text=CarbonTrack+Architecture)

## Features
- **Frictionless Calculator:** Estimate emissions in under 2 minutes.
- **Anonymous-First UX:** See full results before committing to sign up.
- **Dynamic Dashboards:** Monitor historical trends and compare against benchmarks.
- **Science-Backed Engine:** Real-world emission factors tailored to global averages.
- **Enterprise Edge:** Server Components, Edge rendering, and NextAuth security.

## Quick Start

Get the local development environment running in under 5 minutes.

### 1. Clone & Install
```bash
git clone https://github.com/your-org/carbon-track.git
cd carbon-track
npm install
```

### 2. Environment Variables
Copy the template and fill in your credentials.
```bash
cp .env.example .env.local
```

### 3. Database Migration
Spin up a local PostgreSQL instance or connect to a cloud database (Supabase), then push the schema.
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing Architecture

This repository strictly adheres to the 70/20/10 Testing Pyramid:
- **70% Unit Tests:** Calculation engine and Zod schemas (Vitest).
- **20% Integration Tests:** API routes and UI components (Vitest + RTL).
- **10% E2E Tests:** Critical paths, visual regression, and accessibility (Playwright).

**Run the Full Suite:**
```bash
npm run test           # Run Vitest unit & integration tests
npm run test:e2e       # Run Playwright E2E suite
```

## Deployment

CarbonTrack is optimized for **Vercel**.
1. Push to the `main` branch.
2. Vercel automatically builds the project (`npm run build`).
3. Migrations run automatically during the build step.
4. Edge middleware and ISR routes are automatically provisioned.

For detailed operational procedures, refer to [OPERATIONS.md](./OPERATIONS.md).
