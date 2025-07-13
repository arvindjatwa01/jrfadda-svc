const User = require('./User')
const Product = require('./Product')

// Define associations
User.hasMany(Product, {
  foreignKey: 'userId',
  as: 'products'
})

Product.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
})

module.exports = {
  User,
  Product
}
