const express = require("express");
const Result = require("../models/Result");
const router = express.Router();
const https = require('https');
const { md5,decode } = require("../utils/index");
var qs = require('querystring');
const fs = require('fs')
const Base64 = require("js-base64");
/**
 * @swagger
 *  /feishu/textfeeling:
 *    get:
 *      tags:
 *        - get
 *      summary: 获得识别结果
 *      description: 表单类型使用 form-data, 文件名称使用f：<input name="foo" type="file" />
 *      responses:
 *        200:
 *          description: 返回文件访问路径
 */
 router.post("/textfeeling", async function (requ, resp) {
    
    var text = {
        type: "dependent",
    };
    let Appid = "5f9a2331";
    let apiKey = "c107afe8bd277ae1f57228468bf6c7c8"
    
    let param = Base64.encode(JSON.stringify(text));
    
    let CurTime = Math.round(new Date()/1000);
    
    let header = {
        "X-Appid": Appid,
        "X-CurTime": CurTime.toString(),
        "X-Param": param,
        "X-CheckSum": md5(apiKey + CurTime.toString() + param),
    };
    
    let t = requ.body.text

    let postData =qs.stringify({
        'text': t  
    })

    var parsePostBody = function (req, done) {
        var length = req.headers['content-length'] - 0;
        var arr = [];
        var chunks;
                req.on('data', buff => {
            arr.push(buff);
        });
                req.on('end', () => {
                chunks = Buffer.concat(arr);
        done(chunks);
        });
        };
        
        var client = https.request({
            hostname: 'ltpapi.xfyun.cn',
            path: '/v2/sa',
            method: 'POST',
            headers:{
                "X-Appid": Appid,
                "X-CurTime": CurTime.toString(),
                "X-Param": param,
                "X-CheckSum": md5(apiKey + CurTime.toString() + param),
                'content-length': Buffer.byteLength(postData),
                "Content-Type":"application/x-www-form-urlencoded"
            }
            // body:body
        },function (req,res) {
            console.log('req',req)
            parsePostBody(req, (chunks) => {
    
                let result = JSON.parse(chunks.toString())
                
                if(result){
                    new Result(result, '获取成功', 'success').success(resp)
                }
                
          })
                
        })
        // client.write(postData);
        // client.write(postData);
        client.end(postData);
        
    

 })



 module.exports = router;