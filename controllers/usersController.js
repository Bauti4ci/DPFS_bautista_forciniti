const bcrypt = require('bcryptjs');
const db = require('../database/models');
const User = db.User;

const { validationResult } = require('express-validator');


const usersController = {
    log: function (req, res) {
        res.render('users/login', { title: 'Inicio de sesión' });
    },

    processLogin: async function (req, res) {
        try {
            const userToLogin = await db.User.findOne({ where: { email: req.body.email } });

            if (userToLogin) {
                const isPasswordCorrect = bcrypt.compareSync(req.body.password, userToLogin.password);
                if (isPasswordCorrect) {
                    delete userToLogin.password;
                    req.session.userLogged = userToLogin;

                    if (req.body.remember_me) {
                        res.cookie('userEmail', req.body.email, { maxAge: 1000 * 60 * 60 * 24 * 30 });
                    }

                    return res.redirect('/users/profile');
                }
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
            req.session.userLogged = newUser;

            return res.redirect('/users/profile');

        } catch (error) {
            await t.rollback();
            console.error("Error en el registro de usuario:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },


    logout: function (req, res) {
        res.clearCookie('userEmail');

        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            }

            return res.redirect('/');
        });
    },

    profile: function (req, res) {
        if (req.session.userLogged) {
            res.render('users/profile', {
                title: 'Mi Perfil',
                user: req.session.userLogged
            });
        } else {
            res.redirect('/users/login');
        }
    },

    edit: async function (req, res) {
        try {
            const userToEdit = await db.User.findByPk(req.session.userLogged.id);

            res.render('users/editUser', {
                title: 'Editar Perfil',
                user: userToEdit
            });
        } catch (error) {
            console.error("Error al cargar el perfil para editar:", error);
            res.status(500).send("Ocurrió un error en el servidor.");
        }
    },

    update: async function (req, res) {
        try {
            const userId = req.session.userLogged.id;
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
            req.session.userLogged = updatedUser;

            res.redirect('/users/profile');

        } catch (error) {
            console.error("Error al actualizar el usuario:", error);
            if (error.name === 'SequelizeUniqueConstraintError') {
                const userToEdit = await db.User.findByPk(req.session.userLogged.id);
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
