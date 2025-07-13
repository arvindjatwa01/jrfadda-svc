const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
require('dotenv').config()

const db = require('./config/database')
const routes = require('./routes')
const { errorHandler, notFound } = require('./middleware/errorMiddleware')
const { swaggerUi, specs } = require('./config/swagger')

const app = express()
const PORT = process.env.PORT || 3000

// Security middleware
app.use(helmet())
app.use(cors())
app.use(compression())

// Logging middleware
app.use(morgan('combined'))

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Node.js Express MySQL API Documentation'
}))

// Test database connection
db.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully.')
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err)
  })

// API routes
app.use(`/api/${process.env.API_VERSION || 'v1'}`, routes)

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  })
})

// Root endpoint with API information
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Node.js Express MySQL ORM API',
    version: process.env.API_VERSION || 'v1',
    documentation: `/api-docs`,
    health: '/health',
    api: `/api/${process.env.API_VERSION || 'v1'}`
  })
})

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`)
  console.log(`📚 API documentation: http://localhost:${PORT}/api-docs`)
  console.log(`🔗 API base URL: http://localhost:${PORT}/api/${process.env.API_VERSION || 'v1'}`)
})

module.exports = app
