const jwt = require('jsonwebtoken')
const { User } = require('../models')

class AuthController {
  // Register a new user
  async register(req, res, next) {
    try {
      const { firstName, lastName, email, password } = req.body

      // Check if user already exists
      const existingUser = await User.findOne({ where: { email } })
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        })
      }

      // Create new user
      const user = await User.create({
        firstName,
        lastName,
        email,
        password
      })

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      )

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          token
        }
      })
    } catch (error) {
      console.log("error --- ", error);
      next(error)
    }
  }

  // Login user
  async login(req, res, next) {
    try {
      const { email, password } = req.body

      // Find user by email
      const user = await User.findOne({ where: { email } })
      if (!user || !user.isActive) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password)
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        })
      }

      // Update last login
      await user.update({ lastLoginAt: new Date() })

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      )

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Get current user profile
  async getProfile(req, res, next) {
    try {
      res.json({
        success: true,
        data: {
          user: req.user
        }
      })
    } catch (error) {
      next(error)
    }
  }

  // Update user profile
  async updateProfile(req, res, next) {
    try {
      const { firstName, lastName } = req.body
      const user = req.user

      await user.update({
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName
      })

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user
        }
      })
    } catch (error) {
      next(error)
    }
  }
}

module.exports = new AuthController()
