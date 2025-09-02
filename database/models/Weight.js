'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Weight extends Model {
    static associate(models) {
      Weight.belongsToMany(models.Product, {
        as: 'products',
        through: models.ProductWeight,
        foreignKey: 'weight_id',
        otherKey: 'product_id',
        timestamps: false
      });
    }
  }
  Weight.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
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