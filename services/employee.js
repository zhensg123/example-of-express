var employee = require('../sql/tables').employee;
var sql = require('../sql');

/**
 * 班级信息
 */
var employeeService = {
    add: async function(obj) {
        return await sql.insertData(employee, obj)
    },
    delete: async function(id) {
        return await sql.deleteData(employee, {
            id: id
        })
    },
    find: async function(id) {
        return await sql.findOne(employee, {
            id: id
        })
    },
    findAll: async function() {
        return await sql.findAll();
    },
    update: async function(id, obj) {
        return await sql.updateData(employee, obj, {
            id: id
        })
    }
}

module.exports = employeeService