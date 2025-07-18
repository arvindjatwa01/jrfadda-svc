const { Category } = require("../models");
const { Op } = require("sequelize");

class CategoryController {
    // Get all Categories with pagination
    async getAllCategories(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            // const category = req.query.category;

            const search = req.query.search;

            const whereClause = { dlb_is_deleted: false };

            if (search) {
                whereClause[Op.or] = [
                    { dlb_c_name: { [Op.like]: `%${search}%` } },
                    //  { description: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows: category } = await Category.findAndCountAll({
                where: whereClause,
                // include: [
                //     {
                //         model: User,
                //         as: "user",
                //         attributes: ["id", "firstName", "lastName", "email"],
                //     },
                // ],
                limit,
                offset,
                order: [["dlb_c_created_date", "DESC"]],
            });

            res.json({
                success: true,
                responsePacket: {
                    data: category,
                    totalItems: count,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(count / limit),
                        totalItems: count,
                        itemsPerPage: limit,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get all delete Categories with pagination
    async getAllDeletedCategories(req, res, next) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            // const category = req.query.category;

            const search = req.query.search;

            const whereClause = { dlb_is_deleted: true };

            if (search) {
                whereClause[Op.or] = [
                    { dlb_c_name: { [Op.like]: `%${search}%` } },
                    //  { description: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows: category } = await Category.findAndCountAll({
                where: whereClause,
                // include: [
                //     {
                //         model: User,
                //         as: "user",
                //         attributes: ["id", "firstName", "lastName", "email"],
                //     },
                // ],
                limit,
                offset,
                order: [["dlb_c_created_date", "DESC"]],
            });

            res.json({
                success: true,
                responsePacket: {
                    data: category,
                    totalItems: count,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(count / limit),
                        totalItems: count,
                        itemsPerPage: limit,
                    },
                },
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single category by Id
    async getCategoryById(req, res, next) {
        try {
            const { id } = req.params;

            const examCategory = await Category.findOne({
                where: { dlb_c_id: id, dlb_is_Active: true, dlb_is_deleted: false },
                // include: [
                //     {
                //         model: User,
                //         as: "user",
                //         attributes: ["id", "firstName", "lastName", "email"],
                //     },
                // ],
            });

            if (!examCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found",
                });
            }

            res.json({
                success: true,
                data: examCategory,
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new category
    async createCategory(req, res, next) {
        try {
            const { dlb_c_name, dlb_c_parent_id, dlb_c_content, dlb_order_id, bg_color, border_color } = req.body;
            // const userId = req.user.id;

            const category = await Category.create({
                dlb_c_parent_id,
                dlb_c_name,
                dlb_c_content,
                dlb_order_id,
                bg_color,
                border_color,
            });

            res.status(201).json({
                success: true,
                message: "Category created successfully",
                data: category,
            });
        } catch (error) {
            next(error);
        }
    }

    // Update category
    async updateCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { dlb_c_name, dlb_c_parent_id, dlb_c_content, dlb_order_id, bg_color, border_color } = req.body;
            // const userId = req.user.id;

            const category = await ExamsCategory.findOne({
                where: { dlb_c_id: id, dlb_is_Active: true, dlb_is_deleted: false },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or you do not have permission to update it",
                });
            }

            const updatedCategory = await category.update({
                dlb_c_parent_id: dlb_c_parent_id || category.dlb_c_parent_id,
                dlb_c_name: dlb_c_name || category.dlb_c_name,
                dlb_c_content: dlb_c_content || category.dlb_c_content,
                dlb_order_id: dlb_order_id || category.dlb_order_id,
                bg_color: bg_color || category.bg_color,
                dlb_image_alt: dlb_image_alt || category.dlb_image_alt,
            });

            res.json({
                success: true,
                message: "Category updated successfully",
                data: updatedCategory,
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete category (soft delete)
    async deleteCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const category = await Category.findOne({
                where: { dlb_c_id: id, dlb_is_deleted: false },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or you do not have permission to delete it",
                });
            }

            await category.update({ dlb_is_deleted: true });

            res.json({
                success: true,
                message: "Category deleted successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    // Revive category
    async reviveCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const category = await Category.findOne({
                where: { dlb_c_id: id, dlb_is_deleted: true },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or you do not have permission to delete it",
                });
            }

            await category.update({ dlb_is_deleted: false });

            res.json({
                success: true,
                message: "Category revived successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    // active category
    async activeCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const category = await Category.findOne({
                where: { dlb_c_id: id, dlb_is_Active: false },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or you do not have permission to active it",
                });
            }

            await category.update({ dlb_is_Active: true });

            res.json({
                success: true,
                message: "Category activate successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    // Inactive category
    async inActiveCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const category = await Category.findOne({
                where: { dlb_xm_id: id, dlb_is_Active: true },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to deactive it",
                });
            }

            await category.update({ dlb_is_Active: false });

            res.json({
                success: true,
                message: "Exam category deactive successfully",
            });
        } catch (error) {
            next(error);
        }
    }

    // Get categories key value pair list (no pagination)
    async getCategoryKeyValueList(req, res, next) {
        try {
            const whereClause = { dlb_is_Active: true, dlb_is_deleted: false, dlb_c_status: true, dlb_c_parent_id: 0 };

            const categories = await Category.findAll({
                where: whereClause,
                order: [["dlb_c_created_date", "DESC"]],
            });

            // Map the categories to the key-value format [{label: Category name, value: category uuid}]
            const categoryList = categories.map((category) => ({
                label: category.dlb_c_name,
                value: category.dlb_c_id,
            }));
            res.json({
                success: true,
                data: categoryList,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
