<template>
  <div style="background: #FFFFFF;">
    <template v-if="model1Show">
      <div class="login-top">
        <router-link  class="icon iconfont icon-guanbi" to="/login" replace></router-link>
      </div>
      <div class="form">
        <ul>
          <li>
            <div class="text-muted form-title">
              找回密码
            </div>
          </li>
          <li>
            <i :class="{'is-danger': errors.has('手机号')}"></i>
            <div class="cells">
              <label>+86</label>
              <input name="手机号" v-model="mobile" v-validate="'required|phone'" placeholder="请输入注册手机号"/>
            </div>
            <span v-show="errors.has('手机号')" class="help is-danger">{{ errors.first('手机号') }}</span>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="getImgCode">下一步</button>
      </div>
    </template>
    <template  v-if="model2Show">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
      </div>
      <div class="form">
        <ul>
          <li>
            <div class="text-muted form-title">
              找回密码
            </div>
          </li>
          <li>
            <i :class="{'is-danger': errors.has('验证码')}"></i>
            <div class="cells">
              <input title="验证码" name="验证码" v-validate="'required'" maxlength="4" v-model="verificationCode" placeholder="请输入右侧验证码"/>
              <img class="img-code" @click="getImgCode" :src="imgCodeSrc" onerror="this.src='./static/images/temp-img.png'">
            </div>
            <span v-show="errors.has('验证码')" class="help is-danger">{{ errors.first('验证码') }}</span>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="getMobileCode(1)">下一步</button>
      </div>
    </template>
    <template v-if="model3Show">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
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
        <button type="button" class="btn btn-link" @click="getMobileCode(0)" v-if="resetCode">重新发送验证码</button>
      </div>
    </template>
    <template v-if="model4Show">
      <div class="login-top"></div>
      <div class="form">
        <div class="cells border-input-cells">
          <input type="password" class="border-input" name="密码" minlength="6" maxlength="20" v-validate="'required|verificationPassword'" v-model="password" placeholder="请设置6-20位密码">
          <span v-show="errors.has('密码')" class="help is-danger">{{ errors.first('密码') }}</span>
        </div>
        <div class="cells border-input-cells">
          <input type="password" class="border-input" name="确认密码" minlength="6" maxlength="20" v-validate="'required|verificationPassword|confirmed:密码'" v-model="confirmPassword" placeholder="请再次输入密码">
          <span v-show="errors.has('确认密码')" class="help is-danger">{{ errors.first('确认密码') }}</span>
        </div>
        <button type="button" class="btn btn-primary" @click="submit">提交</button>
      </div>
    </template>
  </div>
</template>
<script>
import axios from 'axios'
require('../../assets/css/login.css')
export default {
  name: 'forget-password',
  data () {
    return {
      mobile: '',
      code1: '',
      code2: '',
      code3: '',
      code4: '',
      mobileCode: '',
      id: '',
      password: '',
      confirmPassword: '',
      imgCodeSrc: '',
      verificationCode: '',
      model1Show: true,
      model2Show: false,
      model3Show: false,
      model4Show: false,
      setTimeOut: true,
      resetCode: false,
      time: 60
    }
  },
  methods: {
    getImgCode () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/password/checkPhone', {
            'phone': this.mobile
          }).then((response) => {
            if (response.data.status == 0) {
              this.model2Show = true
              this.model1Show = false
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
    getMobileCode (val) {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/code/passwordSend', {
            'phone': this.mobile,
            'code': this.verificationCode,
            'codeValid': val,
            'id': this.id
          }).then((response) => {
            if (response.data.status == 0) {
              this.model1Show = false
              this.model2Show = false
              this.model3Show = true
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
        }
      })
    },
    checkCode () {
      axios.post('api/password/checkCode', {
        'phone': this.mobile,
        'code': this.mobileCode
      }).then((response) => {
        if (response.data.status == 0) {
          this.model1Show = false
          this.model2Show = false
          this.model3Show = false
          this.model4Show = true
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
    },
    submit () {
      var self = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/password/update', {
            'phone': this.mobile,
            'code': this.mobileCode,
            'password': this.password,
            'confirmPassword': this.confirmPassword
          }).then((response) => {
            if (response.data.status == 0) {
              this.$vux.toast.show({
                type: 'success',
                text: '密码修改成功',
                onShow () {
                  // 响应成功回调
                  document.cookie = '_token='
                  localStorage.clear()
                },
                onHide () {
                  self.$router.replace('/login')
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
  components: {}
}
</script>

<style scoped>
  body {
    background: #FFFFFF;
  }
</style>
