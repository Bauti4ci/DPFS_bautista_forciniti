'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {
            User.hasOne(models.Cart, {
                foreignKey: 'user_id',
                as: 'cart'
            });

            User.belongsToMany(models.Role, {
                as: 'roles',
                through: 'User_Roles',
                foreignKey: 'user_id',
                otherKey: 'role_id',
                timestamps: false
            });
        }
    }
    User.init({
        first_names: {
            type: DataTypes.STRING,
            allowNull: false
        },
        last_names: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        dni: {
            type: DataTypes.INTEGER,
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        sequelize,
        modelName: 'User',
        tableName: 'Users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    return User;
};