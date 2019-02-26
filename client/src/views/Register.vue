<template>
  <div class="register">
    <section class="form_container">
      <div class="manage_tip">
        <span class="title">迪迦后台管理系统</span>
      </div>
      <el-form :model="registerUser" status-icon :rules="rules" ref="registerForm" label-width="80px"
               class="registerForm">
        <el-form-item label="用户名" prop="name">
          <el-input v-model="registerUser.name" placholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="registerUser.email" placholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="registerUser.password" placholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="registerUser.checkPass" placholder="请确认密码"></el-input>
        </el-form-item>
        <el-form-item label="选择身份" >
          <el-select v-model="registerUser.identity" placholder="请选择身份">
            <el-option label="管理员" value="manager"></el-option>
            <el-option label="员工" value="employee"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">提交</el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
  export default {
    name: "register",
    data() {
      var validatePass = (rule, value, callback) => {
        if (value !== this.registerUser.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        registerUser: {
          name: "",
          email: "",
          password: "",
          checkPass: "",
          identify: ""
        },
        rules: {
          name: [
            {required: true, message: "用户名不能为空", trigger: 'blur'},
            {min: 2, max: 30, message: "长度2到30个字符之间", trigger: 'blur'}
          ],
          email: [
            {trigger: 'blur', required: true, type: "email", message: "邮箱格式不正确"}
          ],
          password: [
            {trigger: 'blur', required: true, message: "密码名不能为空"},
            {min: 6, max: 30, message: "长度6到30个字符之间", trigger: 'blur'}
          ],
          checkPass: [
            {trigger: 'blur', required: true, message: "密码名不能为空"},
            {validator: validatePass, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$axios.post("/api/users/register",this.registerUser).then(res=>{
              //注册成功
              console.log(res)
              this.$message({
                "message":"账号注册成功！",
                type:"success"
              })
              this.$router.push("/login");
            })
              .catch(err=>{})
          } else {
            console.log('error submit!!');
            return false;
          }

        });
      }
    }
  }
</script>

<style scoped rel="stylesheet/scss" lang="scss">
  .register {
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

  .registerForm {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 40px 20px 20px;
    border-radius: 5px;
    box-shadow: 0px 5px 10px #cccc;
  }

  .submit_btn {
    width: 100%;
  }
</style>
