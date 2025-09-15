const { ExamsCategory } = require("../models");
const { Op } = require("sequelize");

class WifiExamsController {
    // Get all Exam Categories with pagination
    async getAllExamCategories(req, res, next) {
        try {
            // Extract page, size, and search from request body
            const { pageNumber, pageSize, search } = req.body;

            const page = parseInt(pageNumber) || 1;
            const limit = parseInt(pageSize) || 10;
            // const page = parseInt(req.query.page) || 1;
            // const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            // const category = req.query.category;

            // const search = req.query.search;

            const whereClause = { dlb_is_deleted: false };

            if (search) {
                whereClause[Op.or] = [
                    { dlb_xm_name: { [Op.like]: `%${search}%` } },
                    //  { description: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows: examsCategory } = await ExamsCategory.findAndCountAll({
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
                order: [["dlb_xm_created_date", "DESC"]],
            });

            // Manually fetch the parent category title for each category
            const formattedExamCategories = await Promise.all(
                examsCategory.map(async (category) => {
                    // If the category has a parent, fetch the parent category title
                    let parentCategoryTitle = null;
                    if (category.dlb_xm_parent_id) {
                        const parentCategory = await ExamsCategory.findOne({
                            where: { dlb_xm_id: category.dlb_xm_parent_id },
                        });
                        parentCategoryTitle = parentCategory ? parentCategory.dlb_xm_name : null;
                    }

                    return {
                        // ...category.toJSON(),
                        uuid: category.dlb_xm_id,
                        categoryId: category.dlb_xm_id,
                        orderId: category.dlb_order_id,
                        categoryName: category.dlb_xm_name,
                        active: category.dlb_isActive,
                        deleted: category.dlb_is_deleted,
                        isHomeCat: category.dlb_is_home,
                        creatdAt: category.dlb_xm_created_date,
                        parentCategoryTitle, // Add the parentCategoryTitle to the category
                    };
                })
            );

            res.json({
                success: true,
                responsePacket: {
                    data: formattedExamCategories,
                    totalItems: count,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(count / limit),
                        totalItems: count,
                        itemsPerPage: limit,
                    },
                },
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }
    // Get all deleted Exam Categories with pagination
    async getAllDeletedExamCategories(req, res, next) {
        try {
            // Extract page, size, and search from request body
            const { pageNumber, pageSize, search } = req.body;

            const page = parseInt(pageNumber) || 1;
            const limit = parseInt(pageSize) || 10;
            // const page = parseInt(req.query.page) || 1;
            // const limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;
            // const category = req.query.category;

            // const search = req.query.search;

            const whereClause = { dlb_is_deleted: true };

            if (search) {
                whereClause[Op.or] = [
                    { dlb_xm_name: { [Op.like]: `%${search}%` } },
                    //  { description: { [Op.like]: `%${search}%` } }
                ];
            }

            const { count, rows: examsCategory } = await ExamsCategory.findAndCountAll({
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
                order: [["dlb_xm_created_date", "DESC"]],
            });

            // Manually fetch the parent category title for each category
            const formattedExamCategories = await Promise.all(
                examsCategory.map(async (category) => {
                    // If the category has a parent, fetch the parent category title
                    let parentCategoryTitle = null;
                    if (category.dlb_xm_parent_id) {
                        const parentCategory = await ExamsCategory.findOne({
                            where: { dlb_xm_id: category.dlb_xm_parent_id },
                        });
                        parentCategoryTitle = parentCategory ? parentCategory.dlb_xm_name : null;
                    }

                    return {
                        // ...category.toJSON(),
                        uuid: category.dlb_xm_id,
                        categoryId: category.dlb_xm_id,
                        orderId: category.dlb_order_id,
                        categoryName: category.dlb_xm_name,
                        active: category.dlb_isActive,
                        deleted: category.dlb_is_deleted,
                        isHomeCat: category.dlb_is_home,
                        creatdAt: category.dlb_xm_created_date,
                        parentCategoryTitle, // Add the parentCategoryTitle to the category
                    };
                })
            );

            res.json({
                success: true,
                responsePacket: {
                    data: formattedExamCategories,
                    totalItems: count,
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(count / limit),
                        totalItems: count,
                        itemsPerPage: limit,
                    },
                },
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get dashboard categories (no pagination)
    async getDashboardExamCategories(req, res, next) {
        try {
            const whereClause = { dlb_isActive: true, dlb_is_home: true, dlb_is_deleted: false };

            const examsCategory = await ExamsCategory.findAll({
                where: whereClause,
                order: [["dlb_xm_created_date", "DESC"]],
            });

            res.json({
                success: true,
                data: examsCategory,
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get categories key value pair list (no pagination)
    async getCategoryKeyValueList(req, res, next) {
        try {
            const whereClause = { dlb_isActive: true, dlb_is_deleted: false, dlb_xm_status: false, dlb_xm_parent_id: 0 };

            const examsCategory = await ExamsCategory.findAll({
                where: whereClause,
                order: [["dlb_xm_created_date", "DESC"]],
            });

            // Map the categories to the key-value format [{label: Category name, value: category uuid}]
            const categoryList = examsCategory.map((category) => ({
                label: category.dlb_xm_name,
                value: category.dlb_xm_id,
            }));
            res.json({
                success: true,
                data: categoryList,
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get single exam category by ID
    async getExamCategoryById(req, res, next) {
        try {
            const { id } = req.params;

            const examCategory = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_isActive: true },
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
                    errorCode: 999,
                });
            }

            res.json({
                success: true,
                data: examCategory,
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Create new exam category
    async createExamCategory(req, res, next) {
        try {
            const { dlb_xm_name, dlb_xm_heading, dlb_poster_url, dlb_order_id, dlb_heading_desc, dlb_image_alt } = req.body;
            // const userId = req.user.id;

            const examsCategory = await ExamsCategory.create({
                dlb_xm_name,
                dlb_xm_heading,
                dlb_poster_url,
                dlb_order_id,
                dlb_heading_desc,
                dlb_image_alt,
            });

            res.status(201).json({
                success: true,
                message: "Exam Category created successfully",
                data: examsCategory,
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Update exam category
    async updateExamCategory(req, res, next) {
        try {
            const { id } = req.params;
            const { dlb_xm_name, dlb_xm_heading, dlb_poster_url, dlb_order_id, dlb_heading_desc, dlb_image_alt } = req.body;
            // const userId = req.user.id;

            const category = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_isActive: true },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Exam Category not found or you do not have permission to update it",
                    errorCode: 999,
                });
            }

            const updatedCategory = await category.update({
                dlb_xm_name: dlb_xm_name || category.dlb_xm_name,
                dlb_xm_heading: dlb_xm_heading || category.dlb_xm_heading,
                dlb_poster_url: dlb_poster_url || category.dlb_poster_url,
                dlb_order_id: dlb_order_id || category.dlb_order_id,
                dlb_heading_desc: dlb_heading_desc || category.dlb_heading_desc,
                dlb_image_alt: dlb_image_alt || category.dlb_image_alt,
            });

            res.json({
                success: true,
                message: "Exam Category updated successfully",
                data: updatedCategory,
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Delete exam category (soft delete)
    async deleteExamCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const examCategory = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_is_deleted: false },
            });

            if (!examCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to delete it",
                    errorCode: 999,
                });
            }

            const updatedCategory = await examCategory.update({ dlb_is_deleted: true });

            res.json({
                success: true,
                message: "Exam category deleted successfully",
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Revive exam category
    async reviveExamCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const examCategory = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_is_deleted: true },
            });

            if (!examCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to delete it",
                    errorCode: 999,
                });
            }

            const updatedCategory = await examCategory.update({ dlb_is_deleted: false });

            res.json({
                success: true,
                message: "Exam category revived successfully",
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // active exam category
    async activeExamCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const examCategory = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_isActive: false },
            });

            if (!examCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to active it",
                    errorCode: 999,
                });
            }

            await examCategory.update({ dlb_isActive: true });

            res.json({
                success: true,
                message: "Exam category activate successfully",
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Inactive exam category
    async inActiveExamCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const examCategory = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_isActive: true },
            });

            if (!examCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to deactive it",
                    errorCode: 999,
                });
            }

            await examCategory.update({ dlb_isActive: false });

            res.json({
                success: true,
                message: "Exam category deactive successfully",
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // show category on dashboard
    async showOnDashboardExamCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const examCategory = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_isActive: true, dlb_is_deleted: false },
            });

            if (!examCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to show on dashboard it",
                    errorCode: 999,
                });
            }

            await examCategory.update({ dlb_is_home: true });

            res.json({
                success: true,
                message: "Exam category show on dashboard successfully",
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // hide category from dashboard
    async hideFromDashboardExamCategory(req, res, next) {
        try {
            const { id } = req.params;
            // const userId = req.user.id;

            const examCategory = await ExamsCategory.findOne({
                where: { dlb_xm_id: id, dlb_isActive: true, dlb_is_deleted: false },
            });

            if (!examCategory) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to hide on dashboard it",
                    errorCode: 999,
                });
            }

            await examCategory.update({ dlb_is_home: false });

            res.json({
                success: true,
                message: "Exam category hide from dashboard successfully",
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new WifiExamsController();
