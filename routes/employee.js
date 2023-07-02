var express = require('express');
var router = express.Router();
const employeeService = require('../services/employee');
const Result = require('../models/Result')

/* GET users listing. */
router.get('/findAll', async function(req, res, next) {
   const employee = await employeeService.findAll()
   if (employee) {
      new Result(employee, '获取成功', 'success').success(res)
   } else {
      new Result(null, '获取失败', 'fail').fail(res)
   }
});

module.exports = router;