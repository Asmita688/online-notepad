const express = require('express');
const bodyParser = require('body-parser');
const { exec } = require('child_process');

const app = express();
app.use(bodyParser.json());
app.use(express.static('.')); // Serve index.html

app.post('/save', (req, res) => {
    let note = req.body.note;

    // Call Python script and pass the note text
    exec(`python save_note.py "${note.replace(/"/g, '\\"')}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send('Failed to save note');
        }
        res.send(stdout || 'Note saved!');
    });
});

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
