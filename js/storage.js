/**
 * storage.js
 * API Client for Node.js Backend
 */

const API_URL = '/api';

const Storage = {
    // Session State
    session: null,

    init() {
        const saved = sessionStorage.getItem('snp_session');
        if (saved) {
            this.session = JSON.parse(saved);
        }
    },

    // --- User Logic ---

    async createUser(username, password) {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) return false;
            return await res.json();
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    async loginUser(username, password) {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!res.ok) return null;
            return await res.json();
        } catch (e) {
            return null;
        }
    },

    async deleteUser(userId) {
        try {
            const res = await fetch(`${API_URL}/user/${userId}`, {
                method: 'DELETE'
            });
            if (!res.ok) return false;
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    },

    // --- Note Logic ---

    async getNotes(userId) {
        try {
            const res = await fetch(`${API_URL}/notes?userId=${userId}`);
            if (!res.ok) return [];
            return await res.json();
        } catch (e) {
            return [];
        }
    },

    async saveNote(note, userId) {
        note.userId = userId;
        try {
            await fetch(`${API_URL}/notes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(note)
            });
        } catch (e) {
            console.error('Save failed', e);
        }
    },

    async deleteNote(noteId) {
        try {
            await fetch(`${API_URL}/notes/${noteId}`, { method: 'DELETE' });
        } catch (e) {
            console.error('Delete failed', e);
        }
    },

    // --- Session Logic ---

    setSession(user) {
        this.session = user;
        sessionStorage.setItem('snp_session', JSON.stringify(user));
    },

    getSession() {
        return this.session;
    },

    clearSession() {
        this.session = null;
        sessionStorage.removeItem('snp_session');
    }
};

Storage.init();
