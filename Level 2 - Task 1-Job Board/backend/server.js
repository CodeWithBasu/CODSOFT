const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        
        // Create users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL CHECK(role IN ('employer', 'candidate'))
        )`);

        // Create jobs table
        db.run(`CREATE TABLE IF NOT EXISTS jobs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            company TEXT NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL,
            description TEXT NOT NULL,
            employerId INTEGER NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employerId) REFERENCES users (id)
        )`);

        // Create applications table
        db.run(`CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            jobId INTEGER NOT NULL,
            candidateId INTEGER NOT NULL,
            status TEXT DEFAULT 'pending',
            coverLetter TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (jobId) REFERENCES jobs (id),
            FOREIGN KEY (candidateId) REFERENCES users (id)
        )`);
        
        // Seed initial jobs if empty
        db.get("SELECT COUNT(*) as count FROM jobs", [], (err, row) => {
            if (row && row.count === 0) {
                console.log("Seeding initial jobs data...");
                const stmt = db.prepare("INSERT INTO jobs (title, company, location, type, description, employerId) VALUES (?, ?, ?, ?, ?, ?)");
                stmt.run("Frontend Developer", "TechNova", "Remote", "Full-time", "We are looking for a skilled React developer to build modern UIs.", 1);
                stmt.run("Backend Engineer", "DataSync Systems", "New York, NY", "Full-time", "Design and build scalable server-side systems using Node.js.", 1);
                stmt.run("UI/UX Designer", "Creative Sphere", "San Francisco, CA", "Contract", "Craft beautiful and intuitive user interfaces for our clients.", 2);
                stmt.finalize();
            }
        });
    }
});

// -- API ROUTES --

// Auth & Users
app.post('/api/auth/register', (req, res) => {
    const { name, email, password, role } = req.body;
    db.run(`INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`, 
    [name, email, password, role], function(err) {
        if (err) {
            return res.status(400).json({ error: "Email already exists or invalid data constraints" });
        }
        res.status(201).json({ id: this.lastID, name, email, role, token: "mock-jwt-" + this.lastID });
    });
});

app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    db.get(`SELECT id, name, email, role, password FROM users WHERE email = ?`, [email], (err, user) => {
        if (err || !user) return res.status(401).json({ error: "Invalid credentials" });
        if (user.password !== password) return res.status(401).json({ error: "Invalid credentials" }); // Cleartext comparison for simplicity in assignment
        
        res.json({ id: user.id, name: user.name, email: user.email, role: user.role, token: "mock-jwt-" + user.id });
    });
});

// Jobs
app.get('/api/jobs', (req, res) => {
    const search = req.query.search || '';
    const query = `SELECT * FROM jobs WHERE title LIKE ? OR company LIKE ? ORDER BY createdAt DESC`;
    db.all(query, [`%${search}%`, `%${search}%`], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.get('/api/jobs/:id', (req, res) => {
    db.get(`SELECT * FROM jobs WHERE id = ?`, [req.params.id], (err, row) => {
        if (err) res.status(500).json({ error: err.message });
        else if (!row) res.status(404).json({ error: "Job not found" });
        else res.json(row);
    });
});

app.post('/api/jobs', (req, res) => {
    const { title, company, location, type, description, employerId } = req.body;
    db.run(`INSERT INTO jobs (title, company, location, type, description, employerId) VALUES (?, ?, ?, ?, ?, ?)`,
    [title, company, location, type, description, employerId], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else res.status(201).json({ id: this.lastID, ...req.body });
    });
});

// Employer's Jobs
app.get('/api/employers/:id/jobs', (req, res) => {
    db.all(`SELECT * FROM jobs WHERE employerId = ? ORDER BY createdAt DESC`, [req.params.id], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

// Applications
app.post('/api/applications', (req, res) => {
    const { jobId, candidateId, coverLetter } = req.body;
    db.run(`INSERT INTO applications (jobId, candidateId, coverLetter) VALUES (?, ?, ?)`,
    [jobId, candidateId, coverLetter], function(err) {
        if (err) res.status(500).json({ error: err.message });
        else {
            // Mock email notification
            console.log(`[EMAIL NOTIFICATION]: Application successful for job ${jobId} by candidate ${candidateId}`);
            res.status(201).json({ id: this.lastID, jobId, candidateId });
        }
    });
});

app.get('/api/candidates/:id/applications', (req, res) => {
    const query = `
        SELECT a.id as applicationId, a.status, a.createdAt, j.* 
        FROM applications a
        JOIN jobs j ON a.jobId = j.id
        WHERE a.candidateId = ?
    `;
    db.all(query, [req.params.id], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.get('/api/employers/:id/applications', (req, res) => {
    const query = `
        SELECT a.id, a.status, a.coverLetter, a.createdAt, u.name, u.email, j.title
        FROM applications a
        JOIN jobs j ON a.jobId = j.id
        JOIN users u ON a.candidateId = u.id
        WHERE j.employerId = ?
    `;
    db.all(query, [req.params.id], (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        else res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
