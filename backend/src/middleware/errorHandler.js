// errorHandler.js

function errorHandler(err, req, res, next) {
  console.error('Express Error Handler caught:', err);
  
  if (err.message === 'TIMEOUT') {
    return res.status(504).json({
      success: false,
      error: 'TIMEOUT',
      message: 'AI response took too long. Please try again.'
    });
  }

  if (err.name === 'ValidationError' || err.message.includes('VALIDATION')) {
    return res.status(400).json({
      success: false,
      error: 'VALIDATION',
      message: err.message || 'Validation failed. Check your input parameters.'
    });
  }

  res.status(500).json({
    success: false,
    error: 'AI_ERROR',
    message: err.message || 'Unable to generate roadmap. Please try again.'
  });
}

module.exports = errorHandler;
