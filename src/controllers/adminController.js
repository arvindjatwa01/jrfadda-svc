const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

class AdminController {
    // Register a new admin
    async register(req, res, next) {
        try {
            const { dlb_a_name, dlb_a_email, dlb_a_password } = req.body;

            // Check if admin already exists
            const existingUser = await Admin.findOne({ where: { dlb_a_email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "Admin with this email already exists",
                });
            }

            // Create new admin
            const admin = await Admin.create({
                dlb_a_name,
                dlb_a_email,
                dlb_a_password,
            });

            // Generate JWT token
            const token = jwt.sign({ dlb_a_id: admin.dlb_a_id, dlb_a_email: admin.dlb_a_email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.status(201).json({
                success: true,
                message: "Admin registered successfully",
                data: {
                    admin,
                    token,
                },
            });
        } catch (error) {
            console.log("error --- ", error);
            next(error);
        }
    }

    // Login admin
    async login(req, res, next) {
        try {
            const { dlb_a_email, dlb_a_password } = req.body;

            // Find admin by email
            const admin = await Admin.findOne({ where: { dlb_a_email } });
            if (!admin) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                    errorCode: 999,
                });
            }

            // Check password
            const isPasswordValid = await admin.comparePassword(dlb_a_password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                    data: isPasswordValid,
                    errorCode: 999,
                });
            }

            // Update last login
            await admin.update({ lastLoginAt: new Date() });

            // Generate JWT token
            const token = jwt.sign({ dlb_a_id: admin.dlb_a_id, dlb_a_email: admin.dlb_a_email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.json({
                success: true,
                message: "Login successful",
                data: {
                    admin,
                    token,
                },
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get current admin profile
    async getProfile(req, res, next) {
        try {
            res.json({
                success: true,
                data: {
                    admin: req.admin,
                },
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Update admin profile
    async updateProfile(req, res, next) {
        try {
            const { dlb_a_name } = req.body;
            const admin = req.admin;

            await admin.update({
                dlb_a_name: dlb_a_name || admin.dlb_a_name,
            });

            res.json({
                success: true,
                message: "Profile updated successfully",
                data: {
                    admin,
                },
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AdminController();
