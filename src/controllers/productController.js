const { Product, User } = require('../models')
const { Op } = require('sequelize')

class ProductController {
  // Get all products with pagination
  async getAllProducts(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const offset = (page - 1) * limit
      const category = req.query.category
      const search = req.query.search

      const whereClause = { isActive: true }
      
      if (category) {
        whereClause.category = category
      }

      if (search) {
        whereClause[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { description: { [Op.like]: `%${search}%` } }
        ]
      }

      const { count, rows: products } = await Product.findAndCountAll({
        where: whereClause,
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }],
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      })

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit
          }
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Get single product by ID
  async getProductById(req, res, next) {
    try {
      const { id } = req.params

      const product = await Product.findOne({
        where: { id, isActive: true },
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      })

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found'
        })
      }

      res.json({
        success: true,
        data: {
          product
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Create new product
  async createProduct(req, res, next) {
    try {
      const { name, description, price, stock, category } = req.body
      const userId = req.user.id

      const product = await Product.create({
        name,
        description,
        price,
        stock,
        category,
        userId
      })

      // Fetch the product with user details
      const productWithUser = await Product.findByPk(product.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      })

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: {
          product: productWithUser
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Update product
  async updateProduct(req, res, next) {
    try {
      const { id } = req.params
      const { name, description, price, stock, category } = req.body
      const userId = req.user.id

      const product = await Product.findOne({
        where: { id, userId, isActive: true }
      })

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or you do not have permission to update it'
        })
      }

      await product.update({
        name: name || product.name,
        description: description || product.description,
        price: price || product.price,
        stock: stock || product.stock,
        category: category || product.category
      })

      // Fetch updated product with user details
      const updatedProduct = await Product.findByPk(product.id, {
        include: [{
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email']
        }]
      })

      res.json({
        success: true,
        message: 'Product updated successfully',
        data: {
          product: updatedProduct
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Delete product (soft delete)
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params
      const userId = req.user.id

      const product = await Product.findOne({
        where: { id, userId, isActive: true }
      })

      if (!product) {
        return res.status(404).json({
          success: false,
          message: 'Product not found or you do not have permission to delete it'
        })
      }

      await product.update({ isActive: false })

      res.json({
        success: true,
        message: 'Product deleted successfully'
      })
    } catch (error) {
      next(error)
    }
  }

  // Get user's products
  async getUserProducts(req, res, next) {
    try {
      const userId = req.user.id
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const offset = (page - 1) * limit

      const { count, rows: products } = await Product.findAndCountAll({
        where: { userId, isActive: true },
        limit,
        offset,
        order: [['createdAt', 'DESC']]
      })

      res.json({
        success: true,
        data: {
          products,
          pagination: {
            currentPage: page,
            totalPages: Math.ceil(count / limit),
            totalItems: count,
            itemsPerPage: limit
          }
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new ProductController()
