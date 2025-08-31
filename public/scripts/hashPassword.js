const bcrypt = require('bcryptjs');

// La contraseña que quieres para tu admin
const password = 'admin12345'; // <-- ¡Cambia esto por una contraseña fuerte!

// El número de "rondas" de hashing (10 es un buen estándar)
const saltRounds = 10;

const hashedPassword = bcrypt.hashSync(password, saltRounds);

console.log('Tu contraseña es:', password);
console.log('Copia y pega este hash en tu consulta SQL:');
console.log(hashedPassword);