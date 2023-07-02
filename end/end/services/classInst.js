var ClassInst = require('../sql/tables').ClassInst;
var ClassInfo = require('../sql/tables').ClassInfo;
var sql = require('../sql');
const { User } = require('../sql/tables');

/**
 * 班级的学生
 */
var classInstService = {
    update: async function(classId,userId,obj) {

        return await sql.updateData(ClassInst, obj, {
            classId: classId,
            userId: userId
        })
    },
    updateUserId: async function(classId,obj) {
        return await sql.updateData(ClassInst, obj, {
            classId: classId
        })
    },
    add: async function(classId, userId) {
        const obj = {
            classId: classId,
            userId: userId
        }
        const row = await sql.insertData(ClassInst, obj);
        if (row) {
            await sql.increment(ClassInfo, classId, 'registerStuCount');
        }
        return row;
    },
    delete: async function(classId, userId) {
        const obj = {
            classId: classId,
            userId: userId
        }
        const res = await sql.deleteData(ClassInst, obj);
        if (res == 1) {
            await sql.decrement(ClassInfo, classId, 'registerStuCount');
            return true
        }
        return false
        
    },
    find: async function(id) {
        return await sql.findOne(ClassInst, {
            id: id
        }, {
            model: User,
            required: false
        })
    },
    findAll: async function(obj, isRaw) {
        return await sql.findAll(ClassInst, obj, {
            model: User,
            required: false
        }, isRaw);
    }
}

module.exports = classInstService