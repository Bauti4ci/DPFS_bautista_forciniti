'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// --- INICIO DE LA MODIFICACIÓN ---

// Lista explícita de tus modelos
const modelFiles = [
  'User.js',
  'Role.js',
  'Category.js',
  'Gender.js',
  'Product.js',
  'Cart.js', // Aseguramos que Cart se cargue antes que CartDetail
  'CartDetail.js',
  'FootSize.js',
  'Size.js',
  'WearSize.js',
  'Weight.js'
  // ...agrega aquí cualquier otro archivo de modelo si falta
];

modelFiles.forEach(file => {
  const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
});


// --- FIN DE LA MODIFICACIÓN ---

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;