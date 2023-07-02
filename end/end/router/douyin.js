const express = require("express");
const Result = require("../models/Result");
const router = express.Router();
const https = require('https');
var http = require('http');
const { md5,decode } = require("../utils/index");
var qs = require('querystring');
const fs = require('fs')
const Base64 = require("js-base64");
const host = 'http://remote.codejoyai.com:5050'
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
 router.post("/roomID", async function (requ, resp) {
    
    
    
    let url = requ.body.url
    
    // let path = "/get_room_id?url="+url

    let postData =qs.stringify({
        'url': decodeURIComponent(url) 
    })
        
        http.get(`${host}/get_room_id?${postData}`,
        function(res){
            var html = '';
        
            res.on('data', function (data) {
                html  += data;
             });
        
            res.on('end', function () {
                console.log(html);
                new Result(html, '新增成功', 'success').success(resp)
             });
        }).on('error',function(){
            console.log('出错！');
        });
    

 })

 router.post("/roomInfo", async function (requ, resp) {
    
    
    
    let id = requ.body.id
    
    // let path = "/get_room_id?url="+url

    let postData =qs.stringify({
        'room_id': id//decodeURIComponent(id) 
    })
        
        http.get(`${host}/room_info?${postData}`,
        function(res){
            var html = '';
        
            res.on('data', function (data) {
                html  += data;
             });
        
            res.on('end', function () {
                console.log(html);
                new Result(html, '新增成功', 'success').success(resp)
             });
        }).on('error',function(){
            console.log('出错！');
        });
    

 })

 router.post("/msg", async function (requ, resp) {
    
    
    
    let id = requ.body.id
    let cursor = requ.body.cursor
    let internal_ext = requ.body.internal_ext
    // let path = "/get_room_id?url="+url

    let postData =qs.stringify({
        'room_id': id,//decodeURIComponent(id) 
        'cursor':cursor,
        'internal_ext':internal_ext
    })
        
        http.get(`${host}/room_barrage?${postData}`,
        function(res){
            var html = '';
        
            res.on('data', function (data) {
                html  += data;
             });
        
            res.on('end', function () {
                console.log(html);
                new Result(html, '新增成功', 'success').success(resp)
             });
        }).on('error',function(){
            console.log('出错！');
        });
    

 })

 router.post("/topUser", async function (requ, resp) {
    
    
    
    let id = requ.body.id

    // let path = "/get_room_id?url="+url

    let postData =qs.stringify({
        'room_id': id,//decodeURIComponent(id) 
        // 'cursor':cursor,
        // 'internal_ext':internal_ext
    })
        
        http.get(`${host}/get_room_top?${postData}`,
        function(res){
            var html = '';
        
            res.on('data', function (data) {
                html  += data;
             });
        
            res.on('end', function () {
                console.log(html);
                new Result(html, '新增成功', 'success').success(resp)
             });
        }).on('error',function(){
            console.log('出错！');
        });
    

 })



 module.exports = router;