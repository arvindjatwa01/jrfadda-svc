const multer = require("multer");
const multerS3 = require("multer-s3");
const { s3 } = require("../config/aws");
const path = require("path");

if (!process.env.AWS_BUCKET_NAME) {
    throw new Error("AWS_BUCKET_NAME is missing. Check your .env or startup config.");
}

// Configure multer for S3 upload
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
            // Create unique filename with timestamp
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const extension = path.extname(file.originalname);
            const fileName = `Website/${file.fieldname}-${uniqueSuffix}${extension}`;
            cb(null, fileName);
        },
    }),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: function (req, file, cb) {
        // Check file type
        const allowedTypes = /jpeg|jpg|png|gif|webp/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
        }
    },
});

module.exports = upload;
