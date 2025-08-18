// Theme management including logo switching
function toggleTheme() {
    const html = document.documentElement;
    const isDark = html.classList.toggle('dark');
    localStorage.setItem('dark-mode', isDark);
    updateLogoForTheme(isDark);
}

function updateLogoForTheme(isDark) {
    const logo = document.getElementById('logo');
    if (!logo) return;

    const darkSrc = logo.dataset.darkSrc;
    const currentSrc = logo.src;
    
    if (isDark && darkSrc && !currentSrc.endsWith('logo-dark.png')) {
        logo.dataset.lightSrc = currentSrc;
        logo.src = darkSrc;
    } else if (!isDark && logo.dataset.lightSrc && currentSrc.endsWith('logo-dark.png')) {
        logo.src = logo.dataset.lightSrc;
    }
}

function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const storedDark = localStorage.getItem('dark-mode');
    const darkMode = storedDark ? JSON.parse(storedDark) : prefersDark;

    if (darkMode) {
        document.documentElement.classList.add('dark');
    }
    updateLogoForTheme(darkMode);
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    setupThemeToggle();
});
