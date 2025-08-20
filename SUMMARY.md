# Summary

- Unified theming via `data-theme` on `<html>` with a single `js/theme.js` manager. Logo sources now swap automatically for `data-dark-src`, `data-theme-dark-src`, or `data-theme-src` attributes and images reset `srcset` to avoid double fetches.
- Added accessible theme toggle styles and hidden page headings for proper hierarchy. Question options act as a keyboard-friendly radio group with roving focus and `aria-checked` states.
- Normalized header centering, refined Tailwind CDN handling, and added a focus outline for the theme switcher.
- Hardened service worker: scope-aware caching list, navigation network-first with cached/offline fallbacks, cache-first strategy for same-origin assets, and defensive registration under subpaths.
- Generator uses an AbortController (20s timeout), disables footer buttons while running, retries once on 429, truncates outputs to 300 chars, and always restores UI in `finally`.
- Settings/onboarding: debounced model fetch with duplicate-key guard, persists selections, and shows tooltips when free-only filtering yields no models.

# Smoke Test

1. First load online: open any page, ensure styles load even if Tailwind CDN fails (check console warning).
2. Toggle theme via header button – logos switch, `aria-pressed` updates.
3. Navigate through onboarding, using keyboard to answer questions; model list debounces and warns if no free models.
4. Generate content; observe spinner, retry on rate-limit, and timeout after ~20s. Footer buttons re-enable afterwards.
5. Second load offline: previously visited pages render from cache and navigations fall back to `index.html` if missing.
