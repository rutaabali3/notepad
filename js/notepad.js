/**
 * notepad.js
 * Notepad page logic
 */

let currentNoteId = null;
let hasUnsavedChanges = false;

document.addEventListener('DOMContentLoaded', async () => {
    // Check auth
    const session = Storage.getSession();
    if (!session) {
        window.location.href = 'login.html';
        return;
    }

    // Display username
    document.getElementById('current-user-name').textContent = session.username;

    // Setup logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        Storage.clearSession();
        window.location.href = 'login.html';
    });

    // Track changes
    const saveBtn = document.getElementById('btn-save');
    const markUnsaved = () => {
        hasUnsavedChanges = true;
        saveBtn.textContent = 'UNSAVED';
        saveBtn.classList.remove('btn-success');
        saveBtn.classList.add('btn-primary');
    };

    const markSaved = () => {
        hasUnsavedChanges = false;
        saveBtn.textContent = 'SAVED';
        saveBtn.classList.remove('btn-primary');
        saveBtn.classList.add('btn-success');
    };

    document.getElementById('note-title').addEventListener('input', markUnsaved);
    document.getElementById('note-content').addEventListener('input', markUnsaved);

    // Save action
    document.getElementById('btn-save').addEventListener('click', async () => {
        const title = document.getElementById('note-title').value.trim() || 'Untitled Note';
        const content = document.getElementById('note-content').value.trim();

        if (!content) {
            Swal.fire('Empty Note', 'Please write some content before saving!', 'info');
            return;
        }

        const now = new Date();
        let note = {};

        if (currentNoteId) {
            const existingNotes = await Storage.getNotes(session.id);
            const existing = existingNotes.find(n => n.id === currentNoteId);
            if (existing) {
                note = { ...existing };
                note.title = title;
                note.content = content;
                note.updatedAt = now.toISOString();
            }
        } else {
            note = {
                id: 'note_' + Date.now(),
                userId: session.id,
                title: title,
                content: content,
                createdAt: now.toISOString(),
                updatedAt: now.toISOString()
            };
            currentNoteId = note.id;
        }

        await Storage.saveNote(note, session.id);

        markSaved();
        Swal.fire({
            icon: 'success',
            title: 'Saved!',
            text: 'Note saved successfully',
            timer: 1500,
            showConfirmButton: false
        });
    });

    // Warning on close
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Check for note parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const noteId = urlParams.get('note');
    if (noteId) {
        const notes = await Storage.getNotes(session.id);
        const note = notes.find(n => n.id === noteId);
        if (note) {
            currentNoteId = note.id;
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            markSaved();
        }
    }
});
