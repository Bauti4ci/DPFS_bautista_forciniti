'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, { as: 'category', foreignKey: 'category_id' });
            Product.belongsTo(models.Gender, { as: 'gender', foreignKey: 'gender_id' });

            Product.belongsToMany(models.WearSize, {
                as: 'wearSizes', // <-- Estandarizado a camelCase
                through: models.ProductWearSize,
                foreignKey: 'product_id', otherKey: 'wear_size_id', timestamps: false
            });
            Product.belongsToMany(models.FootSize, {
                as: 'footSizes', // <-- Estandarizado a camelCase
                through: models.ProductFootSize,
                foreignKey: 'product_id', otherKey: 'foot_size_id', timestamps: false
            });
            Product.belongsToMany(models.Weight, {
                as: 'weights', // Este se queda así (es una sola palabra)
                through: models.ProductWeight,
                foreignKey: 'product_id', otherKey: 'weight_id', timestamps: false
            });
            Product.belongsToMany(models.Size, {
                as: 'sizes', // Este se queda así (es una sola palabra)
                through: models.ProductSize,
                foreignKey: 'product_id', otherKey: 'size_id', timestamps: false
            });
        }
    }
    Product.init({
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        image_url: {
            type: DataTypes.STRING,
            allowNull: true
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        },
        category_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        gender_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'Product',
        tableName: 'products',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: false
    });
    return Product;
};