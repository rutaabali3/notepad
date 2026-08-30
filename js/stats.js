/**
 * Live text statistics for the notepad editor.
 * Words, characters, sentences and reading time.
 */

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('note-content');
    if (!content) return;

    const wordsEl = document.getElementById('stat-words');
    const charsEl = document.getElementById('stat-chars');
    const sentencesEl = document.getElementById('stat-sentences');
    const readingEl = document.getElementById('stat-reading');

    function updateStats() {
        const text = content.textContent || '';
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
        const reading = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));

        if (wordsEl) wordsEl.textContent = words;
        if (charsEl) charsEl.textContent = chars;
        if (sentencesEl) sentencesEl.textContent = sentences;
        if (readingEl) readingEl.textContent = reading === 0 ? '0 min' : (reading === 1 ? '1 min' : reading + ' mins');
    }

    content.addEventListener('input', updateStats);
    updateStats();

    window.NoteStats = { update: updateStats };
});