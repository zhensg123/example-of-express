var sql = require('../sql');
const Lesson = require('../sql/tables').Lesson;
const LessonResource = require('../sql/tables').LessonResource;

var lessonService = {
    findLesson: async function(id) {
        return await sql.findOne(Lesson, {
            id: id
        }, {
            model: LessonResource,
            required: false
        })
    },
    findAllLesson: async function() {
        return await sql.findAll(Lesson, {}, {
            model: LessonResource,
            required: false
        });
    },
    deleteLesson: async function(id) {
        return await sql.deleteData(Lesson, {
            id: id
        })
    },
    addLesson: async function(lessonObj) {
        return await sql.insertData(Lesson, lessonObj)
    },
    updateLesson: async function(id, obj) {
        return await sql.updateData(Lesson, obj, {
            id: id
        })
    }
}

module.exports = lessonService
