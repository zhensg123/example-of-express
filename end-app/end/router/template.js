const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const templateService = require('../services/template')
const RBAC = require('./rbac')
/**
 * @swagger
 *  /template/info/:id:
 *    get:
 *      tags:
 *        - template
 *      summary: 获取模板详细信息
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回模板信息
 */
router.get('/info/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    const template = await templateService.findTemplate(id)
    if (template) {
        new Result(template, '获取成功', 'success').success(res)
    } else {
        new Result(null, '获取失败', 'fail').fail(res)
    }
});

/**
 * @swagger
 *  /template/all:
 *    get:
 *      tags:
 *        - template
 *      summary: 获取所有模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: type
 *          description: 模板类型, python或scratch
 *      responses:
 *        200:
 *          description: 返回模板列表
 */
router.get('/all', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const type = req.body.type
    const rows = await templateService.findAllTemplate(type)
    new Result(rows, '获取成功', 'success').success(res)
});

/**
 * @swagger
 *  /template/delete/:id:
 *    delete:
 *      tags:
 *        - template
 *      summary: 删除模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: id
 *          description: 模板id
 *      responses:
 *        200:
 *          description: 删除成功
 */
router.delete('/delete/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    await templateService.deleteTemplate(id)
    new Result(null, '删除成功', 'success').success(res)
});

/**
 * @swagger
 *  /template/add:
 *    post:
 *      tags:
 *        - template
 *      summary: 添加模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: name
 *          description: 名称
 *        - name: url
 *          description: 模板文件地址
 *        - name: info
 *          description: 模板详情
 *        - name: type
 *          description: 类型，scratch或python
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post('/add', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const obj = {
        name: req.body.name,
        url: req.body.url,
        info : req.body.info,
        type : req.body.type,
    }
    const template = await templateService.addTemplate(obj)
    new Result(template, '新增成功', 'success').success(res)
});

/**
 * @swagger
 *  /template/update/:id:
 *    put:
 *      tags:
 *        - template
 *      summary: 更新模板
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: id
 *        - name: name
 *          description: 名称
 *        - name: url
 *          description: 模板文件地址
 *        - name: info
 *          description: 模板详情
 *        - name: type
 *          description: 类型，scratch或python
 *      responses:
 *        200:
 *          description: 更新模板信息成功
 */
router.put('/update/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    await templateService.updateTemplate(id, {
        name: req.body.name,
        url: req.body.url,
        info : req.body.info,
        type : req.body.type,
    })
    new Result(null, '更新成功', 'success').success(res)
});

module.exports = router
