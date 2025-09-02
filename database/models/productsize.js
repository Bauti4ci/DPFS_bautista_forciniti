'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductSize extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductSize.init({
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    size_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false // Importante: coincide con tu base de datos
    }
  }, {
    sequelize,
    modelName: 'ProductSize',
    tableName: 'product_sizes',
    timestamps: false
  });
  return ProductSize;
};