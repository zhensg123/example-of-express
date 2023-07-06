<template>
    <el-dialog
  :title="title"
  :visible.sync="dialogVisible"
  width="30%"
  :before-close="handleClose">
  <el-form :model="ruleForm" ref="ruleForm" label-position="left"  label-width="60px">
      <el-form-item label="姓名">
          <el-input v-model="ruleForm.ename"></el-input>
      </el-form-item>
      <el-form-item label="部门">
        <el-input v-model="ruleForm.dname"></el-input>

        </el-form-item>
        <el-form-item label="工资">
            <el-input v-model="ruleForm.salary"></el-input>

        </el-form-item>
        <el-form-item label="出生">
            <el-date-picker
            style="width:100%"
      v-model="ruleForm.hiredate"
      type="date"
      value-format="yyyy-MM-dd"
      placeholder="选择日期">
    </el-date-picker>
        </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" :loading='btnloading' @click="handleEmployee">确 定</el-button>
  </span>
</el-dialog>
</template>
<script>
import myworkApi from './api/mywork'

const initForm = function(){
    return {
        ename: '',
            salary: '',
            dname: '',
            hiredate: '1990-01-01'
    }
}
  export default {
    data() {
      return {
        dialogVisible: false,
        ruleForm: {
            ename: '',
            salary: '',
            dname: '',
            hiredate: '1990-01'
        },
        btnloading: false,
        title: '新增员工'
      };
    },
    methods: {
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      },
      _openDialog(value){
        this.ruleForm = value || initForm()
        this.title  =value ? '更新员工' : '新增员工'
        this.dialogVisible = true
      },
      handleEmployee(){
        this.btnloading = true
        const api =this.ruleForm.eno ?  myworkApi.postUpdateEmployee : myworkApi.postAddEmployee
        api(this.ruleForm).then((res) => {
            this.$message({
                type: 'success',
                message: this.ruleForm.eno ? '更新成功' : '添加成功'
            })
        this.$emit("updateDate", this.ruleForm.eno)
        this.dialogVisible = false
      }).finally(() => {
        this.btnloading = false
      })
      }
    }
  };
</script>
