import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * @param {Object} user 
 * @returns {string} 
 */
const generateToken = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
    googleId: user.googleId
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify JWT token
 * @param {string} token 
 * @returns {Object} 
 */
const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader 
 * @returns {string|null} 
 */
const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
  //substring 7 letter chor ke return karega jisse Bearer and ek space reh jayega only token jayega
};

module.exports = {
  generateToken,
  verifyToken,
  extractTokenFromHeader
};
