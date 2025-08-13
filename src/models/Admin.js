const { DataTypes } = require("sequelize");
const bcrypt = require("bcryptjs");
const sequelize = require("../config/database");

const Admin = sequelize.define(
    "Admin",
    {
        dlb_a_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dlb_a_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [2, 50],
            },
        },
        dlb_a_email: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        dlb_a_password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: [6, 255],
            },
        },
        dlb_a_city: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_state: {
            type: DataTypes.STRING(20),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_country: {
            type: DataTypes.STRING(100),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_address: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_zip_code: {
            type: DataTypes.STRING(15),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_phone: {
            type: DataTypes.STRING(15),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_image: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_image_thumb: {
            type: DataTypes.STRING(250),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        dlb_admin_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        dlb_a_created_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        dlb_a_type: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        dlb_ds_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_subject: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_a_promo: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_profile_link: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_tele_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_pro_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_pro_text: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        dlb_super_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        pending_lead: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        user_lead: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0,
        },
        dlb_pkg_id: {
            type: DataTypes.STRING(255),
            allowNull: true,
            defaultValue: "",
        },
        lastLoginAt: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: null,
        },
    },
    {
        tableName: "wifi_admin",
        hooks: {
            beforeCreate: async (admin) => {
                if (admin.dlb_a_password) {
                    admin.dlb_a_password = await bcrypt.hash(admin.dlb_a_password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
                }
            },
            beforeUpdate: async (admin) => {
                if (admin.changed("dlb_a_password")) {
                    admin.dlb_a_password = await bcrypt.hash(admin.dlb_a_password, parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12);
                }
            },
        },
    }
);

// Instance methods
Admin.prototype.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.dlb_a_password);
};

Admin.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.dlb_a_password;
    return values;
};

module.exports = Admin;
