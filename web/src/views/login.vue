<template>
  <div class="login-box">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
      <el-form-item label="" prop="username">
        <el-input prefix-icon="el-icon-user" placeholder="输入账号" v-model="ruleForm.username">
        </el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input
          type="password"
          show-password
          placeholder="输入密码"
          prefix-icon="el-icon-lock"
          v-model="ruleForm.password"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button style="width: 100%" :loading="btnloading" @click="submit" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import loginApi from './login'
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [{
            required: true,
            message: '输入账号',
            trigger: ['blur', 'change']
        }],
        password: [{
            required: true,
            message: '输入密码',
            trigger: ['blur', 'change']
        }]
      },
      btnloading: false
    }
  },
  methods: {
    submit(){
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.postUserLogin()
          } else {

          }
        })
    },
    postUserLogin(){
      this.btnloading = true
      loginApi.postUserLogin({
        ...this.ruleForm
      }).then((res)=>{
        this.$message({
                message: '登陆成功',
                type: 'success'
            })
            setTimeout(()=>{
                this.$router.push('/')
            }, 1500)
      }).finally(()=>{
        this.btnloading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.login-box {
  display: flex;
  justify-content: center;
  background-color: #fff;
  height: 100%;
  padding-top: 100px;
  .form {
    padding: 20px;
    height: 200px;
    width: 300px;
    border: 1px solid #ddd;
  }
}
</style>
