// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 全局导入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';



// 导入字体图标
import './assets/fonts/iconfont.css'
// 导入全局样式表
import './assets/css/global.css'

Vue.config.productionTip = false
Vue.use(ElementUI);
// 按需引用的形式
//Vue.use(ElementUI.Button)


// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 配置拦截器
axios.interceptors.request.use(config => {
  console.log(config)
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 挂载原型属性
Vue.prototype.$http = axios
// 将弹框提示组件挂在为Vue的原型属性
Vue.prototype.$message = ElementUI.Message
// 挂载弹框组件
Vue.prototype.$confirm = ElementUI.MessageBox.confirm


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  render: h => h(App)
}).$mount('#app')
