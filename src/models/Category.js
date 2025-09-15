const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Category = sequelize.define(
    "Category",
    {
        dlb_c_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dlb_c_parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            references: {
                model: "Category",
                key: "dlb_c_id",
            },
        },
        dlb_a_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            // references: {
            //     model: "Category",
            //     key: "dlb_c_id",
            // },
        },
        dlb_c_slug: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "",
            // validate: {
            //     notEmpty: false,
            //     len: [2, 100],
            // },
        },
        dlb_c_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        dlb_c_content: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_c_meta_title: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_c_meta_description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_c_meta_keywords: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_c_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        dlb_c_created_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Default to the current date and time
        },
        dlb_order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        dlb_c_image_og: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_doubts_cat: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        set_flag: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dlb_isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        dlb_is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        tableName: "wifi_categories",
    }
);

module.exports = Category;
