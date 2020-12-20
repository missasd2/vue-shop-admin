import Vue from 'vue'
import Router from 'vue-router'

import Login from '../components/login'
import Home from '../components/home'
import Welcome from "../components/Welcome";
import Users from "../components/user/Users";

Vue.use(Router)

const router =  new Router({
  routes: [
    {path: '/login', component: Login},
  //  添加路由重定向
    {path: '/', redirect: '/login'},
    {
      path: '/home',
      component: Home,
      // 定义重定向及子路由
      redirect: '/welcome',
      children: [
        {path: '/welcome', component: Welcome},
        {path: '/users', component: Users},

      ]},


  ]
})

// 暴露路由之前，挂在路由导航守卫
router.beforeEach((to, from, next) => {
  // to将要访问的路径
  // from 代表从哪个路径跳转而来
  // next 是一个函数, 表示放行
  // next() 放行 next('/login') 强制跳转

  // 若路径是login则直接放行
  if (to.path === '/login') return next();
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token');
  // 若token为空
  if (!tokenStr) return next('/login');
  // token不为空直接放行
  next();




})

export default router
