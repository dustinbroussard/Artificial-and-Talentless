# Artificial-and-Talentless

This project is a Progressive Web App that offers light and dark themes with a single `data-theme` attribute on the `<html>` element.

## Features
- Theme preference (`light`, `dark`, or `system`) is saved to `localStorage` and applied before the first paint to avoid flashes of unstyled content.
- Toggle button available on every page except `generator.html` with proper `aria-pressed` state and icon swaps.
- Service worker uses a Stale-While-Revalidate caching strategy to provide offline support.
- `manifest.webmanifest` defines install metadata and icons for Android/Chrome.
- Custom install banner shown on each visit until the user installs or dismisses it for the session.

## Testing Installability
1. Serve the project over **HTTPS**.
2. Open Chrome DevTools ➜ **Application** ➜ **Manifest** to verify the manifest and service worker registration.
3. Use the **Lighthouse** panel to audit PWA installability and offline readiness.

## Generating an Android APK
1. Install Bubblewrap: `npm i -g @bubblewrap/cli`.
2. Run `bubblewrap init --manifest=https://YOUR_DOMAIN/manifest.webmanifest`.
3. Follow the prompts, then execute `bubblewrap build` to create the signed APK.
4. The resulting APK can be uploaded to the Play Store or sideloaded on devices.

## Production Tailwind build
The project currently pulls Tailwind from the CDN during development. For a production build:

1. Install build tools: `npm i -D tailwindcss postcss autoprefixer vite`
2. Run `npx tailwindcss init -p` and set `content` to `./*.{html,js}`
3. Create `src/styles/tailwind.css` with `@tailwind base; @tailwind components; @tailwind utilities;`
4. Build with `npx tailwindcss -i src/styles/tailwind.css -o style.css --minify`
5. Remove `<script src="https://cdn.tailwindcss.com"></script>` from HTML files.

