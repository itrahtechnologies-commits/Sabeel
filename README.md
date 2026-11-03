<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/0a7e6667-0883-4fde-aeaa-3f3a2266c9b6

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Member and Admin Dashboards

The member and admin portals use Supabase Authentication and Postgres Row Level
Security. They do not use the former browser-only demo account as an authenticated
session.

1. Create a Supabase project and copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` from the project's
   API settings. An anon key can be used as the publishable key. Never put a
   service-role key in a `VITE_*` variable or in browser code.
3. Run the SQL in
   `supabase/migrations/20261102223000_member_admin_dashboards.sql` in the
   Supabase SQL Editor.
4. Configure the Supabase Auth email confirmation and redirect URL settings for
   the deployed app. If email confirmation is enabled, members confirm their
   email before signing in to their dashboard.
5. Register and confirm the account that will be the first admin. In the SQL
   Editor, promote that account using its verified email:

   ```sql
   update public.member_profiles
   set role = 'admin', membership_status = 'approved'
   where email = 'admin@example.com';
   ```

   Run this administrative SQL only in the Supabase SQL Editor; client-side
   accounts cannot grant themselves an admin role.

New registrations receive the `member` role and `pending` membership status.
Admin access is based on the profile role returned under RLS, and admin
operations are also protected by RLS policies. Savings, shares, and loan rows
are read-only to browser clients and are not fabricated; they remain empty until
trusted server-side workflows populate them.

## Deploy to Vercel

This is a Vite static site. Import the project repository into Vercel; the
included `vercel.json` sets the build command to `npm run build`, the output
directory to `dist`, and the SPA fallback. If Vercel does not detect these
settings automatically, select **Vite** as the framework preset.

Before deploying, add these environment variables in the Vercel project under
**Settings → Environment Variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)

Use only the Supabase publishable/anon key in this browser app. Never add a
service-role key as a `VITE_*` variable. Configure the Supabase Auth site URL
and redirect URLs to include the deployed Vercel domain, then redeploy after
changing build environment variables.

## Build and run with Docker

The `Dockerfile` builds the Vite app and serves the static output with Nginx
on port 8080. Docker build arguments supply the public Supabase configuration
at build time:

```powershell
docker build `
  --build-arg VITE_SUPABASE_URL="https://YOUR_PROJECT_ID.supabase.co" `
  --build-arg VITE_SUPABASE_PUBLISHABLE_KEY="YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY" `
  -t al-adala .
docker run --rm -p 8080:8080 al-adala
```

Open `http://localhost:8080` to verify the container. Vercel deploys this
project as a static Vite build; it does not deploy the Docker image.
