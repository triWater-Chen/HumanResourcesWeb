<template>
  <div>
    <el-form
        :model="loginForm"
        status-icon
        :rules="rules"
        ref="loginForm"
        v-loading="loading"
        element-loading-text="正在登录..."
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        class="loginContainer">
      <h3 class="loginTitle">
        登录
      </h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username"
                  size="normal"
                  type="text"
                  auto-complete="off"
                  placeholder="请输入用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password"
                  size="normal"
                  type="password"
                  auto-complete="off"
                  placeholder="请输入密码"
        />
      </el-form-item>
      <el-checkbox v-model="checked" size="normal" class="loginRemember" >记住密码</el-checkbox>
      <el-button size="normal"
                 type="primary"
                 style="width: 100%; margin: 5px 0 10px 0;"
                 @click="submitLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script>

export default {
  name: "Login",
  data() {

    // 表单验证
    let checkUser = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    let checkPass = (rule, value, callback) => {
      const check = /^.*(?=.{6,})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[.!@#$%^&*? ]).*$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!check.test(value)) {
        callback(new Error('密码格式不正确'))
      } else {
        callback()
      }
    }

    return {
      loading: false,
      checked: true,
      loginForm: {
        username: 'user',
        password: 'Ab123.',
      },
      rules: {
        username: [{validator: checkUser, trigger: 'change'}],
        password: [{validator: checkPass, trigger: 'change'}],
      }
    }
  },

  methods: {
    submitLogin() {
      // $refs 是对全部组件的查找，ref="loginForm" 即定义 <el-form> 表单组件的名字
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.API.login(this.loginForm).then(res => {
            this.SessionStorage.set("USER", res)
            this.$router.replace('/')
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.loginContainer {
  border-radius: 15px;
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 15px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  box-shadow: 0 0 25px #cac6c6;
}

.loginTitle {
  margin: 15px auto 20px auto;
  text-align: center;
  color: #505458;
}

.loginRemember {
  text-align: left;
  margin: 0 0 15px 0;
}

.el-form-item__content{
  display: flex;
  align-items: center;
}
</style>