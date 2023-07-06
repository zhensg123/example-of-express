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
            eno: id
        })
    },
    find: async function(id) {
        return await sql.findOne(employee, {
            id: id
        })
    },
    findAll: async function(obj, isRaw) {
        return await sql.findAll(employee, obj, null, isRaw);
    },
    findData: async function(obj, pageObj) {
        return await sql.findData(employee, obj, pageObj);
    },
    update: async function(id, obj) {
        return await sql.updateData(employee, obj, {
            eno: id
        })
    }
}

module.exports = employeeService