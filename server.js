const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Setup DB
const db = new sqlite3.Database('./notes.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT NOT NULL
    )`);
});

app.use(bodyParser.json());
app.use(express.static('.')); // Serve index.html

// Save note
app.post('/save', (req, res) => {
    const note = req.body.note;

    if (!note || note.trim() === "") {
        return res.status(400).send("Note is empty!");
    }

    db.run(`INSERT INTO notes (content) VALUES (?)`, [note], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Failed to save note");
        }
        res.send("Note saved successfully!");
    });
});

// Get all notes
app.get('/notes', (req, res) => {
    db.all(`SELECT * FROM notes`, [], (err, rows) => {
        if (err) {
            console.error(err.message);
            return res.status(500).send("Failed to get notes");
        }
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
