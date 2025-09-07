const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate PowerBI requests
 * Verifies JWT token and adds user info to request
 */
const powerbiAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided or invalid format'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add user information to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name
    };

    next();
  } catch (error) {
    console.error('PowerBI auth middleware error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Authentication error'
    });
  }
};

/**
 * Optional middleware to check if user has PowerBI access
 * This can be extended to check user permissions/roles
 */
const checkPowerBIAccess = (req, res, next) => {
  try {
    // For now, all authenticated users have access
    // You can extend this to check specific roles or permissions
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Example: Check if user has PowerBI access role
    // if (!user.roles || !user.roles.includes('powerbi_user')) {
    //   return res.status(403).json({
    //     success: false,
    //     message: 'Insufficient permissions for PowerBI access'
    //   });
    // }

    next();
  } catch (error) {
    console.error('PowerBI access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Access check error'
    });
  }
};

/**
 * Middleware to validate PowerBI resource IDs
 */
const validatePowerBIResource = (req, res, next) => {
  try {
    const { reportId, dashboardId } = req.params;
    
    // Validate report ID format (PowerBI GUID format)
    if (reportId && !isValidGUID(reportId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid report ID format'
      });
    }
    
    // Validate dashboard ID format (PowerBI GUID format)
    if (dashboardId && !isValidGUID(dashboardId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid dashboard ID format'
      });
    }
    
    next();
  } catch (error) {
    console.error('PowerBI resource validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Resource validation error'
    });
  }
};

/**
 * Helper function to validate GUID format
 */
function isValidGUID(guid) {
  const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return guidRegex.test(guid);
}

/**
 * Middleware to log PowerBI API usage
 */
const logPowerBIUsage = (req, res, next) => {
  const startTime = Date.now();
  
  // Log the request
  console.log(`PowerBI API Request: ${req.method} ${req.path}`, {
    user: req.user?.email,
    timestamp: new Date().toISOString(),
    userAgent: req.headers['user-agent']
  });
  
  // Override res.json to log response time
  const originalJson = res.json;
  res.json = function(data) {
    const duration = Date.now() - startTime;
    console.log(`PowerBI API Response: ${req.method} ${req.path}`, {
      user: req.user?.email,
      duration: `${duration}ms`,
      success: data.success,
      timestamp: new Date().toISOString()
    });
    
    return originalJson.call(this, data);
  };
  
  next();
};

module.exports = {
  powerbiAuth,
  checkPowerBIAccess,
  validatePowerBIResource,
  logPowerBIUsage
};
