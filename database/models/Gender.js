'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Gender extends Model {
        static associate(models) {
            Gender.hasMany(models.Product, {
                as: 'products',
                foreignKey: 'gender_id'
            });
        }
    }
    Gender.init({
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    }, {
        sequelize,
        modelName: 'Gender',
        tableName: 'genders',
        timestamps: false
    });
    return Gender;
};