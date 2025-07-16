const User = require('../models/User.js');
const bcrypt = require('bcryptjs')


let usersController = {
    log: function (req, res) {
        res.render('users/login', { title: 'Inicio de sesión' });

    },
    create: function (req, res) {
        res.render('users/register', { title: 'Registro' });

    },
    store: async function (req, res) {
        try {
            const formData = req.body;

            const allUsers = User.findAll();

            const existingUser = allUsers.find(user => user.email === formData.email);

            if (existingUser) {
                return res.status(400).json({ message: 'Este email ya está en uso' });
            }

            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(formData.password, saltRounds);

            const imagePath = req.file
                ? `/usersImages/${req.file.filename}`
                : 'https://placehold.co/535x665/ffffff/000000?text=No se pudo cargar la imagen';

            const newUserData = {
                image: imagePath,
                firstNames: formData.name,
                lastNames: formData.lname,
                dni: Number(formData.dni),
                email: formData.email,
                password: hashedPassword,
                number: Number(formData.phone),
                type: formData.type || null,
            };

            User.create(newUserData);

            res.redirect('/');

        } catch (error) {
            console.error("Error en el registro de usuario:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    }
}

module.exports = usersController