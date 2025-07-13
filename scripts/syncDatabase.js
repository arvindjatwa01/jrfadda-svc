require('dotenv').config()
const sequelize = require('../src/config/database')
const { User, Product } = require('../src/models')

async function syncDatabase() {
  try {
    console.log('🔄 Starting database synchronization...')
    
    // Test database connection
    await sequelize.authenticate()
    console.log('✅ Database connection established successfully.')
    
    // Sync all models
    await sequelize.sync({ alter: true })
    console.log('✅ All models were synchronized successfully.')
    
    console.log('🎉 Database setup completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Unable to sync database:', error)
    process.exit(1)
  }
}

syncDatabase()
