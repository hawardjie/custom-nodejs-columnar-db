const { v4: uuidv4 } = require('uuid');

class ColumnStore {
  constructor() {
    this.databases = new Map();
  }

  createDatabase(dbName) {
    if (!this.databases.has(dbName)) {
      this.databases.set(dbName, new Map());
    }
    return this.databases.get(dbName);
  }

  createTable(dbName, tableName, columns) {
    const db = this.databases.get(dbName);
    if (!db) {
      throw new Error(`Database ${dbName} not found`);
    }

    const table = {
      columns: {},
      metadata: {
        columnDefinitions: columns,
        rowCount: 0,
      },
    };

    // Initialize columns
    columns.forEach((col) => {
      table.columns[col.name] = [];
    });

    db.set(tableName, table);
  }

  insert(dbName, tableName, data) {
    const db = this.databases.get(dbName);
    if (!db) {
      throw new Error(`Database ${dbName} not found`);
    }

    const table = db.get(tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found`);
    }

    // Insert record
    Object.keys(data).forEach((columnName) => {
      if (table.columns[columnName] !== undefined) {
        table.columns[columnName].push(data[columnName]);
      }
    });

    table.metadata.rowCount++;
  }

  select(dbName, tableName, columnNames = []) {
    const db = this.databases.get(dbName);
    if (!db) {
      throw new Error(`Database ${dbName} not found`);
    }

    const table = db.get(tableName);
    if (!table) {
      throw new Error(`Table ${tableName} not found`);
    }

    const cols =
      columnNames.length > 0 ? columnNames : Object.keys(table.columns);
    const result = [];

    // Convert columnar data back to row format for output
    for (let i = 0; i < table.metadata.rowCount; i++) {
      const row = {};
      cols.forEach((colName) => {
        row[colName] = table.columns[colName][i];
      });
      result.push(row);
    }

    return result;
  }
}

/*----------------------------------------------------------------
const db = new ColumnStore();
const dbName = 'investmentDB';
const investorsTableName = 'investors';
const stocksTableName = 'stocks';
const transactionsTableName = 'transactions';
const portfoliosTableName = 'portfolios';
const marketDataTableName = 'marketData';
const watchListTableName = 'watchList';

// Create database
db.createDatabase(dbName);

// Create table investors
db.createTable(dbName, investorsTableName, [
  { name: 'investorId', type: 'string' },
  { name: 'firstName', type: 'string' },
  { name: 'lastName', type: 'string' },
  { name: 'email', type: 'string' },
  { name: 'status', type: 'string' },
  { name: 'createdAt', type: 'date' },
]);

// Create table stocks
db.createTable(dbName, stocksTableName, [
  { name: 'stockId', type: 'string' },
  { name: 'tickerSymbol', type: 'string' }, // AAPL, ORCL
  { name: 'companyName', type: 'string' },
  { name: 'market', type: 'string' }, // NYSE, NASDAQ
]);

// Create table transactions
db.createTable(dbName, transactionsTableName, [
  { name: 'transactionId', type: 'string' },
  { name: 'investorId', type: 'string' },
  { name: 'stockId', type: 'string' },
  { name: 'transactionType', type: 'string' },
  { name: 'quantity', type: 'number' },
  { name: 'pricePerShare', type: 'number' },
  { name: 'transactionDate', type: 'date' },
]);

// Create table portfolios
db.createTable(dbName, portfoliosTableName, [
  { name: 'investorId', type: 'string' },
  { name: 'stockId', type: 'string' },
  { name: 'quantityOwned', type: 'number' },
]);

// Create table marketData
db.createTable(dbName, marketDataTableName, [
  { name: 'stockId', type: 'string' },
  { name: 'date', type: 'date' },
  { name: 'openPrice', type: 'number' },
  { name: 'closePrice', type: 'number' },
  { name: 'highPrice', type: 'number' },
  { name: 'lowPrice', type: 'number' },
  { name: 'volume', type: 'number' },
]);

// Create table watchList
db.createTable(dbName, watchListTableName, [
  { name: 'watchListId', type: 'string' },
  { name: 'investorId', type: 'string' },
  { name: 'stockId', type: 'string' },
  { name: 'addedDate', type: 'date' },
]);

// Insert records into table(s)
db.insert(dbName, investorsTableName, {
  investorId: uuidv4(),
  firstName: 'Haward',
  lastName: 'Jie',
  email: 'haward.jie@columnardb.com',
  createdAt: new Date(),
  status: 'Active',
});

db.insert(dbName, investorsTableName, {
  investorId: uuidv4(),
  firstName: 'Mary',
  lastName: 'Smith',
  email: 'mary.smith@columnardb.com',
  status: 'Active',
  createdAt: new Date(),
});

// Query example
console.log(
  'investors:',
  db.select(dbName, investorsTableName, ['investorId', 'firstName', 'email'])
);

----------------------------------------------------------------*/

module.exports = ColumnStore;
