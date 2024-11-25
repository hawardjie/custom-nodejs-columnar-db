const express = require('express');
const { v4: uuidv4 } = require('uuid');
const ColumnStore = require('./column-store');
const app = express();
const port = 3000;

// Middleware
app.use(express.json());

// Initialize database
const db = new ColumnStore();
const dbName = 'investmentDB';
db.createDatabase(dbName);

// Initialize tables
const tables = {
  investors: [
    { name: 'investorId', type: 'string' },
    { name: 'firstName', type: 'string' },
    { name: 'lastName', type: 'string' },
    { name: 'email', type: 'string' },
    { name: 'status', type: 'string' },
    { name: 'createdAt', type: 'date' },
  ],
  stocks: [
    { name: 'stockId', type: 'string' },
    { name: 'tickerSymbol', type: 'string' },
    { name: 'companyName', type: 'string' },
    { name: 'market', type: 'string' },
  ],
};

// Create tables
Object.entries(tables).forEach(([tableName, columns]) => {
  db.createTable(dbName, tableName, columns);
});

// =================================================================
// API Routes
// =================================================================

// Create record
app.post('/api/table/:tableName/create', (req, res) => {
  try {
    const { tableName } = req.params;
    const data = { ...req.body };

    // Add ID if not provided
    if (!data[`${tableName.slice(0, -1)}Id`]) {
      data[`${tableName.slice(0, -1)}Id`] = uuidv4();
    }

    // Add createdAt if applicable
    if (tables[tableName].some((col) => col.name === 'createdAt')) {
      data.createdAt = new Date();
    }

    db.insert(dbName, tableName, data);
    res
      .status(201)
      .json({ message: `Record created into table ${tableName} successfully` });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all records
app.get('/api/table/:tableName', (req, res) => {
  try {
    const { tableName } = req.params;
    const result = db.select(dbName, tableName);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get specific columns
app.get('/api/table/:tableName/columns', (req, res) => {
  try {
    const { tableName } = req.params;
    const { columns } = req.query;
    const columnArray = columns ? columns.split(',') : [];
    const result = db.select(dbName, tableName, columnArray);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
