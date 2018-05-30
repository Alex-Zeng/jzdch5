import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/home/index'
import GoodsClass from '@/components/goods-class/goods-class'
import User from '@/components/user/user'
import shopCard from '@/components/shop-card/shop-card'
import Login from '@/components/login/login'
import LoginCode from '@/components/login/Login-code'
import Register from '@/components/login/register'
import forgetPassword from '@/components/login/forget-password'
import myForm from '@/components/form'
Vue.use(Router)
export default new Router({
  routes: [
    {
      path: '/',
      name: 'index',
      meta: {
        title: '首页'
      },
      component: Index
    },
    {
      path: '/goods-class',
      name: 'goods-class',
      meta: {
        title: '分类'
      },
      component: GoodsClass
    },
    {
      path: '/user',
      name: 'user',
      meta: {
        title: '用户中心'
      },
      component: User
    },
    {
      path: '/shop-card',
      name: 'shop-card',
      meta: {
        title: '采购清单'
      },
      component: shopCard
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: '登录'
      },
      component: Login
    },
    {
      path: '/loginByCode',
      name: 'loginByCode',
      meta: {
        title: '免密登录'
      },
      component: LoginCode
    },
    {
      path: '/register',
      name: 'register',
      meta: {
        title: '注册'
      },
      component: Register
    },
    {
      path: '/forget-password',
      name: 'forget-password',
      meta: {
        title: '忘记密码'
      },
      component: forgetPassword
    },
    {
      path: '/form',
      name: 'myForm',
      meta: {
        title: '表单验证'
      },
      component: myForm
    }
  ]
})
