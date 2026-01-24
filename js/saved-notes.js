/**
 * saved-notes.js
 * Saved notes page logic
 */

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

    // Render notes
    await renderNotes();

    // Search
    document.getElementById('search-notes').addEventListener('input', renderNotes);
});

async function renderNotes() {
    const session = Storage.getSession();
    const list = document.getElementById('notes-list');
    const search = document.getElementById('search-notes');
    
    list.innerHTML = '';

    const notes = await Storage.getNotes(session.id);
    const filterText = search.value.toLowerCase();
    const filteredNotes = notes.filter(n =>
        n.title.toLowerCase().includes(filterText) ||
        n.content.toLowerCase().includes(filterText)
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    if (filteredNotes.length === 0) {
        list.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="bi bi-journal-x fs-1 text-muted"></i>
                <p class="text-muted mt-2">No notes found.</p>
                <a href="notepad.html" class="btn btn-primary btn-sm mt-2">Create New</a>
            </div>`;
        return;
    }

    filteredNotes.forEach(note => {
        const date = new Date(note.updatedAt).toLocaleDateString() + ' ' + new Date(note.updatedAt).toLocaleTimeString();
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card h-100 note-card" style="cursor: pointer;" onclick="openNote('${note.id}')">
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
}

function openNote(noteId) {
    window.location.href = `notepad.html?note=${noteId}`;
}

async function deleteNote(event, noteId) {
    event.stopPropagation();

    const result = await Swal.fire({
        title: 'Delete Note?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        await Storage.deleteNote(noteId);
        await renderNotes();
        Swal.fire('Deleted!', 'Your note has been deleted.', 'success');
    }
}
