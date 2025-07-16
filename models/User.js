const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, '../data/users.json');

const User = {
    findAll: () => {
        const jsonUsers = fs.readFileSync(usersFilePath, 'utf-8');
        const users = JSON.parse(jsonUsers);
        return users;
    },

    findById: (id) => {
        const allUsers = User.findAll();
        const userFound = allUsers.find(user => user.id == id);
        return userFound;
    },
    create: (userData) => {
        const allUsers = User.findAll();

        const lastUser = allUsers[allUsers.length - 1];
        const newId = lastUser ? lastUser.id + 1 : 1;

        const newUser = {
            id: newId,
            ...userData
        };


        allUsers.push(newUser);


        fs.writeFileSync(usersFilePath, JSON.stringify(allUsers, null, 4));

        return newUser;
    }
}


module.exports = User;