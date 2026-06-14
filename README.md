# CarbonTrack 🌍

A beautiful, science-backed carbon footprint calculator with real-time calculations and a premium glassmorphic UI.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-7-brightgreen)
![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🎯 **2-Minute Calculator** - Quick and easy carbon footprint estimation
- 📊 **Real-Time Updates** - See your impact as you type
- 🎨 **Premium UI** - Glassmorphic design with smooth animations
- 📱 **Mobile First** - Fully responsive on all devices
- 🔒 **Privacy Focused** - Optional authentication, anonymous usage supported
- 📈 **Historical Tracking** - Monitor your progress over time
- 🌐 **Production Ready** - Built with enterprise-grade patterns

## 🚀 Live Demo

[Visit Live Site](https://your-deployment-url.vercel.app) _(coming soon after deployment)_

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** NextAuth.js v5
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Testing:** Vitest + Playwright

## 📦 Quick Start

### Prerequisites
- Node.js 20+
- PostgreSQL database (or use Supabase)

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/carbon-track.git
cd carbon-track

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your database credentials

# Push database schema
npx prisma db push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deployment

This project is optimized for **Vercel**. See the [deployment guide](./deploy.md) for step-by-step instructions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/carbon-track)

## 📖 Documentation

- [Deployment Guide](./deploy.md) - Quick deployment steps
- [Full Deployment Documentation](./DEPLOYMENT_STEPS.md) - Comprehensive guide
- [Architecture](./ARCHITECTURE.md) - System design and patterns
- [API Documentation](./API.md) - API endpoints reference
- [Operations](./OPERATIONS.md) - Production operations guide

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run E2E tests
npm run test:e2e

# Run linting
npm run lint
```

## 🤝 Contributing

Contributions are welcome! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Emission factors based on EPA and IPCC guidelines
- UI inspired by Apple's iOS design system
- Built with modern web standards and best practices

---

**Built with ❤️ for a sustainable future**
