const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve frontend static files

const DATA_DIR = path.join(__dirname, 'json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const NOTES_FILE = path.join(DATA_DIR, 'notepad.json');

// Ensure data directory exists
async function ensureDataFiles() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch(e) {}

    try {
        await fs.access(USERS_FILE);
    } catch {
        await fs.writeFile(USERS_FILE, '[]');
    }

    try {
        await fs.access(NOTES_FILE);
    } catch {
        await fs.writeFile(NOTES_FILE, '[]');
    }
}

// Helpers
async function readJSON(file) {
    try {
        const data = await fs.readFile(file, 'utf8');
        return JSON.parse(data || '[]');
    } catch (e) {
        return [];
    }
}

async function writeJSON(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Routes
app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    const users = await readJSON(USERS_FILE);

    if (users.find(u => u.username === username)) {
        return res.status(400).json({ error: 'Username taken' });
    }

    const newUser = { id: 'user_' + Date.now(), username, password };
    users.push(newUser);
    await writeJSON(USERS_FILE, users);
    res.json(newUser);
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const users = await readJSON(USERS_FILE);
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) res.json(user);
    else res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/notes', async (req, res) => {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    
    const notes = await readJSON(NOTES_FILE);
    const userNotes = notes.filter(n => n.userId === userId);
    res.json(userNotes);
});

app.post('/api/notes', async (req, res) => {
    const note = req.body; // Full note object including userId
    if (!note.userId) return res.status(400).json({ error: 'Missing userId' });

    let notes = await readJSON(NOTES_FILE);
    const index = notes.findIndex(n => n.id === note.id);
    
    if (index !== -1) {
        notes[index] = note;
    } else {
        notes.push(note);
    }
    
    await writeJSON(NOTES_FILE, notes);
    res.json({ success: true });
});

app.delete('/api/notes/:id', async (req, res) => {
    const { id } = req.params;
    let notes = await readJSON(NOTES_FILE);
    notes = notes.filter(n => n.id !== id);
    await writeJSON(NOTES_FILE, notes);
    res.json({ success: true });
});

app.delete('/api/user/:userId', async (req, res) => {
    const { userId } = req.params;
    
    // Delete user
    let users = await readJSON(USERS_FILE);
    users = users.filter(u => u.id !== userId);
    await writeJSON(USERS_FILE, users);
    
    // Delete all user's notes
    let notes = await readJSON(NOTES_FILE);
    notes = notes.filter(n => n.userId !== userId);
    await writeJSON(NOTES_FILE, notes);
    
    res.json({ success: true });
});

// Start
ensureDataFiles().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
});
