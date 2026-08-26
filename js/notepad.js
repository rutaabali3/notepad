/**
 * Editor page logic for the local-only notepad.
 */

let currentNoteId = null;
let hasUnsavedChanges = false;

function getEditorElements() {
    return {
        title: document.getElementById('note-title'),
        content: document.getElementById('note-content'),
        saveButton: document.getElementById('btn-save'),
        status: document.getElementById('save-status')
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const { title, content, saveButton, status } = getEditorElements();
    const urlParams = new URLSearchParams(window.location.search);
    const requestedNoteId = urlParams.get('note');
    const existingNote = requestedNoteId ? Storage.getNotes().find(note => note.id === requestedNoteId) : null;

    if (existingNote) {
        currentNoteId = existingNote.id;
        title.value = existingNote.title;
        content.value = existingNote.content;
    }

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
        const noteContent = content.value.trim();
        if (!noteContent) {
            Swal.fire('Empty Note', 'Please write some content before saving.', 'info');
            return;
        }

        const savedNote = Storage.saveNote({
            id: currentNoteId,
            title: title.value.trim() || 'Untitled Note',
            content: noteContent
        });
        currentNoteId = savedNote.id;
        markSaved();

        Swal.fire({
            icon: 'success',
            title: 'Saved locally',
            text: 'Your note is stored in this browser.',
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
