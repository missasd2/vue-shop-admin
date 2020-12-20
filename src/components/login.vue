<template>
  <div class="login_container">
    <div class="login_box">
      <!--      头像区-->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="">
      </div>

      <div>
        <!--   登录表单区, 将表单绑定到loginForm数据对象上   -->
        <el-form ref="loginFormRef" class="login_form" :model="loginForm" :rules="loginFormRules">


          <!--用户名 prop属性设置为需校验的表单的字段名即可-->
          <el-form-item prop="username">
            <!-- 为input输入框绑定对象属性 username-->
            <el-input prefix-icon="iconfont icon-user " v-model="loginForm.username"></el-input>
          </el-form-item>

          <!--密码-->
          <el-form-item prop="password">
            <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
          </el-form-item>

          <!--按钮区域-->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      // 这是登录表单的数据绑定对象, 有几个属性
      loginForm: {
        username: 'admin',
        password: '123456',
      },
      // 这是表单的验证规则对象
      loginFormRules: {
        username: [{required: true, message: '请输入用户名', trigger: 'blur'},
          {min: 3, max: 16, message: '长度在6到15个字符', trigger: 'blur'}
        ],
        password: [{required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 6, message: '长度为6个字符', trigger: 'blur'}
        ]
      }

    };
  },

  methods: {
    // 点击重置按钮所绑定的事件
    resetLoginForm() {
      // this 指的是当前登录组件的实例对象
      // console.log(this);
      this.$refs.loginFormRef.resetFields();
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        // console.log(valid);
        if (!valid) return;
        const {data: res} = await this.$http.post('login', this.loginForm);
        // console.log(res);
        if (res.meta.status !== 200) return this.$message.error("登录失败")
        this.$message.success("登录成功")
        // 1. 将登录成功之后的 token, 保存到客户端的 sessionStorage中
        // 1.1 项目中除了登录之外的其他API接口, 必须在登录之后才能访问
        // 1.2 token 只应在当前网站打开期间生效, 所以将token 保存在sessionStorage中
        window.sessionStorage.setItem("token", res.data.token);
        // 2 通过编程式导航跳转到后天主页，路由地址是/home
        this.$router.push('/home');
      });
    },
  }

}
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 5px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eeeeee;
    }

  }


}

.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;

}

.btns {
  display: flex;
  justify-content: flex-end;
}


</style>
