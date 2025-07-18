const express = require("express");
const examsCategoryController = require("../controllers/examsCategoryController");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: exam-category
 *   description: Exam category management endpoints
 */

/**
 * @swagger
 * /api/v1/exam-category/list:
 *   get:
 *     summary: Get all exam category with pagination and filtering
 *     tags: [exam-category]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by exam category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in exam category name and description
 *     responses:
 *       200:
 *         description: exam category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedExamCateofyResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/list", examsCategoryController.getAllExamCategories);

/**
 * @swagger
 * /api/v1/exam-category/deleted-list:
 *   get:
 *     summary: Get all deletd exam category with pagination and filtering
 *     tags: [exam-category]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by exam category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in deleted exam category name and description
 *     responses:
 *       200:
 *         description: deleted exam category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedExamCateofyResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/deleted-list", examsCategoryController.getAllDeletedExamCategories);

/**
 * @swagger
 * /api/v1/exam-category/get/{id}:
 *   get:
 *     summary: Get a exam category by ID
 *     tags: [exam-category]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: exam category ID
 *     responses:
 *       200:
 *         description: Category retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                       $ref: '#/components/schemas/ExamCategory'
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id(\\d+)", examsCategoryController.getExamCategoryById);

/**
 * @swagger
 * /api/v1/exam-category/save:
 *   post:
 *     summary: Create a new category
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ExamCategoryInput'
 *     responses:
 *       201:
 *         description: Category created successfully
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
 *                   example: "Category created successfully"
 *                 data:
 *                       $ref: '#/components/schemas/ExamCategory'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/save", examsCategoryController.createExamCategory);

/**
 * @swagger
 * /api/v1/exam-category/update/{id}:
 *   put:
 *     summary: Update a exam category
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Exam Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *                $ref: '#/components/schemas/ExamCategoryInput'
 *     responses:
 *       200:
 *         description: Exam Category updated successfully
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
 *                   example: "Exam Category updated successfully"
 *                 data:
 *                       $ref: '#/components/schemas/ExamCategory'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam Category not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/update/:id", examsCategoryController.updateExamCategory);

/**
 * @swagger
 * /api/v1/exam-category/delete/{id}:
 *   delete:
 *     summary: Delete a exam category (soft delete)
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Exam Category deleted successfully
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
 *                   example: "Exam Category deleted successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam Category not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/delete/:id", examsCategoryController.deleteExamCategory);
/**
 * @swagger
 * /api/v1/exam-category/revive/{id}:
 *   put:
 *     summary: revive deletd exam category
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Exam Category revived successfully
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
 *                   example: "Exam Category revived successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam Category not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/revive/:id", examsCategoryController.reviveExamCategory);

/**
 * @swagger
 * /api/v1/exam-category/activate/{id}:
 *   put:
 *     summary: active a exam category
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Exam category activate successfully
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
 *                   example: "Exam category activate successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam Category not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/activate/:id", examsCategoryController.activeExamCategory);

/**
 * @swagger
 * /api/v1/exam-category/inactivate/{id}:
 *   put:
 *     summary: deactive a exam category
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Exam Category deactive successfully
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
 *                   example: "Exam Category deactive successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam Category not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/inactivate/:id", examsCategoryController.inActiveExamCategory);

/**
 * @swagger
 * /api/v1/exam-category/dashboard:
 *   get:
 *     summary: Get exam category dashboard data
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExamsCategoryDashboardResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/dashboard", examsCategoryController.getDashboardExamCategories);

/**
 * @swagger
 * /api/v1/exam-category/show-dashboard/{id}:
 *   put:
 *     summary: show exam category on dashboard
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Exam category show on dashboard successfully
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
 *                   example: "Exam category show on dashboard successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam Category not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/show-dashboard/:id", examsCategoryController.showOnDashboardExamCategory);

/**
 * @swagger
 * /api/v1/exam-category/hide-dashboard/{id}:
 *   put:
 *     summary: hide exam category from dashboard
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category Id
 *     responses:
 *       200:
 *         description: Exam category hide from dashboard successfully
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
 *                   example: "Exam category hide from dashboard successfully"
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Exam Category not found or unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/hide-dashboard/:id", examsCategoryController.hideFromDashboardExamCategory);

/**
 * @swagger
 * /api/v1/exam-category/key-value-list:
 *   get:
 *     summary: Get exam category key-value-list data
 *     tags: [exam-category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: key-value-list data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/KeyValuePairList'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

router.get("/key-value-list", examsCategoryController.getCategoryKeyValueList);

module.exports = router;
