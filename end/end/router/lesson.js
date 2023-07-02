const express = require('express')
const Result = require('../models/Result')
const router = express.Router()
const lessonService = require('../services/lesson')
const RBAC = require('./rbac')
const teachingService = require('../services/teaching')
const classCourseService = require('../services/classCourse')
const lessonResourceService = require('../services/lessonResource')
/**
 * @swagger
 *  /lesson/info/:id:
 *    get:
 *      tags:
 *        - lesson
 *      summary: 获取课时详细信息
 *      description: 访问权限：admin teacher student
 *      responses:
 *        200:
 *          description: 返回课时信息
 */
router.get('/info/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
        return
    }
    const id = req.params.id;
    const lesson = await lessonService.findLesson(id)
    if (lesson) {
        new Result(lesson, '获取成功', 'success').success(res)
    } else {
        new Result(null, '获取失败', 'fail').fail(res)
    }
});

/**
 * @swagger
 *  /lesson/delete/:id:
 *    delete:
 *      tags:
 *        - lesson
 *      summary: 删除课时
 *      description: 访问权限：admin
 *      parameters:
 *        - name: id
 *          description: 课时id
 *      responses:
 *        200:
 *          description: 删除成功
 */
router.delete('/delete/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN,RBAC.ROLE_TEACHER], res)) {
        return
    }
    const id = req.params.id;

    // const recording = await teachingService.findRecordByLesson(id)
    // if(recording&&recording.length>0){
    //     recording.forEach(element => {
    //         let courseClass = await classCourseService.findClassByCourse(element.dataValues.courseId)

    //     });
    // }

    await teachingService.deleteByLesson(id)
    

    await lessonService.deleteLesson(id)
    new Result(null, '删除成功', 'success').success(res)
});

/**
 * @swagger
 *  /lesson/add:
 *    post:
 *      tags:
 *        - lesson
 *      summary: 添加课时
 *      description: 访问权限：admin
 *      parameters:
 *        - name: title
 *          description: 标题
 *        - name: introduce
 *          description: 简介
 *        - name: videoUrl
 *          description: 视频地址
 *        - name: pptUrl
 *          description: PPT url
 *        - name: templateId
 *          description: 模板ID
 *        - name: videoUrlStu
 *          description: 视频地址（学生）
 *        - name: pptUrlStu
 *          description: PPT url（学生）
 *        - name: templateIdStu
 *          description: 模板ID（学生）
 *        - name: courseId
 *          description: 课程ID
 *        - name: cover
 *          description: 封面
 *        - name: showUrl
 *          description: 展示地址
 *        - name: introduceVideoUrl
 *          description: 课程介绍视频
 *        - name: planUrl
 *          description: 教案
 *        - name: ais
 *          description: ai互动数组，包括名字、链接地址。json数组格式的字符串，如[{"name":"111","url":"http://www.baidu.com"},{"name":"222","url":"http://www.sohu.com"}]
 *        - name: resourcePackUrl
 *          description: 教师资源包
 *        - name: platform
 *          description: 平台
 *        - name: resourceName
 *          description: 附加资源名称
 *        - name: resourceUrl
 *          description: 附加资源链接
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post('/add', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN,RBAC.ROLE_TEACHER], res)) {
        return
    }
    const obj = {
        introduce: req.body.introduce,
        videoUrl: req.body.videoUrl,
        videoName: req.body.videoName,
        pptUrl: req.body.pptUrl,
        pptName: req.body.pptName,
        templateId: req.body.templateId,
        templateName: req.body.templateName,
        videoUrlStu: req.body.videoUrlStu,
        videoNameStu: req.body.videoNameStu,
        pptUrlStu: req.body.pptUrlStu,
        pptNameStu: req.body.pptNameStu,
        templateIdStu: req.body.templateIdStu,
        templateNameStu: req.body.templateNameStu,
        courseId: req.body.courseId,
        title: req.body.title,
        cover: req.body.cover,
        showUrl: req.body.showUrl,
        introduceVideoUrl: req.body.introduceVideoUrl,
        introduceVideoName: req.body.introduceVideoName,
        planUrl: req.body.planUrl,
        planName: req.body.planName,
        ais: req.body.ais,
        resourcePackUrl: req.body.resourcePackUrl,
        resourcePackName: req.body.resourcePackName,
        platform:req.body.platform,
        stuAis: req.body.stuAis,
        resourceStuPackUrl: req.body.resourceStuPackUrl,
    }
    
   
    const lesson = await lessonService.addLesson(obj)
    if(req.body.notebookResource){

        var tempNR = req.body.notebookResource.split("\n");
        tempNR.forEach(async (ai, index) => {
          var temp = ai.split(",");
          let name = temp[0]
          let url = ''
          if (temp.length == 2) {
              
            url = temp[1]
          }else if(temp.length > 2){
            for(let i=1;i<temp.length;i++){
              if(i ==1){
                 url+= temp[i] 
              }else{
                url+= ","+temp[i] 
              }
              
            }
            
          }
          let resourceObj = {
            lessonId:lesson.dataValues.id,
            name:name,
            url:url
        }
        const lessonResource = await lessonResourceService.addLessonResource(resourceObj)
        console.log('lessonResource',lessonResource)
        });
       
    }

    new Result(lesson, '新增成功', 'success').success(res)
});

/**
 * @swagger
 *  /lesson/update/:id:
 *    put:
 *      tags:
 *        - lesson
 *      summary: 更新课时
 *      description: 访问权限：admin
 *      parameters:
 *        - name: id
 *          description: 课时id
 *        - name: title
 *          description: 标题
 *        - name: introduce
 *          description: 简介
 *        - name: videoUrl
 *          description: 视频地址
 *        - name: pptUrl
 *          description: PPT url
 *        - name: templateId
 *          description: 模板ID
 *        - name: videoUrlStu
 *          description: 视频地址（学生）
 *        - name: pptUrlStu
 *          description: PPT url（学生）
 *        - name: templateIdStu
 *          description: 模板ID（学生）
 *        - name: cover
 *          description: 封面
 *        - name: showUrl
 *          description: 展示地址
 *        - name: introduceVideoUrl
 *          description: 课程介绍视频
 *        - name: planUrl
 *          description: 教案
 *        - name: ais
 *          description: ai互动数组，包括名字、链接地址。json数组格式的字符串，如[{"name":"111","url":"http://www.baidu.com"},{"name":"222","url":"http://www.sohu.com"}]
 *        - name: resourcePackUrl
 *          description: 教师资源包
 *        - name: platform
 *          description: 平台
 *        - name: resourceName
 *          description: 附加资源名称
 *        - name: resourceUrl
 *          description: 附加资源链接
 *      responses:
 *        200:
 *          description: 更新课时信息成功
 */
router.put('/update/:id', async function(req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN,RBAC.ROLE_TEACHER], res)) {
        return
    }
    console.log('req.body',req.body)
    const id = req.params.id;
    await lessonService.updateLesson(id, {
        introduce: req.body.introduce,
        videoUrl: req.body.videoUrl,
        videoName: req.body.videoName,
        pptUrl: req.body.pptUrl,
        pptName: req.body.pptName,
        templateId: req.body.templateId,
        templateName: req.body.templateName,
        videoUrlStu: req.body.videoUrlStu,
        videoNameStu: req.body.videoNameStu,
        pptUrlStu: req.body.pptUrlStu,
        pptNameStu: req.body.pptNameStu,
        templateIdStu: req.body.templateIdStu,
        templateNameStu: req.body.templateNameStu,
        title: req.body.title,
        cover: req.body.cover,
        showUrl: req.body.showUrl,
        introduceVideoUrl: req.body.introduceVideoUrl,
        introduceVideoName: req.body.introduceVideoName,
        planUrl: req.body.planUrl,
        planName: req.body.planName,
        ais: req.body.ais,
        resourcePackUrl: req.body.resourcePackUrl,
        resourcePackName: req.body.resourcePackName,
        platform:req.body.platform,
        stuAis: req.body.stuAis,
        resourceStuPackUrl: req.body.resourceStuPackUrl,
    })
    if(req.body.notebookResource){

        var tempNR = req.body.notebookResource.split("\n");
        tempNR.forEach(async (ai, index) => {
          var temp = ai.split(",");
          let name = temp[0]
          let url = ''
          if (temp.length == 2) {
              
            url = temp[1]
          }else if(temp.length > 2){
            for(let i=1;i<temp.length;i++){
              if(i ==1){
                 url+= temp[i] 
              }else{
                url+= ","+temp[i] 
              }
              
            }
        }
            let resourceObj = {
                lessonId:req.params.id,
                name:name,
                url:url
            }
            // let lRS = await lessonResourceService.findLessonResourceByLesson(req.params.id)
            // console.log(lRS,'lRS')
            // if(lRS){
                await lessonResourceService.deleteLessonResourceBylessonId(req.params.id)
            // }else{
                // resourceObj['lessonId'] = 
                await lessonResourceService.addLessonResource(resourceObj)
            // }
            
          
        });
       
    }
    new Result(null, '更新成功', 'success').success(res)
});

module.exports = router
