var sql = require('../sql');
const LessonResource = require('../sql/tables').LessonResource;

var lessonResourceService = {
    findLessonResource: async function(id) {
        return await sql.findOne(LessonResource, {
            id: id
        })
    },
    findLessonResourceByLesson: async function(lessonId) {
        return await sql.findOne(LessonResource, {
            lessonId: lessonId
        })
    },
    findAllLessonResource: async function() {
        return await sql.findAll(LessonResource);
    },
    deleteLessonResourceBylessonId: async function(lessonId) {
        return await sql.deleteData(LessonResource, {
            lessonId: lessonId
        })
    },
    deleteLessonResource: async function(id) {
        return await sql.deleteData(LessonResource, {
            id: id
        })
    },
    addLessonResource: async function(lessonResourceObj) {
        return await sql.insertData(LessonResource, lessonResourceObj)
    },
    updateLessonResource: async function(id, obj) {
        return await sql.updateData(LessonResource, obj, {
            id: id
        })
    }
}

module.exports = lessonResourceService
