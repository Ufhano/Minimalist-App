# Minimalist App

A distraction-reducing, mindful phone launcher companion built with React Native + Expo. Inspired by [Minimalist Phone](https://minimalistphone.com).

## Features

- **Minimalist Home** — Plain text app list, clock, no icons
- **App Management** — Allowed / Restricted / Blocked categories with daily limits
- **Intention System** — "Why are you opening this?" prompt before opening apps
- **Focus Sessions** — Pomodoro-style sessions (25, 90, or custom minutes)
- **Screen Time Dashboard** — Daily/weekly usage, streaks, simple bar charts
- **Profiles** — Work, Personal, Wind-Down (schema ready)
- **Auth** — Email/password + Google OAuth via Supabase
- **Offline-first** — AsyncStorage cache when not logged in

## Tech Stack

- **Frontend:** React Native, Expo SDK 54+, expo-router, NativeWind (Tailwind), Zustand, React Query
- **Backend:** Supabase (PostgreSQL, Auth, Realtime)
- **Optional API:** Express.js on Render.com (free tier)

## Setup

### 1. Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Enable **Email** and **Google** auth in Authentication → Providers
3. Run the migration in **SQL Editor**:

   ```bash
   # Copy contents of supabase/migrations/001_initial_schema.sql
   # Paste and run in Supabase SQL Editor
   ```

4. RLS is enabled; users can only access their own rows.

### 3. Run the app

```bash
npm install
npx expo start
```

- Press `a` for Android, `i` for iOS, or scan QR with Expo Go.

### 4. Deep links (auth callbacks)

In `app.json`, the scheme is `minimalistappv1`. For password reset:

- Add redirect URL: `minimalistappv1://auth/callback` in Supabase Auth settings.

## Project Structure

```
/app
  /(auth)         → login, signup, forgot-password
  /(tabs)         → home, focus, stats, settings
  /onboarding     → 5-step onboarding flow
  /app-manager    → manage app list
  /focus-session  → active Pomodoro timer
  /intention-prompt → "Why are you opening this?"
/components       → ErrorBoundary, LoadingSkeleton, TextButton
/lib             → supabase.ts, api.ts
/stores          → authStore, appStore, settingsStore
/constants       → theme, config
/types           → database.ts (Supabase types)
/supabase/migrations → SQL schema
```

## Render.com (optional)

If you add an Express API:

1. Create `server/` with `package.json` and `index.js`
2. Push to GitHub and connect to Render
3. Use `render.yaml` for config
4. Set env vars in Render dashboard

## EAS Build

```bash
npx eas build --platform android
npx eas build --platform ios
```

Configure `eas.json` for free tier.

## License

MIT
