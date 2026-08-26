/**
 * Shared light/dark mode controller.
 */

const THEME_KEY = 'mynotes_theme';

function applyTheme(theme) {
    const isDark = theme === 'dark';
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';

    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.setAttribute('aria-pressed', String(isDark));
    toggle.innerHTML = isDark
        ? '<i class="bi bi-sun me-1"></i><span>Light mode</span>'
        : '<i class="bi bi-moon-stars me-1"></i><span>Dark mode</span>';
}

function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    return 'dark';
}

applyTheme(getPreferredTheme());

document.addEventListener('DOMContentLoaded', () => {
    applyTheme(getPreferredTheme());
    const toggle = document.getElementById('theme-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
        const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_KEY, nextTheme);
        applyTheme(nextTheme);
    });
});
