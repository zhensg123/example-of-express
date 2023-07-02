const express = require("express");
const Result = require("../models/Result");
const router = express.Router();
const https = require('https');
var qs = require('querystring');
const fs = require('fs')
/**
 * @swagger
 *  /baidu/regoDetection:
 *    get:
 *      tags:
 *        - get
 *      summary: 获得识别结果
 *      description: 表单类型使用 form-data, 文件名称使用f：<input name="foo" type="file" />
 *      responses:
 *        200:
 *          description: 返回文件访问路径
 */
 router.get("/regoDetection/token", async function (requ, resp) {
    

    const param = qs.stringify({
        'grant_type': 'client_credentials',
        'client_id': 'r2aGbCsA5fwZWOPxSxAFaDSY',
        'client_secret': 'qkHSmO63Qi4lnw61V0gAKyuwNT1lQauw'
    });
    // let param=`grant_type=${para.grant_type}&client_id=${para.client_id}&client_secret${para.client_secret}`
    

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

    https.get({
        hostname: 'aip.baidubce.com',
        path: '/oauth/2.0/token?' + param,
        agent: false
    },function (req,res) {
        req.pipe(process.stdout);
        // 写入文件
        req.pipe(fs.createWriteStream('./baidu-token.json'));

        parsePostBody(req, (chunks) => {
            // new Result(), '新增成功', 'success').success(resp)

            // localStorage.setItem("baidu_token",JSON.parse(chunks.toString()).access_token)
            // new Result(JSON.parse(chunks.toString()), '新增成功', 'success').success(resp)
            if(JSON.parse(chunks.toString()).access_token){
                new Result(null, '新增成功', 'success').success(resp)
            }
            
      })

    
            
    })

 })

 router.post("/regoDetection",async function(req,resp){
    let token = JSON.parse(fs.readFileSync('./baidu-token.json', 'utf8'))

    // console.log("token",token)
    let image = req.body.image
    let imgparam = qs.stringify({'access_token':token.access_token})
    let body = {
        'image': image,
        
    };


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
        hostname: 'aip.baidubce.com',
        path: '/rest/2.0/ocr/v1/license_plate?' + imgparam,
        method: 'POST',
        headers:{"Content-Type":"application/x-www-form-urlencoded"}
        // body:body
    },function (req,res) {
        parsePostBody(req, (chunks) => {

            let result = JSON.parse(chunks.toString())

            if(result){
                new Result(result, '获取成功', 'success').success(resp)
            }
            
      })
            
    })
    client.end( qs.stringify(body) );
 })

 module.exports = router;