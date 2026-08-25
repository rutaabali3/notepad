require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Import Models
const User = require('./models/User');
const Note = require('./models/Note');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); 

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Error:', err));

// Routes
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Basic unique check
        const existing = await User.findOne({ username });
        if (existing) return res.status(400).json({ error: 'Username taken' });

        const user = await User.create({ username, password });
        // Return user object mapping _id to id for frontend compatibility
        res.json({ id: user._id, username: user.username });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username, password });
        
        if (user) {
            res.json({ id: user._id, username: user.username });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/notes', async (req, res) => {
    try {
        const { userId } = req.query;
        if (!userId) return res.status(400).json({ error: 'Missing userId' });
        
        const notes = await Note.find({ userId });
        // Map _id to id for frontend compatibility
        const mappedNotes = notes.map(n => ({
            id: n._id,
            userId: n.userId,
            title: n.title,
            content: n.content,
            updatedAt: n.updatedAt
        }));
        res.json(mappedNotes);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.post('/api/notes', async (req, res) => {
    try {
        const { id, userId, title, content } = req.body;
        if (!userId) return res.status(400).json({ error: 'Missing userId' });

        // If ID starts with "note_", it's a new note from frontend thinking (local logic).
        // Or if it's undefined. 
        // We will treat MongoDB _id as the source of truth.
        // If the ID coming in is a valid Mongo ObjectId, update it. If not, create new.
        
        let note;
        if (id && mongoose.Types.ObjectId.isValid(id)) {
            note = await Note.findByIdAndUpdate(id, { title, content, updatedAt: Date.now() }, { new: true });
        } 
        
        if (!note) {
             note = await Note.create({ userId, title, content });
        }

        res.json({ success: true, id: note._id });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/notes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Note.findByIdAndDelete(id);
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.delete('/api/user/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        await User.findByIdAndDelete(userId);
        await Note.deleteMany({ userId });
        res.json({ success: true });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
