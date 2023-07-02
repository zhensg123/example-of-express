const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const courseService = require('../services/course')
const RBAC = require('./rbac')

/**
 * @swagger
 *  /course/info/:id:
 *    get:
 *      tags:
 *        - course
 *      summary: 获取课程详细信息
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回课程信息
 */
router.get('/info/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    const course = await courseService.findCourse(id)
    if (course) {
        // const lessons = await course.getLessons();
        // course.lessons = lessons
        new Result(course, '获取成功', 'success').success(res)
    } else {
        new Result(null, '获取失败', 'fail').fail(res)
    }
});

/**
 * @swagger
 *  /course/all:
 *    get:
 *      tags:
 *        - course
 *      summary: 获取所有课程
 *      description: 访问权限：admin
 *      responses:
 *        200:
 *          description: 返回课程列表
 */
router.get('/all', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const rows = await courseService.findAllCourse()
    new Result(rows, '获取成功', 'success').success(res)
});

/**
 * @swagger
 *  /course/delete/:id:
 *    delete:
 *      tags:
 *        - course
 *      summary: 删除课程
 *      description: 访问权限：admin
 *      parameters:
 *        - name: id
 *          description: 课程id
 *      responses:
 *        200:
 *          description: 删除成功
 */
router.delete('/delete/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN,RBAC.ROLE_TEACHER], res)) {
        return
    }
    const id = req.params.id;
    await courseService.deleteCourse(id)
    new Result(null, '删除成功', 'success').success(res)
});

/**
 * @swagger
 *  /course/add:
 *    post:
 *      tags:
 *        - course
 *      summary: 添加课程
 *      description: 访问权限：admin
 *      parameters:
 *        - name: name
 *          description: 名称
 *        - name: introduce
 *          description: 简介
 *        - name: totalLesson
 *          description: 总课时
 *        - name: category
 *          description: 分类
 *        - name: tag
 *          description: tag
 *        - name: cover
 *          description: 封面
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post('/add', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN,RBAC.ROLE_TEACHER], res)) {
        return
    }
    const obj = {
        name: req.body.name,
        introduce: req.body.introduce,
        totalLesson: 0,
        category: req.body.category,
        tag: req.body.tag,
        cover: req.body.cover,
    }
    const r = await courseService.findAllCourseByName(req.body.name)
    if(r.length>0){
        new Result(null, '课程名称已存在', 'class name already in use').fail(res)
    }else{
        const course = await courseService.addCourse(obj)
        new Result(course, '新增成功', 'success').success(res)
    }
    
});

/**
 * @swagger
 *  /course/update/:id:
 *    put:
 *      tags:
 *        - course
 *      summary: 更新课程
 *      description: 访问权限：admin
 *      parameters:
 *        - name: id
 *          description: 课程id
 *        - name: introduce
 *          description: 简介
 *        - name: totalLesson
 *          description: 总课时
 *        - name: category
 *          description: 分类
 *        - name: tag
 *          description: tag
 *        - name: cover
 *          description: 封面
 *      responses:
 *        200:
 *          description: 更新课程信息成功
 */
router.put('/update/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN,RBAC.ROLE_TEACHER], res)) {
        return
    }
    const id = req.params.id;
    await courseService.updateCourse(id, {
        introduce: req.body.introduce,
        totalLesson: 0,
        category: req.body.category,
        name: req.body.name,
        tag: req.body.tag,
        cover: req.body.cover,
    })
    new Result(null, '更新成功', 'success').success(res)
});

module.exports = router
