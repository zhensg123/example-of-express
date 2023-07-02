const express = require("express");
const Result = require("../models/Result");
const router = express.Router();
const UPLOAD_FILE_PATH = require("../utils/constant").UPLOAD_FILE_PATH;
const random = require("string-random");
var path = require("path");
const s3 = require("./s3").s3;
const OSS = require("ali-oss");
const RBAC = require("./rbac");
var xlsx = require("node-xlsx");
const { PWD_SALT } = require("../utils/constant");
const userService = require("../services/user");
const teacherStudentService = require("../services/teacherStudent");
const classInstService = require("../services/classInst");
const { md5 } = require("../utils/index");

const ossClient = new OSS({
  region: "oss-cn-shanghai",
  accessKeyId: 'LTAI5tAZmNd44SfBpyKMqcsQ',
  accessKeySecret: '1WH11brQtu3cG3OzJ7mcYoLacovWFW',
  bucket: 'huidefen-course-materials'
});

const Core = require("@alicloud/pop-core");

var client = new Core({
  accessKeyId: 'LTAI5tAZmNd44SfBpyKMqcsQ',
  accessKeySecret: '1WH11brQtu3cG3OzJ7mcYoLacovWFW',
  endpoint: "https://imm.cn-shanghai.aliyuncs.com",
  apiVersion: "2017-09-06",
});

const getUploadedFileData = (file) => ({
  md5: file.md5,
  name: file.name,
  size: file.size,
  uploadPath: path.join(uploadDir, file.name),
  uploadDir: uploadDir,
});

/**
 * @swagger
 *  /upload/single:
 *    post:
 *      tags:
 *        - upload
 *      summary: 上传单个文件
 *      description: 表单类型使用 form-data, 文件名称使用f：<input name="foo" type="file" />
 *      responses:
 *        200:
 *          description: 返回文件访问路径
 */
router.post("/single", async function (req, res) {
  if (!req.files) {
    new Result(null, "没有文件上传", "incorrect parameter").fail(res);
    return;
  }

  const f = req.files.f;
  const tokens = f.name.split(".");
  const ftype = tokens.length > 1 ? tokens[tokens.length - 1] : "";

  var filename = new Date().getTime() + "_" + Math.round(Math.random() * 10000);
  if (ftype) {
    filename = filename + "." + ftype;
  }
  const uploadPath = path.join(UPLOAD_FILE_PATH, filename);

  f.mv(uploadPath, (err) => {
    if (err) {
      new Result(null, "文件上传失败:" + err, "fail: " + err).fail(res);
      return;
    }
    new Result(
      {
        url: "/file/" + filename,
      },
      "文件上传成功",
      "success"
    ).success(res);
  });
});

// /upload/createStudent
router.post("/createStudentPhone", async function (req, res) {
  if (!req.files) {
    new Result(null, "没有文件上传", "incorrect parameter").fail(res);
    return;
  }
  const f = req.files.f;
  const teacherId = req.body.teacherId;
  const classId = req.body.classId;
  // const tokens = f.name.split('.')
  // const ftype = tokens.length > 1 ? tokens[tokens.length - 1] : ''
  // console.log('name="f"',f)

  var obj = xlsx.parse(f.data);
  let userArr = []
  let fileContent = obj[0].data.filter((item)=>item && item[0]);
  console.log('name="ffileContent"',fileContent)

  for (var i = 0; i < fileContent.length; i++) {
    // let studentId = fileContent[i][0];
    let phone = fileContent[i][0];

    if(phone){
      const username = "edu" + random(6, { letters: false });
      const roles = "student";
      let defaultPassword = "000000";
      const md5password = md5(`${defaultPassword}${PWD_SALT}`);
  
      const obj = {
        phone: phone,
        firstName: username,
        username: username,
        roles: roles,
        password: md5password,
      };
  
       let user = await userService.addUser(obj);
       userArr.push(user)
      // 添加班级和学生关联信息
      // const c = await classInstService.add(classId, user.id);
  
      // 添加老师和学生关联信息
      const t = await teacherStudentService.add(teacherId, user.id);
    }
  }

  new Result(userArr, "添加成功", "success").success(res);
});

// /upload/createStudent
router.post("/createStudent", async function (req, res) {
  if (!req.files) {
    new Result(null, "没有文件上传", "incorrect parameter").fail(res);
    return;
  }
  console.log("req", req);
  const f = req.files.f;
  const teacherId = req.body.teacherId;
  const classId = req.body.classId;
  console.log("teacherId", teacherId);
  // const tokens = f.name.split('.')
  // const ftype = tokens.length > 1 ? tokens[tokens.length - 1] : ''
  // console.log('name="f"',f)

  var obj = xlsx.parse(f.data);
  console.log(JSON.stringify(obj));

  let fileContent = obj[0].data;
  for (var i = 1; i < fileContent.length; i++) {
    // let studentId = fileContent[i][0];
    let studentName = fileContent[i][0];

    const username = "edu" + random(6, { letters: false });
    const roles = "student";
    let defaultPassword = "000000";
    const md5password = md5(`${defaultPassword}${PWD_SALT}`);

    const obj = {
    //   studentId:studentId,
      firstName: studentName,
      username: username,
      roles: roles,
      password: md5password,
    };

    const user = await userService.addUser(obj);
    console.log(user);

    // 添加班级和学生关联信息
    const c = await classInstService.add(classId, user.id);

    // 添加老师和学生关联信息
    const t = await teacherStudentService.add(teacherId, user.id);
  }

  new Result({}, "添加成功", "success").success(res);
});

/**
 * @swagger
 *  /upload/single2:
 *    post:
 *      tags:
 *        - upload
 *      summary: 上传单个文件到AWS S3
 *      description: 表单类型使用 form-data, 文件名称使用f：<input name="foo" type="file" />
 *      responses:
 *        200:
 *          description: 返回文件key
 */
router.post("/single2", async function (req, res) {
  if (!req.files) {
    xlsx;
    new Result(null, "没有文件上传", "incorrect parameter").fail(res);
    return;
  }

  const f = req.files.f;
  const tokens = f.name.split(".");
  const ftype = tokens.length > 1 ? tokens[tokens.length - 1] : "";

  var filename = new Date().getTime() + "_" + Math.round(Math.random() * 10000);
  if (ftype) {
    filename = filename + "." + ftype;
  }

  var uploadParams = {
    Bucket: "huidefen-codejoynew",
    Key: "file/" + filename,
    Body: f.data,
  };

  // call S3 to retrieve upload file to specified bucket
  s3.upload(uploadParams, function (err, data) {
    if (err) {
      new Result(null, "文件上传失败:" + err, "fail: " + err).fail(res);
      return;
    }
    if (data) {
      new Result(
        {
          url: "file/" + filename,
        },
        "文件上传成功",
        "success"
      ).success(res);
    }
  });
});

/**
 * @swagger
 *  /upload/singleAlioss:
 *    post:
 *      tags:
 *        - upload
 *      summary: 上传单个文件到阿里云oss
 *      description: 表单类型使用 form-data, 文件名称使用f：<input name="foo" type="file" />
 *      responses:
 *        200:
 *          description: 返回文件key
 */
router.post("/singleAlioss", async function (req, res) {
  if (!req.files) {
    new Result(null, "没有文件上传", "incorrect parameter").fail(res);
    return;
  }

  const f = req.files.f;
  const tokens = f.name.split(".");
  const ftype = tokens.length > 1 ? tokens[tokens.length - 1] : "";

  var filename = new Date().getTime() + "_" + Math.round(Math.random() * 10000);
  if (ftype) {
    filename = filename + "." + ftype;
  }

  try {
    // 'object'填写上传至OSS的object名称,即不包括Bucket名称在内的Object的完整路径。
    // 'localfile'填写上传至OSS的本地文件完整路径。
    console.log("uploading " + filename);
    let r1 = await ossClient.put(filename, new Buffer(f.data));
    console.log("put success: %j", r1);
    new Result(
      {
        url: r1.url,
      },
      "文件上传成功",
      "success"
    ).success(res);
  } catch (e) {
    console.error(e);
  }
});

/**
 * @swagger
 *  /upload/deleteAlioss:
 *    post:
 *      tags:
 *        - upload
 *      summary: 上传单个文件到阿里云oss
 *      description: 表单类型使用 form-data, 文件名称使用f：<input name="foo" type="file" />
 *      responses:
 *        200:
 *          description: 返回文件key
 */
router.delete("/deleteAlioss/:filename", async function (req, res) {
  if (!RBAC.checkRole(req.user, [RBAC.ROLE_ADMIN], res)) {
    return;
  }
  const filename = req.params.filename;
  /*  */
  try {
    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    let result = await ossClient.delete(filename);
    console.log(result);
    new Result(null, "文件删除成功", "success").success(res);
  } catch (e) {
    new Result(null, "文件删除失败", e).fail(res);
    console.log(e);
  }
});

/**
 * @swagger
 *  /access:
 *    post:
 *      tags:
 *        - access
 *      summary: 访问AWS S3上的文件，返回文件流
 *      parameters:
 *        - name: fileKey
 *          description: 文件key
 *      responses:
 *        200:
 *          description: 返回文件流
 */
router.get("/access", async function (req, res) {
  var fileKey = req.query.fileKey;
  if (!fileKey) {
    new Result(null, "文件不存在", "file not found").fail(res);
    return;
  }

  var options = {
    Bucket: "huidefen-codejoynew",
    Key: fileKey,
  };

  res.attachment(fileKey);
  var fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
});

/**
 * @swagger
 *  /accessUrl:
 *    post:
 *      tags:
 *        - access
 *      summary: 访问AWS S3上的文件，返回访问地址
 *      parameters:
 *        - name: fileKey
 *          description: 文件key
 *      responses:
 *        200:
 *          description: 返回文件访问路径
 */
router.get("/accessUrl", async function (req, res) {
  var fileKey = req.query.fileKey;
  if (!fileKey) {
    new Result(null, "文件不存在", "file not found").fail(res);
    return;
  }

  var options = {
    Bucket: "huidefen-codejoynew",
    Key: fileKey,
  };

  res.attachment(fileKey);
  var url = s3.getSignedUrl("getObject", options);
  new Result(
    {
      url: url,
    },
    "文件地址获取成功",
    "success"
  ).success(res);
});

/**
 * @swagger
 *  /accessOpen:
 *    post:
 *      tags:
 *        - access
 *      summary: 访问AWS S3上的文件，返回文件流。该接口免认证
 *      parameters:
 *        - name: fileKey
 *          description: 文件key
 *      responses:
 *        200:
 *          description: 返回文件流
 */
router.get("/accessOpen", async function (req, res) {
  var fileKey = req.query.fileKey;
  if (!fileKey) {
    new Result(null, "文件不存在", "file not found").fail(res);
    return;
  }

  var options = {
    Bucket: "huidefen-codejoynew-open",
    Key: fileKey,
  };

  res.attachment(fileKey);
  var fileStream = s3.getObject(options).createReadStream();
  fileStream.pipe(res);
});

/**
 * @swagger
 *  /preview:
 *    post:
 *      tags:
 *        - preview
 *      summary: 文档预览信息
 *      parameters:
 *        - name: filename 文件名
 *          description: 文件key
 *      responses:
 *        200:
 *          description: 返回预览信息
 */
router.get("/preview", async function (req, res) {
  var params = {
    SrcUri: "oss://huidefen-course-materials/" + req.query.filename,
    Project: "codejoydevoss",
  };

  var requestOption = {
    method: "POST",
  };

  client.request("GetOfficePreviewURL", params, requestOption).then(
    (result) => {
      console.log(JSON.stringify(result));
      new Result(
        {
          url: result.PreviewURL,
          accessToken: result.AccessToken,
        },
        "成功",
        "success"
      ).success(res);
    },
    (ex) => {
      console.log(ex);
      new Result(null, "文件不存在", ex).fail(res);
    }
  );
});

module.exports = router;
