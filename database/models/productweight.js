'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductWeight extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductWeight.init({
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
    modelName: 'ProductWeight',
    tableName: 'product_weights',
    timestamps: false
  });
  return ProductWeight;
};