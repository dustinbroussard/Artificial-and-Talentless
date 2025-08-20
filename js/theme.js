const THEME_KEY = 'app:theme';

export function applyTheme(preference) {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const systemTheme = () => (media.matches ? 'dark' : 'light');
    const theme = preference === 'system' ? systemTheme() : preference;
    
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    localStorage.setItem(THEME_KEY, preference);

    // Update theme toggle button state
    document.querySelectorAll('[data-theme-toggle]').forEach(btn => {
        btn.setAttribute('aria-pressed', theme === 'dark');
    });

    // Update logo
    const logo = document.getElementById('logo');
    if (logo && logo.dataset.darkSrc) {
        logo.src = theme === 'dark' ? logo.dataset.darkSrc : logo.dataset.darkSrc.replace('-dark', '');
    }
}

export function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
    applyTheme(savedTheme);
    
    // Setup media query listener for system theme changes
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', () => {
        if (localStorage.getItem(THEME_KEY) === 'system') {
            applyTheme('system');
        }
    });
}

// Initialize theme when module is imported
document.addEventListener('DOMContentLoaded', initTheme);

