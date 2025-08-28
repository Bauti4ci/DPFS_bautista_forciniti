'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class WearSize extends Model {
        static associate(models) {
            WearSize.belongsToMany(models.Product, {
                as: 'products',
                through: 'product_wearsizes',
                foreignKey: 'wear_size_id',
                otherKey: 'product_id',
                timestamps: false
            });
        }
    }
    WearSize.init({
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
        modelName: 'Wearsize',
        tableName: 'wearsizes',
        timestamps: false
    });
    return WearSize;
};