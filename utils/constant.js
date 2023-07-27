const os = require('os');

module.exports = {
    CODE_ERROR: -1,
    CODE_SUCCESS: 0,
    CODE_TOKEN_EXPIRED: -2,
    debug:true,
    PWD_SALT: 'admin_imooc_node',
    PRIVATE_KEY: 'admin_imooc',
    JWT_EXPIRED: 60 * 60, // token失效时间
    UPLOAD_FILE_PATH: os.type() == 'Linux' ? '/opt/file' : os.homedir(),
    ROLE_TEACHER: 'teacher',
    ROLE_STUDENT: 'student'
}
