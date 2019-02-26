<template>
  <div class="login">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">迪迦后台管理系统</span>
      </div>
      <el-form :model="loginUser" status-icon :rules="rules" ref="loginForm" label-width="60px"
               class="loginForm">
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="loginUser.email" placholder="请输入邮箱" @keyup.native.enter="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="loginUser.password" placholder="请输入密码" @keyup.native.enter="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">登录</el-button>
        </el-form-item>
        <div class="tiparea">
          <p>还没有账号？现在
            <router-link to='/register'>注册</router-link>
          </p>
        </div>
      </el-form>

    </section>
  </div>
</template>

<script>
  import jwt_code from 'jwt-decode';
  import {mapActions} from 'vuex';

  export default {
    name: "login",
    data() {
      return {
        loginUser: {
          email: "",
          password: "",
        },
        rules: {
          email: [
            {trigger: 'blur', required: true, type: "email", message: "邮箱格式不正确"}
          ],
          password: [
            {trigger: 'blur', required: true, message: "密码名不能为空"},
            {min: 6, max: 30, message: "长度6到30个字符之间", trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      ...mapActions([
        'setIsAuthenticated',// 映射 this.setIsAuthenticated() 为this.$store.dispatch('setIsAuthenticated')]),
        'setUser'
      ]),
      // ...mapMutations({
      //   add: 'increment' // 映射 this.add() 为this.$store.commit('increment')
      //})
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post("/api/users/login", this.loginUser).then(res => {
              //登录成功
              console.log(res)

              //token
              const {token} = res.data;

              //储存到本地
              localStorage.setItem('eleToken', token);

              //解析token
              const decoded = jwt_code(token);
              console.log(decoded)

              //token 存储到vuex中
              this.setIsAuthenticated(!this.isEmpty(decoded))
              //储存用户信息
              this.setUser(decoded)

              this.$message({
                "message": "登录成功！",
                type: "success"
              })
              this.$router.push("/index");
            })
              .catch(err => {
              })
          } else {
            console.log('error submit!!');
            return false;
          }

        });
      },
      isEmpty(value){
        return (
          value === undefined || value === null ||
          (typeof value === "object" && Object.keys(value).length===0) ||
          (typeof value === "string" && value.trim().length===0)

        )
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .login {
    position: relative;
    width: 100%;
    height: 100%;
    background: url(../assets/bg.jpg) no-repeat center center;
    background-size: 100% 100%;
  }

  .form_container {
    width: 370px;
    height: 210px;
    position: absolute;
    top: 10%;
    left: 34%;
    padding: 25px;
    border-radius: 5px;
    text-align: center;
  }

  .form_container .manage_tip .title {
    font-family: "Microsoft YaHei";
    font-weight: bold;
    font-size: 26px;
    color: #fff;
  }

  .loginForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 30px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
  }

  .submit_btn {
    width: 100%;
  }

  .tiparea {
    text-align: right;
    font-size: 12px;
    color: #333;
  }

  .tiparea p a {
    color: #409eff;
  }
</style>
