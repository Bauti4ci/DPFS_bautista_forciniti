'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        static associate(models) {
            Size.belongsToMany(models.Product, {
                as: 'products',
                through: models.ProductSize,
                foreignKey: 'size_id',
                otherKey: 'product_id',
                timestamps: false
            });
        }
    }
    Size.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        value: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Size',
        tableName: 'sizes',
        timestamps: false
    });
    return Size;
};