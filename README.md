# Aura — Dopamine Detox Tracker

A full-stack gamified dopamine detox tracker with identity-level progression, aura economy, and streak tracking.

## Tech Stack

- **React 18 + TypeScript + Vite**
- **Clerk** — Authentication (Google, GitHub, Discord, email magic link)
- **Supabase** — Postgres database with Row Level Security
- **Tailwind CSS v4** — Dark cosmic styling
- **Framer Motion** — Animations
- **Zustand** — Client state management

## Setup (Required Before Running)

### 1. Clerk Setup

1. Create a free app at [clerk.com](https://clerk.com)
2. Enable OAuth providers in Clerk Dashboard → Social Connections (Google, GitHub, Discord)
3. Go to **JWT Templates** → **New template** → choose **Supabase**
4. Name it exactly `supabase`
5. Copy your **Publishable Key** (`pk_...`)

### 2. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Settings → API** and copy your project URL and anon key
3. Go to **Settings → API → JWT Secret** and paste the Clerk JWT secret from the Clerk JWT template
4. Open the **SQL Editor** and run the contents of `supabase/schema.sql`

### 3. Environment Variables

Create `.env.local` in the project root:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 4. Run

```bash
npm install
npm run dev
```

## Features

- **Onboarding** — Select what you're avoiding (presets + custom items)
- **Live aura timer** — Passive +2/min, +200/hr hourly bonuses, extended bonuses at 3h/6h/12h/24h
- **10 identity levels** — NPC → Aware → Resister → Disciplined → Sigma → Alpha → Apex → Architect → Sovereign → Transcendent
- **Re-entry rewards** — "You earned X aura while away" modal on return
- **Relapse tracking** — Soft reset (streak resets, aura preserved)
- **Cross-device sync** — All data tied to your authenticated account via Supabase

## Level Thresholds

| Level | Name | Days |
|-------|------|------|
| 0 | NPC | 0 |
| 1 | Aware | 1 |
| 2 | Resister | 3 |
| 3 | Disciplined | 7 |
| 4 | Sigma | 14 |
| 5 | Alpha | 21 |
| 6 | Apex | 30 |
| 7 | Architect | 45 |
| 8 | Sovereign | 60 |
| 9 | Transcendent | 90 |
# Aura
