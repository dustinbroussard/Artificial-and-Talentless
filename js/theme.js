// js/theme.js
(function () {
  const KEY = 'app:theme'; // 'light' | 'dark' | 'system'
  const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

  const getSystemTheme = () => (mq && mq.matches ? 'dark' : 'light');
  const getPref = () => localStorage.getItem(KEY) || 'system';

  function setThemeAttr(theme) {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    // Helps form controls, UA widgets, etc.
    root.style.colorScheme = theme;
  }

  function swapImages(theme) {
    // Fail-safe query; if selector is bad, nothing breaks.
    let nodeList = [];
    try {
      nodeList = document.querySelectorAll(
        'img[data-dark-src], img[data-light-src], img[data-theme-dark-src], img[data-theme-light-src], img[data-theme-src]'
      );
    } catch (_) {
      return;
    }
    nodeList.forEach((img) => {
      // Priority: explicit theme attribs, then generic map
      let darkSrc = img.getAttribute('data-theme-dark-src') || img.getAttribute('data-dark-src');
      let lightSrc = img.getAttribute('data-theme-light-src') || img.getAttribute('data-light-src');

      const map = img.getAttribute('data-theme-src');
      if (!darkSrc || !lightSrc) {
        if (map) {
          const pairs = map.split(',').map((s) => s.trim());
          const dict = {};
          pairs.forEach((p) => {
            const [k, v] = p.split(':').map((x) => x && x.trim());
            if (k && v) dict[k] = v;
          });
          darkSrc = darkSrc || dict.dark;
          lightSrc = lightSrc || dict.light;
        }
      }

      const next = theme === 'dark' ? darkSrc : lightSrc;
      if (next && img.src !== next) {
        img.removeAttribute('srcset'); // avoid stale DPR srcsets
        img.src = next;
      }
    });
  }

  function apply(pref) {
    const resolved = pref === 'system' ? getSystemTheme() : pref;
    setThemeAttr(resolved);
    localStorage.setItem(KEY, pref);

    // Sync toggle button state and icons
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', String(resolved === 'dark'));

    // Swap any theme-aware images
    swapImages(resolved);

    // Update meta theme-color for PWA feel & address bar
    const lightMeta = document.querySelector('meta[name="theme-color"]:not([media])');
    const darkMeta = document.querySelector('meta[name="theme-color"][media*="prefers-color-scheme: dark"]');
    if (lightMeta && darkMeta) {
      const content = resolved === 'dark' ? (darkMeta.getAttribute('content') || '#000000')
                                          : (lightMeta.getAttribute('content') || '#FFFFE3');
      // Create a single live tag to match current theme (optional but nice)
      let live = document.querySelector('meta[name="theme-color"][data-live]');
      if (!live) {
        live = document.createElement('meta');
        live.setAttribute('name', 'theme-color');
        live.setAttribute('data-live', 'true');
        document.head.appendChild(live);
      }
      live.setAttribute('content', content);
    }
  }

  function init() {
    // 1) Apply saved preference or system
    apply(getPref());

    // 2) React to system changes only if user chose 'system'
    const handle = () => {
      if (getPref() === 'system') apply('system');
    };
    if (mq) {
      if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handle);
      else if (typeof mq.addListener === 'function') mq.addListener(handle);
    }

    // 3) Wire up the toggle button
    const btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        const pref = getPref();
        // Cycle: system → dark → light → dark (simple, explicit)
        // If you prefer system in the cycle, comment the next line and uncomment the 3-state version below.
        const next = (pref === 'dark') ? 'light' : 'dark';
        // 3-state alternative:
        // const order = ['system', 'dark', 'light'];
        // const next = order[(order.indexOf(pref) + 1) % order.length];

        apply(next);
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Expose for debugging: setTheme('light'|'dark'|'system')
  window.setTheme = apply;
})();
