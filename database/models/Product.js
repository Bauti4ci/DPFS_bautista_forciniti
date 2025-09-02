'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        static associate(models) {
            Product.belongsTo(models.Category, {
                as: 'category',
                foreignKey: 'category_id'
            });

            Product.belongsTo(models.Gender, {
                as: 'gender',
                foreignKey: 'gender_id'
            });

            // Aseguramos que todas las relaciones "through" usen el modelo correspondiente
            Product.belongsToMany(models.WearSize, {
                as: 'wearsizes',
                through: models.ProductWearSize, // <-- Correcto
                foreignKey: 'product_id',
                otherKey: 'wear_size_id',
                timestamps: false
            });

            Product.belongsToMany(models.FootSize, {
                as: 'footsizes',
                through: models.ProductFootSize, // <-- Correcto
                foreignKey: 'product_id',
                otherKey: 'foot_size_id',
                timestamps: false
            });

            Product.belongsToMany(models.Weight, {
                as: 'weights',
                through: models.ProductWeight, // <-- Correcto
                foreignKey: 'product_id',
                otherKey: 'weight_id',
                timestamps: false
            });

            Product.belongsToMany(models.Size, {
                as: 'sizes',
                through: models.ProductSize, // <-- Correcto
                foreignKey: 'product_id',
                otherKey: 'size_id',
                timestamps: false
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