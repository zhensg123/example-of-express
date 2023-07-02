var students = require('../sql/tables').students;
var sql = require('../sql');

/**
 * 班级信息
 */
var studentsService = {
    add: async function(obj) {
        return await sql.insertData(students, obj)
    },
    delete: async function(id) {
        return await sql.deleteData(students, {
            id: id
        })
    },
    find: async function(id) {
        return await sql.findOne(students, {
            id: id
        })
    },
    findAll: async function(obj, isRaw) {
        return await sql.findAll(students, obj, null, isRaw);
    },
    update: async function(id, obj) {
        return await sql.updateData(students, obj, {
            id: id
        })
    }
}

module.exports = studentsService