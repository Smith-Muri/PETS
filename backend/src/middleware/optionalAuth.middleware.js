const { extractTokenFromHeader, verifyToken } = require('../utils/jwt');

function optionalAuth(req, res, next) {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    if (!token) return next();
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
  } catch (err) {
    // If token invalid/expired, do not block the request here; downstream may treat as anonymous
    console.warn('optionalAuth: token invalid or expired');
  }
  return next();
}

module.exports = optionalAuth;
