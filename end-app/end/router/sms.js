const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const sendSms4Login = require('../utils/sendcloud').sendSms4Login
const sendSms4BindPhone = require('../utils/sendcloud').sendSms4BindPhone
const randomNum = require('../utils/sendcloud').randomNum
var myCache = require('../utils/cache.js').myCache
var path = require('path');

var SMS_TYPE_LOGIN = require('../utils/cache.js').SMS_TYPE_LOGIN;
var SMS_TYPE_BINDPHONE = require('../utils/cache.js').SMS_TYPE_BINDPHONE

/**
 * @swagger
 *  /sms/send:
 *    post:
 *      tags:
 *        - sms
 *      summary: 发送登录验证短信
 *      description: 访问权限：公开访问
 *      parameters:
 *        - name: phone
 *          description: 11位手机号
 *        - name: type
 *          description: 短信类型。1：登录（默认值）；2：绑定手机号
 *      responses:
 *        200:
 *          description: 返回短信发送结果
 */
router.post('/send', async function(req, res) {
    const phone = req.body.phone || ''
    const type = req.body.type || 1
    if (!phone) {
        new Result(null, 'phone不能为空', 'phone is blank').fail(res);
        return
    }

    if (type == 1) {
        sendSms4Login(phone, function(obj) {
            if (obj.result) {
                var code = obj.code;
                var ret = myCache.set( SMS_TYPE_LOGIN + ":" + phone, code, 60 * 10 );
                new Result(null, '发送成功', 'success').success(res);
            } else {
                new Result(null, '短信发送失败', 'send sms fail').fail(res);
            }
        })
    } else if (type == 2) {
        sendSms4BindPhone(phone, function(obj) {
            if (obj.result) {
                var code = obj.code;
                var ret = myCache.set( SMS_TYPE_BINDPHONE + ":" + phone, code, 60 * 10 );
                new Result(null, '发送成功', 'success').success(res);
            } else {
                new Result(null, '短信发送失败', 'send sms fail').fail(res);
            }
        })
    } else {
        new Result(null, '不支持的短信类型', 'unsupported sms type').fail(res);
    }

});



module.exports = router
