<template>
  <div style="background: #FFFFFF;">
    <template v-if="model1Show">
      <div class="login-top">
        <i class="icon iconfont icon-guanbi" onclick="history.go(-1)"></i>
        <router-link to="/login">账号密码登录</router-link>
      </div>
      <form class="form" @submit.prevent="getMobileCode(1)">
        <ul>
          <li>
            <i :class="{'is-danger': errors.has('mobile')}"></i>
            <div class="cells">
              <label>+86</label>
              <input name="mobile" v-model="mobile" v-validate="'required|phone'" type="text" placeholder="填写手机号码，未注册用户也可直接登录">
            </div>
          </li>
          <li>
            <i :class="{'is-danger': errors.has('verificationCode')}"></i>
            <div class="cells">
              <input title="验证码" name="verificationCode" v-model="verificationCode" v-validate="'required|verificationCode'" type="text" maxlength="4" placeholder="请输入右侧验证码"/>
            </div>
            <img class="img-code" @click="getImgCode" :src="imgCodeSrc">
          </li>
        </ul>
        <button type="submit" class="btn btn-primary">下一步</button>
      </form>
      <div class="user-agreement">
        未注册用户登录后代表您已阅读并同意
        <a href="javascript:;" @click="msg = true">《用户协议》</a>
      </div>
      <agreement @showbox="toshow" v-if="msg"></agreement>
    </template>
    <template v-if="model2Show">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
        <span>免密登录</span>
      </div>
      <form class="form" @submit.prevent="getMobileCode(0)">
        <div class="text-gray">短信验证码已发送至 {{mobile}}</div>
        <div class="code-input-box" @click="focusInput" @keyup="clear($event)">
          <input type="number" id="code1" v-model="code1" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code2" v-model="code2" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code3" v-model="code3" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code4" v-model="code4" oninput="if(value.length>1)value=value.slice(0,1)">
        </div>
        <div class="text-gray" v-if="setTimeOut"><span v-text="time"></span>s后重新发送</div>
        <button type="submit" class="btn btn-link" v-if="resetCode">重新发送验证码</button>
      </form>
    </template>
    <template v-if="model3Show">
      <div class="login-top"></div>
      <form class="form" @submit.prevent="submit">
        <input type="hidden" v-model="mobileCode">
        <input type="text" class="border-input" name="userName" v-validate="'required'" minlength="4" maxlength="20" required v-model="userName" placeholder="首次登录，请设置4~20位非纯数字用户名">
        <button type="submit" class="btn btn-primary">提交</button>
      </form>
    </template>
  </div>
</template>
<script>
import axios from 'axios'
import agreement from '@/components/login/agreement'
require('../../assets/css/login.css')
export default {
  name: 'login',
  data () {
    return {
      mobile: '',
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      mobileCode: '',
      userName: '',
      imgCodeSrc: '',
      id: '',
      verificationCode: '',
      model1Show: true,
      model2Show: false,
      model3Show: false,
      setTimeOut: true,
      resetCode: false,
      time: 60,
      msg: false
    }
  },
  methods: {
    toshow (msg) {
      this.msg = msg
    },
    getImgCode () {
      axios.get('api/captcha/img', this.mobile).then((response) => {
        if (response.data.status === 0) {
          this.id = response.data.data.id
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
    getMobileCode (val) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/code/registerSend', {
            'phone': this.mobile,
            'code': this.verificationCode,
            'id': this.id,
            'codeValid': val
          }).then((response) => {
            if (response.data.status === 0) {
              this.model1Show = false
              this.model2Show = true
              this.time = 60
              this.setTimeOut = true
              this.resetCode = false
              this.setTimeMethods()
              // 响应成功回调
              setTimeout(function () {
                document.getElementById('code1').focus()
              }, 50)
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
          text: '请填写手机号或图片验证码'
        })
      })
    },
    checkCode () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/code/registerValid', {
            'phone': this.mobile,
            'code': this.mobileCode
          }).then((response) => {
            if (response.data.status === 0) {
              this.model1Show = false
              this.model2Show = false
              this.model3Show = true
              // 响应成功回调
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
          text: '请填写短信验证码'
        })
      })
    },
    submit () {
      var self = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/register/phone', {
            'phone': this.mobile,
            'code': this.mobileCode,
            'userName': this.userName,
            'channel': 1
          }).then((response) => {
            if (response.data.status === 0) {
              this.$vux.toast.show({
                type: 'success',
                text: '注册成功',
                onShow () {
                  // 响应成功回调
                  document.cookie = '_token=' + response.data.data.token
                  sessionStorage.setItem('loginToken', response.data.data.token)
                },
                onHide () {
                  let oldUrl = sessionStorage.getItem('oldUrl')
                  console.log(oldUrl)
                  if (oldUrl) {
                    self.$router.replace(oldUrl)
                  } else {
                    self.$router.replace('/')
                  }
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
          text: '请填写用户名'
        })
      })
    },
    focusInput (event) {
      if (this.code1 === '') {
        setTimeout(function () {
          document.getElementById('code1').focus()
        }, 50)
      } else if (this.code2 === '') {
        setTimeout(function () {
          document.getElementById('code2').focus()
        }, 50)
      } else if (this.code3 === '') {
        setTimeout(function () {
          document.getElementById('code3').focus()
        }, 50)
      } else if (this.code4 === '') {
        setTimeout(function () {
          document.getElementById('code4').focus()
        }, 200)
      }
    },
    clear (event) {
      if (event.keyCode === 8) {
        this.code3 = ''
        this.code2 = ''
        this.code1 = ''
        setTimeout(function () {
          document.getElementById('code1').focus()
        }, 100)
      }
    },
    back () {
      this.model1Show = true
      this.model2Show = false
      this.model3Show = false
    },
    setTimeMethods () {
      var _sel = this
      var setTime = null
      setTime = setInterval(move, 1000)
      function move () {
        if (_sel.time > 0) {
          _sel.time--
        } else {
          _sel.setTimeOut = false
          _sel.resetCode = true
          clearInterval(setTime)
        }
      }
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
      })
    }
  },
  created () {
    window.scrollTo(0, 0)
  },
  mounted () {
    this.getImgCode()
  },
  updated: function () {
  },
  watch: {
    code1 () {
      document.getElementById('code2').focus()
    },
    code2 () {
      document.getElementById('code3').focus()
    },
    code3 () {
      document.getElementById('code4').focus()
    },
    code4 () {
      this.mobileCode = this.code1 + this.code2 + this.code3 + this.code4
      this.checkCode()
    }
  },
  components: {
    agreement
  }
}
</script>

<style scoped>
  body {
    background: #FFFFFF;
  }
</style>
