const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'information.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
        process.exit(1); // stop the server if DB fails
    } else {
        console.log('Connected to SQLite database at', dbPath);
    }
});

// Create table if it doesn't exist
db.run(`
    CREATE TABLE IF NOT EXISTS info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT
    )
`, (err) => {
    if (err) console.error('Error creating table:', err.message);
    else console.log('Table "info" is ready.');
});

// Routes
app.get('/api/info', (req, res) => {
    db.all('SELECT * FROM info', [], (err, rows) => {
        if (err) {
            console.error('Error fetching data:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

app.post('/api/info', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and Email required' });

    db.run('INSERT INTO info (name, email) VALUES (?, ?)', [name, email], function(err) {
        if (err) {
            console.error('Error inserting data:', err.message);
            res.status(500).json({ error: err.message });
        } else {
            res.json({ id: this.lastID, name, email });
        }
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
