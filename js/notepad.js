/**
 * Rich-text editor page logic for the local-only notepad.
 */

let currentNoteId = null;
let hasUnsavedChanges = false;
let savedSelection = null;

function getEditorElements() {
    return {
        title: document.getElementById('note-title'),
        content: document.getElementById('note-content'),
        saveButton: document.getElementById('btn-save'),
        status: document.getElementById('save-status')
    };
}

function rememberSelection(editor) {
    const selection = window.getSelection();
    if (!selection.rangeCount || !editor.contains(selection.anchorNode)) return;
    savedSelection = selection.getRangeAt(0).cloneRange();
}

function restoreSelection(editor) {
    editor.focus();
    if (!savedSelection) return;
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(savedSelection);
}

function plainOrRichContent(content) {
    if (!content) return '';
    return /<\/?[a-z][\s\S]*>/i.test(content) ? Storage.sanitizeHtml(content) : escapeHtmlForEditor(content);
}

function escapeHtmlForEditor(value) {
    const container = document.createElement('div');
    container.textContent = value;
    return container.innerHTML.replaceAll('\n', '<br>');
}

function normalizeLink(url) {
    const trimmed = url.trim();
    if (/^(https?:|mailto:)/i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
}

function insertLink(editor) {
    restoreSelection(editor);
    const selection = window.getSelection();
    const range = selection.rangeCount ? selection.getRangeAt(0) : null;
    const selectedText = selection.toString().trim();
    const url = window.prompt('Enter the web address:', 'https://');
    if (!url || !url.trim() || !range) return;

    const normalizedUrl = normalizeLink(url);
    if (selectedText) {
        document.execCommand('createLink', false, normalizedUrl);
    } else {
        const linkText = window.prompt('What text should be clickable?', normalizedUrl);
        if (!linkText || !linkText.trim()) return;

        const link = document.createElement('a');
        link.href = normalizedUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = linkText.trim();
        range.deleteContents();
        range.insertNode(link);
        range.setStartAfter(link);
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    rememberSelection(editor);
    editor.dispatchEvent(new Event('input', { bubbles: true }));
}

function setupToolbar(editor) {
    document.querySelectorAll('.editor-tool[data-command]').forEach(button => {
        button.addEventListener('mousedown', event => event.preventDefault());
        button.addEventListener('click', () => {
            restoreSelection(editor);
            document.execCommand(button.dataset.command, false, button.dataset.value || null);
            rememberSelection(editor);
            editor.dispatchEvent(new Event('input', { bubbles: true }));
        });
    });

    const linkButton = document.getElementById('btn-add-link');
    linkButton.addEventListener('mousedown', event => event.preventDefault());
    linkButton.addEventListener('click', () => insertLink(editor));

    editor.addEventListener('keyup', () => rememberSelection(editor));
    editor.addEventListener('mouseup', () => rememberSelection(editor));
    editor.addEventListener('click', event => {
        const link = event.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href') || '';
        if (/^(https?:|mailto:)/i.test(href)) {
            event.preventDefault();
            window.open(href, '_blank', 'noopener,noreferrer');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const { title, content, saveButton, status } = getEditorElements();
    const urlParams = new URLSearchParams(window.location.search);
    const requestedNoteId = urlParams.get('note');
    const existingNote = requestedNoteId ? Storage.getNotes().find(note => note.id === requestedNoteId) : null;

    if (existingNote) {
        currentNoteId = existingNote.id;
        title.value = existingNote.title;
        content.innerHTML = plainOrRichContent(existingNote.content);
    }

    setupToolbar(content);

    const markUnsaved = () => {
        hasUnsavedChanges = true;
        saveButton.textContent = 'UNSAVED';
        saveButton.classList.remove('btn-success');
        saveButton.classList.add('btn-primary');
        if (status) status.textContent = 'Changes not saved';
    };

    const markSaved = () => {
        hasUnsavedChanges = false;
        saveButton.textContent = 'SAVED';
        saveButton.classList.remove('btn-primary');
        saveButton.classList.add('btn-success');
        if (status) status.textContent = 'Saved on this device';
    };

    title.addEventListener('input', markUnsaved);
    content.addEventListener('input', markUnsaved);

    saveButton.addEventListener('click', () => {
        const noteContent = content.textContent.trim();
        if (!noteContent) {
            Swal.fire('Empty Note', 'Please write some content before saving.', 'info');
            return;
        }

        const savedNote = Storage.saveNote({
            id: currentNoteId,
            title: title.value.trim() || 'Untitled Note',
            content: content.innerHTML
        });
        currentNoteId = savedNote.id;
        markSaved();

        Swal.fire({
            icon: 'success',
            title: 'Saved locally',
            text: 'Your formatted note is stored in this browser.',
            timer: 1200,
            showConfirmButton: false
        });
    });

    window.addEventListener('beforeunload', event => {
        if (hasUnsavedChanges) {
            event.preventDefault();
            event.returnValue = '';
        }
    });

    if (existingNote) markSaved();
    else if (status) status.textContent = 'Ready to write';
});
