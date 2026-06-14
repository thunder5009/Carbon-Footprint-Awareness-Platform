# Deployment Instructions for CarbonTrack

## Prerequisites
- GitHub account
- Vercel account (free - sign up at vercel.com)
- PostgreSQL database (Supabase recommended - free tier available)

---

## Quick Deploy to Vercel (5 minutes)

### Step 1: Push to GitHub

Run these commands in your terminal (replace YOUR_USERNAME with your GitHub username):

```bash
cd "c:\Users\dhruv\OneDrive\Desktop\Carbon Footprints Awarness\carbon-track"
git remote add origin https://github.com/YOUR_USERNAME/carbon-track.git
git branch -M main
git push -u origin main
```

### Step 2: Set Up Database (Supabase)

1. Go to [supabase.com](https://supabase.com) and sign up (free)
2. Create a new project
3. Go to Project Settings → Database
4. Copy the "Connection Pooling" string (URI mode)
5. Save it - you'll need it for Vercel

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Click "Add New..." → "Project"
3. Import your `carbon-track` repository
4. Vercel will auto-detect Next.js settings
5. Click "Environment Variables" and add:

```env
DATABASE_URL=your_supabase_connection_string
AUTH_SECRET=your_generated_secret
AUTH_URL=https://your-project-name.vercel.app/api/auth
NEXT_PUBLIC_SENTRY_DSN=optional_sentry_dsn
```

6. Click "Deploy"

### Step 4: Generate AUTH_SECRET

Run this in your terminal to generate a secure secret:

```bash
openssl rand -base64 33
```

Copy the output and use it as your `AUTH_SECRET` in Vercel.

---

## Environment Variables Reference

### Required:
- `DATABASE_URL` - PostgreSQL connection string from Supabase
- `AUTH_SECRET` - Generated secret for NextAuth
- `AUTH_URL` - Your Vercel deployment URL + /api/auth

### Optional (for OAuth):
- `AUTH_GITHUB_ID` - GitHub OAuth app client ID
- `AUTH_GITHUB_SECRET` - GitHub OAuth app secret
- `AUTH_GOOGLE_ID` - Google OAuth client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth client secret

### Optional (for monitoring):
- `NEXT_PUBLIC_SENTRY_DSN` - Sentry error tracking DSN

---

## After Deployment

1. **Run Database Migration:**
   - Vercel should auto-run `prisma db push` during build
   - If not, go to Vercel dashboard → Settings → Functions → Add command: `npx prisma db push`

2. **Test Your Site:**
   - Visit your Vercel URL (e.g., https://carbon-track.vercel.app)
   - Test the calculator at /calculator
   - Try signing up (if auth is configured)

3. **Set Up Custom Domain (Optional):**
   - Go to Vercel dashboard → Domains
   - Add your custom domain
   - Follow DNS configuration instructions

---

## Alternative: Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Connect your GitHub repository
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
4. Add the same environment variables
5. Deploy!

---

## Alternative: Self-Host with Docker

Create a `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:

```bash
docker build -t carbon-track .
docker run -p 3000:3000 --env-file .env carbon-track
```

---

## Troubleshooting

### Build Fails with "AUTH_SECRET not defined"
- Make sure you've added `AUTH_SECRET` to environment variables in Vercel

### Database Connection Error
- Verify your `DATABASE_URL` is correct
- Make sure it's the connection pooling URL from Supabase
- Check if you need to add `?pgbouncer=true` to the URL

### Prisma Migration Issues
- Go to Vercel project → Settings → General
- Add Build Command: `npx prisma generate && npx prisma db push && npm run build`

### Worker File Not Found
- This is expected in production (Web Workers are bundled differently)
- The app should still work - calculator will fall back to main thread

---

## Production Checklist

- [ ] Database is set up and migrated
- [ ] All environment variables are configured
- [ ] AUTH_SECRET is generated and secure
- [ ] AUTH_URL matches your deployment URL
- [ ] Test calculator functionality
- [ ] Test sign-up/sign-in flows
- [ ] Check mobile responsiveness
- [ ] Set up custom domain (optional)
- [ ] Configure Sentry for error tracking (optional)
- [ ] Set up GitHub OAuth (optional)
- [ ] Set up Google OAuth (optional)

---

## Useful Commands

```bash
# Local development
npm run dev

# Build locally
npm run build

# Start production server locally
npm run start

# Run linting
npm run lint

# Run tests
npm run test
npm run test:e2e

# Database commands
npx prisma studio          # Open database GUI
npx prisma db push         # Push schema to database
npx prisma generate        # Generate Prisma Client
npx prisma migrate dev     # Create migration
```

---

## Support

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth Docs**: https://next-auth.js.org

---

Good luck with your deployment! 🚀
