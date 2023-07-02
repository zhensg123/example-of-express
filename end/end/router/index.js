const express = require('express')
const boom = require('boom')
const userRouter = require('./user')
    // const pythonRouter = require('./python')
    // const scratchRouter = require('./scratch')
    // const studentRouter = require('./student')
    // const scratchTemplateRouter = require('./scratchTemplate')
    // const pythonTemplateRouter = require('./pythonTemplate')
const courseRouter = require('./course')
const lessonRouter = require('./lesson')
const templateRouter = require('./template')
const userCourseRouter = require('./userCourse')
const userTemplateInstRouter = require('./userTemplateInst')
const settingRouter = require('./setting')
const uploadRouter = require('./upload')
const classRouter = require('./class')
const classManagement = require('./classManagement')
const smsRouter = require('./sms')
const teachingRouter = require('./teaching')
const baiduRouter = require('./baidu')
const feishuRouter = require('./feishu')
const douyinRouter = require('./douyin')
const yuanRouter = require('./yuan')

const jwtAuth = require('./jwt')
const Result = require('../models/Result')
const { UserTemplateInst } = require('../sql/tables')

// 注册路由
const router = express.Router()
router.use(jwtAuth)

router.get('/', function(req, res) {
    res.send('欢迎codejoy管理后台')
})



// 通过 userRouter 来处理 /user 路由，对路由处理进行解耦
router.use('/user', userRouter)

router.use('/course', courseRouter)
router.use('/lesson', lessonRouter)
router.use('/template', templateRouter)
router.use('/userCourse', userCourseRouter)
router.use('/userTemplateInst', userTemplateInstRouter)
router.use('/setting', settingRouter)
router.use('/upload', uploadRouter)
router.use('/teaching', teachingRouter)

router.use('/class', classRouter)
router.use('/classManagement', classManagement)

router.use('/sms', smsRouter)
router.use('/baidu',baiduRouter)
router.use('/feishu',feishuRouter)
router.use('/douyin',douyinRouter)
router.use('/yuan',yuanRouter)

//通过 scratchRouter 来处理 /scratch 路由，对路由处理进行解耦
// router.use('/scratch',scratchRouter)

// 通过 pythonRouter 来处理 /python 路由，对路由处理进行解耦
// router.use('/python',pythonRouter)

/**
 * 集中处理404请求的中间件
 * 注意：该中间件必须放在正常处理流程之后
 * 否则，会拦截正常请求
 */
router.use((req, res, next) => {
    // next(boom.notFound('接口不存在123'))
    new Result(null, '接口不存在', 'api not found').fail(res)
})

/**
 * 自定义路由异常处理中间件
 * 注意两点：
 * 第一，方法的参数不能减少
 * 第二，方法的必须放在路由最后
 */
router.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        new Result(null, 'token失效', 'user unauthorized').jwtError(res.status(err.status))
    } else {
        const msg = (err && err.message) || '系统错误'
        const statusCode = (err.output && err.output.statusCode) || 500;
        const errorMsg = (err.output && err.output.payload && err.output.payload.error) || err.message
        new Result(null, msg, 'system error').fail(res.status(statusCode))
    }
})

module.exports = router