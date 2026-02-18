const { ZodError } = require('zod');

function errorHandler(err, req, res, next) {
  console.error('Error:', err);


  if (err instanceof ZodError) {
    const errors = err.errors.map(e => ({
      path: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors,
    });
  }


  if (err.code === 'SQLITE_CONSTRAINT' && err.message.includes('UNIQUE')) {
    return res.status(409).json({
      success: false,
      message: 'Resource ya existe (violación de constraint único)',
    });
  }


  if (err.code && err.code.startsWith('SQLITE')) {
    return res.status(500).json({
      success: false,
      message: 'Database error',
    });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }


  return res.status(500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = errorHandler;
