'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Cart extends Model {
        static associate(models) {
            Cart.belongsTo(models.User, {
                as: 'user',
                foreignKey: 'user_id'
            });

            Cart.hasMany(models.CartDetail, {
                as: 'items',
                foreignKey: 'cart_id'
            });
        }
    }
    Cart.init({
        id: {                
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM('activo', 'completado', 'abandonado'),
            defaultValue: 'activo'
        }
    }, {
        sequelize,
        modelName: 'Cart',
        tableName: 'carts',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    });
    return Cart;
};