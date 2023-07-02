const expressJwt = require('express-jwt');
const { PRIVATE_KEY } = require('../utils/constant');

const jwtAuth = expressJwt({
     secret: PRIVATE_KEY,
     credentialsRequired: false // 设置为false就不进行校验了，游客也可以访问
}).unless({
    path: [
        '/',
        '/user/login',
        '/user/register',
        /^\/userTemplateInst\/shareinfo\/.*/,
        '/upload/accessOpen',
        //'/upload/access',
        '/api-docs',
        '/sms/send',
        '/user/sms_verify',
        '/user/sms_register_verify',
        '/baidu/regoDetection',
        '/baidu/regoDetection/token',
        '/feishu/textfeeling',
        '/douyin/roomID',
        '/douyin/topUser',
        '/douyin/msg',
        '/douyin/roomInfo',
        '/yuan/init'
        // '/user/all',
        // /^\/user\/delete\/.*/,
        // /^\/user\/update\/.*/,
        // /^\/user\/add\/.*/,

        // //student
        // /^\/student\/findStudent\/.*/,
        // /^\/student\/findStudent_User\/.*/,
        // /^\/student\/addStudent\/.*/,
        // /^\/student\/addStudent_toParent\/.*/,
        // /^\/student\/updateStudent_toUser\/.*/,
        // /^\/student\/delete\/.*/,


        // /^\/python\/uploadFile\/.*/,
        // /^\/python\/updateFile\/.*/,
        // /^\/python\/allfileByName\/.*/,
        // /^\/python\/deletefile\/.*/,

        // '/scratch/save',
        // '/scratch/getproject',
        // /^\/scratch\/allfileByName\/.*/,

        // '/scratchTemplate/saveTemplate',
        // '/scratchTemplate/allTemplate',
        // /^\/scratchTemplate\/deleteTemplate\/.*/,

        //  //pythonTemplate
        // '/pythonTemplate/findAll',
        // /^\/pythonTemplate\/find\/.*/,
        // /^\/pythonTemplate\/addFile\/.*/,
        // /^\/pythonTemplate\/updateFile\/.*/,
        // /^\/pythonTemplate\/deleteFile\/.*/,
    ], // 设置 jwt 认证白名单
});

module.exports = jwtAuth;
