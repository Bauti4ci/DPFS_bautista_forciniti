const { body } = require('express-validator');

const validations = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 5 }).withMessage('El nombre debe tener al menos 5 caracteres.'),
    body('bio')
        .isLength({ min: 20 }).withMessage('La descripción debe tener al menos 20 caracteres.')
];

module.exports = validations;