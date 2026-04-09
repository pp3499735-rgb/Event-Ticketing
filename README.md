# HyperLocal

HyperLocal is a full-stack hyper-local event ticketing platform for college fests, pop-ups, workshops, and community events.

## Stack

- **Frontend:** Next.js (App Router) + Tailwind CSS
- **Backend:** Next.js Route Handlers (serverless-friendly APIs)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth (Email magic-link + Google OAuth)
- **Deploy:** Vercel-ready monolith (frontend + backend in one app)

## Features

- Authentication with role-aware sessions (`ATTENDEE`, `ORGANIZER`)
- Event discovery using geolocation/manual city, category/date filters, and distance radius
- Organizer event creation with lat/long, pricing, and capacity
- Ticket booking with unique UUID booking code and confirmation page
- Attendance/check-in API for organizers
- Dashboard for attendees and organizers
- Seed script with demo users and events

## API Endpoints

- `/api/auth/*` — NextAuth handlers
- `/api/events` — `GET`, `POST`
- `/api/events/[id]` — `GET`
- `/api/bookings` — `GET`, `POST`
- `/api/checkin` — `POST`

## Environment Variables

Create `.env`:

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-long-random-secret"

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Email provider used by NextAuth Email login
EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
EMAIL_FROM="HyperLocal <noreply@hyperlocal.dev>"
```

> If you use **Vercel Postgres**, set `DATABASE_URL` from Vercel project env vars.

## Local setup

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
pnpm dev
```

Open: `http://localhost:3000`

## Demo seed users

- Organizer: `organizer@hyperlocal.dev`
- Attendee: `attendee@hyperlocal.dev`

(For OAuth/magic-link, use real provider credentials. Seed users are for DB demo data.)

## Deploy to Vercel

1. Push repo to GitHub.
2. Import project in Vercel.
3. Add env vars listed above.
4. Provision Postgres (Vercel Postgres/Neon/Supabase) and set `DATABASE_URL`.
5. Run migrations in Vercel build or CI:
   ```bash
   pnpm prisma migrate deploy
   pnpm prisma generate
   ```
6. Deploy.

### Notes

- App is serverless-friendly: APIs are Next.js route handlers.
- Seed locally for demo data (`pnpm prisma:seed`).
- You can mock confirmation email behavior via the Email provider in development (Mailtrap recommended).

## Optional enhancements already scaffolded

- Distance-based filtering via Haversine
- Debounced search in event discovery
- Check-in endpoint to power QR/ticket scanner UI
