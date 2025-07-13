const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node.js Express MySQL ORM API',
      version: '1.0.0',
      description: 'A professional REST API built with Express.js, MySQL, and Sequelize ORM',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3000}`,
        description: 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['firstName', 'lastName', 'email'],
          properties: {
            id: {
              type: 'integer',
              description: 'User ID'
            },
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User first name'
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              description: 'User last name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the user is active'
            },
            lastLoginAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last login timestamp'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account creation timestamp'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Account last update timestamp'
            }
          }
        },
        UserRegistration: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'User'
            },
            lastName: {
              type: 'string',
              minLength: 2,
              maxLength: 50,
              example: 'Doe'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              minLength: 6,
              pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)',
              example: 'Password123',
              description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            }
          }
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com'
            },
            password: {
              type: 'string',
              example: 'Password123'
            }
          }
        },
        Product: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            id: {
              type: 'integer',
              description: 'Product ID'
            },
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              description: 'Product name'
            },
            description: {
              type: 'string',
              description: 'Product description'
            },
            price: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              description: 'Product price'
            },
            stock: {
              type: 'integer',
              minimum: 0,
              description: 'Product stock quantity'
            },
            category: {
              type: 'string',
              description: 'Product category'
            },
            isActive: {
              type: 'boolean',
              description: 'Whether the product is active'
            },
            userId: {
              type: 'integer',
              description: 'ID of the user who created the product'
            },
            user: {
              $ref: '#/components/schemas/User'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        ProductInput: {
          type: 'object',
          required: ['name', 'price', 'category'],
          properties: {
            name: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              example: 'MacBook Pro'
            },
            description: {
              type: 'string',
              example: 'Apple MacBook Pro 16-inch with M2 chip'
            },
            price: {
              type: 'number',
              format: 'decimal',
              minimum: 0,
              example: 2499.99
            },
            stock: {
              type: 'integer',
              minimum: 0,
              example: 5
            },
            category: {
              type: 'string',
              example: 'Electronics'
            }
          }
        },
        AuthResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Login successful'
            },
            data: {
              type: 'object',
              properties: {
                user: {
                  $ref: '#/components/schemas/User'
                },
                token: {
                  type: 'string',
                  example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string'
            },
            data: {
              type: 'object'
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: {
                    type: 'string'
                  },
                  message: {
                    type: 'string'
                  }
                }
              }
            }
          }
        },
        PaginatedProductsResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                products: {
                  type: 'array',
                  items: {
                    $ref: '#/components/schemas/Product'
                  }
                },
                pagination: {
                  type: 'object',
                  properties: {
                    currentPage: {
                      type: 'integer',
                      example: 1
                    },
                    totalPages: {
                      type: 'integer',
                      example: 5
                    },
                    totalItems: {
                      type: 'integer',
                      example: 50
                    },
                    itemsPerPage: {
                      type: 'integer',
                      example: 10
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
}

const specs = swaggerJsdoc(options)

module.exports = {
  swaggerUi,
  specs
}
