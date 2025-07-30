'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Role extends Model {
        static associate(models) {
            Role.belongsToMany(models.User, {
                as: 'users',
                through: 'User_Roles',
                foreignKey: 'role_id',
                otherKey: 'user_id',
                timestamps: false
            });
        }
    }
    Role.init({
        role_name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Role',
        tableName: 'Roles',
        timestamps: false
    });
    return Role;
};