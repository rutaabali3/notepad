/**
 * Local storage settings page logic.
 */

document.addEventListener('DOMContentLoaded', () => {
    const count = document.getElementById('notes-count');
    const importFile = document.getElementById('import-file');

    const refreshCount = () => {
        count.textContent = Storage.getNotes().length;
    };

    document.getElementById('btn-export-notes').addEventListener('click', () => {
        const blob = new Blob([Storage.exportNotes()], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `mynotes-${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        URL.revokeObjectURL(url);
    });

    document.getElementById('btn-import-notes').addEventListener('click', () => importFile.click());

    importFile.addEventListener('change', event => {
        const [file] = event.target.files;
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const importedCount = Storage.importNotes(reader.result);
                refreshCount();
                await Swal.fire('Notes imported', `${importedCount} note${importedCount === 1 ? '' : 's'} imported to this browser.`, 'success');
            } catch (error) {
                Swal.fire('Import failed', error.message || 'Please select a valid MyNotes JSON file.', 'error');
            } finally {
                importFile.value = '';
            }
        };
        reader.readAsText(file);
    });

    document.getElementById('btn-clear-notes').addEventListener('click', async () => {
        if (Storage.getNotes().length === 0) {
            Swal.fire('Nothing to clear', 'There are no notes saved in this browser.', 'info');
            return;
        }

        const result = await Swal.fire({
            title: 'Clear all local notes?',
            text: 'This cannot be undone. Export your notes first if you may need them later.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            confirmButtonText: 'Clear everything'
        });

        if (result.isConfirmed) {
            Storage.clearNotes();
            refreshCount();
            Swal.fire('Notes cleared', 'All notes were removed from this browser.', 'success');
        }
    });

    refreshCount();
});
