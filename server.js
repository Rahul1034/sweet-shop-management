const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database initialization
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  // Create Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      email TEXT UNIQUE,
      password TEXT,
      isAdmin BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create Sweets table
  db.run(`
    CREATE TABLE IF NOT EXISTS sweets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      price REAL,
      quantity INTEGER,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insert sample data
  db.run("INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)",
    ['Laddu', 'Traditional', 50, 100]);
  db.run("INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)",
    ['Barfi', 'Dry Sweets', 150, 50]);
});

// Authentication middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    next();
  });
};

// Routes

// Auth - Register
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);
  
  db.run(
    'INSERT INTO users (username, email, password, isAdmin) VALUES (?, ?, ?, 0)',
    [username, email, hashedPassword],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, username, email });
    }
  );
});

// Auth - Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) return res.status(401).json({ error: 'User not found' });
    
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign({ id: user.id, isAdmin: user.isAdmin }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, isAdmin: user.isAdmin } });
  });
});

// Sweets - Get all
app.get('/api/sweets', verifyToken, (req, res) => {
  db.all('SELECT * FROM sweets', (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Sweets - Search
app.get('/api/sweets/search', verifyToken, (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let query = 'SELECT * FROM sweets WHERE 1=1';
  const params = [];
  
  if (name) {
    query += ' AND name LIKE ?';
    params.push(`%${name}%`);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (minPrice) {
    query += ' AND price >= ?';
    params.push(minPrice);
  }
  if (maxPrice) {
    query += ' AND price <= ?';
    params.push(maxPrice);
  }
  
  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Sweets - Create
app.post('/api/sweets', verifyToken, (req, res) => {
  const { name, category, price, quantity } = req.body;
  
  db.run(
    'INSERT INTO sweets (name, category, price, quantity) VALUES (?, ?, ?, ?)',
    [name, category, price, quantity],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.status(201).json({ id: this.lastID, name, category, price, quantity });
    }
  );
});

// Sweets - Update (Admin only)
app.put('/api/sweets/:id', verifyToken, (req, res) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Admin access required' });
  
  const { name, category, price, quantity } = req.body;
  db.run(
    'UPDATE sweets SET name = ?, category = ?, price = ?, quantity = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
    [name, category, price, quantity, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ id: req.params.id, name, category, price, quantity });
    }
  );
});

// Sweets - Delete (Admin only)
app.delete('/api/sweets/:id', verifyToken, (req, res) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Admin access required' });
  
  db.run('DELETE FROM sweets WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(400).json({ error: err.message });
    res.json({ message: 'Sweet deleted' });
  });
});

// Inventory - Purchase
app.post('/api/sweets/:id/purchase', verifyToken, (req, res) => {
  const { quantity } = req.body || { quantity: 1 };
  
  db.get('SELECT * FROM sweets WHERE id = ?', [req.params.id], (err, sweet) => {
    if (err || !sweet) return res.status(404).json({ error: 'Sweet not found' });
    if (sweet.quantity < quantity) return res.status(400).json({ error: 'Insufficient inventory' });
    
    db.run(
      'UPDATE sweets SET quantity = quantity - ? WHERE id = ?',
      [quantity, req.params.id],
      function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: 'Purchase successful', newQuantity: sweet.quantity - quantity });
      }
    );
  });
});

// Inventory - Restock (Admin only)
app.post('/api/sweets/:id/restock', verifyToken, (req, res) => {
  if (!req.isAdmin) return res.status(403).json({ error: 'Admin access required' });
  
  const { quantity } = req.body;
  db.run(
    'UPDATE sweets SET quantity = quantity + ? WHERE id = ?',
    [quantity, req.params.id],
    function(err) {
      if (err) return res.status(400).json({ error: err.message });
      res.json({ message: 'Restock successful' });
    }
  );
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Sweet Shop API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Sweet Shop Management API running on port ${PORT}`);
});

module.exports = app;
