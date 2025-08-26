'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Weight extends Model {
    static associate(models) {
      Weight.belongsToMany(models.Product, {
        as: 'products',
        through: 'Product_Weights',
        foreignKey: 'weight_id',
        otherKey: 'product_id',
        timestamps: false
      });
    }
  }
  Weight.init({
    value: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Weight',
    tableName: 'weights',
    timestamps: false
  });
  return Weight;
};