var ClassInfo = require('../sql/tables').ClassInfo;
var sql = require('../sql');

/**
 * 班级信息
 */
var classInfoService = {
    add: async function(obj) {
        return await sql.insertData(ClassInfo, obj)
    },
    delete: async function(id) {
        return await sql.deleteData(ClassInfo, {
            id: id
        })
    },
    find: async function(id) {
        return await sql.findOne(ClassInfo, {
            id: id
        })
    },
    findAll: async function(obj, isRaw) {
        return await sql.findAll(ClassInfo, obj, null, isRaw);
    },
    update: async function(id, obj) {
        return await sql.updateData(ClassInfo, obj, {
            id: id
        })
    }
}

module.exports = classInfoService