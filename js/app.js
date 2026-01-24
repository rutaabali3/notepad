/**
 * app.js
 * Main application logic for Secure Notepad.
 */

// State
let currentNoteId = null;
let hasUnsavedChanges = false;

// Initialize App
window.initApp = function() {
    setupUserInfo();
    setupNavigation();
    setupNotepad();
    setupSettings();
    
    // Load default view
    loadView('notepad');
};

function setupUserInfo() {
    const session = Storage.getSession();
    if (session) {
        document.getElementById('current-user-name').textContent = session.username;
        document.getElementById('settings-username').value = session.username;
        document.getElementById('settings-uid').value = session.id;
    }
}

function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetView = e.currentTarget.getAttribute('data-view');
            
            // Check for unsaved changes before switching
            if (hasUnsavedChanges && targetView !== 'notepad') { // Allow switching back to notepad harmlessly
                 Swal.fire({
                    title: 'Unsaved Changes',
                    text: "You have unsaved work. Do you want to save before leaving?",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Save & Go',
                    cancelButtonText: 'Discard & Go'
                }).then((result) => {
                    if (result.isConfirmed) {
                        saveNote();
                        loadView(targetView);
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        hasUnsavedChanges = false; // Discard changes
                        loadView(targetView);
                    }
                    // If dismissed by clicking outside, stay on page
                });
            } else {
                loadView(targetView);
            }
        });
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        Storage.clearSession();
        location.reload();
    });
}

function loadView(viewName) {
    // Reload page when navigating to ensure fresh data
    location.reload();
}

function setupNotepad() {
    const titleInput = document.getElementById('note-title');
    const contentInput = document.getElementById('note-content');
    const saveBtn = document.getElementById('btn-save');

    // Track changes
    const markUnsaved = () => {
        hasUnsavedChanges = true;
        document.getElementById('save-status').classList.remove('opacity-0');
        document.getElementById('save-status').textContent = 'Unsaved changes';
    };

    titleInput.addEventListener('input', markUnsaved);
    contentInput.addEventListener('input', markUnsaved);

    // Save Action
    saveBtn.addEventListener('click', saveNote);

    // Window close warning
    window.addEventListener('beforeunload', (e) => {
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });
}

async function saveNote() {
    const title = document.getElementById('note-title').value.trim() || 'Untitled Note';
    const content = document.getElementById('note-content').value;
    
    if (!content && !document.getElementById('note-title').value.trim()) {
        Swal.fire('Empty Note', 'Write something before saving!', 'info');
        return;
    }

    const session = Storage.getSession();
    if (!session) return; 

    const now = new Date();
    let note = {};

    if (currentNoteId) {
        // Find existing note to update
        const existingNotes = await Storage.getNotes(session.id);
        const existing = existingNotes.find(n => n.id === currentNoteId);
        if (existing) {
            note = { ...existing };
            note.title = title;
            note.content = content;
            note.updatedAt = now.toISOString();
        }
    } else {
        // Create new
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
    
    // UI Feedback and reload
    hasUnsavedChanges = false;
    Swal.fire({
        icon: 'success',
        title: 'Saved!',
        text: 'Note saved successfully',
        timer: 1000,
        showConfirmButton: false
    }).then(() => {
        location.reload();
    });
}

async function renderSavedNotes() {
    const list = document.getElementById('notes-list');
    const search = document.getElementById('search-notes');
    list.innerHTML = '';

    const session = Storage.getSession();
    const notes = await Storage.getNotes(session.id);

    // Filter logic
    const filterText = search.value.toLowerCase();
    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(filterText) || 
        n.content.toLowerCase().includes(filterText)
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)); // Newest first

    if (filteredNotes.length === 0) {
        list.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="bi bi-journal-x fs-1 text-muted"></i>
                <p class="text-muted mt-2">No notes found.</p>
                <button class="btn btn-primary btn-sm mt-2" onclick="openNote(null)">Create New</button>
            </div>`;
        return;
    }

    filteredNotes.forEach(note => {
        const date = new Date(note.updatedAt).toLocaleDateString() + ' ' + new Date(note.updatedAt).toLocaleTimeString();
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card h-100 note-card" onclick="openNote('${note.id}')">
                <div class="card-body position-relative">
                    <h5 class="card-title text-truncate fw-bold mb-2">${note.title}</h5>
                    <p class="card-text text-muted small text-truncate mb-3" style="max-height: 40px;">${note.content.substring(0, 100)}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <small class="note-date"><i class="bi bi-clock me-1"></i>${date}</small>
                        <button class="btn btn-sm btn-outline-danger btn-delete-note rounded-circle p-1" style="width: 30px; height: 30px;" onclick="deleteNote(event, '${note.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(col);
    });

    search.oninput = () => renderSavedNotes();
}

// Global scope for onclick handlers
window.openNote = async function(noteId) {
    if (noteId) {
        const session = Storage.getSession();
        const notes = await Storage.getNotes(session.id);
        const note = notes.find(n => n.id === noteId);

        if (note) {
            currentNoteId = note.id;
            document.getElementById('note-title').value = note.title;
            document.getElementById('note-content').value = note.content;
            hasUnsavedChanges = false;
        }
    } else {
        // Create new
        currentNoteId = null;
        document.getElementById('note-title').value = '';
        document.getElementById('note-content').value = '';
        hasUnsavedChanges = false;
    }
    loadView('notepad');
};

window.deleteNote = function(event, noteId) {
    event.stopPropagation(); // prevent opening the note
    
    Swal.fire({
        title: 'Delete Note?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await Storage.deleteNote(noteId);
            
            // If current note was deleted, clear context
            if (currentNoteId === noteId) {
                currentNoteId = null;
                document.getElementById('note-title').value = '';
                document.getElementById('note-content').value = '';
            }

            renderSavedNotes();
            Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
        }
    });
};

function setupSettings() {
    document.getElementById('btn-delete-account').addEventListener('click', () => {
        Swal.fire({
            title: 'Are you sure?',
            text: "This will permanently delete your account and all notes!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete everything!'
        }).then((result) => {
            if (result.isConfirmed) {
                const session = Storage.getSession();
                let users = Storage.getUsers();
                users = users.filter(u => u.id !== session.id);
                Storage.saveUsers(users);
                Storage.clearSession();
                
                Swal.fire('Deleted!', 'Account has been removed.', 'success')
                    .then(() => location.reload());
            }
        });
    });

    // Validating backup/restore elements existence just in case
    const btnExport = document.getElementById('btn-export-json');
    if (btnExport) {
        btnExport.addEventListener('click', () => {
            const json = Storage.exportDatabase();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'secure_notepad_backup.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            Swal.fire('Backup Created', 'Your data has been downloaded.', 'success');
        });
    }

    const btnImport = document.getElementById('btn-trigger-import');
    const fileInput = document.getElementById('import-file-input');
    
    if (btnImport && fileInput) {
        btnImport.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                const content = event.target.result;
                Swal.fire({
                    title: 'Restore Data?',
                    text: "This will OVERWRITE all current data!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Yes, Restore'
                }).then((result) => {
                    if (result.isConfirmed) {
                        const success = Storage.importDatabase(content);
                        if (success) {
                            Storage.clearSession(); // Force re-login
                            Swal.fire('Restored!', 'Data restored. Please login again.', 'success')
                                .then(() => location.reload());
                        } else {
                            Swal.fire('Error', 'Invalid backup file.', 'error');
                        }
                    } else {
                        fileInput.value = ''; // Reset
                    }
                });
            };
            reader.readAsText(file);
        });
    }
}
