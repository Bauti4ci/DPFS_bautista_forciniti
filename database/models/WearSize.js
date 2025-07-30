'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WearSize extends Model {
        static associate(models) {
            WearSize.belongsToMany(models.Product, {
                as: 'products',
                through: 'Product_WearSizes',
                foreignKey: 'wear_size_id',
                otherKey: 'product_id',
                timestamps: false
            });
        }
    }
    WearSize.init({
        value: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'WearSize',
        tableName: 'WearSizes',
        timestamps: false
    });
    return WearSize;
};