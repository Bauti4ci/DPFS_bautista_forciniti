'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.belongsToMany(models.User, {
                as: 'users',
                through: 'user_roles',
                foreignKey: 'role_id',
                otherKey: 'user_id',
                timestamps: false
            });
        }
    }
    Role.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'roles',
        timestamps: false
    });
    return Role;
};