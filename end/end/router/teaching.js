const express = require("express");
const Result = require("../models/Result");
const router = express.Router();
const lessonService = require("../services/lesson");
const RBAC = require("./rbac");
const teachingService = require("../services/teaching");
const courseService = require("../services/course");
const classCourseService = require("../services/classCourse");

/**
 * @swagger
 *  /teaching/recording/:courseId/:classId:
 *    get:
 *      tags:
 *        - teaching
 *      summary: 获取教学记录详细信息
 *      description: 访问权限：admin teacher
 *      responses:
 *        200:
 *          description: 返回上课记录信息
 */
router.get("/recording/:classId", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }
  // const courseId = req.params.courseId;
  const classId = req.params.classId;

  const teaching = await teachingService.findRecordByClass(classId);
  if (teaching) {
    for (var i = 0; i < teaching.length; i++) {
      const lessonInfo = await lessonService.findLesson(
        teaching[i].dataValues.lessonId
      );
      const courseInfo = await courseService.findCourse(
        teaching[i].dataValues.courseId
      );
      if (lessonInfo) {
        teaching[i].dataValues.lessonInfo = lessonInfo;
      }
      if (courseInfo) {
        teaching[i].dataValues.courseInfo = courseInfo;
      }
    }
    new Result(teaching, "获取成功", "success").success(res);
  } else {
    new Result(null, "获取失败", "fail").fail(res);
  }
});

/**
 * @swagger
 *  /teaching/recording/add:
 *    post:
 *      tags:
 *        - teaching
 *      summary: 添加教学记录详细信息
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: class Id list
 *        - name: courseId
 *          description: course Id list
 *        - name: lessonId
 *          description: lesson Id list
 *        - name: status
 *          description: 记录状态list
 *        - name: title
 *          description: 课时标题list
 *        - name: comment
 *          description: 备注list
 *        - name: time
 *          description: 上课时间list
 *      responses:
 *        200:
 *          description: 返回上课记录信息
 */
router.post("/recording/add", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }
  let data = req.body;
  let lessonList = JSON.parse(data.lessonId);
  let classIdList = JSON.parse(data.classId);
  let courseIdList = JSON.parse(data.courseId);
  let lessonIdList = JSON.parse(data.lessonId);
  let statusList = JSON.parse(data.status);
  let titleList = JSON.parse(data.title);
  let commentList = JSON.parse(data.comment);
  let timeList = JSON.parse(data.time);
  let row = [];
  let message = "";
  let messageEn = "";
  for (var i = 0; i < lessonList.length; i++) {
    let classCourse = await classCourseService.findAll(
      {
        classId: classIdList[i],
        courseId: courseIdList[i],
      },
      true
    );

    if (classCourse.length == 0) {
      let recording = {
        classId: classIdList[i],
        courseId: courseIdList[i],
        title: titleList[i],
        lessonId: lessonIdList[i],
        status: "planning",
      };
      let obj = {
        classId: classIdList[i],
        courseId: courseIdList[i],
        recording: JSON.stringify(recording),
      };
      const c = await classCourseService.add(obj);
    }

    let existRecording = await teachingService.findRecordByThreeInfo(
      classIdList[i],
      courseIdList[i],
      lessonIdList[i]
    );

    if (existRecording.length == 0) {
      let opt = {
        classId: classIdList[i],
        courseId: courseIdList[i],
        lessonId: lessonIdList[i],
        status: statusList[i],
        title: titleList[i],
        comment: commentList[i],
        time: timeList[i],
      };
      const r = await teachingService.add(opt);
      message += titleList[i] + " ";
      messageEn += titleList[i] + " ";
      row.push(r);
    }
  }
  if (row.length > 0) {
    new Result(row, message + "新增成功", messageEn + "success").success(res);
  } else {
    new Result(null, "课程计划已经存在", "Teaching plan has been created").fail(
      res
    );
  }
});


/**
 * @swagger
 *  /teaching/recording/add:
 *    put:
 *      tags:
 *        - teaching
 *      summary: 更新教学记录详细信息
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: class Id
 *        - name: courseId
 *          description: course Id
 *        - name: lessonId
 *          description: lesson Id
 *        - name: comment
 *          description: 备注
 *        - name: time
 *          description: 上课时间
 *      responses:
 *        200:
 *          description: 返回上课记录信息
 */
 router.put("/recording/update", async function (req, res) {
    let classId = req.body.classId
    let courseId = req.body.courseId
    let lessonId = req.body.lessonId
    let opt={
        comment: req.body.comment,
        time: req.body.time
    }
    await teachingService.updateByInfo(classId,courseId,lessonId,opt)
    new Result(null, '更新成功', 'success').success(res)
 })

/**
 * @swagger
 *  /teaching/recording/delete:
 *    delete:
 *      tags:
 *        - teaching
 *      summary: 删除教学记录详细信息
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: class Id
 *        - name: courseId
 *          description: course Id
 *        - name: lessonId
 *          description: lesson Id
 *      responses:
 *        200:
 *          description: 返回上课记录信息
 */
 router.delete("/recording/delete", async function (req, res) {

    await teachingService.deleteByObj(req.body)
    new Result(null, '更新成功', 'success').success(res)
 })

module.exports = router;
