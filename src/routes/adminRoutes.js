const express = require("express");
const adminController = require("../controllers/adminController");
const adminMiddleware = require("../middleware/adminMiddleware");
const { adminValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: admin
 *   description: admin authentication and profile management
 */

/**
 * @swagger
 * /api/v1/admin/register:
 *   post:
 *     summary: Register a new admin
 *     tags: [admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRegistration'
 *     responses:
 *       201:
 *         description: admin registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: admin already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/register", adminValidation.register, adminController.register);

/**
 * @swagger
 * /api/v1/admin/login:
 *   post:
 *     summary: Login admin
 *     tags: [admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminLogin'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/login", adminValidation.login, adminController.login);

/**
 * @swagger
 * /api/v1/admin/profile:
 *   get:
 *     summary: Get current admin profile
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: admin profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       $ref: '#/components/schemas/admin'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/profile", adminMiddleware, adminController.getProfile);

/**
 * @swagger
 * /api/v1/admin/profile:
 *   put:
 *     summary: Update admin profile
 *     tags: [admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               dlb_a_name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: "John"
 *     responses:
 *       200:
 *         description: Profile updated successfully
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
 *                   example: "Profile updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     admin:
 *                       $ref: '#/components/schemas/Admin'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/profile", adminMiddleware, adminController.updateProfile);

module.exports = router;
