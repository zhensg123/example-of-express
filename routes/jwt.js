const { expressjwt : expressJWT } = require('express-jwt');
const { PRIVATE_KEY } = require('../utils/code-status');

const jwtAuth = expressJWT({
     secret: PRIVATE_KEY,
     algorithms: ["HS256"],
     credentialsRequired: false // 设置为false就不进行校验了，游客也可以访问
}).unless({
    path: [
        '/',
        '/user/login',
        // '/user/register',
        // /^\/userTemplateInst\/shareinfo\/.*/,
        //'/upload/access',
        '/api-docs'
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
