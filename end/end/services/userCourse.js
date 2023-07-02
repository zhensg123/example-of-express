var UserCourse = require('../sql/tables').UserCourse;
var sql = require('../sql');
const { User, Course } = require('../sql/tables');
const classInstService = require("../services/classInst");
const classCourseService = require("../services/classCourse");

var userCourseService = {
    findUserCourse: async function(id) {
        return await sql.findOne(UserCourse, {
            id: id
        }, [{
            model: Course,
            required: false
        }, {
            model: User,
            required: false
        }])
    },
    findUserCourseByObj: async function(obj, isRaw) {
        return await sql.findAll(UserCourse, obj, [{
            model: Course,
            required: false
        }], isRaw);
    },
    findAllUserCourse: async function(id, isRaw) {
        return await sql.findAll(UserCourse, {
            userId: id
        }, [{
            model: Course,
            required: false
        }], isRaw);
    },
    findAll: async function() {
        return await sql.findAll(UserCourse);
    },
    deleteUserCourse: async function(id) {
        return await sql.deleteData(UserCourse, {
            id: id
        })
    },
    addUserCourse: async function(userCourseObj) {
        return await sql.insertData(UserCourse, userCourseObj)
    },
    updateUserCourse: async function(id, obj) {
        return await sql.updateData(UserCourse, obj, {
            id: id
        })
    },
    findStudentCourse: async function(id) {
        // 查找学生的所有课程
        // 学生课程不能直接查找userCourse表，需要通过学生的班级信息关联到课程
        const classes = await classInstService.findAll({
            userId: id
        });
        if (!classes || classes.length <= 0) return []

        var courseIds = []
        var courseList = []
        for (var i in classes) {
            const item = classes[i]
            const classId = item.classId
            const courses = await classCourseService.findAll({
                classId: classId
            }, true);
            if (!courses || courses.length <= 0) continue
            
            for (var j in courses) {
                item2 = courses[j]
                if (courseIds.indexOf(item2['Course.id']) == -1) {
                    courseIds.push(item2['Course.id'])
                    courseList.push({
                        id: item2['Course.id'],
                        name: item2['Course.name'],
                        category: item2['Course.category'],
                        cover: item2['Course.cover'],
                        introduce: item2['Course.introduce'],
                    })
                }
            }
        }
        return courseList
    }
}

module.exports = userCourseService
