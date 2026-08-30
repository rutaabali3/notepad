/**
 * Mobile sidebar toggle for the responsive layout.
 * Slides the sidebar in from the left on small screens.
 */

document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('sidebar-toggle');
    const backdrop = document.getElementById('sidebar-backdrop');

    const setOpen = open => {
        document.body.classList.toggle('sidebar-open', open);
        if (toggle) toggle.setAttribute('aria-expanded', String(open));
        if (open && backdrop) backdrop.focus();
    };

    if (toggle) {
        toggle.addEventListener('click', () => {
            setOpen(!document.body.classList.contains('sidebar-open'));
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', () => setOpen(false));
    }

    window.addEventListener('keydown', event => {
        if (event.key === 'Escape') setOpen(false);
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) setOpen(false);
    });
});