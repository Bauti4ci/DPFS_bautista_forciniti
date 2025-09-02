'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductWeight extends Model {
    static associate(models) {
      ProductWeight.belongsTo(models.Product, { foreignKey: 'product_id' });
      ProductWeight.belongsTo(models.Weight, { foreignKey: 'weight_id' });
    }
  }
  ProductWeight.init({
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    weight_id: { type: DataTypes.INTEGER, primaryKey: true },
    stock: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'ProductWeight',
    tableName: 'product_weights',
    timestamps: false
  });
  return ProductWeight;
};