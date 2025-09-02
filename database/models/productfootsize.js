'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductFootSize extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductFootSize.init({
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
    modelName: 'ProductFootSize',
    tableName: 'product_footsizes',
    timestamps: false
  });
  return ProductFootSize;
};