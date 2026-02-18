require('dotenv').config();
const path = require('path');

module.exports = {
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  

  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
  

  DB_PATH: process.env.DB_PATH || path.resolve(__dirname, '..', 'db', 'pets.db'),
  
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.resolve(__dirname, '..', '..', 'uploads'),
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
};
