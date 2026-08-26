/**
 * Saved notes page logic for the local-only notepad.
 */

document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
    document.getElementById('search-notes').addEventListener('input', renderNotes);
});

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function renderNotes() {
    const list = document.getElementById('notes-list');
    const search = document.getElementById('search-notes').value.toLowerCase().trim();
    const terms = search.split(/\s+/).filter(Boolean);
    const notes = Storage.getNotes().filter(note => {
        const searchableText = `${note.title} ${note.content}`.toLowerCase();
        return terms.every(term => searchableText.includes(term));
    });
    const summary = document.getElementById('search-summary');

    summary.textContent = search
        ? `${notes.length} note${notes.length === 1 ? '' : 's'} found for “${search}”`
        : `${notes.length} note${notes.length === 1 ? '' : 's'} saved`;
    list.innerHTML = '';

    if (notes.length === 0) {
        list.innerHTML = `
            <div class="col-12 text-center mt-5">
                <i class="bi bi-journal-x fs-1 text-muted"></i>
                <p class="text-muted mt-2">${search ? `No notes match “${escapeHtml(search)}”.` : 'No notes saved yet.'}</p>
                <a href="notepad.html" class="btn btn-primary btn-sm mt-2">Create New Note</a>
            </div>`;
        return;
    }

    notes.forEach(note => {
        const date = new Date(note.updatedAt).toLocaleDateString() + ' ' + new Date(note.updatedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card h-100 note-card" role="button" tabindex="0">
                <div class="card-body position-relative d-flex flex-column">
                    <h5 class="card-title text-truncate fw-bold mb-2">${escapeHtml(note.title)}</h5>
                    <p class="card-text text-muted small mb-3">${escapeHtml(note.content.substring(0, 140))}${note.content.length > 140 ? '…' : ''}</p>
                    <div class="d-flex justify-content-between align-items-center mt-auto">
                        <small class="note-date"><i class="bi bi-clock me-1"></i>${escapeHtml(date)}</small>
                        <button class="btn btn-sm btn-outline-danger btn-delete-note rounded-circle p-1" aria-label="Delete ${escapeHtml(note.title)}" style="width: 30px; height: 30px;">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const card = col.querySelector('.note-card');
        card.addEventListener('click', () => openNote(note.id));
        card.addEventListener('keydown', event => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openNote(note.id);
            }
        });
        col.querySelector('.btn-delete-note').addEventListener('click', event => deleteNote(event, note.id));
        list.appendChild(col);
    });
}

function openNote(noteId) {
    window.location.href = `notepad.html?note=${encodeURIComponent(noteId)}`;
}

async function deleteNote(event, noteId) {
    event.stopPropagation();
    const result = await Swal.fire({
        title: 'Delete Note?',
        text: 'This will remove the note from this browser.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        Storage.deleteNote(noteId);
        renderNotes();
        Swal.fire('Deleted!', 'Your note has been deleted locally.', 'success');
    }
}
