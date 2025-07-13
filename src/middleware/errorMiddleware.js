const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  res.status(404)
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Sequelize validation error
  if (err.name === 'SequelizeValidationError') {
    statusCode = 400
    message = err.errors.map(error => error.message).join(', ')
  }

  // Sequelize unique constraint error
  if (err.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409
    message = 'Resource already exists'
  }

  // Sequelize foreign key constraint error
  if (err.name === 'SequelizeForeignKeyConstraintError') {
    statusCode = 400
    message = 'Invalid reference to related resource'
  }

  // JWT error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401
    message = 'Invalid token'
  }

  // JWT expired error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401
    message = 'Token expired'
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

module.exports = {
  notFound,
  errorHandler
}
