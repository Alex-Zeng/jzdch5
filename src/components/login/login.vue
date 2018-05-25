<template>
  <div>
    <div class="login-top">
      <i class="icon iconfont icon-guanbi" onclick="history.go(-1)"></i>
      <span>免密登录</span>
    </div>
    <form class="form" action="" method="post">
      <group>
        <x-input title="用户名" required name="mobile" placeholder="请输入您的用户名/手机号/邮箱" keyboard="number"></x-input>
      </group>
      <group>
        <x-input type="password" required title="密码" name="password" placeholder="请输入您的登陆密码"
                 keyboard="number"></x-input>
      </group>
      <group v-if="false">
        <x-input title="验证码" required name="verificationCode" placeholder="请输入右侧验证码">
          <img slot="right-full-height" src="https://ws1.sinaimg.cn/large/663d3650gy1fq684go3glj203m01hmwy.jpg">
        </x-input>
      </group>
      <x-button type="primary" link="/user">登陆</x-button>
    </form>
    <div class="user-agreement">
      <router-link to="/register" class="text-muted fl">免费注册</router-link>
      <a href="javascript:;" class="text-muted fr">忘记密码</a>
    </div>
  </div>
</template>

<script>
import {Cell, Group, XButton, XInput} from 'vux'

require('../../assets/css/login.css')
export default {
  name: 'login',
  data () {
    return {}
  },
  components: {
    XInput,
    XButton,
    Group,
    Cell
  }
}
</script>

<style>
  body {
    background: #FFFFFF;
  }
</style>
