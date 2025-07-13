require('dotenv').config()
const { User, Product } = require('../src/models')

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...')

    // Create sample users
    const users = await User.bulkCreate([
      {
        firstName: 'Rajesh',
        lastName: 'Charanwal',
        email: 'rajesh@example.com',
        password: 'rajesh1234'
      },
      // {
      //   firstName: 'Jane',
      //   lastName: 'Smith',
      //   email: 'jane.smith@example.com',
      //   password: 'Password123'
      // }
    ])

    console.log('✅ Sample users created.')

    // Create sample products
    await Product.bulkCreate([
      {
        name: 'MacBook Pro',
        description: 'Apple MacBook Pro 16-inch with M2 chip',
        price: 2499.99,
        stock: 5,
        category: 'Electronics',
        userId: users[0].id
      },
      {
        name: 'iPhone 15',
        description: 'Latest iPhone with advanced camera system',
        price: 999.99,
        stock: 10,
        category: 'Electronics',
        userId: users[0].id
      },
      {
        name: 'Wireless Headphones',
        description: 'Premium noise-cancelling wireless headphones',
        price: 299.99,
        stock: 15,
        category: 'Electronics',
        userId: users[1].id
      },
      {
        name: 'Coffee Mug',
        description: 'Ceramic coffee mug with motivational quotes',
        price: 19.99,
        stock: 50,
        category: 'Home & Kitchen',
        userId: users[1].id
      }
    ])

    console.log('✅ Sample products created.')
    console.log('🎉 Database seeding completed!')
    process.exit(0)
  } catch (error) {
    console.error('❌ Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
