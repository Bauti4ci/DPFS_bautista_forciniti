const jwt = require('jsonwebtoken');
const db = require('../database/models');

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.redirect('/users/login');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await db.User.findByPk(decoded.id, {
            include: [{ model: db.Role, as: 'roles' }] 
        });

        if (!user) {
            return res.redirect('/users/login');
        }

        delete user.dataValues.password;
        req.user = user;
        res.locals.userLogged = user;

        next();
    } catch (error) {
        res.clearCookie('jwt'); 
        return res.redirect('/users/login');
    }
};

const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).send('No estás autorizado');
    }

    console.log('DATOS DEL USUARIO EN MIDDLEWARE:', JSON.stringify(req.user, null, 2));

    const isAdmin = req.user.roles.some(role => role.role_name === 'Admin');

    if (!isAdmin) {
        return res.status(403).render('error', {
            message: 'Acceso denegado',
            error: { status: '403', stack: 'No tienes permisos de administrador para ver esta página.' }
        });
    }

    next();
};

module.exports = { authMiddleware, adminMiddleware };