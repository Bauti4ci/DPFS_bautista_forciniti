const bcrypt = require('bcryptjs');
const db = require('../database/models');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');


const usersController = {
    log: function (req, res) {
        res.render('users/login', { title: 'Inicio de sesión' });
    },

    processLogin: async function (req, res) {
        try {
            const userToLogin = await db.User.findOne({
                where: { email: req.body.email },
                include: [{ model: db.Role, as: 'roles' }]
            });

            if (!userToLogin) {
                return res.render('users/login', {
                    title: 'Inicio de sesión',
                    errors: { email: { msg: 'Credenciales inválidas' } }
                });
            }

            const isPasswordCorrect = bcrypt.compareSync(req.body.password, userToLogin.password);

            if (isPasswordCorrect) {
                const payload = {
                    id: userToLogin.id,
                    email: userToLogin.email,
                    roles: userToLogin.roles.map(role => role.role_name)
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                });

                res.cookie('jwt', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    maxAge: 3600000
                });

                return res.redirect('/users/profile');

            } else {
                return res.render('users/login', {
                    title: 'Inicio de sesión',
                    errors: { email: { msg: 'Credenciales inválidas' } }
                });
            }

        } catch (error) {
            console.error("Error en el login:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    create: function (req, res) {
        res.render('users/register', { title: 'Registro' });
    },
    store: async function (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('users/register', {
                title: 'Registro',
                errors: errors.mapped(),
                oldData: req.body
            });
        }
        const t = await db.sequelize.transaction();
        try {
            const existingUser = await db.User.findOne({ where: { email: req.body.email } });
            if (existingUser) {
                await t.rollback();
                return res.render('users/register', {
                    title: 'Registro',
                    errors: { email: { msg: 'Este email ya está en uso' } },
                    oldData: req.body
                });
            }

            const imagePath = req.file ? `/usersImages/${req.file.filename}` : null;
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);

            const newUser = await db.User.create({
                first_names: req.body.name,
                last_names: req.body.lname,
                email: req.body.email,
                password: hashedPassword,
                dni: Number(req.body.dni) || null,
                phone: req.body.phone || null,
                image_url: imagePath
            }, { transaction: t });

            const customerRole = await db.Role.findOne({ where: { role_name: 'cliente' } });
            if (customerRole) {
                await newUser.addRole(customerRole, { transaction: t });
            } else {
                throw new Error("El rol 'cliente' no fue encontrado en la base de datos.");
            }

            await t.commit();

            delete newUser.dataValues.password;
            req.user = newUser;

            return res.redirect('/users/profile');

        } catch (error) {
            await t.rollback();
            console.error("Error en el registro de usuario:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },


    logout: function (req, res) {
        res.clearCookie('jwt');
        return res.redirect('/');
    },

    profile: function (req, res) {
        res.render('users/profile', {
            title: 'Mi Perfil',
            user: req.user
        });
    },

    edit: async function (req, res) {

        res.render('users/editUser', {
            title: 'Editar Perfil',
            user: req.user
        });
    },

    update: async function (req, res) {
        try {
            const userId = req.user.id;
            const userToUpdate = await db.User.findByPk(userId);

            const imagePath = req.file ? `/usersImages/${req.file.filename}` : userToUpdate.image_url;

            await userToUpdate.update({
                first_names: req.body.first_names,
                last_names: req.body.last_names,
                phone: req.body.phone,
                image_url: imagePath,
                dni: req.body.dni,
                email: req.body.email
            });

            const updatedUser = await db.User.findByPk(userId);
            delete updatedUser.dataValues.password;
            req.user = updatedUser;

            res.redirect('/users/profile');

        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                const userToEdit = await db.User.findByPk(req.user.id);
                return res.render('users/editProfile', {
                    title: 'Editar Perfil',
                    user: userToEdit,
                    error: 'El DNI o Email ingresado ya está en uso por otro usuario.'
                });
            }
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },
};

module.exports = usersController;
