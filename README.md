# Peleka Customer Web Portal — Standalone Project

This is a complete standalone Next.js customer portal project. It is intended to be
run as a NEW project and does not require replacing your existing Peleka customer
portal.

## Stack

- Next.js
- React
- JavaScript
- Lucide icons
- `src/` project structure
- Existing Peleka backend API

## Project structure

```text
src/
  app/
    (auth)/
      login/
      register/
      forgot-password/
    (portal)/
      dashboard/
        billing/
        notifications/
        settings/
        shipments/
          new/
          [id]/
        track/
    reset-password/
    track/
    globals.css
    layout.js
    page.js
  components/
    PortalShell.js
  lib/
    api.js

jsconfig.json
package.json
.env.example
```

## Run as a new project

1. Extract this ZIP to a NEW folder, for example:

   `C:\My projects\peleka-customer-web`

2. Open a terminal in that folder.

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create `.env.local` from `.env.example`:

   ```env
   NEXT_PUBLIC_API_URL=https://peleka-server.vercel.app/api
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

5. Start development:

   ```bash
   npm run dev
   ```

6. Open:

   `http://localhost:3000`

## Production build

```bash
npm run build
npm start
```

## Create Shipment login flow

The protected shipment creation page redirects unauthenticated users to:

`/login?redirect=/dashboard/shipments/new`

After successful login or registration, the customer is returned automatically to:

`/dashboard/shipments/new`

The redirect is restricted to internal paths to avoid open redirects.

## Existing backend

The portal is designed to communicate with the existing Peleka backend at the
configured `NEXT_PUBLIC_API_URL`. No backend replacement is included in this ZIP.

## Important

Do not copy this project over your existing customer portal. This ZIP is already
structured as a standalone project. You can keep both projects side-by-side while
testing the new portal.
