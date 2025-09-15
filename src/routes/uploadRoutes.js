const express = require("express");
const uploadController = require("../controllers/uploadController");
const router = express.Router();

/**
 * @swagger
 * /api/v1/upload/single:
 *   post:
 *     summary: Upload a single image
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload
 *     responses:
 *       200:
 *         description: Image uploaded successfully
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
 *                   example: Image uploaded successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     imageUrl:
 *                       type: string
 *                       example: https://d2ngeethx3cedg.cloudfront.net/Website/image-1641499946671.jpg
 *                     originalName:
 *                       type: string
 *                       example: myimage.jpg
 *                     size:
 *                       type: number
 *                       example: 1024576
 *                     key:
 *                       type: string
 *                       example: Website/image-1641499946671.jpg
 */
router.post("/single", uploadController.uploadSingleImage);

/**
 * @swagger
 * /api/v1/upload/multiple:
 *   post:
 *     summary: Upload multiple images
 *     tags: [Upload]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Multiple image files to upload (max 10)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 */
router.post("/multiple", uploadController.uploadMultipleImages);

/**
 * @swagger
 * /api/v1/upload/status:
 *   get:
 *     summary: Get upload service status
 *     tags: [Upload]
 *     responses:
 *       200:
 *         description: Upload service status
 */
router.get("/status", uploadController.getUploadStatus);

module.exports = router;
