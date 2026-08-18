# Peleka Customer Portal — src structure + auth redirect patch

This patch reorganizes the customer portal to the same high-level Next.js structure used by the admin portal:

- `src/app`
- `src/components`
- `src/lib`

It also fixes the reported flow:

`Create Shipment -> Login -> Create Shipment`

and preserves the destination through:

`Create Shipment -> Login -> Register -> Create Shipment`

The protected dashboard shell now redirects unauthenticated users to `/login?redirect=<original path>`.

## Apply

1. Replace the existing root `app`, `components`, and `lib` folders with the folders under `src/`.
2. Keep your existing `package.json`, `.env.local`, Next config, and other project files.
3. Add/merge the included `jsconfig.json` so `@/` imports resolve to `src/`.
4. Remove the old root `app`, `components`, and `lib` folders after verifying the `src` copy is in place.
5. Run `npm install` and `npm run build`.

## Main fixes

- `src/components/PortalShell.js`: preserves the current pathname when redirecting unauthenticated users.
- `src/app/(auth)/login/page.js`: reads `redirect` and returns there after successful login.
- `src/app/(auth)/register/page.js`: preserves the redirect after successful registration.
- `src/app/(auth)/forgot-password/page.js`: preserves the redirect when returning to login.
- `src/app/page.js`: Start shipping goes to the protected Create Shipment route so the auth guard controls the flow.
- `src` alias configuration added in `jsconfig.json`.

The existing API and UI components are otherwise retained.
