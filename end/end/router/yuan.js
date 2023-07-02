const express = require("express");
const Result = require("../models/Result");
const router = express.Router();
const https = require("https");
var http = require("http");
const { md5, decode } = require("../utils/index");
var qs = require("querystring");
const fs = require("fs");
const Base64 = require("js-base64");

const formatDate =()=>{
    var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var strDate = date.getDate();
if (month >= 1 && month <= 9) {
    month = '0' + month;
}
if (strDate >= 0 && strDate <= 9) {
    strDate = '0' + strDate;
}
var currentdate = year + '-' + month + '-' + strDate;
return currentdate;
}

router.post("/init", async function (requ, resp) {
  let msg = requ.body.msg;

  let token = requ.body.token; //md5(account+phone+t)

  // let url = `http://api-air.inspur.com:32102/v1/interface/api/requestId?account=${account}&data=${msg}&temperature=1.0&topP=0.8&topK=5&tokensToGenerate=10&type=api`
  // let res = await this.getRequest(url,token)
//   console.log("msg",msg)
  let postData =qs.stringify({
    'account': 'CrazyEric',
    'data':msg,
    'temperature':1.0,
    "topP":0.8,
    "topK":5,
    "tokensToGenerate":10,
    "type":"api"
})
  http
    .get(
      {
        hostname: "api-air.inspur.com",
        port: 32102,
        path: `/v1/interface/api/requestId?${postData}`,
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          token: token,
        },
      },
      function (res) {
        var html = "";

        res.on("data", function (data) {
          html += data;
        });

        res.on("end", function () {
          console.log(html);

          let data = JSON.parse(html);
          
            if(data.resData&&data.flag){
                // console.log('data.resData',data.resData)
                setTimeout(()=>{
          http
            .get(
              {
                hostname: "api-air.inspur.com",
                port: 32102,
                path: `/v1/interface/api/result?account=CrazyEric&requestId=${data.resData}`,
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  token: token,
                },
              },
              function (res) {
                var html = "";

                res.on("data", function (data) {
                  html += data;
                });

                res.on("end", function () {
                  console.log(html);

                  let data = JSON.parse(html);

                  new Result(data, "新增成功", "success").success(resp);
                });
              }
            )
            .on("error", function () {
              console.log("出错！");
            });
        },1000)
        }
        //   new Result(html, "新增成功", "success").success(resp);
        });
      }
    )
    .on("error", function () {
      console.log("出错！");
    });
});

module.exports = router;
