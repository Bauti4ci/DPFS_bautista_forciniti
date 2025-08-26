'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class CartDetail extends Model {
        static associate(models) {
            CartDetail.belongsTo(models.Cart, {
                as: 'cart',
                foreignKey: 'cart_id'
            });
            CartDetail.belongsTo(models.Product, {
                as: 'product',
                foreignKey: 'product_id'
            });
            CartDetail.belongsTo(models.WearSize, { foreignKey: 'wear_size_id', as: 'wearSize' });
            CartDetail.belongsTo(models.FootSize, { foreignKey: 'foot_size_id', as: 'footSize' });
            CartDetail.belongsTo(models.Weight, { foreignKey: 'weight_id', as: 'weight' });
            CartDetail.belongsTo(models.Size, { foreignKey: 'size_id', as: 'size' });
        }
    }
    CartDetail.init({
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },
        quantity: { type: DataTypes.INTEGER, allowNull: false },
        unit_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        cart_id: DataTypes.INTEGER,
        product_id: DataTypes.INTEGER,
        wear_size_id: DataTypes.INTEGER,
        foot_size_id: DataTypes.INTEGER,
        weight_id: DataTypes.INTEGER,
        size_id: DataTypes.INTEGER
    }, {
        sequelize,
        modelName: 'CartDetail',
        tableName: 'cart_Details',
        timestamps: false
    });
    return CartDetail;
};