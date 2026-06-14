# SRE Operations Runbook

This document outlines the operational procedures for monitoring, alerting, and incident response for the CarbonTrack production environment.

## 1. Monitoring & Observability

### Vercel Analytics (RUM)
Real User Metrics (RUM) are tracked via `@vercel/analytics` and `@vercel/speed-insights`.
- **Target LCP:** < 2.5s (Enforced via Lighthouse CI).
- **Target CLS:** < 0.1.

### Sentry Error Tracking
`@sentry/nextjs` is configured to catch unhandled exceptions across the Client, Server, and Edge environments.
- **Source Maps:** Automatically uploaded during Vercel builds.
- **Session Replay:** Configured with strict privacy masks (`maskAllText: true`, `blockAllMedia: true`).

## 2. Alerting Thresholds

Alerts should be configured in Sentry/Vercel to page the on-call engineer under the following conditions:
- **Error Rate:** > 1% over a 5-minute window.
- **Latency (p95):** > 500ms on `/api/footprint/calc`.
- **Healthcheck:** `/api/health` returning non-200.

## 3. Incident Response Runbook

### Scenario A: Database Connection Exhaustion (HTTP 500s on API routes)
**Symptoms:** Prisma throws `Timeout fetching a new connection from the connection pool`.
**Action:**
1. Verify Supavisor (connection pooler) status in the Supabase dashboard.
2. If connection spikes are malicious, identify the IP in Vercel logs and block via Vercel Edge Firewall.
3. If legitimate load, increase the Prisma connection pool limit temporarily (`?connection_limit=50` in `.env`).

### Scenario B: Accidental Data Loss / Corruption
**Symptoms:** User data corrupted via bad migration or application bug.
**Action:**
1. **STOP THE BLEEDING:** Revert the deployment in Vercel instantly using "Instant Rollback".
2. **RECOVER:** Utilize Supabase Point-in-Time Recovery (PITR). Restore the database to the minute prior to the deployment.

### Scenario C: Rate Limit Exhaustion (HTTP 429s for legitimate users)
**Symptoms:** Sudden influx of `429 Too Many Requests`.
**Action:**
1. Adjust the `rateLimitMax` threshold in `src/lib/utils/rate-limit.ts`.
2. Push a hotfix. Vercel will deploy this in ~40 seconds.

## 4. Disaster Recovery
- **Database:** Supabase automatically performs daily physical backups and maintains WAL logs for PITR.
- **Infrastructure:** The application is entirely stateless. If Vercel experiences a regional outage, Edge routing automatically fails over to available regions.
