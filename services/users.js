var User = require('../sql/tables').users;
var sql = require('../sql');

// const avatarUrl ="https://i.imgur.com/iN3L6aI.png"

var userService = {
    login: async function(username, password) {
        const rows = await sql.findAll(User, {
            username: username,
            password: password
        });
        if (!rows || rows.len <= 0) {
            return null
        } else {
            const item = rows[0]
            return rows[0]
        }
    },
    findUserByPk: async function(id) {
        return await sql.findByPk(User, id)
    },
    findAllUser: async function() {
        return await sql.findAll(User, {});
    },
    deleteUser: async function(id) {
        return await sql.deleteData(User, {
            id: id
        })
    },
    addUser: async function(userObj) {
        // userObj.avatar = avatarUrl
        return await sql.insertData(User, userObj)
    },
    updateUser: async function(id, obj) {
        return await sql.updateData(User, obj, {
            id: id
        })
    },
    findUserByPhone: async function(phone) {
        return await sql.findAll(User, {
            phone: phone,
            phoneVerify: 1
        })
    }
}

module.exports = userService
