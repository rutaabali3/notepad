/**
 * Dictionary-based spell checker for the notepad.
 * Uses the hunspell en_US dictionary via the Typo.js spellchecker
 * (loaded on demand from a CDN). Everything stays local in the browser.
 */

const DICTIONARY_URL = 'https://cdn.jsdelivr.net/npm/typo-js@1.2.4/typo.js';
const DICTIONARY_PATH = 'https://cdn.jsdelivr.net/npm/typo-js@1.2.4/dictionaries';
const DICTIONARY_LANG = 'en_US';

const ALWAYS_VALID = new Set([
    "don't", "won't", "can't", "isn't", "aren't", "doesn't", "didn't",
    "wasn't", "weren't", "haven't", "hasn't", "hadn't", "couldn't",
    "shouldn't", "wouldn't", "it's", "that's", "let's", "we're",
    "they're", "you're", "i'm", "i've", "we've", "you've", "they've",
    "i'll", "you'll", "we'll", "they'll", "he'll", "she'll", "it'll",
    "okay", "ok"
]);

document.addEventListener('DOMContentLoaded', () => {
    const content = document.getElementById('note-content');
    const btn = document.getElementById('btn-spell-check');
    const panel = document.getElementById('spell-panel');
    const list = document.getElementById('spell-list');
    const tooltip = document.getElementById('spell-tooltip');
    const countEl = document.getElementById('spell-count');
    const btnClear = document.getElementById('btn-clear-spell');
    if (!content || !btn) return;

    let dictionary = null;
    let loading = false;

    function loadTypoLib() {
        return fetch(DICTIONARY_URL)
            .then(response => response.text())
            .then(src => new Function(src + '\n;return Typo;')());
    }

    function loadDictionary() {
        return new Promise((resolve, reject) => {
            let done = false;
            const finish = (err, dict) => {
                if (done) return;
                done = true;
                if (err) reject(err);
                else resolve(dict);
            };

            loadTypoLib()
                .then(Typo => {
                    const dict = new Typo(DICTIONARY_LANG, false, false, {
                        dictionaryPath: DICTIONARY_PATH,
                        asyncLoad: true,
                        loadedCallback: () => finish(null, dict)
                    });
                })
                .catch(() => finish(new Error('Could not load the spellchecker.')));

            setTimeout(() => finish(new Error('Spelling dictionary took too long to load.')), 20000);
        });
    }

    function getPlainText(container) {
        let text = '';
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
                text += '\n';
            }
        }
        return text;
    }

    function getNodeAndOffsetAtPosition(container, pos) {
        let currentPos = 0;
        const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null, false);
        let node;
        let lastTextNode = null;
        while ((node = walker.nextNode())) {
            if (node.nodeType === Node.TEXT_NODE) {
                const len = node.textContent.length;
                if (currentPos + len >= pos) {
                    return { node: node, offset: pos - currentPos };
                }
                currentPos += len;
                lastTextNode = node;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'BR') {
                currentPos += 1;
            }
        }
        if (lastTextNode) {
            return { node: lastTextNode, offset: lastTextNode.textContent.length };
        }
        return null;
    }

    function isWordValid(word) {
        if (!word) return true;
        if (/\d/.test(word)) return true;
        if (word.replace(/[\u0027\u2019-]/g, '').length === 0) return true;
        const lower = word.toLowerCase();
        if (ALWAYS_VALID.has(lower)) return true;

        if (word.includes('-') || word.includes('\u0027') || word.includes('\u2019')) {
            const parts = word.split(/[\u0027\u2019-]+/).filter(Boolean);
            if (parts.length > 1 && parts.every(part => dictionary.check(part))) return true;
        }

        try {
            return dictionary.check(word);
        } catch (_) {
            return true;
        }
    }

    function collectMisspellings(text) {
        const misspellings = [];
        const tokenRe = /[A-Za-z0-9]+(?:[\u0027\u2019-][A-Za-z0-9]+)*/g;
        let match;
        while ((match = tokenRe.exec(text)) !== null) {
            const word = match[0];
            if (isWordValid(word)) continue;
            misspellings.push({ word: word, start: match.index, end: match.index + word.length });
        }
        return misspellings;
    }

    function clearHighlights() {
        content.querySelectorAll('mark.spell-miss').forEach(mark => {
            const parent = mark.parentNode;
            const textNode = document.createTextNode(mark.textContent);
            parent.replaceChild(textNode, mark);
        });
        list.innerHTML = '';
        if (countEl) countEl.textContent = '0';
        if (tooltip) tooltip.hidden = true;
    }

    function escapeHtml(value) {
        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    }

    function updateCount() {
        const count = list.querySelectorAll('li[data-start]').length;
        if (countEl) countEl.textContent = count;
        if (count === 0 && !list.querySelector('.no-errors')) {
            list.innerHTML = '<li class="no-errors"><i class="bi bi-check-circle me-2"></i>No spelling issues detected.</li>';
        }
    }

    function applyCorrection(mark, suggestion) {
        const start = mark.dataset.start;
        mark.replaceWith(document.createTextNode(suggestion));
        const li = list.querySelector(`li[data-start="${start}"]`);
        if (li) li.remove();
        if (tooltip) tooltip.hidden = true;
        updateCount();
        content.dispatchEvent(new Event('input', { bubbles: true }));
        if (window.NoteStats) window.NoteStats.update();
    }

    function showTooltip(mark) {
        if (!dictionary || !mark.isConnected) return;

        const word = mark.textContent.trim();
        let suggestions = [];
        try {
            suggestions = dictionary.suggest(word);
        } catch (_) {
            suggestions = [];
        }

        tooltip.innerHTML = '';
        const label = document.createElement('div');
        label.className = 'spell-tooltip-label';
        label.textContent = `Suggestions for “${word}”`;
        tooltip.appendChild(label);

        const btns = document.createElement('div');
        btns.className = 'spell-tooltip-btns';
        if (suggestions.length > 0) {
            suggestions.slice(0, 4).forEach(suggestion => {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'spell-tooltip-btn';
                button.textContent = suggestion;
                button.addEventListener('click', () => applyCorrection(mark, suggestion));
                btns.appendChild(button);
            });
        } else {
            const none = document.createElement('div');
            none.className = 'spell-tooltip-none';
            none.textContent = 'No suggestions';
            btns.appendChild(none);
        }
        tooltip.appendChild(btns);

        const rect = mark.getBoundingClientRect();
        let left = rect.left;
        let top = rect.bottom + 8;
        if (left + 340 > window.innerWidth) left = window.innerWidth - 350;
        if (top + 200 > window.innerHeight) top = Math.max(8, rect.top - 16 - tooltip.offsetHeight);
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
        tooltip.hidden = false;
    }

    async function runCheck() {
        if (loading) return;
        loading = true;
        btn.disabled = true;

        try {
            if (!dictionary) {
                panel.hidden = false;
                list.innerHTML = '<li class="no-errors"><i class="bi bi-hourglass me-2"></i>Loading spelling dictionary…</li>';
                dictionary = await loadDictionary();
            }

            clearHighlights();
            panel.hidden = false;

            const text = getPlainText(content);
            const misspellings = collectMisspellings(text);

            for (let i = misspellings.length - 1; i >= 0; i--) {
                const miss = misspellings[i];
                const start = getNodeAndOffsetAtPosition(content, miss.start);
                const end = getNodeAndOffsetAtPosition(content, miss.end);
                if (!start || !end) continue;

                try {
                    const range = document.createRange();
                    range.setStart(start.node, start.offset);
                    range.setEnd(end.node, end.offset);
                    const mark = document.createElement('mark');
                    mark.className = 'spell-miss';
                    mark.dataset.word = miss.word;
                    mark.dataset.start = miss.start;
                    range.surroundContents(mark);
                } catch (_) {
                    // Skip ranges that cannot be wrapped safely.
                }
            }

            list.innerHTML = '';
            const marks = content.querySelectorAll('mark.spell-miss');
            marks.forEach(mark => {
                const word = mark.textContent.trim();
                let suggestions = [];
                try {
                    suggestions = dictionary.suggest(word);
                } catch (_) {
                    suggestions = [];
                }

                const li = document.createElement('li');
                li.dataset.start = mark.dataset.start;
                li.innerHTML = `<span class="spell-word">${escapeHtml(word)}</span>`;

                const wrapper = document.createElement('div');
                wrapper.className = 'spell-suggestions';
                if (suggestions.length > 0) {
                    suggestions.slice(0, 3).forEach(suggestion => {
                        const button = document.createElement('button');
                        button.type = 'button';
                        button.textContent = suggestion;
                        button.addEventListener('click', () => applyCorrection(mark, suggestion));
                        wrapper.appendChild(button);
                    });
                } else {
                    const none = document.createElement('span');
                    none.className = 'spell-suggest-none';
                    none.textContent = 'No suggestions';
                    wrapper.appendChild(none);
                }
                li.appendChild(wrapper);
                list.appendChild(li);
            });

            updateCount();
            if (window.NoteStats) window.NoteStats.update();
        } catch (error) {
            panel.hidden = true;
            Swal.fire('Dictionary unavailable', error.message || 'Could not load the spelling dictionary. Please check your internet connection.', 'error');
        } finally {
            loading = false;
            btn.disabled = false;
        }
    }

    btn.addEventListener('click', () => {
        if (!panel.hidden && list.querySelector('li[data-start]')) {
            clearHighlights();
            panel.hidden = true;
        } else {
            runCheck();
        }
    });

    if (btnClear) {
        btnClear.addEventListener('click', () => {
            clearHighlights();
            panel.hidden = true;
        });
    }

    content.addEventListener('click', event => {
        const mark = event.target.closest('mark.spell-miss');
        if (mark) {
            showTooltip(mark);
        } else {
            tooltip.hidden = true;
        }
    });

    document.addEventListener('click', event => {
        if (tooltip && !event.target.closest('#spell-tooltip')) {
            tooltip.hidden = true;
        }
    });

    content.addEventListener('input', () => {
        if (tooltip) tooltip.hidden = true;
    });
});