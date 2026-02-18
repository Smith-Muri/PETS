const jwt = require('jsonwebtoken');
const config = require('../config/env');


function generateToken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRY,
  });
}

/**
 * Verifica token y retorna payload
 * @throws Error si token es inválido o expirado
 */
function verifyToken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}


function extractTokenFromHeader(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
}

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader,
};
