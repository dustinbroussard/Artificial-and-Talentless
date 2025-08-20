(function () {
  const KEY = 'app:theme';
  const media = window.matchMedia('(prefers-color-scheme: dark)');
  const system = () => (media.matches ? 'dark' : 'light');

  function apply(pref) {
    const theme = pref === 'system' ? system() : pref;
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    localStorage.setItem(KEY, pref);

    document.querySelectorAll('img[data-dark-src][data-light-src]').forEach(img => {
      const next = theme === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc;
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
    media.addEventListener('change', () => {
      if ((localStorage.getItem(KEY) || 'system') === 'system') apply('system');
    });
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', () => {
      const current = localStorage.getItem(KEY) || 'system';
      const resolved = current === 'dark' ? 'light' : 'dark';
      apply(resolved);
    });
  }
  document.addEventListener('DOMContentLoaded', init);
})();
