var ClassCourse = require('../sql/tables').ClassCourse;
var sql = require('../sql');
const { Course } = require('../sql/tables');

/**
 * 班级的课程
 */
var classCourseService = {
    add: async function(obj) {
        return await sql.insertData(ClassCourse, obj)
    },
    delete: async function(obj) {
        return await sql.deleteData(ClassCourse, obj)
    },
    find: async function(id) {
        return await sql.findOne(ClassCourse, {
            id: id
        })
    },
    updateRecording: async function(courseId,classId,obj){

        return await sql.updateData(ClassCourse, obj, {
            courseId: courseId,
            classId:classId
        })
    },
    updateRecordingByCourse: async function(courseId,obj){

        return await sql.updateData(ClassCourse, obj, {
            courseId: courseId,
        })
    },
    findClassByCourse: async function(courseId) {
        return await sql.findAll(ClassCourse, {
            courseId: courseId
        })
    },
    findAll: async function(obj, isRaw) {
        return await sql.findAll(ClassCourse, obj, {
            model: Course,
            required: false
        }, isRaw);
    }
}

module.exports = classCourseService