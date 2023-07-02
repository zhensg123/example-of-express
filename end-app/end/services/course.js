var Course = require('../sql/tables').Course;
var sql = require('../sql');
const { Lesson } = require('../sql/tables');
const LessonResource = require('../sql/tables').LessonResource;

var courseService = {
    findCourse: async function(id) {
        return await sql.findOne(Course, {
            id: id
        }, {
            model: Lesson,
            required: false,
            include: { required: false, model: LessonResource }
        })
    },
    findAllCourseByName: async function(name) {
        // return await sql.findAll(Course, {}, {
        //     model: Lesson,
        //     required: false
        // });
        return await sql.findAll(Course, {name:name});
    },
    findAllCourse: async function() {
        // return await sql.findAll(Course, {}, {
        //     model: Lesson,
        //     required: false
        // });
        return await sql.findAll(Course, {}, {
            model: Lesson,
            required: false,
            include: { required: false, model: LessonResource }
        });
    },
    deleteCourse: async function(id) {
        return await sql.deleteData(Course, {
            id: id
        })
    },
    addCourse: async function(courseObj) {
        return await sql.insertData(Course, courseObj)
    },
    updateCourse: async function(id, obj) {
        return await sql.updateData(Course, obj, {
            id: id
        })
    }
}

module.exports = courseService