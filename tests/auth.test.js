const request = require('supertest')
const app = require('../src/server')
const { User, Product } = require('../src/models')

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await User.destroy({ where: {}, force: true })
  })

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123'
      }

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(201)

      expect(res.body.success).toBe(true)
      expect(res.body.data.user.email).toBe(userData.email)
      expect(res.body.data.token).toBeDefined()
    })

    it('should not register user with invalid email', async () => {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'invalid-email',
        password: 'Password123'
      }

      const res = await request(app)
        .post('/api/v1/auth/register')
        .send(userData)
        .expect(400)

      expect(res.body.success).toBe(false)
    })
  })

  describe('POST /api/v1/auth/login', () => {
    it('should login with valid credentials', async () => {
      // First create a user
      const user = await User.create({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123'
      })

      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'john.doe@example.com',
          password: 'Password123'
        })
        .expect(200)

      expect(res.body.success).toBe(true)
      expect(res.body.data.token).toBeDefined()
    })

    it('should not login with invalid credentials', async () => {
      const res = await request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'wrongpassword'
        })
        .expect(401)

      expect(res.body.success).toBe(false)
    })
  })
})
