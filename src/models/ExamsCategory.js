const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ExamsCategory = sequelize.define(
    "ExamsCategory",
    {
        dlb_xm_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dlb_xm_parent_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
            references: {
                model: "ExamsCategory",
                key: "dlb_xm_id",
            },
        },
        dlb_xm_name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 100],
            },
        },
        dlb_xm_content: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_xm_meta_title: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_xm_meta_description: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_xm_meta_keywords: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_xm_status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        dlb_xm_slug: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "",
            // validate: {
            //     notEmpty: false,
            //     len: [2, 100],
            // },
        },
        dlb_xm_image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dlb_xm_created_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW, // Default to the current date and time
        },
        dlb_a_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        dlb_order_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        dlb_xm_image_og: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_xm_youtube: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dlb_xm_test: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dlb_total_test: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dlb_maincat_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dlb_show_post: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dlb_xm_heading: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dlb_poster_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dlb_offline_online: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        dlb_xm_last_date: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        dlb_image_alt: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dlb_redirect_url: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        dlb_show_side: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        dlb_is_home: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
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
        tableName: "wifi_exams",
    }
);

module.exports = ExamsCategory;
