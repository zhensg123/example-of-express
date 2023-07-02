var UserTemplateInst = require('../sql/tables').UserTemplateInst;
var User = require('../sql/tables').User;
// const { where } = require('sequelize/types');
var sql = require('../sql');
const { Template } = require('../sql/tables');

var userTemplateInstService = {
    findUserTemplateInst: async function(id) {
        return await sql.findOne(UserTemplateInst, {
            id: id
        }, [{
            model: Template,
            required: false
        }, {
            model: User,
            required: false
        }])
    },
    findAllUserTemplateInst: async function(id, type) {
        var whereObj = {
            userId: id
        }
        var includeObj = [{
            model: Template,
            required: false
        }]
        if (type) whereObj.type = type
        return await sql.findAll(UserTemplateInst, whereObj, includeObj);
    },
    findAll: async function() {
        return await sql.findAll(UserTemplateInst);
    },
    deleteUserTemplateInst: async function(id) {
        return await sql.deleteData(UserTemplateInst, {
            id: id
        })
    },
    addUserTemplateInst: async function(userTemplateInstObj) {
        return await sql.insertData(UserTemplateInst, userTemplateInstObj)
    },
    updateUserTemplateInst: async function(id, obj) {
        return await sql.updateData(UserTemplateInst, obj, {
            id: id
        })
    }
}

module.exports = userTemplateInstService
