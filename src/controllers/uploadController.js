const upload = require("../middleware/upload");

class UploadController {
    // Single image upload
    uploadSingleImage(req, res) {
        const uploadSingle = upload.single("image");

        uploadSingle(req, res, (err) => {
            if (err) {
                console.error("Upload error:", err);
                return res.status(400).json({
                    success: false,
                    message: err.message || "Upload failed",
                    error: err.code || "UPLOAD_ERROR",
                });
            }

            if (!req.file) {
                return res.status(400).json({
                    success: false,
                    message: "No file uploaded",
                });
            }

            // Generate CloudFront URL for faster loading
            const cloudFrontUrl = `${process.env.CLOUD_FRONT_URL}${req.file.key}`;

            res.status(200).json({
                success: true,
                message: "Image uploaded successfully",
                data: {
                    imageUrl: cloudFrontUrl,
                    originalName: req.file.originalname,
                    size: req.file.size,
                    key: req.file.key,
                    bucket: req.file.bucket,
                },
            });
        });
    }

    // Multiple images upload
    uploadMultipleImages(req, res) {
        const uploadMultiple = upload.array("images", 10); // Max 10 files

        uploadMultiple(req, res, (err) => {
            if (err) {
                console.error("Upload error:", err);
                return res.status(400).json({
                    success: false,
                    message: err.message || "Upload failed",
                    error: err.code || "UPLOAD_ERROR",
                });
            }

            if (!req.files || req.files.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No files uploaded",
                });
            }

            // Generate CloudFront URLs for all uploaded files
            const uploadedFiles = req.files.map((file) => ({
                imageUrl: `${process.env.CLOUD_FRONT_URL}${file.key}`,
                originalName: file.originalname,
                size: file.size,
                key: file.key,
            }));

            res.status(200).json({
                success: true,
                message: `${req.files.length} image(s) uploaded successfully`,
                data: {
                    images: uploadedFiles,
                    count: req.files.length,
                },
            });
        });
    }

    // Get upload status/health check
    getUploadStatus(req, res) {
        res.status(200).json({
            success: true,
            message: "Upload service is running",
            data: {
                maxFileSize: "10MB",
                allowedTypes: ["jpeg", "jpg", "png", "gif", "webp"],
                cloudFrontUrl: process.env.CLOUD_FRONT_URL,
                bucket: process.env.AWS_BUCKET_NAME,
            },
        });
    }
}

module.exports = new UploadController();
