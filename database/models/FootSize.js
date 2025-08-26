'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FootSize extends Model {
        static associate(models) {
            FootSize.belongsToMany(models.Product, {
                as: 'products',
                through: 'Product_FootSizes',
                foreignKey: 'foot_size_id',
                otherKey: 'product_id',
                timestamps: false
            });
        }
    }
    FootSize.init({
        value: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'FootSize',
        tableName: 'footSizes',
        timestamps: false
    });
    return FootSize;
};