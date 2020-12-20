<template>
  <div>
  <!-- 面包屑导航区   -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>

    </el-breadcrumb>

  <!-- 卡片视图区域   -->
    <el-card>
    <!--栅格布局一共有24列-->
      <el-row :gutter="20">
        <el-col :span="7">

            <!-- 搜索与添加区域, 1 v-model实现双向数据绑定 @clear会调用回调函数-->
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable
                      @clear="getUserList"
            >
              <!-- 2 搜索按钮绑定单击事件-->
              <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
            </el-input>

        </el-col>

        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域-->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"  label="#"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column  label="状态">
          <!-- 作用域插槽, 通过slot-scope接收当前作用域数据-->
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state"
                       active-color="#409eff" inactive-color="#dcdfe6" @change="userStateChanged(scope.row)">

            </el-switch>
          </template>
        </el-table-column>
        <el-table-column  label="操作">
          <template slot-scope="scope">
             <!--修改按钮-->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog()"></el-button>
            <!-- 删除按钮-->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>

            <!-- Tooltip文字提示-->
            <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
            <!--分配角色按钮-->
          </template>
        </el-table-column>
      </el-table>

      <!--分页-->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
      <!--  添加用户的对话框    -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed"
        >
        <!--对话框内容主体区域-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
                 label-width="70px" >
<!--          prop指定校验规则-->
          <el-form-item label="用户名" prop="username">
<!--            数据的双向绑定-->
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>


        </el-form>
        <!--对话框内容底部区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框-->
      <el-dialog
      title="修改用户"
      :visible.sync="addDialogVisible"
      width="30%"
      @close="addDialogClosed"
    >
      <!--对话框内容主体区域-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
               label-width="70px" >
        <!--          prop指定校验规则-->
        <el-form-item label="用户名" prop="username">
          <!--            数据的双向绑定-->
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>


      </el-form>
      <!--对话框内容底部区域-->
      <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Users",
  data() {

    // 验证邮箱的规则
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

      if( regEmail.test(value)){
        // 合法的邮箱
        return cb()
      }

      cb(new  Error('请输入合法的邮箱'))
    }

    // 验证手机号的规则
    var checkPhone = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[768]18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)){
        return cb()
      }
      cb(new  Error('请输入合法的手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo:{
        query: '',
        // 当前页数
        pagenum: 1,
        // 当前每页显式多少条数据
        pagesize: 2
      },
      userlist: [],
      total: 0,
      // 控制添加用户对话框是否显式隐藏，默认false表示隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username : '',
        password: '',
        email:'',
        mobile: '',




      },
      // 添加表单的验证规则
      addFormRules: {
        username :[
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password :[
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '密码长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email :[
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile :[
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],

      },

    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    async getUserList(){
      const {data: res} = await this.$http.get('users', {params: this.queryInfo})
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表失败')
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      // console.log(`每页 ${newSize} 条`);
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 监听 页码值 改变的事件
    handleCurrentChange(newPage) {
      // console.log(`当前页: ${newPage}`);
      this.queryInfo.pagenum = newPage
      this.getUserList()

    },
    // 监听 switch 开关状态的改变
    async userStateChanged(userInfo){
      console.log(userInfo)
      const  {data: res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      if(res.meta.status !== 200){
        // 更新失败，将页面的状态进行回滚
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.error('更新用户状态失败')
      }
      this.$message.success('更新用户状态成功')
    },

    // 监听添加用户对话框的关闭事件
    addDialogClosed(){
      this.$refs.addFormRef.resetFields()
    },

    // 点击按钮，添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        //console.log(valid)
        if(!valid) return // 如果失败，则不走添加的逻辑
        // 可以发起添加用户的网络请求
        const  {data:res} = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201){
          this.$message.error('添加用户失败! ')
        }
        this.$message.success('添加用户成功! ')
        // 添加用户成功后，隐藏添加对话框
        this.addDialogVisible = false
        // 刷新用户列表
        this.getUserList()

      })
    },
    // 修改按钮，展示编辑用户的对话框
    showEditDialog(){

    }
  },


}
</script>

<style lang="less" scoped>

</style>
