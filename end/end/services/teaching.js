var sql = require('../sql');
const Teaching = require('../sql/tables').Teaching;
const { Lesson } = require('../sql/tables');

var teachingService = {
    add:async function(obj) {

        const row = await sql.insertData(Teaching, obj);
    
        return row;
    },
    deleteByInfo:async function(classId, courseId) {
        const obj = {
            classId: classId,
            courseId: courseId
        }

        return await sql.deleteData(Teaching, obj);
    },
    deleteByObj:async function(obj) {
        return await sql.deleteData(Teaching, obj);
    },
    deleteByLesson:async function(lessonId) {
        const obj = {
            lessonId: lessonId,
        }

        return await sql.deleteData(Teaching, obj);
    },
    delete:async function(id) {
        const obj = {
            id: id,
        }
        return await sql.deleteData(Teaching, obj);
    },
    updateByInfo:async function(classId, courseId,lessonId,obj) {
        return await sql.updateData(Teaching, obj, {
            classId: classId,
            courseId:courseId,
            lessonId:lessonId
        })
    },
    update:async function(id,obj) {
        return await sql.updateData(Teaching, obj, {
            id: id
        })
    },
    updateByLessonId:async function(lessonId,obj) {
        return await sql.updateData(Teaching, obj, {
            lessonId: lessonId
        })
    },
    findRecordByInfo:async function(classId, courseId) {
        return await sql.findAll(Teaching, {
            classId: classId,
            courseId:courseId,
        })
    },
    findRecordByThreeInfo:async function(classId, courseId,lessonId) {
        return await sql.findAll(Teaching, {
            classId: classId,
            courseId:courseId,
            lessonId:lessonId
        })
    },
    findRecordByCourse:async function(courseId) {
        return await sql.findAll(Teaching, {
            courseId:courseId,
        }, {
            model: Lesson,
            required: false
        })
    },
    findRecordByClass:async function(classId) {
        return await sql.findAll(Teaching, {
            classId:classId,
        })
    },
    findRecordByLesson:async function(lessonId) {
        return await sql.findAll(Teaching, {
            lessonId:lessonId,
        })
    },
    findRecord:async function(id) {
        return await sql.findOne(Teaching, {
            id:id,
        }, {
            model: Lesson,
            required: false
        })
    }
    // findAllRecord:async function() {
    //     return await sql.findAll(Teaching)
    // },
}

module.exports = teachingService