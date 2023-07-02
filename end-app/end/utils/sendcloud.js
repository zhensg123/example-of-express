var http = require("http")
var crypto = require('crypto')

var SMS_TYPE_LOGIN = 'TYPE1';
var SMS_TYPE_BINDPHONE = 'TYPE2';

function md5(data) {
    //var Buffer = require("buffer").Buffer;
    //var buf = new Buffer(data);
    //var str = buf.toString("binary");
	var str=data
    var crypto = require("crypto");
    return crypto.createHash("md5").update(str).digest("hex");
} 

function sortDict(dict){
    var dict2={},
        keys = Object.keys(dict).sort();
    for (var i = 0, n = keys.length, key; i < n; ++i) {
        key = keys[i];
        console.log(key);
        dict2[key] = dict[key];
    }
    return dict2;
}

function randomNum(n) {
    console.log('---------------------')
    var num = ''
    for (var i = 0; i < n; i++) {
        num = num + Math.floor(Math.random()*10);
	console.log(num)
    }
    console.log('---------------------')
    return num
}

var smsKey = 'FzwDHlAHkwBIM2SJtB0mclJHBXlxXvRi';
var smsUser = 'codejoy_login';
var templateId4Login = '760646'
var templateId4BindPhone = '760662'

function sendSms4Login(phone, cb) {
    sendSms(phone, templateId4Login, cb)
}

function sendSms4BindPhone(phone, cb) {
    sendSms(phone, templateId4BindPhone, cb)
}

function sendSms(phone, templateId, cb) {
    var num = randomNum(6)
    var param = {
        'msgType':0,
        'smsUser':smsUser,
        'templateId' : templateId,  
        'phone' : phone, 
        'vars' : '{%code%:"' + num + '"}'
    }
    sorted_param = sortDict(param);

    var param_str = "";
    for(var key in sorted_param)
        param_str += (key + '=' + sorted_param[key] + '&')
    var param_str = smsKey + '&' + param_str + smsKey;
    var sign = md5(param_str);
    param['signature'] = sign.toUpperCase();
    
    data = require('querystring').stringify(param); 
    var options = {
        host:"www.sendcloud.net",
        port:80,
        path:"/smsapi/send",
        method:"POST"
    }
    options.path = options.path + '?' + data;
    console.log(options.path);
    
    var req = http.request(options, function(res){
        var responseStr = '';
        res.on('data', function (chunk) {
            responseStr += chunk;
        });
        res.on('end', function() {
            var obj = JSON.parse(responseStr)
            if (obj.result) {
                cb({
                    "result": true,
                    "code": num
                })
            } else {
                cb({
                    "result": false,
                    "message": obj.message
                }) 
            }
        });
    });
    req.end();
}

module.exports={
    sendSms,randomNum,SMS_TYPE_LOGIN,SMS_TYPE_BINDPHONE,sendSms4Login,sendSms4BindPhone
}
