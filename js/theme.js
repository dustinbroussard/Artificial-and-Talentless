(function () {
  const KEY = 'app:theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const system = () => (media && media.matches ? 'dark' : 'light');

  function apply(pref) {
    const theme = pref === 'system' ? system() : pref;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    localStorage.setItem(KEY, pref);

    // swap logos/images based on theme
    document
      .querySelectorAll('img[data-dark-src], img[data-light-src], img[data-theme-dark-src], img[data-theme-light-src], img[data-theme-src]')
      .forEach((img) => {
        let darkSrc =
          img.getAttribute('data-theme-dark-src') ||
          img.getAttribute('data-dark-src');
        let lightSrc =
          img.getAttribute('data-theme-light-src') ||
          img.getAttribute('data-light-src') ||
          img.getAttribute('src');
        const themeSrc = img.getAttribute('data-theme-src');
        if (themeSrc) {
          const map = themeSrc.split(',').reduce((acc, pair) => {
            const [k, v] = pair.split(':');
            if (k && v) acc[k.trim()] = v.trim();
            return acc;
          }, {});
          darkSrc = darkSrc || map.dark;
          lightSrc = lightSrc || map.light;
        }
        const next = theme === 'dark' ? darkSrc : lightSrc;
        if (next && img.src !== next) {
          img.removeAttribute('srcset');
          img.src = next;
        }
      });

    const btn = document.getElementById('theme-toggle');
    if (btn) btn.setAttribute('aria-pressed', String(theme === 'dark'));
  }

  function init() {
    const pref = localStorage.getItem(KEY) || 'system';
    apply(pref);

    const handleChange = () => {
      if ((localStorage.getItem(KEY) || 'system') === 'system') apply('system');
    };

    if (media) {
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handleChange);
      } else if (typeof media.addListener === 'function') {
        media.addListener(handleChange);
      }
    }
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => {
      const current = localStorage.getItem(KEY) || 'system';
      const resolved = current === 'dark' ? 'light' : 'dark';
      apply(resolved);
    });
  }
  if (document.readyState !== 'loading') {
    init();
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }
  window.setTheme = apply;
})();
