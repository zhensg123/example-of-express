const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const userCourseService = require('../services/userCourse');
const courseService = require('../services/course')
const { UserCourse } = require('../sql/tables');
const Constants = require('../utils/constant')
const { decode } = require('../utils/index')

const RBAC = require('./rbac')
/**
 * @swagger
 *  /userCourse/info/:id:
 *    get:
 *      tags:
 *        - userCourse
 *      summary: 获取用户课程详细信息
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回用户课程信息
 */
router.get('/info/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }

    const id = req.params.id;
    const userCourse = await userCourseService.findUserCourse(id)
    if (userCourse) {
        new Result(userCourse, '获取成功', 'success').success(res)
    } else {
        new Result(null, '获取失败', 'fail').fail(res)
    }
});

/**
 * @swagger
 *  /userCourse/all:
 *    get:
 *      tags:
 *        - userCourse
 *      summary: 获取所有用户课程
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回用户课程列表
 */
router.get('/all', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }

    const rows = await userCourseService.findAll()
    new Result(rows, '获取成功', 'success').success(res)
});

/**
 * @swagger
 *  /userCourse/all/currentUser:
 *    get:
 *      tags:
 *        - userCourse
 *      summary: 获取某个用户的所有课程
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回某个用户的所有课程列表
 */
router.get('/all/currentUser', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const userId = req.user.userId
    const roles = req.user.roles
    var rows = []
    if (roles[0] == Constants.ROLE_TEACHER) {
        rows = await userCourseService.findAllUserCourse(userId)
       
        for(var i=0;i<rows.length;i++){
            let course = await courseService.findCourse(rows[i].dataValues.courseId)
            console.log('course',course)
            console.log('rows',rows)
            if(course){
               
                rows[i].dataValues.courseInfo = course
            }
            
        }
        
    } else if (roles[0] == Constants.ROLE_STUDENT) {
        rows = await userCourseService.findStudentCourse(userId)
    }
    new Result(rows, '获取成功', 'success').success(res)

});

/**
 * @swagger
 *  /userCourse/delete/:id:
 *    delete:
 *      tags:
 *        - userCourse
 *      summary: 删除用户课程
 *      description: 访问权限：admin teacher 
 *      parameters:
 *        - name: id
 *          description: 用户课程id
 *      responses:
 *        200:
 *          description: 删除成功
 */
router.delete('/delete/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }
    const id = req.params.id;
    await userCourseService.deleteUserCourse(id)
    new Result(null, '删除成功', 'success').success(res)
});

/**
 * @swagger
 *  /userCourse/add:
 *    post:
 *      tags:
 *        - userCourse
 *      summary: 添加用户课程
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: userId
 *          description: 用户id
 *        - name: courseId
 *          description: 课程id
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post('/add', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }
    const obj = {
        userId: req.body.userId,
        courseId: req.body.courseId,
    }

    const arr = await userCourseService.findUserCourseByObj(obj)
    if (arr && arr.length > 0) {
        new Result(arr[0], '课程已经存在', 'success').success(res)
        return
    }

    const userCourse = await userCourseService.addUserCourse(obj)
    new Result(userCourse, '新增成功', 'success').success(res)
});

module.exports = router
