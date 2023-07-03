var express = require('express');
var router = express.Router();
const employeeService = require('../services/employee');
const Result = require('../models/Result')
const seq = require('sequelize');

const Op = seq.Op;
/* GET users listing. */
router.get('/findAll', async function(req, res, next) {
   const {pageSize = 10, pageIndex = 1, keyword} = req.query
   console.log(req.query, 'req')

   const employee = await employeeService.findData({
      ename: {
         [Op.like]: `%${keyword}%`
     },
   }, {
      size: parseInt(pageSize),
      page: parseInt(pageIndex)
   })
   console.log(employee, 'employee')
   if (employee) {
      new Result(employee, '获取成功', 'success').success(res)
   } else {
      new Result(null, '获取失败', 'fail').fail(res)
   }
});

module.exports = router;