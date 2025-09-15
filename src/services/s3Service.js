const AWS = require("aws-sdk");

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID, // your access key
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY, // your secret key
    region: "us-east-1", // replace with your S3 region
    signatureVersion: "v4",
});

const BUCKET_NAME = "your-bucket-name"; // replace with your bucket name

module.exports = { s3, BUCKET_NAME };
