(function () {
  const DISMISSED_KEY = 'pwa-install-dismissed';
  let deferredPrompt;

  if ('serviceWorker' in navigator) {
    const scope = location.pathname.replace(/[^/]+$/, '');
    navigator.serviceWorker.register('./sw.js', { scope }).catch(console.error);
  }

  function showInstallBanner() {
    if (sessionStorage.getItem(DISMISSED_KEY)) return;
    const banner = document.createElement('div');
    banner.id = 'install-banner';
    banner.style.position = 'fixed';
    banner.style.bottom = '20px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.background = 'var(--bg-alt)';
    banner.style.color = 'var(--text)';
    banner.style.padding = '10px 20px';
    banner.style.borderRadius = 'var(--radius)';
    banner.style.boxShadow = '0 4px 6px var(--shadow)';
    const installBtn = document.createElement('button');
    installBtn.textContent = 'Install';
    installBtn.style.marginRight = '10px';
    const dismissBtn = document.createElement('button');
    dismissBtn.textContent = 'Dismiss';
    banner.appendChild(installBtn);
    banner.appendChild(dismissBtn);
    document.body.appendChild(banner);

    installBtn.addEventListener('click', async () => {
      if (!deferredPrompt) return;
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      deferredPrompt = null;
      sessionStorage.setItem(DISMISSED_KEY, '1');
      banner.remove();
    });

    dismissBtn.addEventListener('click', () => {
      sessionStorage.setItem(DISMISSED_KEY, '1');
      banner.remove();
    });
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      return;
    }
    e.preventDefault();
    deferredPrompt = e;
    showInstallBanner();
  });

  // Attempt to lock orientation to portrait when possible (mostly PWAs/Android)
  function tryLockPortrait() {
    try {
      if (screen.orientation && typeof screen.orientation.lock === 'function') {
        screen.orientation.lock('portrait').catch(() => {});
      }
    } catch (_) { /* no-op */ }
  }
  // Run on load and when app enters standalone mode
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    tryLockPortrait();
  } else {
    document.addEventListener('DOMContentLoaded', tryLockPortrait, { once: true });
  }
})();
