'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductWearSize extends Model {
    static associate(models) {
      ProductWearSize.belongsTo(models.Product, { foreignKey: 'product_id' });
      ProductWearSize.belongsTo(models.WearSize, { foreignKey: 'wear_size_id' });
    }
  }
  ProductWearSize.init({
    product_id: { type: DataTypes.INTEGER, primaryKey: true },
    wear_size_id: { type: DataTypes.INTEGER, primaryKey: true },
    stock: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'ProductWearSize',
    tableName: 'product_wearsizes',
    timestamps: false
  });
  return ProductWearSize;
};