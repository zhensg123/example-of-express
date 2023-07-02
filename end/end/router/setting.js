const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
/**
 * @swagger
 *  /setting/all:
 *    get:
 *      tags:
 *        - setting
 *      summary: 获取所有配置信息
 *      description: 
 *      responses:
 *        200:
 *          description: 返回配置信息列表
 */
router.get('/all', async function(req, res) {
    const obj = {
        categoryArr: [
            "AI 常规课", 
            "编程常规课", 
            "机器人常规课", 
            "手工常规课", 
            "研究性课题常规课", 
            "AI 竞赛课", 
            "编程竞赛课", 
            "机器人竞赛课", 
            "手工竞赛课", 
            "研究性课题竞赛课"
        ],
        tagArr: [
            '硬件',
            '幼儿',
            '小学',
            '一年级',
            '二年级',
            '三年级',
            '四年级',
            '五年级',
            '六年级',
            '初中',
            '高中',
            '智慧家居',
            '智慧社区',
            '智慧艺术',
            'AI创意',
            '智慧城市',
            '智慧物流',
            '智慧农业',
            '智慧航天'
    
       ]
    }
    new Result(obj, '获取成功', 'Success').success(res)
});

module.exports = router