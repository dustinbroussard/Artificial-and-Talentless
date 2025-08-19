(function () {
  const KEY = 'app:theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const systemTheme = () => (media.matches ? 'dark' : 'light');

  const applyTheme = (preference) => {
    const theme = preference === 'system' ? systemTheme() : preference;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));

    // Update logo based on theme
    const logos = document.querySelectorAll('img[data-theme-src]');
    logos.forEach(img => {
      const themeSrc = img.dataset[`theme${theme.charAt(0).toUpperCase() + theme.slice(1)}Src`];
      if (themeSrc) {
        img.src = themeSrc;
        img.removeAttribute('srcset'); // Clear srcset for SVG/retina cases
      }
    });

    localStorage.setItem(KEY, preference);
  };

  const init = () => {
    const pref = localStorage.getItem(KEY) || 'system';
    applyTheme(pref);

    media.addEventListener('change', () => {
      if (localStorage.getItem(KEY) === 'system') applyTheme('system');
    });

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });

    const sel = document.getElementById('theme-select');
    if (sel) {
      sel.value = pref;
      sel.addEventListener('change', () => applyTheme(sel.value));
    }
  };

  document.addEventListener('DOMContentLoaded', init);
})();

