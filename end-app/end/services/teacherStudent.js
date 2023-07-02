var TeacherStudent = require('../sql/tables').TeacherStudent;
var sql = require('../sql');
const { User } = require('../sql/tables');

/**
 * 班级的课程
 */
var teacherStudentService = {
    add: async function(teacherId, userId) {
        const obj = {
            teacherId: teacherId,
            studentId: userId
        }
        return await sql.insertData(TeacherStudent, obj)
    },
    delete: async function(teacherId, studentId) {
        const obj = {
            teacherId: teacherId,
            studentId: studentId
        }
        return await sql.deleteData(TeacherStudent, obj)
    },
    find: async function(teacherId) {
        return await sql.findOne(TeacherStudent, {
            teacherId: teacherId
        })
    },
    findAll: async function(obj, isRaw) {
        return await sql.findAll(TeacherStudent, obj);
    }
}

module.exports = teacherStudentService