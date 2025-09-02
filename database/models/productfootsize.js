'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductFootSize extends Model {
    static associate(models) {
      // Define las relaciones aquí
      ProductFootSize.belongsTo(models.Product, { foreignKey: 'product_id' });
      ProductFootSize.belongsTo(models.FootSize, { foreignKey: 'foot_size_id' });
    }
  }
  ProductFootSize.init({
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    foot_size_id: { type: DataTypes.INTEGER, primaryKey: true }, // Corregido de 'size_id' a 'foot_size_id'
    stock: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'ProductFootSize',
    tableName: 'product_footsizes',
    timestamps: false
  });
  return ProductFootSize;
};