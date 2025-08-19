const db = require('../../database/models');

const apiUsersController = {

    list: async (req, res) => {
        try {
            const users = await db.User.findAll({
                attributes: ['id', 'first_names', 'last_names', 'email']
            });

            const usersWithDetail = users.map(user => ({
                id: user.id,
                name: `${user.first_names} ${user.last_names}`,
                email: user.email,
                detail: `/api/users/${user.id}`
            }));

            return res.json({
                count: users.length,
                users: usersWithDetail
            });

        } catch (error) {
            console.error("Error en API de usuarios (list):", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    },


    detail: async (req, res) => {
        try {
            const user = await db.User.findByPk(req.params.id, {
                attributes: { exclude: ['password'] }
            });

            if (!user) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            const userDetail = {
                id: user.id,
                first_names: user.first_names,
                last_names: user.last_names,
                email: user.email,
                dni: user.dni,
                phone: user.phone,
                image_url: user.image_url ? `${req.protocol}://${req.get('host')}${user.image_url}` : null
            };

            return res.json(userDetail);

        } catch (error) {
            console.error("Error en API de usuarios (detail):", error);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

module.exports = apiUsersController;
