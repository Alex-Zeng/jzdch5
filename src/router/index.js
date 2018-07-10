import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/home/index'
import GoodsClass from '@/components/goods-class/goods-class'
import User from '@/components/user/user'
import Settings from '@/components/settings/index'
import selectEnterprise from '@/components/settings/select-enterprise'
import Safety from '@/components/settings/safety'
import settingPhone from '@/components/settings/phone-setting'
import changePhone from '@/components/settings/phone-change'
import settingEmail from '@/components/settings/email-setting'
import changeEmail from '@/components/settings/email-change'
import settingPassword from '@/components/settings/password-setting'
import changePassword from '@/components/settings/password-change'
import Other from '@/components/settings/other'
import GoodsCollect from '@/components/user/goods-collect'
import Message from '@/components/user/message'
import noticeDetail from '@/components/user/notice-detail'
import ShopCartemplate from '@/components/shop-car/shop-car-template'
import ShopCar from '@/components/shop-car/shop-car'
import Indent from '@/components/shop-car/indent'
import IndentDetail from '@/components/shop-car/detail'
import AddressLists from '@/components/address/address-lists'
import AddressEditor from '@/components/address/address-editor'
import AddressNew from '@/components/address/address-new'
import Login from '@/components/login/login'
import LoginCode from '@/components/login/login-code'
import Register from '@/components/login/register'
import ForgetPassword from '@/components/login/forget-password'
import Search from '@/components/search/search'
import GoodsDetail from '@/components/detail/detail'
import Enterprise from '@/components/enterprise/enterprise'
import OrderList from '@/components/user/order-list'
import OrderDetail from '@/components/user/order-detail'
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
      path: '/settings',
      name: 'index',
      meta: {
        title: '设置中心'
      },
      component: Settings
    },
    {
      path: '/select-enterprise',
      name: 'select-enterprise',
      meta: {
        title: '认证中心'
      },
      component: selectEnterprise
    },
    {
      path: '/safety',
      name: 'safety',
      meta: {
        title: '安全设置'
      },
      component: Safety
    },
    {
      path: '/safety/phone-setting',
      name: 'phone-setting',
      meta: {
        title: '设置绑定手机'
      },
      component: settingPhone
    },
    {
      path: '/safety/phone-change',
      name: 'phone-change',
      meta: {
        title: '修改绑定手机'
      },
      component: changePhone
    },
    {
      path: '/safety/email-setting',
      name: 'email-setting',
      meta: {
        title: '设置邮箱'
      },
      component: settingEmail
    },
    {
      path: '/safety/email-change',
      name: 'email-change',
      meta: {
        title: '修改邮箱'
      },
      component: changeEmail
    },
    {
      path: '/safety/password-setting',
      name: 'password-setting',
      meta: {
        title: '设置密码'
      },
      component: settingPassword
    },
    {
      path: '/safety/password-change',
      name: 'password-change',
      meta: {
        title: '修改密码'
      },
      component: changePassword
    },
    {
      path: '/other',
      name: 'other',
      meta: {
        title: '其他设置'
      },
      component: Other
    },
    {
      path: '/goods-collect',
      name: 'goods-collect',
      meta: {
        title: '收藏夹'
      },
      component: GoodsCollect
    },
    {
      path: '/message',
      name: 'message',
      meta: {
        title: '消息中心'
      },
      component: Message
    },
    {
      path: '/message/notice-detail/:id',
      name: 'notice-detail',
      meta: {
        title: '公告详情'
      },
      component: noticeDetail
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
      path: '/address-editor',
      name: 'address-editor',
      meta: {
        title: '编辑收货地址'
      },
      component: AddressEditor
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
    },
    {
      path: '/order-list',
      name: 'Order',
      meta: {
        title: '我的订单'
      },
      component: OrderList
    },
    {
      path: '/order-detail/:no',
      name: 'OrderDetail',
      meta: {
        title: '订单详情'
      },
      component: OrderDetail
    }
  ]
})
