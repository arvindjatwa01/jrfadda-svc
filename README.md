# Node.js Express MySQL ORM Project

A professional Node.js REST API built with Express.js, MySQL, and Sequelize ORM.

## Features

- 🚀 **Express.js** - Fast, unopinionated web framework
- 🗄️ **MySQL** - Reliable relational database
- 🔗 **Sequelize ORM** - Modern JavaScript ORM for MySQL
- 🔐 **JWT Authentication** - Secure user authentication
- ✅ **Input Validation** - Express-validator for request validation
- 🛡️ **Security** - Helmet, CORS, bcrypt password hashing
- 📝 **Logging** - Morgan for HTTP request logging
- 🧪 **Testing** - Jest and Supertest for testing
- 📊 **Code Quality** - ESLint for code linting
- 🔄 **Auto-reload** - Nodemon for development
- 📖 **API Documentation** - Swagger/OpenAPI 3.0 with interactive UI

## Project Structure

```
src/
├── config/
│   └── database.js          # Database configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   └── productController.js # Product CRUD operations
├── middleware/
│   ├── authMiddleware.js    # JWT authentication middleware
│   ├── errorMiddleware.js   # Error handling middleware
│   └── validationMiddleware.js # Request validation
├── models/
│   ├── User.js             # User model
│   ├── Product.js          # Product model
│   └── index.js            # Model associations
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── productRoutes.js    # Product routes
│   └── index.js            # Route aggregation
└── server.js               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (>= 16.0.0)
- MySQL (>= 8.0)
- npm (>= 8.0.0)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd basic_node_mysql_orm_project
   ```

2. **Quick Setup (Windows)**
   ```bash
   setup.bat
   ```
   
   **Manual Setup:**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   copy .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   NODE_ENV=development
   PORT=3000
   
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=myapp_db
   DB_USER=root
   DB_PASSWORD=your_password
   
   JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_secure
   JWT_EXPIRES_IN=7d
   
   BCRYPT_SALT_ROUNDS=12
   API_VERSION=v1
   ```

4. **Database Setup**
   
   Create the database in MySQL:
   ```sql
   CREATE DATABASE myapp_db;
   ```
   
   Setup tables and seed data:
   ```bash
   npm run db:setup
   ```

5. **Start the application**
   
   Development mode:
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

6. **Access the API**
   
   - **API Base URL**: `http://localhost:3000/api/v1`
   - **API Documentation**: `http://localhost:3000/api-docs`
   - **Health Check**: `http://localhost:3000/health`

## API Documentation

This project includes comprehensive **Swagger/OpenAPI 3.0** documentation with an interactive UI.

### Accessing Documentation

- **Interactive Swagger UI**: `http://localhost:3000/api-docs`
- **OpenAPI JSON**: `http://localhost:3000/api-docs.json`

### Documentation Features

- 📋 **Complete API Reference** - All endpoints documented with examples
- 🔒 **Authentication Support** - Built-in JWT authentication testing
- 📝 **Request/Response Schemas** - Detailed data models and validation rules
- 🧪 **Interactive Testing** - Test API endpoints directly from the browser
- 📊 **Error Responses** - Comprehensive error handling documentation
- 🎯 **Parameter Validation** - Query parameters, path parameters, and request body validation

### Using the Swagger UI

1. Start the development server: `npm run dev`
2. Open your browser and navigate to `http://localhost:3000/api-docs`
3. Explore the available endpoints and their documentation
4. For protected endpoints:
   - First authenticate using the `/auth/login` endpoint
   - Copy the JWT token from the response
   - Click the "Authorize" button in Swagger UI
   - Enter: `Bearer YOUR_JWT_TOKEN`
   - Test protected endpoints

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/auth/register` | Register new user | No |
| POST | `/api/v1/auth/login` | Login user | No |
| GET | `/api/v1/auth/profile` | Get user profile | Yes |
| PUT | `/api/v1/auth/profile` | Update user profile | Yes |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/products` | Get all products | No |
| GET | `/api/v1/products/:id` | Get product by ID | No |
| POST | `/api/v1/products` | Create new product | Yes |
| PUT | `/api/v1/products/:id` | Update product | Yes |
| DELETE | `/api/v1/products/:id` | Delete product | Yes |
| GET | `/api/v1/products/user/my-products` | Get user's products | Yes |

## Request Examples

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "Password123"
  }'
```

### Login User
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "Password123"
  }'
```

### Create Product
```bash
curl -X POST http://localhost:3000/api/v1/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 999.99,
    "stock": 10,
    "category": "Electronics"
  }'
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

## Code Quality

Lint code:
```bash
npm run lint
```

Fix linting issues:
```bash
npm run lint:fix
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run db:sync` - Create/update database tables
- `npm run db:seed` - Seed database with sample data
- `npm run db:setup` - Setup database (sync + seed)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_NAME` | Database name | - |
| `DB_USER` | Database user | - |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `BCRYPT_SALT_ROUNDS` | Bcrypt salt rounds | `12` |
| `API_VERSION` | API version | `v1` |

## Security Features

- **Password Hashing**: bcrypt with configurable salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive request validation
- **Security Headers**: Helmet.js for security headers
- **CORS**: Cross-Origin Resource Sharing support
- **Rate Limiting**: Built-in protection against abuse

## Best Practices Implemented

- ✅ Proper error handling and logging
- ✅ Input validation and sanitization
- ✅ Secure password storage
- ✅ JWT token authentication
- ✅ Database connection pooling
- ✅ Environment-based configuration
- ✅ Code linting and formatting
- ✅ Comprehensive testing
- ✅ API documentation
- ✅ Proper HTTP status codes
- ✅ Pagination for list endpoints
- ✅ Soft delete for data integrity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Submit a pull request

## License

This project is licensed under the MIT License.
