const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // Keeping as String to match session ID for now
    title: String,
    content: String,
    updatedAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Note', NoteSchema);
