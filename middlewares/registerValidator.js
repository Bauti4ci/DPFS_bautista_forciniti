const { body } = require('express-validator');
const db = require('../database/models');

const validations = [
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres.'),
    body('lname')
        .notEmpty().withMessage('El apellido es obligatorio.')
        .isLength({ min: 2 }).withMessage('El apellido debe tener al menos 2 caracteres.'),
    body('email')
        .notEmpty().withMessage('El email es obligatorio.')
        .isEmail().withMessage('Debe ser un formato de email válido.')
        .custom(async (value) => {
            const user = await db.User.findOne({ where: { email: value } });
            if (user) {
                throw new Error('Este email ya está registrado.');
            }
            return true;
        }),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria.')
        .isLength({ min: 8 }).withMessage('La contraseña debe tener al menos 8 caracteres.'),
    body('image')
        .custom((value, { req }) => {
            if (!req.file) {
                throw new Error('Debes subir una imagen de perfil.');
            }
            const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
            const fileExtension = req.file.originalname.split('.').pop().toLowerCase();
            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error('La imagen debe tener un formato válido (JPG, JPEG, PNG, GIF).');
            }
            return true;
        })
];

module.exports = validations;