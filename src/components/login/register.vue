<template>
  <div>
    <template v-if="modelShow">
      <div class="login-top">
        <i class="icon iconfont icon-guanbi" onclick="history.go(-1)"></i>
        <span>账号密码登录</span>
      </div>
      <form class="form" action="">
        <group>
          <x-input title="+86" name="mobile" required v-model="mobile" placeholder="填写手机号码，未注册用户也可直接登录"
                   keyboard="number" is-type="china-mobile"></x-input>
        </group>
        <group>
          <x-input title="验证码" name="verificationCode" required @on-change="checkCode" placeholder="请输入右侧验证码">
            <img slot="right-full-height" src="https://ws1.sinaimg.cn/large/663d3650gy1fq684go3glj203m01hmwy.jpg">
          </x-input>
        </group>
        <button type="button" class="btn btn-primary" @click="getMobileCode">下一步</button>
      </form>
      <div class="user-agreement">
        未注册用户登录后代表您已阅读并同意
        <a href="javascript:;">《用户协议》</a>
      </div>
    </template>
    <template v-if="!modelShow">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
        <span>免密登录</span>
      </div>
      <form class="form" action="">
        <div class="text-gray">短信验证码已发送至 {{mobile}}</div>
        <div class="code-input-box" @click="focusInput">
          <input type="text" maxlength="1" id="code1" v-model="code1">
          <input type="text" maxlength="1" id="code2" v-model="code2">
          <input type="text" maxlength="1" id="code3" v-model="code3">
          <input type="text" maxlength="1" id="code4" v-model="code4">
        </div>
        <button type="button" class="btn btn-link" @click="getMobileCode">下一步</button>
      </form>
    </template>
  </div>
</template>
<script>
import {Cell, Group, XButton, XInput} from 'vux'
require('../../assets/css/login.css')
export default {
  name: 'login',
  data () {
    return {
      mobile: '15010825542',
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      mobileCode: '',
      modelShow: true
    }
  },
  methods: {
    checkMobile () {
      this.$vux.toast.show({
        type: 'warn',
        text: '手机号码已存在',
        onShow () {
          console.log('Plugin: I\'m showing')
        },
        onHide () {
          console.log('Plugin: I\'m hiding')
        }
      })
    },
    getMobileCode () {
      console.log(this.mobile)
      this.$http.get('/', this.mobile).then((response) => {
        this.modelShow = false
        // 响应成功回调
        console.log('success')
        setTimeout(function () {
          // $('.code-input-box input').eq(0).focus()
        }, 200)
      }, (response) => {
        // 响应错误回调
        console.log('error')
      })
      return false
    },
    checkCode () {
    },
    focusInput () {
      console.log(1111111)
      if (this.code1 === '') {
        setTimeout(function () {
          // $('.code-input-box input').eq(0).focus()
        }, 200)
      } else if (this.code2 === '') {
        setTimeout(function () {
          // $('.code-input-box input').eq(1).focus()
        }, 200)
      } else if (this.code3 === '') {
        setTimeout(function () {
          // $('.code-input-box input').eq(2).focus()
        }, 200)
      } else if (this.code4 === '') {
        setTimeout(function () {
          // $('.code-input-box input').eq(3).focus()
        }, 200)
      }
    },
    back () {
      this.modelShow = true
    }
  },
  mounted () {

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
