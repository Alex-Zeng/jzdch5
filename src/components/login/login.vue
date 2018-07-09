<template>
  <div style="background: #FFFFFF;">
    <div class="login-top">
      <i class="icon iconfont icon-guanbi" onclick="history.go(-1)"></i>
      <router-link to="/loginByCode">免密登录</router-link>
    </div>
    <form class="form">
      <ul>
        <li>
          <i :class="{'is-danger': errors.has('mobile')}"></i>
          <div class="cells">
            <label for="">用户名</label>
            <input type="text" name="mobile" v-validate="'required'" v-model="mobile" placeholder="请输入您的用户名/手机号/邮箱"/>
          </div>
        </li>
        <li>
          <i :class="{'is-danger': errors.has('password')}"></i>
          <div class="cells">
            <label for="">密码&emsp;</label>
            <input type="password" name="password" v-validate="'required'" v-model="password" placeholder="请输入您的登陆密码"/>
            <input type="hidden" v-model="password2">
          </div>
        </li>
        <li v-if="false">
          <div class="cells">
            <input type="text" name="verificationCode" required maxlength="5" v-model="verificationCode" placeholder="请输入右侧验证码"/>
          </div>
          <img class="img-code" @click="getImgCode" :src="imgCodeSrc">
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="login">登录</button>
    </form>
    <div class="user-agreement">
      <router-link to="/register" class="text-muted fl">免费注册</router-link>
      <router-link to="/forget-password" class="text-muted fr">忘记密码</router-link>
    </div>
  </div>
</template>

<script>
import {Cell, Group, XButton, XInput} from 'vux'
import crypto from 'crypto'
import axios from 'axios'
require('../../assets/css/login.css')
export default {
  name: 'login',
  data () {
    return {
      mobile: '',
      password: '',
      password2: '',
      imgCodeSrc: ''
    }
  },
  methods: {
    setMd5 () {
      var md5 = crypto.createHash('md5')
      md5.update(this.password) // this.pw2这是你要加密的密码
      this.password2 = md5.digest('hex') // this.pw这就是你加密完的密码，这个往后台传就行了
    },
    login () {
      var _sel = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/login/index', {
            'userName': this.mobile,
            'password': this.password
          }).then((response) => {
            if (response.data.status === 0) {
              sessionStorage.removeItem('loginToken')
              this.$vux.toast.show({
                type: 'success',
                text: '登陆成功',
                onShow () {
                  sessionStorage.setItem('loginToken', response.data.data.token)
                  document.cookie = '_token=' + response.data.data.token
                },
                onHide () {
                  _sel.$router.push('/')
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg
              })
            }
          }).catch((response) => {
            // 响应错误回调
            this.errorMsg()
          })
          return
        }
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写用户名和密码'
        })
      })
    },
    getImgCode () {
      axios.get('api/captcha/img', this.mobile).then((response) => {
        if (response.data.status === 0) {
          this.imgCodeSrc = response.data.data.src + '?t=' + new Date().getTime()
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.data.msg
          })
        }
      }).catch((response) => {
        // 响应错误回调
        this.errorMsg()
      })
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
      })
    }
  },
  components: {
    XInput,
    XButton,
    Group,
    Cell
  }
}
</script>

<style scoped>
  body {
    background: #FFFFFF;
  }
</style>
