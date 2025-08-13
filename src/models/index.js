const User = require("./User");
const Admin = require("./Admin");
const Product = require("./Product");
const ExamsCategory = require("./ExamsCategory");
const Category = require("./Category");

// Define associations
User.hasMany(Product, {
    foreignKey: "userId",
    as: "products",
});

Product.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

module.exports = {
    Admin,
    User,
    Product,
    ExamsCategory,
    Category,
};
