<template>
  <div style="background: #FFFFFF;">
    <template v-if="model1Show">
      <div class="login-top">
        <i class="icon iconfont icon-guanbi" @click="$router.push('/')"></i>
        <router-link to="/login" replace>账号密码登录</router-link>
      </div>
      <div class="form">
        <ul>
          <li>
            <i :class="{'is-danger': errors.has('mobile')}"></i>
            <div class="cells">
              <label for="">+86</label>
              <input name="手机号码" v-model="mobile" v-validate="'required|phone'" maxlength="11" type="text" placeholder="填写手机号码，未注册用户也可直接登录">
            </div>
            <span v-show="errors.has('手机号码')" class="help is-danger">{{ errors.first('手机号码') }}</span>
          </li>
          <li>
            <div class="cells">
              <input title="验证码" name="验证码" v-validate="'required'" maxlength="4" v-model="verificationCode" placeholder="请输入右侧验证码"/>
              <img class="img-code" @click="getImgCode" :src="imgCodeSrc" onerror="this.src='./static/images/temp-img.png'">
            </div>
            <span v-show="errors.has('验证码')" class="help is-danger">{{ errors.first('验证码') }}</span>
          </li>
        </ul>
        <button type="submit" class="btn btn-primary" @click="getMobileCode(1)">下一步</button>
      </div>
    </template>
    <template v-if="model2Show">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
        <router-link to="/login" replace>账号密码登录</router-link>
      </div>
      <div class="form">
        <div class="text-gray">短信验证码已发送至 {{mobile}}</div>
        <div class="code-input-box" @click="focusInput"  @keyup="clear($event)">
          <input type="number" id="code1" v-model="code1" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code2" v-model="code2" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code3" v-model="code3" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code4" v-model="code4" oninput="if(value.length>1)value=value.slice(0,1)">
        </div>
        <div class="text-gray" v-if="setTimeOut"><span v-text="time"></span>s后重新发送</div>
        <button type="button" class="btn btn-link" v-if="resetCode" @click="getMobileCode(0)">重新发送验证码</button>
      </div>
    </template>
    <template v-if="model3Show">
      <div class="login-top"></div>
      <div class="form">
        <input type="hidden" v-model="mobileCode">
        <div class="cells border-input-cells">
          <input type="text" class="border-input" name="用户名" v-validate="'required'" minlength="4" maxlength="20" required v-model="userName" placeholder="首次登录，请设置4~20位非纯数字用户名">
          <span v-show="errors.has('用户名')" class="help is-danger">{{ errors.first('用户名') }}</span>
        </div>
        <div class="cells border-input-cells">
          <input type="password" class="border-input" name="密码" v-validate="'required|verificationPassword'" minlength="6" maxlength="20" required v-model="userPassword" placeholder="请设置6~20位字母及数字的组合密码">
          <span v-show="errors.has('密码')" class="help is-danger">{{ errors.first('密码') }}</span>
        </div>
        <button type="submit" class="btn btn-primary" @click="submit">登录</button>
      </div>
      <div class="user-agreement">
        <i class="icon iconfont icon-xuanzhong" style="color: #1EB9EE;"></i>
        我已阅读并同意
        <a href="javascript:;" @click="msg = true">《用户协议》</a>、<a href="javascript:;" @click="secrecy = true">《保密协议》</a>
      </div>
      <agreement @showbox="toshow" v-if="msg"></agreement>
      <secrecy @showboxSecrecy="toshowSecrecy" v-if="secrecy"></secrecy>
    </template>
  </div>
</template>
<script>
import axios from 'axios'
import agreement from '@/components/login/agreement'
import secrecy from '@/components/login/secrecy'
require('../../assets/css/login.css')
export default {
  name: 'loginByCode',
  data () {
    return {
      mobile: '',
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      mobileCode: '',
      userName: '',
      userPassword: '',
      imgCodeSrc: '',
      channel: '2',
      id: '',
      verificationCode: '',
      model1Show: true,
      model2Show: false,
      model3Show: false,
      setTimeOut: true,
      resetCode: false,
      msg: false,
      secrecy: false,
      time: 60
    }
  },
  methods: {
    toshow (data) {
      this.msg = data
    },
    toshowSecrecy (data) {
      this.secrecy = data
    },
    getImgCode () {
      axios.get('api/captcha/img', this.mobile).then((response) => {
        if (response.data.status == 0) {
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
          axios.post('api/code/loginSend', {
            'phone': this.mobile,
            'code': this.verificationCode,
            'id': this.id,
            'codeValid': val
          }).then((response) => {
            if (response.data.status == 0) {
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
          return false
        }
      })
    },
    checkCode () {
      let self = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/login/phone', {
            'phone': this.mobile,
            'code': this.mobileCode
          }).then((response) => {
            if (response.data.status == 0) {
              let d = new Date()
              d.setHours(d.getHours() + (24 * 30)) // 保存一个月
              document.cookie = '_token=' + response.data.data.token + '; expires=' + d.toGMTString() // 将date赋值给expires
              localStorage.setItem('loginToken', response.data.token)
              // 响应成功回调
              let oldUrl = localStorage.getItem('oldUrl')
              if (oldUrl) {
                this.$router.push(oldUrl)
              } else {
                this.$router.push('/')
              }
            } else if (response.data.status == -3) {
              self.model1Show = false
              self.model2Show = false
              self.model3Show = true
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
            'password': this.userPassword,
            'channel': 0
          }).then((response) => {
            if (response.data.status == 0) {
              this.$vux.toast.show({
                type: 'success',
                text: '注册成功',
                onShow () {
                  // 响应成功回调
                  let d = new Date()
                  d.setHours(d.getHours() + (24 * 30)) // 保存一个月
                  document.cookie = '_token=' + response.data.data.token + '; expires=' + d.toGMTString() // 将date赋值给expires
                  localStorage.setItem('loginToken', response.data.data.token)
                },
                onHide () {
                  let oldUrl = localStorage.getItem('oldUrl')
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
          return false
        }
      })
    },
    focusInput (event) {
      if (this.code1 == '') {
        setTimeout(function () {
          document.getElementById('code1').focus()
        }, 50)
      } else if (this.code2 == '') {
        setTimeout(function () {
          document.getElementById('code2').focus()
        }, 50)
      } else if (this.code3 == '') {
        setTimeout(function () {
          document.getElementById('code3').focus()
        }, 50)
      } else if (this.code4 == '') {
        setTimeout(function () {
          document.getElementById('code4').focus()
        }, 200)
      }
    },
    clear (event) {
      if (event.keyCode == 8) {
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
    code1 (val) {
      document.getElementById('code2').focus()
    },
    code2 (val) {
      document.getElementById('code3').focus()
    },
    code3 (val) {
      document.getElementById('code4').focus()
    },
    code4 (val) {
      this.mobileCode = this.code1 + this.code2 + this.code3 + this.code4
      this.checkCode()
    }
  },
  components: {
    agreement,
    secrecy
  }
}
</script>

<style scoped>
  body {
    background: #FFFFFF;
  }
</style>
