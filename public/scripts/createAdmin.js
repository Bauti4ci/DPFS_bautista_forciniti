const db = require('../../database/models');
const bcrypt = require('bcryptjs');

const ADMIN_EMAIL = 'leomessi@gmail.com';
const ADMIN_PASSWORD = 'Kakaroto1234';

async function createAdmin() {
    console.log('Iniciando script para crear admin...');

    try {
        const adminRole = await db.Role.findOne({ where: { role_name: 'admin' } });
        if (!adminRole) {
            console.error("Error: El rol 'admin' no existe. Por favor, créalo en la tabla Roles.");
            return;
        }

        const existingAdmin = await db.User.findOne({ where: { email: ADMIN_EMAIL } });
        if (existingAdmin) {
            console.log('El usuario administrador ya existe.');
            return;
        }

        const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 10);

        const newAdmin = await db.User.create({
            first_names: 'Lionel',
            last_names: 'Messi',
            email: ADMIN_EMAIL,
            password: hashedPassword,
            dni: 40000000,
            phone: null,
            image_url: 'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/bltb66cea843d2d8165/639f6af0501fcf7ffb8212dd/GettyImages-1245710025.jpg?auto=webp&format=pjpg&width=3840&quality=60',
        });

        await newAdmin.addRole(adminRole);

        console.log('¡Usuario administrador creado exitosamente!');
        console.log(`Email: ${ADMIN_EMAIL}`);
        console.log(`Contraseña: ${ADMIN_PASSWORD}`);

    } catch (error) {
        console.error('Ocurrió un error al crear el usuario administrador:', error);
    } finally {
        await db.sequelize.close();
        console.log('Conexión con la base de datos cerrada.');
    }
}


//para correr el script
//node public/scripts/createAdmin.js


createAdmin();