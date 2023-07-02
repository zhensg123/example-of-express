const express = require("express");
const Result = require("../models/Result");
const router = express.Router();
const classInstService = require("../services/classInst");
const classCourseService = require("../services/classCourse");
const classInfoService = require("../services/classInfo");
const userService = require("../services/user");
const teacherStudentService = require("../services/teacherStudent");
const teachingService = require("../services/teaching");
const random = require("string-random");
const { PWD_SALT } = require("../utils/constant");
const { md5,decode } = require("../utils/index");
var xlsx = require("node-xlsx");
const RBAC = require("./rbac");
const courseService = require("../services/course");

/**
 * @swagger
 *  /classManagement/addStu:
 *    post:
 *      tags:
 *        - classManagement
 *      summary: 添加学生到班级
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: 班级id
 *        - name: userId
 *          description: 学生id
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post("/addStu", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }
  const classId = req.body.classId;
  const userId = req.body.userId;
  const c = await classInstService.add(classId, userId);
  new Result(c, "添加成功", "success").success(res);
});

/**
 * @swagger
 *  /classManagement/batchCreateAndAddStu:
 *    post:
 *      tags:
 *        - classManagement
 *      summary: 批量创建学生并且添加学生到班级
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: 班级id
 *        - name: names
 *          description: 学生名称列表，多个学生名称用分号分隔
 *      responses:
 *        200:
 *          description: 返回一个excel文件，包括添加的学生的所有信息（id，名字，用户名，初始密码）
 */
router.post("/batchCreateAndAddStu", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }

  const classId = req.body.classId;
  const teacherId = req.body.teacherId;
  const names = (req.body.names || "").split(";");
  

  // 用于生成excel
  var data = [];
  data.push(["学生账号", "学生名称", "初始密码"]);

  for (var i in names) {
    // let icon = names[i].includes(",")?",":"，"
    // const stu = names[i].split(icon)

    const firstname = names[i];
    // const studentId = stu[0];
    
    const username = "edu" + random(6, { letters: false });
    const roles = "student";
    const password = '000000'//random(6, { letters: false });
    const md5password = md5(`${password}${PWD_SALT}`);
    const obj = {
      firstName: firstname,
      username: username,
      roles: roles,
      password: md5password
    };
    console.log('obj',obj)
    // 添加学生信息
    const user = await userService.addUser(obj);
    console.log(user);

    // 添加班级和学生关联信息
    const c = await classInstService.add(classId, user.id);

    // 添加老师和学生关联信息
    const t = await teacherStudentService.add(teacherId, user.id);

    data.push([user.id, username, firstname, password]);
  }
  new Result(data, '新增成功', 'success').success(res)
  // var buffer = xlsx.build([{ name: "学生信息", data: data }]);
  // res.setHeader("Content-Type", "application/vnd.openxmlformats");
  // res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
  // res.end(buffer, "binary");
});

/**
 * @swagger
 *  /classManagement/deleteStu:
 *    post:
 *      tags:
 *        - classManagement
 *      summary: 从班级删除学生
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: 班级id
 *        - name: userId
 *          description: 学生id
 *      responses:
 *        200:
 *          description: 添加成功
 */
router.post("/deleteStu", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }

  const classId = req.body.classId;
  const userId = req.body.userId;
  const ret = await classInstService.delete(classId, userId);
  if (ret) {
    new Result(null, "删除成功", "success").success(res);
  } else {
    new Result(null, "删除成功", "fail").fail(res);
  }
});

/**
 * @swagger
 *  /classManagement/assignCourse:
 *    post:
 *      tags:
 *        - classManagement
 *      summary: 分配课程给班级
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: 班级id
 *        - name: courseId
 *          description: 课程id
 *      responses:
 *        200:
 *          description: 分配成功
 */
router.post("/assignCourse", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }

  const classId = req.body.classId;
  const courseId = req.body.courseId;
  if (!classId) {
    new Result(null, "classId不能为空", "classId cannot be empty").fail(res);
    return;
  }
  if (!courseId) {
    new Result(null, "courseId不能为空", "courseId cannot be empty").fail(res);
    return;
  }

  // get recording and insert
  const course = await courseService.findCourse(courseId);
  let recordList = [];
  if (
    course &&
    course.dataValues.Lessons &&
    course.dataValues.Lessons.length > 0
  ) {
    let lessons = course.dataValues.Lessons;

    for (var i = 0; i < lessons.length; i++) {
      let recording = {
        classId: classId,
        courseId: courseId,
        title: lessons[i].title,
        lessonId: lessons[i].id,
        status: "planning",
      };
      let re = await teachingService.add(recording);
      recordList.push(re.dataValues.id);
    }
  }
  const obj = {
    classId: classId,
    courseId: courseId,
    recording: JSON.stringify(recordList),
  };

  const c = await classCourseService.add(obj);
  if (c) {
    new Result(c, "分配成功", "success").success(res);
  } else {
    new Result(null, "分配失败", "fail").fail(res);
  }
});

/**
 * @swagger
 *  /classManagement/unassignCourse:
 *    post:
 *      tags:
 *        - classManagement
 *      summary: 取消分配课程给班级
 *      description: 访问权限：admin teacher
 *      parameters:
 *        - name: classId
 *          description: 班级id
 *        - name: courseId
 *          description: 课程id
 *      responses:
 *        200:
 *          description: 取消分配成功
 */
router.post("/unassignCourse", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }

  const classId = req.body.classId;
  const courseId = req.body.courseId;
  if (!classId) {
    new Result(null, "classId不能为空", "classId cannot be empty").fail(res);
    return;
  }
  if (!courseId) {
    new Result(null, "courseId不能为空", "courseId cannot be empty").fail(res);
    return;
  }

  const obj = {
    classId: classId,
    courseId: courseId,
  };
  const t = await teachingService.deleteByInfo(classId, courseId);
  const c = await classCourseService.delete(obj);
  if (c && t) {
    new Result(null, "操作成功", "success").success(res);
  } else {
    new Result(null, "操作失败", "fail").fail(res);
  }
});

/**
 * @swagger
 *  /classManagement/teacher/:id/students:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: id
 *          description: 教师ID
 *      responses:
 *        200:
 *          description: 返回班级信息
 */
router.get("/teacher/:id/students", async function (req, res) {
  if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
    return;
  }

  var obj = {
    // userId: req.params.id
    userId: req.user.userId,
  };
  const classList = await classInfoService.findAll(obj, true);
  var studentList = [];
  var studnetIds = [];
  if (classList && classList.length > 0) {
    for (var i in classList) {
      obj = {
        classId: classList[i].id,
      };
      const students = await classInstService.findAll(obj, true);
      if (students && students.length > 0) {
        for (var j in students) {
          const studentId = students[j].userId;
          const user = await userService.findUserByPk(students[j].userId)
          const student = students[j];
          console.log(student);
          if (studnetIds.indexOf(studentId) == -1) {
            studnetIds.push(studentId);
            studentList.push({
              username: student["User.username"],
              id: student.userId,
              userInfo:user
            });
          }
        }
      }
    }
  }
  new Result(studentList, "获取成功", "success").success(res);
});

/**
 * @swagger
 *  /classManagement/teacher/:id/allStudents:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - name: id
 *          description: 教师ID
 *      responses:
 *        200:
 *          description: 返回班级信息
 */
router.get("/teacher/:id/allStudents", async function (req, res) {
  if (!RBAC.checkRole(req.user, RBAC.ROLE_ALL, res)) {
    return;
  }

  var obj = {
    // userId: req.params.id
    teacherId: req.user.userId,
  };
  const stuIDList = await teacherStudentService.findAll(obj, true);
  var studentList = [];
  if (stuIDList && stuIDList.length > 0) {
    for (var i in stuIDList) {
      const relatedStuInfo = await userService.findUserByPk(
        stuIDList[i].dataValues.studentId
      );
      if (relatedStuInfo) {
        studentList.push(relatedStuInfo.dataValues);
      }
    }
  }
  new Result(studentList, "获取成功", "success").success(res);
  //
});

/**
 * @swagger
 *  /classManagement/courseClass:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - courseId: id
 *          description: 课程id
 *      responses:
 *        200:
 *          description: 返回班级信息
 */
router.get("/courseClass/:courseId", async function (req, res) {
  const rows = await classCourseService.findClassByCourse(req.params.courseId);

  console.log("rows", rows);
  if (rows && rows.length > 0) {
    for (var c = 0; c < rows.length; c++) {
      const tmpArr = await classInfoService.find(rows[c].dataValues.classId);
      rows[c].dataValues.classes = tmpArr;

      if (rows[c].dataValues.recording !== null) {
        const recordL = JSON.parse(rows[c].dataValues.recording);
          let record = await teachingService.findRecordByInfo(
            rows[c].dataValues.classId,
            req.params.courseId
          );
          rows[c].dataValues.recording = JSON.stringify(record);
          const t = await teachingService.findRecordByInfo(rows[c].dataValues.classId, req.params.courseId);
          let list = [];
          for (var i = 0; i < t.length; i++) {
            list.push(t[i].dataValues.id);
          }

          await classCourseService.updateRecording(
            req.params.courseId,
            rows[c].dataValues.classId,
            {recording:JSON.stringify(list)}
          );
      }
    }
  }

  new Result(rows, "获取成功", "success").success(res);
});

/**
 * @swagger
 *  /classManagement/updateRecording/:id:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - id: id
 *          description: 课程班级id
 *        - name: recording
 *          description: 上课记录
 *      responses:
 *        200:
 *          description: 返回班级信息
 */

router.put("/updateRecording/:courseId/:classId", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }
  const obj = {
    recording: req.body.recording,
  };

  const recording = JSON.parse(req.body.recording);
  const courseId = req.params.courseId;
  const classId = req.params.classId;
  const lessonId = recording.id;
  delete recording.id;
  await teachingService.updateByInfo(classId, courseId, lessonId, recording);

  const t = teachingService.findRecordByInfo(classId, courseId);

  if (t.length > 0) {
    let list = [];
    for (var i = 0; i < t.length; i++) {
      list.push(t[i].dataValues.id);
    }
    await classCourseService.updateRecording(courseId, classId, {
      recording: JSON.stringify(list),
    });
  }

  new Result(null, "操作成功", "success").success(res);
});

/**
 * @swagger
 *  /classManagement/updateRecordingByCourse/:courseId:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - courseId: courseId
 *          description: 课程班级id
 *        - name: recording
 *          description: 上课记录
 *      responses:
 *        200:
 *          description: 返回班级信息
 */

router.put("/updateRecordingByLesson/:lessonId", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
    return;
  }

  const recording = JSON.parse(req.body.recording);
  const courseId = recording.courseId;
  const lessonId = req.params.lessonId;

  await teachingService.updateByLessonId(lessonId, { title: recording.title });

  new Result(null, "操作成功", "success").success(res);
});

/**
 * @swagger
 *  /classManagement/updateCustomCourseClassRecording/:courseId:
 *    get:
 *      tags:
 *        - class
 *      summary: 获取班级详细信息
 *      description: 访问权限：admin teacher student
 *      parameters:
 *        - courseId: courseId
 *          description: 课程班级id
 *        - name: recording
 *          description: 上课记录
 *      responses:
 *        200:
 *          description: 返回班级信息
 */
router.put(
  "/updateCustomCourseClassRecording/:courseId",
  async function (req, res) {
    if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN, RBAC.ROLE_TEACHER], res)) {
      return;
    }

    const courseId = req.params.courseId;
    let recording = JSON.parse(req.body.recording);
    let lessonId = recording.id;
    const row = await classCourseService.findClassByCourse(courseId);

    console.log("row", row);
    if (row && row.length > 0) {
      for (var i = 0; i < row.length; i++) {
        if (row[i].recording != null) {
          let teachingObj = {
            courseId: courseId,
            lessonId: lessonId,
            classId: row[i].classId,
            status: recording.status,
            title: recording.title,
          };
          let t = await teachingService.add(teachingObj);

          let temp = JSON.parse(row[i].recording);
          temp.push(t.dataValues.id);

          const obj = {
            recording: JSON.stringify(temp),
          };
          // console.log("temp obj",obj)
          await classCourseService.updateRecordingByCourse(courseId, obj);
        }
      }
    }

    new Result(null, "操作成功", "success").success(res);
  }
);

module.exports = router;
