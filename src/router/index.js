import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/home/index'
import GoodsClass from '@/components/goods-class/goods-class'
import User from '@/components/user/user'
import ShopCartemplate from '@/components/shop-car/shop-car-template'
import ShopCar from '@/components/shop-car/shop-car'
import Indent from '@/components/shop-car/indent'
import IndentDetail from '@/components/shop-car/detail'
import AddressLists from '@/components/address/address-lists'
import AddressNew from '@/components/address/address-new'
import Login from '@/components/login/login'
import LoginCode from '@/components/login/login-code'
import Register from '@/components/login/register'
import ForgetPassword from '@/components/login/forget-password'
import Search from '@/components/search/search'
import GoodsDetail from '@/components/detail/detail'
import Enterprise from '@/components/enterprise/enterprise'
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
      path: '/shop-car',
      name: 'shop-car',
      component: ShopCartemplate,
      children: [
        {
          path: '/',
          name: 'shop-car-lists',
          meta: {
            title: '采购清单'
          },
          component: ShopCar
        },
        {
          path: '/shop-car/indent',
          name: 'indent',
          meta: {
            title: '确认订单'
          },
          component: Indent
        },
        {
          path: '/shop-car/detail',
          name: 'detail',
          meta: {
            title: '订单详情'
          },
          component: IndentDetail
        }
      ]
    },
    {
      path: '/address-lists',
      name: 'address-lists',
      meta: {
        title: '收货地址'
      },
      component: AddressLists
    },
    {
      path: '/address-new',
      name: 'address-new',
      meta: {
        title: '新建收货地址'
      },
      component: AddressNew
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
      component: ForgetPassword
    },
    {
      path: '/search',
      name: 'search',
      meta: {
        title: '搜索'
      },
      component: Search
    },
    {
      path: '/detail/:id',
      name: 'detail',
      meta: {
        title: '详情'
      },
      component: GoodsDetail
    },
    {
      path: '/enterprise',
      name: 'enterprise',
      meta: {
        title: '企业认证'
      },
      component: Enterprise
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
