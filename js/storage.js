/**
 * Local browser storage for notes.
 * Notes stay on this browser and are not sent to a server.
 */

const NOTES_KEY = 'mynotes_local_notes';

const Storage = {
    notes: [],

    init() {
        try {
            const saved = localStorage.getItem(NOTES_KEY);
            this.notes = saved ? JSON.parse(saved) : [];
            if (!Array.isArray(this.notes)) this.notes = [];
        } catch (error) {
            console.error('Could not read local notes:', error);
            this.notes = [];
        }
    },

    persist() {
        localStorage.setItem(NOTES_KEY, JSON.stringify(this.notes));
    },

    getNotes() {
        return [...this.notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    },

    toPlainText(html) {
        const container = document.createElement('div');
        container.innerHTML = html || '';
        return container.textContent || '';
    },

    sanitizeHtml(html) {
        const container = document.createElement('div');
        container.innerHTML = html || '';
        const allowedTags = new Set([
            'A', 'B', 'BLOCKQUOTE', 'BR', 'EM', 'H1', 'H2', 'H3', 'I', 'LI', 'OL', 'P', 'STRONG', 'U', 'UL'
        ]);

        [...container.querySelectorAll('*')].forEach(element => {
            if (!allowedTags.has(element.tagName)) {
                element.replaceWith(...element.childNodes);
                return;
            }

            [...element.attributes].forEach(attribute => {
                if (element.tagName === 'A' && ['href', 'target', 'rel'].includes(attribute.name)) return;
                element.removeAttribute(attribute.name);
            });

            if (element.tagName === 'A') {
                const href = element.getAttribute('href') || '';
                if (!/^(https?:|mailto:)/i.test(href)) {
                    element.replaceWith(...element.childNodes);
                } else {
                    element.setAttribute('target', '_blank');
                    element.setAttribute('rel', 'noopener noreferrer');
                }
            }
        });

        return container.innerHTML;
    },

    saveNote(note) {
        const now = new Date().toISOString();
        const existingIndex = this.notes.findIndex(item => item.id === note.id);
        const savedNote = {
            id: note.id || `note_${Date.now()}`,
            title: note.title || 'Untitled Note',
            content: this.sanitizeHtml(note.content || ''),
            createdAt: note.createdAt || now,
            updatedAt: now
        };

        if (existingIndex >= 0) {
            this.notes[existingIndex] = savedNote;
        } else {
            this.notes.push(savedNote);
        }

        this.persist();
        return savedNote;
    },

    deleteNote(noteId) {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.persist();
    },

    clearNotes() {
        this.notes = [];
        this.persist();
    },

    exportNotes() {
        return JSON.stringify(this.getNotes(), null, 2);
    },

    importNotes(rawNotes) {
        const imported = JSON.parse(rawNotes);
        if (!Array.isArray(imported)) throw new Error('The selected file does not contain a notes array.');

        const validNotes = imported
            .filter(note => note && typeof note.content === 'string')
            .map(note => ({
                id: note.id || `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
                title: typeof note.title === 'string' && note.title.trim() ? note.title : 'Untitled Note',
                content: this.sanitizeHtml(note.content),
                createdAt: note.createdAt || new Date().toISOString(),
                updatedAt: note.updatedAt || note.createdAt || new Date().toISOString()
            }));

        this.notes = validNotes;
        this.persist();
        return validNotes.length;
    }
};

Storage.init();
