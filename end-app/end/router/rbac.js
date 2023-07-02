const Result = require('../models/Result')

const ROLE_ADMIN = 'admin'
const ROLE_TEACHER = 'teacher'
const ROLE_STUDENT = 'student'
const ROLE_ALL = [ROLE_ADMIN, ROLE_TEACHER, ROLE_STUDENT]

function checkRole(session, rolesArr, res) {
    if (!session) {
        new Result(null, '用户权限验证失败', 'Incorrect user permission').fail(res)
        return false
    }

    const roles = session.roles;
    for (const i in roles){
        const role = roles[0]
        if (rolesArr.indexOf(role) != -1) {
            return true
        }
    }
    new Result(null, '用户权限验证失败', 'Incorrect user permission').fail(res)
    return false
}

module.exports={
    checkRole,
    ROLE_ADMIN,
    ROLE_TEACHER,
    ROLE_STUDENT,
    ROLE_ALL
}
