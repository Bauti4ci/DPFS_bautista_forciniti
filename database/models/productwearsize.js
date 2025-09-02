'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductWearSize extends Model {
    static associate(models) {
      // define association here
    }
  }
  ProductWearSize.init({
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
    modelName: 'ProductWearSize',
    tableName: 'product_wearsizes',
    timestamps: false
  });
  return ProductWearSize;
};