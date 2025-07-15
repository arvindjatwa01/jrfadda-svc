const express = require("express");
const authRoutes = require("./authRoutes");
const productRoutes = require("./productRoutes");
const examsCategoryRoutes = require("./examsCategoryRoutes");

const router = express.Router();

/**
 * @swagger
 * components:
 *   responses:
 *     UnauthorizedError:
 *       description: Access token is missing or invalid
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: API information and available endpoints
 *     tags: [General]
 *     responses:
 *       200:
 *         description: API information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Welcome to the Node.js Express MySQL ORM API"
 *                 version:
 *                   type: string
 *                   example: "v1"
 *                 endpoints:
 *                   type: object
 *                   properties:
 *                     auth:
 *                       type: object
 *                       properties:
 *                         register:
 *                           type: string
 *                           example: "POST /auth/register"
 *                         login:
 *                           type: string
 *                           example: "POST /auth/login"
 *                         profile:
 *                           type: string
 *                           example: "GET /auth/profile"
 *                         updateProfile:
 *                           type: string
 *                           example: "PUT /auth/profile"
 *                     products:
 *                       type: object
 *                       properties:
 *                         getAll:
 *                           type: string
 *                           example: "GET /products"
 *                         getById:
 *                           type: string
 *                           example: "GET /products/:id"
 *                         create:
 *                           type: string
 *                           example: "POST /products"
 *                         update:
 *                           type: string
 *                           example: "PUT /products/:id"
 *                         delete:
 *                           type: string
 *                           example: "DELETE /products/:id"
 *                         getUserProducts:
 *                           type: string
 *                           example: "GET /products/user/my-products"
 */

// Welcome message
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Node.js Express MySQL ORM API",
        version: process.env.API_VERSION || "v1",
        documentation: "/api-docs",
        endpoints: {
            auth: {
                register: "POST /auth/register",
                login: "POST /auth/login",
                profile: "GET /auth/profile",
                updateProfile: "PUT /auth/profile",
            },
            products: {
                getAll: "GET /products",
                getById: "GET /products/:id",
                create: "POST /products",
                update: "PUT /products/:id",
                delete: "DELETE /products/:id",
                getUserProducts: "GET /products/user/my-products",
            },
            examsCategory: {
                getAll: "GET /exam-category/list",
                getAllDeleted: "GET /exam-category/deleted-list",
                create: "POST /exam-category",
                update: "PUT /exam-category/:id",
                getById: "GET /exam-category/:id",
                delete: "DELETE /exam-category/deleted/:id",
                revive: "DELETE /exam-category/revive/:id",
                activate: "PUT /exam-category/activate/:id",
                inactivate: "PUT /exam-category/inactivate/:id",
                getDashboardExamCategories: "GET /exam-category/dashboard",
                getExamCategoryKeyValueList: "GET /exam-category/key-value-list",
                showCategoryOnDashboard: "GET /exam-category/show-dashboard/:id",
                hideCategoryOnDashboard: "GET /exam-category/hide-dashboard/:id",
            },
        }, 
    });
});

// Route handlers
router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/exam-category", examsCategoryRoutes);

module.exports = router;
