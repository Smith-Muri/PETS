require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Base URL of this service (used for building links, CORS, etc.)
  BASE_URL: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3001}`,

  // If frontend runs on a separate host/port we can whitelist it
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',

  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',

  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, '..', 'db', 'pets.db'),

  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads'),
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};
