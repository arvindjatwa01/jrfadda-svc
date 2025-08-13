const jwt = require("jsonwebtoken");
const { Admin } = require("../models");

const adminMiddleware = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await Admin.findByPk(decoded.dlb_a_id);

        if (!admin || !admin.isActive) {
            return res.status(401).json({
                success: false,
                message: "Invalid token or admin not found.",
            });
        }

        req.admin = admin;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};

module.exports = adminMiddleware;
