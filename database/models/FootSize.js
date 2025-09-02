'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class FootSize extends Model {
        static associate(models) {
            FootSize.belongsToMany(models.Product, {
                as: 'products',
                through: models.ProductFootSize,
                foreignKey: 'foot_size_id',
                otherKey: 'product_id',
                timestamps: false
            });
        }
    }
    FootSize.init({
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
        modelName: 'FootSize',
        tableName: 'footsizes',
        timestamps: false
    });
    return FootSize;
};