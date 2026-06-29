const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_oxygen_sports';

/**
 * Express middleware to authenticate requests using custom local JWT tokens.
 */
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access token is required'
    });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'UNAUTHORIZED',
      message: 'Access token is empty'
    });
  }

  try {
    // Verify local JWT
    const decoded = jwt.verify(token, JWT_SECRET);

    // Attach validated identity payload to request
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      avatar: decoded.avatar
    };

    next();
  } catch (err) {
    console.error('Error validating local JWT:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'EXPIRED_TOKEN',
        message: 'Your login session has expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      error: 'INVALID_TOKEN',
      message: 'Invalid access session token.'
    });
  }
}

module.exports = authMiddleware;
