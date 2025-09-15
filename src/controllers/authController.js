const jwt = require("jsonwebtoken");
const axios = require("axios");
const { User } = require("../models");

let storedOtp = {}; // To store OTP temporarily, mapping by email (In production, use a more robust solution like a database)

class AuthController {
    // Register a new user
    async register(req, res, next) {
        try {
            const { firstName, lastName, email, password } = req.body;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({
                    success: false,
                    message: "User with this email already exists",
                });
            }

            // Create new user
            const user = await User.create({
                firstName,
                lastName,
                email,
                password,
            });

            // Generate JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.status(201).json({
                success: true,
                message: "User registered successfully",
                data: {
                    user,
                    token,
                },
            });
        } catch (error) {
            console.log("error --- ", error);
            next(error);
        }
    }

    // Login user
    async login(req, res, next) {
        try {
            const { email, password } = req.body;

            // Find user by email
            const user = await User.findOne({ where: { email } });
            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid credentials",
                });
            }

            // Update last login
            await user.update({ lastLoginAt: new Date() });

            // Generate JWT token
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });

            res.json({
                success: true,
                message: "Login successful",
                data: {
                    user,
                    token,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get current user profile
    async getProfile(req, res, next) {
        try {
            res.json({
                success: true,
                data: {
                    user: req.user,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // Update user profile
    async updateProfile(req, res, next) {
        try {
            const { firstName, lastName } = req.body;
            const user = req.user;

            await user.update({
                firstName: firstName || user.firstName,
                lastName: lastName || user.lastName,
            });

            res.json({
                success: true,
                message: "Profile updated successfully",
                data: {
                    user,
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // // Send OTP to user's mobile number
    // async sendOtp(req, res, next) {
    //     try {
    //         const { mobile } = req.body;

    //         if (!mobile) {
    //             return res.status(400).json({
    //                 success: false,
    //                 message: "Mobile number is required.",
    //             });
    //         }

    //         // Generate a random OTP
    //         const otp = Math.floor(100000 + Math.random() * 900000).toString();

    //         // Store the OTP temporarily in-memory (by mobile number, for simplicity)
    //         storedOtp[mobile] = otp;

    //         // Send OTP via MSG91 API
    //         const response = await axios.post(
    //             `https://control.msg91.com/api/v5/otp?mobile=91${mobile}&otp=${otp}&template_id=6561b72cd6fc050f085aa354`,
    //             {},
    //             {
    //                 headers: {
    //                     authkey: process.env.MSG91_AUTH_KEY,
    //                     "content-type": "application/json",
    //                 },
    //             }
    //         );

    //         console.log("response ---- ", response)

    //         res.status(200).json({
    //             success: true,
    //             message: "OTP sent successfully",
    //         });
    //     } catch (error) {
    //         console.log("Error sending OTP: ", error);
    //         next(error);
    //     }
    // }

    // Send OTP to user's mobile number
    async sendOtp(req, res, next) {
        try {
            const { mobile } = req.body;

            if (!mobile) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile number is required.",
                });
            }

            // Generate a random OTP
            const otp = Math.floor(1000 + Math.random() * 9000).toString();

            // Store the OTP temporarily in-memory (by mobile number, for simplicity)
            storedOtp[mobile] = otp;

            // Send OTP via MSG91 API
            const response = await axios.post(
                `https://control.msg91.com/api/v5/otp?mobile=91${mobile}&otp=${otp}&template_id=6561b72cd6fc050f085aa354`,
                {},
                {
                    headers: {
                        // authkey: process.env.MSG91_AUTH_KEY,
                        authkey: "342535AeHpOnFJ5fdb0d34P1",
                        "content-type": "application/json",
                    },
                }
            );

            // Log MSG91 response to check for any issues
            console.log("MSG91 API response:", response.data);

            if (response.data.type === "error") {
                return res.status(500).json({
                    success: false,
                    message: response.data.message,
                });
            }

            res.status(200).json({
                success: true,
                message: "OTP sent successfully",
            });
        } catch (error) {
            console.log("Error sending OTP: ", error.response ? error.response.data : error.message);
            next(error);
        }
    }

    // Verify OTP
    async verifyOtp(req, res, next) {
        try {
            const { mobile, otp } = req.body;

            if (!mobile || !otp) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile number and OTP are required.",
                });
            }

            // Check if OTP matches the stored one
            if (storedOtp[mobile] && storedOtp[mobile] === otp) {
                // OTP is correct, clear it after verification
                delete storedOtp[mobile];
                return res.status(200).json({
                    success: true,
                    message: "OTP verified successfully",
                });
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Invalid OTP",
                });
            }
        } catch (error) {
            console.log("Error verifying OTP: ", error);
            next(error);
        }
    }
}

module.exports = new AuthController();
