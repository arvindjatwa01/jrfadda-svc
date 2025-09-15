const { Category } = require("../models");
const { Op } = require("sequelize");

class CategoryController {
    // Get all Categories with pagination
    // async getAllCategories(req, res, next) {
    //     try {
    //         const page = parseInt(req.query.page) || 1;
    //         const limit = parseInt(req.query.limit) || 10;
    //         const offset = (page - 1) * limit;
    //         // const category = req.query.category;

    //         const search = req.query.search;

    //         const whereClause = { dlb_is_deleted: false };

    //         if (search) {
    //             whereClause[Op.or] = [
    //                 { dlb_c_name: { [Op.like]: `%${search}%` } },
    //                 //  { description: { [Op.like]: `%${search}%` } }
    //             ];
    //         }

    //         const { count, rows: category } = await Category.findAndCountAll({
    //             where: whereClause,
    //             // include: [
    //             //     {
    //             //         model: User,
    //             //         as: "user",
    //             //         attributes: ["id", "firstName", "lastName", "email"],
    //             //     },
    //             // ],
    //             limit,
    //             offset,
    //             order: [["dlb_c_created_date", "DESC"]],
    //         });

    //         // Manually fetch the parent category title for each category
    //         const formattedCategories = await Promise.all(
    //             deletedCategories.map(async (category) => {
    //                 // If the category has a parent, fetch the parent category title
    //                 let parentCategoryTitle = null;
    //                 if (category.dlb_c_parent_id) {
    //                     const parentCategory = await Category.findOne({ dlb_c_id: category.dlb_c_parent_id });
    //                     parentCategoryTitle = parentCategory ? parentCategory.dlb_c_name : null;
    //                 }

    //                 return {
    //                     ...category.toObject(),
    //                     categoryId: category.dlb_c_id,
    //                     orderId: category.dlb_order_id,
    //                     categoryName: category.dlb_c_name,
    //                     active: category.dlb_is_active,
    //                     deleted: category.dlb_is_deleted,
    //                     // createdBy: category.dlb_c_name,
    //                     parentCategoryTitle, // Add the parentCategoryTitle to the category
    //                 };
    //             })
    //         );

    //         res.json({
    //             success: true,
    //             responsePacket: {
    //                 // data: category,
    //                 data: formattedCategories,
    //                 totalItems: count,
    //                 pagination: {
    //                     currentPage: page,
    //                     totalPages: Math.ceil(count / limit),
    //                     totalItems: count,
    //                     itemsPerPage: limit,
    //                 },
    //             },
    //             errorCode: 0,
    //         });
    //     } catch (error) {
    //         next(error);
    //     }
    // }

    async getAllCategories(req, res, next) {
        try {
            // Extract page, size, and search from request body
            const { pageNumber, pageSize, search } = req.body;

            // const page = parseInt(req.query.page) || 1;
            // const limit = parseInt(req.query.limit) || 10;
            const page = parseInt(pageNumber) || 1;
            const limit = parseInt(pageSize) || 10;

            // Ensure positive integers for page and limit
            if (page < 1 || limit < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Page and limit must be positive integers.",
                });
            }

            const offset = (page - 1) * limit;
            // const search = req.query.search;

            const whereClause = { dlb_is_deleted: false };

            if (search) {
                whereClause[Op.or] = [{ dlb_c_name: { [Op.like]: `%${search}%` } }];
            }

            const { count, rows: category } = await Category.findAndCountAll({
                where: whereClause,
                limit,
                offset,
                order: [["dlb_c_created_date", "DESC"]],
            });

            // Manually fetch the parent category title for each category
            const formattedCategories = await Promise.all(
                category.map(async (category) => {
                    // If the category has a parent, fetch the parent category title
                    let parentCategoryTitle = null;
                    if (category.dlb_c_parent_id) {
                        const parentCategory = await Category.findOne({
                            where: { dlb_c_id: category.dlb_c_parent_id },
                        });
                        parentCategoryTitle = parentCategory ? parentCategory.dlb_c_name : null;
                    }

                    return {
                        // ...category.toJSON(),
                        uuid: category.dlb_c_id,
                        categoryId: category.dlb_c_id,
                        orderId: category.dlb_order_id,
                        categoryName: category.dlb_c_name,
                        active: category.dlb_isActive,
                        deleted: category.dlb_is_deleted,
                        creatdAt: category.dlb_c_created_date,
                        parentCategoryTitle, // Add the parentCategoryTitle to the category
                    };
                })
            );

            res.json({
                success: true,
                responsePacket: {
                    data: formattedCategories,
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

    // Get all delete Categories with pagination
    async getAllDeletedCategories(req, res, next) {
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

            // Manually fetch the parent category title for each category
            const formattedCategories = await Promise.all(
                category.map(async (category) => {
                    // If the category has a parent, fetch the parent category title
                    let parentCategoryTitle = null;
                    if (category.dlb_c_parent_id) {
                        const parentCategory = await Category.findOne({
                            where: { dlb_c_id: category.dlb_c_parent_id },
                        });
                        parentCategoryTitle = parentCategory ? parentCategory.dlb_c_name : null;
                    }

                    return {
                        // ...category.toJSON(),
                        uuid: category.dlb_c_id,
                        categoryId: category.dlb_c_id,
                        orderId: category.dlb_order_id,
                        categoryName: category.dlb_c_name,
                        active: category.dlb_isActive,
                        deleted: category.dlb_is_deleted,
                        creatdAt: category.dlb_c_created_date,
                        parentCategoryTitle, // Add the parentCategoryTitle to the category
                    };
                })
            );

            res.json({
                success: true,
                responsePacket: {
                    // data: category,
                    data: formattedCategories,
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

    // Get single category by Id
    async getCategoryById(req, res, next) {
        try {
            const { id } = req.params;

            const examCategory = await Category.findOne({
                where: { dlb_c_id: id, dlb_isActive: true, dlb_is_deleted: false },
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
                errorCode: 0,
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
                where: { dlb_c_id: id, dlb_isActive: true, dlb_is_deleted: false },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or you do not have permission to update it",
                    errorCode: 999,
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
                    errorCode: 999,
                });
            }

            await category.update({ dlb_is_deleted: true, dlb_isActive: false });

            res.json({
                success: true,
                message: "Category deleted successfully",
                errorCode: 0,
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
                    errorCode: 999,
                });
            }

            await category.update({ dlb_is_deleted: false });

            res.json({
                success: true,
                message: "Category revived successfully",
                errorCode: 0,
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
                where: { dlb_c_id: id, dlb_isActive: false },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Category not found or you do not have permission to active it",
                    errorCode: 999,
                });
            }

            await category.update({ dlb_isActive: true });

            res.json({
                success: true,
                message: "Category activate successfully",
                errorCode: 0,
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
                where: { dlb_c_id: id, dlb_isActive: true },
            });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Exam category not found or you do not have permission to deactive it",
                    errorCode: 999,
                });
            }

            await category.update({ dlb_isActive: false });

            res.json({
                success: true,
                message: "Exam category deactive successfully",
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }

    // Get categories key value pair list (no pagination)
    async getCategoryKeyValueList(req, res, next) {
        try {
            const whereClause = { dlb_isActive: true, dlb_is_deleted: false, dlb_c_status: true, dlb_c_parent_id: 0 };

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
                errorCode: 0,
            });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new CategoryController();
