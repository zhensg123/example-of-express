const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const userTemplateInstService = require('../services/userTemplateInst')
const templateService = require('../services/template')
const RBAC = require('./rbac')
const s3 = require('./s3').s3;
const syncS3File = require('./s3').syncS3File;

/**
 * @swagger
 *  /userTemplateInst/info/:id:
 *    get:
 *      tags:
 *        - userTemplateInst
 *      summary: 获取用户模板详细信息
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回用户模板信息
 */
router.get('/info/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    const userTemplateInst = await userTemplateInstService.findUserTemplateInst(id)
    if (userTemplateInst) {
        new Result(userTemplateInst, '获取成功', 'success').success(res)
    } else {
        new Result(null, '获取失败', 'fail').fail(res)
    }
});

/**
 * @swagger
 *  /userTemplateInst/all:
 *    get:
 *      tags:
 *        - userTemplateInst
 *      summary: 获取所有用户模板
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回用户模板列表
 */
router.get('/all', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const rows = await userTemplateInstService.findAll()
    new Result(rows, '获取成功', 'success').success(res)
});

/**
 * @swagger
 *  /userTemplateInst/all/:id:
 *    get:
 *      tags:
 *        - userTemplateInst
 *      summary: 获取某个用户的所有模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: id
 *          description: 用户id
 *        - name: type
 *          description: 1（模板实例）或2（自由创作）
 *      responses:
 *        200:
 *          description: 返回某个用户的所有模板列表
 */
router.get('/all/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    // const id = req.params.id;
    const type = req.body.type
    const userId = req.user.userId

    const rows = await userTemplateInstService.findAllUserTemplateInst(userId, type)
    new Result(rows, '获取成功', 'success').success(res)
});

/**
 * @swagger
 *  /userTemplateInst/delete/:id:
 *    delete:
 *      tags:
 *        - userTemplateInst
 *      summary: 删除用户模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: id
 *          description: 用户模板id
 *      responses:
 *        200:
 *          description: 删除成功
 */
router.delete('/delete/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    await userTemplateInstService.deleteUserTemplateInst(id)
    new Result(null, '删除成功', 'success').success(res)
});

/**
 * @swagger
 *  /userTemplateInst/add:
 *    post:
 *      tags:
 *        - userTemplateInst
 *      summary: 添加用户模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: userId
 *          description: 用户id
 *        - name: templateId
 *          description: 模板id
 *        - name: url
 *          description: 模板实例的url
 *        - name: name
 *          description: 实例名称
 *        - name: type
 *          description: 实例类型：1（模板实例）或2（自由创作）。如果为类型2（自由创作），templateId为空
 *        - name: languageType
 *          description: 语言类型：python 或 scratch。注意，如果type=1，则languageType为空，languageType取template.type；如果type=2，则languageType不为空，就取当前值。
 *        - name: projectThumbnail
 *          description: the Project Thumbnail
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post('/add', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const obj = {
        userId: req.user.userId,
        templateId: req.body.templateId,
        url: req.body.url, 
        name: req.body.name,
        type: req.body.type,
        languageType: req.body.languageType,
        projectThumbnail:req.body.projectThumbnail
    }
    if (obj.templateId) {
        const template = templateService.findTemplate(obj.templateId)
        if (template) {
            obj.languageType = template.type
        }
    }
    const inst = await userTemplateInstService.addUserTemplateInst(obj)
    new Result(inst, '新增成功', 'success').success(res)
});


/**
 * @swagger
 *  /userTemplateInst/update/:id:
 *    post:
 *      tags:
 *        - userTemplateInst
 *      summary: 更新用户模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: url
 *          description: 模板实例的url
 *        - name: projectThumbnail
 *          description: the Project Thumbnail
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post('/update/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    const obj = {
        url: req.body.url, 
        name: req.body.name,
        projectThumbnail:req.body.projectThumbnail
    }
    const inst = await userTemplateInstService.updateUserTemplateInst(id, obj);

    // 如果该用户模板已经分享过，那么需要同步文件
    const userTemplateInst = await userTemplateInstService.findUserTemplateInst(id)
    if (userTemplateInst.isShare) {
        syncS3File(userTemplateInst.url)
    }

    new Result(inst, '更新成功', 'success').success(res)
});

/**
 * @swagger
 *  /userTemplateInst/share/:id:
 *    post:
 *      tags:
 *        - userTemplateInst
 *      summary: 分享用户模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: instructions
 *          description: 操作说明
 *        - name: remarks
 *          description: 备注
 *        - name: isShare
 *          description: 是否已分享
 *      responses:
 *        200:
 *          description: 返回分享的项目信息
 */
router.post('/share/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    const userTemplateInst = await userTemplateInstService.findUserTemplateInst(id)
    if (!userTemplateInst) {
        new Result(null, '项目不存在', 'project not found').fail(res)
        return
    }

    if (userTemplateInst.userId != req.user.userId) {
        new Result(null, '项目不属于当前用过户', 'project not found').fail(res)
        return
    }

    if (!userTemplateInst.isShare) {
        // 如果初次分享，将sb3文件拷贝到公共的S3桶里面
        syncS3File(userTemplateInst.url)
    }

    const obj = {
        instructions: req.body.instructions, 
        remarks: req.body.remarks,
        isShare: 1
    }

    const inst = await userTemplateInstService.updateUserTemplateInst(id, obj);
    new Result(inst, '分享成功', 'success').success(res)
});

/**
 * @swagger
 *  /userTemplateInst/shareinfo/:id:
 *    get:
 *      tags:
 *        - userTemplateInst
 *      summary: 获取已分享项目的详细信息
 *      description: 访问权限：公开
 *      responses:
 *        200:
 *          description: 返回项目信息
 */
router.get('/shareinfo/:id', async function(req, res) {
    const id = req.params.id;
    const userTemplateInst = await userTemplateInstService.findUserTemplateInst(id)
    if (userTemplateInst) {
        new Result(userTemplateInst, '获取成功', 'success').success(res)
    } else {
        new Result(null, '获取失败', 'fail').fail(res)
    }
});


module.exports = router
