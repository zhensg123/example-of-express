const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const classInfoService = require("../services/classInfo");
const classCourseService = require("../services/classCourse")
const classInstService = require('../services/classInst');
const userCourseService = require("../services/userCourse")

var xlsx = require('node-xlsx');
const RBAC = require('./rbac')
const disableLayout ={layout: false};

/**
 * @swagger
 *  /class/addClass:
 *    post:
 *      tags:
 *        - class
 *      summary: 添加班级
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: name
 *          description: 名称
 *        - name: userId
 *          description: 用户ID（老师）
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post('/addClass', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }

    // 检查name是否唯一
    const rows = await classInfoService.findAll({
        name: req.body.name
    })
    if (rows && rows.length > 0) {
        new Result(null, '班级名称已存在', 'class name already in use').fail(res)
        return
    }
    var code = generateCode()
    var codeCheck = await classInfoService.findAll({
        invitedCode: code
    })
    while(codeCheck.length > 0){
        code = generateCode()
        codeCheck = await classInfoService.findAll({
            invitedCode: code
        })
    }
    
    const obj = {
        name: req.body.name,
        userId: req.body.userId,
        invitedCode:code
    }
    const c = await classInfoService.add(obj)
    new Result(c, '新增成功', 'success').success(res)
});

router.post('/addExcelClass', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }

    // 检查name是否唯一
    const rows = await classInfoService.findAll({
        name: req.body.name
    })
    if (rows && rows.length > 0) {
        new Result(null, '班级名称已存在', 'class name already in use').fail(res)
        return
    }
    var code = generateCode()
    var codeCheck = await classInfoService.findAll({
        invitedCode: code
    })
    while(codeCheck.length > 0){
        code = generateCode()
        codeCheck = await classInfoService.findAll({
            invitedCode: code
        })
    }
    const obj = {
        name: req.body.name,
        userId: req.body.userId,
        invitedCode:code,
    }

    const c = await classInfoService.add(obj)

    const studentIds = req.body.studentIds
    for(let i=0;i<studentIds.length; i++){
      const studentId = studentIds[i]
         // 添加班级和学生关联信息
      const s = await classInstService.add(c.id, studentId);
    }
    new Result(c, '申请成功', 'success').success(res)
});

const generateCode = ()=>{
    let tempCode = Math.floor(Math.random()*(999999-0))+0;    
    let code = tempCode.toString()
    if(code.length<6){
        for(var i=0; i<6-code.length;i++){
            code = "0"+code
        }
    }
    return code
}

/**
 * @swagger
 *  /class/updateClass/:id:
 *    put:
 *      tags:
 *        - class
 *      summary: 更新班级信息
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: id
 *          description: 班级id
 *        - name: name
 *          description: 名称
 *      responses:
 *        200:
 *          description: 更新班级信息成功
 */
router.put('/updateClass/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }

    const id = req.params.id;
    await classInfoService.update(id, {
        name: req.body.name
    })
    new Result(null, '更新成功', 'success').success(res)
});

router.put('/updateExcelClass/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }

    const id = req.params.id;
    await classInfoService.update(id, {
        name: req.body.name
    })
    
    const studentIds = req.body.studentIds
    for(let i=0;i<studentIds.length; i++){
      const userId = studentIds[i]
      console.log(userId, 'userIduserId')
         // 添加班级和学生关联信息
      const s = await classInstService.updateUserId(id, {
        userId: userId
      });
    }
    new Result(null, '更新成功', 'success').success(res)
});
/**
 * @swagger
 *  /class/info/:id:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回班级信息
 */
router.get('/info/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }

    const id = req.params.id;
    const c = await classInfoService.find(id)

    if (c) {
        const obj = {
            classId: id
        }
        const studentsObj = await classInstService.findAll(obj);
        c.dataValues.students = studentsObj
        
        const coursesObj = []
        const tmpArr = await classCourseService.findAll({
            classId: id
        })
        if (tmpArr) {
            tmpArr.forEach(e => {
                coursesObj.push(e.Course)
            });
        }
        c.dataValues.courses = coursesObj
        new Result(c, '获取成功', 'success').success(res)
    } else {
        new Result(null, '获取失败', 'fail').fail(res)
    }
});

/**
 * @swagger
 *  /class/updateStatus/:id:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回班级信息
 */
router.put('/updateStatus/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }
    const id = req.params.id;
    if(req.body&&req.body.userId){
        const userId = req.body.userId
        if(req.body.studentStatus){
            const obj = {
                studentStatus:req.body.studentStatus
            }
            const result = await classInstService.update(id,userId,obj)
            new Result(result, '获取成功', 'success').success(res)
        }else{
            new Result(null, '获取失败', 'fail').fail(res)
        }
    }else{
        new Result(null, '获取失败', 'fail').fail(res)
    }
})
/**
 * @swagger
 *  /class/all:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取所有班级
 *      description: 访问权限：admin
 *      responses:
 *        200:
 *          description: 返回班级列表
 */
router.get('/all', async function(req, res) {
    // TODO: 管理员和教师的该接口应该分开
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }

    const rows = await classInfoService.findAll()
    if(rows&& rows.length>0){
        for(var i =0; i<rows.length;i++){
            const coursesObj = []
            const tmpArr = await classCourseService.findAll({
                classId: rows[i].id
            })
            if (tmpArr) {
                tmpArr.forEach(e => {
                    coursesObj.push(e.Course)
                });
            }
            rows[i].dataValues.courses = coursesObj
            console.log('rows[i]',rows[i])
        }
    }
    

    new Result(rows, '获取成功', 'success').success(res)
});

/**
 * @swagger
 *  /class/classCount:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取所有班级
 *      description: 访问权限：admin
 *      responses:
 *        200:
 *          description: 返回班级列表
 */
router.get('/classCount', async function(req, res) {
    // TODO: 管理员和教师的该接口应该分开
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN], res)) {
        return
    }

    const rows = await classInfoService.findAll()
    new Result(rows.length, '获取成功', 'success').success(res)
});

/**
 * @swagger
 *  /class/delete/:id:
 *    delete:
 *      tags:
 *        - class
 *      summary: 删除班级
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: id
 *          description: 班级id
 *      responses:
 *        200:
 *          description: 删除成功
 */
router.delete('/delete/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }

    const id = req.params.id;
    await classInfoService.delete(id)
    new Result(null, '删除成功', 'success').success(res)
});

/**
 * @swagger
 *  /class/:id/export:
 *    get:
 *      tags:
 *        - class
 *      summary: 导出所有班级
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: 班级id
 *      responses:
 *        200:
 *          description: 导出所有班级
 */
router.get('/:id/export', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
        return
    }

    const obj = {
        classId: req.params.id
    }
    const studentsObj = await classInstService.findAll(obj);
    const coursesObj = await classCourseService.findAll(obj);
    console.log("studentsObj",studentsObj)
    console.log("coursesObj",coursesObj)
    
    // 班级课程信息
    var data = [];
    data.push(['课程ID', '课程名称']);
    if (coursesObj.length > 0) {
        coursesObj.forEach(c => {
            t = c.dataValues.Course
            if(t!=null){
                data.push([t.id, t.name])
            }
            
        });
    }
    // 学生信息
    var data2 = [];
    data2.push(['学生ID', '用户名','学生名称'])
    if (studentsObj.length > 0) {
        studentsObj.forEach(c => {
            t = c.dataValues.User
            if(t!=null){
                data2.push([t.studentId,t.username ,t.firstName]);
            }
        });
    }

    var buffer = xlsx.build([
        {name: "班级学生信息", data: data2}, 
        {name: "班级课程信息", data: data},
    ]);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(buffer, 'binary');
});

module.exports = router