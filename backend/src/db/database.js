const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const config = require('../config/env');
const fs = require('fs');


const dbDir = path.dirname(config.DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new sqlite3.Database(config.DB_PATH, (err) => {
  if (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database:', config.DB_PATH);
});


db.run('PRAGMA foreign_keys = ON');

const SCHEMA = `
-- Users
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  passwordHash TEXT NOT NULL,
  createdAt INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updatedAt INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Pets
CREATE TABLE IF NOT EXISTS pets (
  id TEXT PRIMARY KEY,
  ownerId TEXT NOT NULL,
  name TEXT NOT NULL,
  funFacts TEXT NOT NULL,
  image TEXT,
  enabled INTEGER DEFAULT 1 NOT NULL,
  createdAt INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  updatedAt INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  
  FOREIGN KEY (ownerId) REFERENCES users(id) 
    ON DELETE CASCADE 
    ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_pets_ownerId ON pets(ownerId);
CREATE INDEX IF NOT EXISTS idx_pets_enabled ON pets(enabled);
CREATE INDEX IF NOT EXISTS idx_pets_createdAt ON pets(createdAt DESC);

-- Likes (CONSTRAINT CRÍTICO: Un usuario solo puede likear una vez por mascota)
CREATE TABLE IF NOT EXISTS likes (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,
  petId TEXT NOT NULL,
  createdAt INTEGER DEFAULT (strftime('%s', 'now')) NOT NULL,
  
  UNIQUE(userId, petId),
  
  FOREIGN KEY (userId) REFERENCES users(id) 
    ON DELETE CASCADE,
  FOREIGN KEY (petId) REFERENCES pets(id) 
    ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_likes_userId ON likes(userId);
CREATE INDEX IF NOT EXISTS idx_likes_petId ON likes(petId);
`;

function initializeSchema() {
  return new Promise((resolve, reject) => {
    db.exec(SCHEMA, (err) => {
      if (err) {
        console.error('Schema initialization error:', err);
        reject(err);
      } else {
        console.log('Database schema initialized');
        resolve();
      }
    });
  });
}


function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve({ id: this.lastID, changes: this.changes });
      }
    });
  });
}


function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err);
      } else {
        resolve(row);
      }
    });
  });
}


function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

module.exports = {
  db,
  initializeSchema,
  run,
  get,
  all,
};
