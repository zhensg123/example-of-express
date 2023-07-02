var Template = require('../sql/tables').Template;
var sql = require('../sql');

var templateService = {
    findTemplate: async function(id) {
        return await sql.findOne(Template, {
            id: id
        })
    },
    findAllTemplate: async function(type) {
        return await sql.findAll(Template, {
            type: type
        });
    },
    deleteTemplate: async function(id) {
        return await sql.deleteData(Template, {
            id: id
        })
    },
    addTemplate: async function(templateObj) {
        return await sql.insertData(Template, templateObj)
    },
    updateTemplate: async function(id, obj) {
        return await sql.updateData(Template, obj, {
            id: id
        })
    }
}

module.exports = templateService
