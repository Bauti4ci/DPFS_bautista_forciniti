'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Size extends Model {
        static associate(models) {
            Size.belongsToMany(models.Product, {
                as: 'products',
                through: 'Product_Sizes',
                foreignKey: 'size_id',
                otherKey: 'product_id',
                timestamps: false
            });
        }
    }
    Size.init({
        value: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Size',
        tableName: 'Sizes',
        timestamps: false
    });
    return Size;
};