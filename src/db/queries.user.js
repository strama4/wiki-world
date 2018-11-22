const User = require('../db/models').User;
const bcrypt = require('bcrypt');

module.exports = {
    createUser(newUser, callback) {
        const salt = bcrypt.genSaltSync();
        const hashedPassword = bcrypt.hashSync(newUser.password, salt);

        return User.create({
            name: newUser.name,
            email: newUser.email,
            password: hashedPassword
        })
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },
    getUser(id, callback) {
        return User.findByPk(id)
        .then((user) => {
            callback(null, user);
        })
        .catch((err) => {
            callback(err);
        })
    },
    toggleUser(id, callback) {
        return User.findByPk(id)
        .then((user) => {
            let role = user.role === 0 ? 1 : 0;
            user.update({role})
            .then((updatedUser) => {
                callback(null, updatedUser);
            })
            .catch((err) => {
                callback(err);
            })
        })
    }
}