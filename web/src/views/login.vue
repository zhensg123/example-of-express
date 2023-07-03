<template>
  <div class="login-box">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="form">
      <el-form-item label="" prop="username">
        <el-input prefix-icon="el-icon-user" v-model="ruleForm.username">
        </el-input>
      </el-form-item>
      <el-form-item label="" prop="password">
        <el-input
          type="password"
          show-password
          prefix-icon="el-icon-lock"
          v-model="ruleForm.password"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button style="width: 100%" @click="submit" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {}
    }
  },
  methods: {
    submit(){

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
