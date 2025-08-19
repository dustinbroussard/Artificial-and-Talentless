// Global theme toggling using sun/moon icons
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const lightIcon = document.getElementById('light-icon');
    const darkIcon = document.getElementById('dark-icon');

    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            if (lightIcon) lightIcon.style.display = 'none';
            if (darkIcon) darkIcon.style.display = 'inline-block';
        } else {
            body.classList.remove('dark-mode');
            if (lightIcon) lightIcon.style.display = 'inline-block';
            if (darkIcon) darkIcon.style.display = 'none';
        }
        localStorage.setItem('theme', theme);

        // Swap images if a dark version is provided
        document.querySelectorAll('img[data-dark-src]').forEach(img => {
            if (!img.dataset.lightSrc) {
                img.dataset.lightSrc = img.src;
            }
            img.src = theme === 'dark' ? img.dataset.darkSrc : img.dataset.lightSrc;
        });
    }

    // Initialize theme from localStorage or default to light
    applyTheme(localStorage.getItem('theme') || 'light');

    const toggleIcons = document.getElementById('theme-toggle-icons');
    if (toggleIcons) {
        toggleIcons.addEventListener('click', () => {
            const current = localStorage.getItem('theme') || 'light';
            const next = current === 'light' ? 'dark' : 'light';
            applyTheme(next);
        });
    }
});

