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
              <label for="">+86</label>
              <input name="mobile" v-model="mobile" v-validate="'required|phone'" maxlength="11" type="text" placeholder="填写手机号码，未注册用户也可直接登录">
            </div>
          </li>
          <li>
            <div class="cells">
              <input title="验证码" name="code" required maxlength="5" v-model="verificationCode" placeholder="请输入右侧验证码"/>
              <img class="img-code" @click="getImgCode" :src="imgCodeSrc">
            </div>
          </li>
        </ul>
        <button type="submit" class="btn btn-primary">下一步</button>
      </form>
    </template>
    <template v-if="model2Show">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
        <router-link to="/login">账号密码登录</router-link>
      </div>
      <form class="form" @submit.prevent="getMobileCode(0)">
        <div class="text-gray">短信验证码已发送至 {{mobile}}</div>
        <div class="code-input-box" @click="focusInput"  @keyup="clear($event)">
          <input type="number" id="code1" v-model="code1" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code2" v-model="code2" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code3" v-model="code3" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code4" v-model="code4" oninput="if(value.length>1)value=value.slice(0,1)">
        </div>
        <div class="text-gray" v-if="setTimeOut"><span v-text="time"></span>s后重新发送</div>
        <button type="button" class="btn btn-link" v-if="resetCode" @click="getMobileCode(0)">重新发送验证码</button>
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
      imgCodeSrc: '',
      channel: '2',
      id: '',
      verificationCode: '',
      model1Show: true,
      model2Show: false,
      model3Show: false,
      setTimeOut: true,
      resetCode: false,
      time: 60
    }
  },
  methods: {
    getImgCode () {
      axios.get('api/captcha/img', this.mobile).then((response) => {
        console.log(response)
        if (response.data.status === 0) {
          this.id = response.data.data.id
          this.imgCodeSrc = response.data.data.src + '?t=' + new Date().getTime()
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.data.msg,
            onShow () {
              console.log('Plugin: I\'m showing')
            },
            onHide () {
              console.log('Plugin: I\'m hiding')
            }
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
            if (response.data.status === 0) {
              console.log(response)
              this.model1Show = false
              this.model2Show = true
              this.time = 60
              this.setTimeOut = true
              this.resetCode = false
              this.setTimeMethods()
              // 响应成功回调
              console.log('success')
              setTimeout(function () {
                document.getElementById('code1').focus()
              }, 50)
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg,
                onShow () {
                  console.log('Plugin: I\'m showing')
                },
                onHide () {
                  console.log('Plugin: I\'m hiding')
                }
              })
            }
          }).catch((response) => {
            // 响应错误回调
            console.log('error')
            this.errorMsg()
          })
          return
        }
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写手机号或图片验证码',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
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
            if (response.data.status === 0) {
              console.log(this.mobileCode)
              sessionStorage.setItem('loginToken', response.data.token)
              // 响应成功回调
              console.log('success')
              this.$router.push('/')
            } else if (response.data.status === -3) {
              this.$vux.toast.show({
                type: 'warn',
                text: '请输入用户名，提交注册',
                onShow () {
                  console.log('Plugin: I\'m showing')
                  self.model1Show = false
                  self.model2Show = false
                  self.model3Show = true
                },
                onHide () {
                  console.log('Plugin: I\'m hiding')
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg,
                onShow () {
                  console.log('Plugin: I\'m showing')
                },
                onHide () {
                  console.log('Plugin: I\'m hiding')
                }
              })
            }
          }).catch((response) => {
            // 响应错误回调
            console.log('error')
            this.errorMsg()
          })
          return
        }
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写短信验证码',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      })
    },
    submit () {
      var _sel = this
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/register/phone', {
            'phone': this.mobile,
            'code': this.mobileCode,
            'userName': this.userName,
            'channel': 0
          }).then((response) => {
            if (response.data.status === 0) {
              console.log(response)
              this.$vux.toast.show({
                type: 'success',
                text: '注册成功',
                onShow () {
                  console.log('Plugin: I\'m showing')
                  // 响应成功回调
                  console.log('success')
                  sessionStorage.setItem('loginToken', response.data.data.token)
                },
                onHide () {
                  console.log('Plugin: I\'m hiding')
                  _sel.$router.push('/')
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg,
                onShow () {
                  console.log('Plugin: I\'m showing')
                },
                onHide () {
                  console.log('Plugin: I\'m hiding')
                }
              })
            }
          }).catch((response) => {
            // 响应错误回调
            console.log('error')
            this.errorMsg()
          })
          return
        }
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写用户名',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
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
      console.log(event.keyCode)
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
      this.modelShow = true
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
        text: '网络可能有点问题',
        onShow () {
          console.log('Plugin: I\'m showing')
        },
        onHide () {
          console.log('Plugin: I\'m hiding')
        }
      })
    }
  },
  mounted () {
    this.getImgCode()
  },
  updated: function () {
  },
  watch: {
    code1 (val) {
      console.log(val)
      document.getElementById('code2').focus()
    },
    code2 (val) {
      console.log(val)
      document.getElementById('code3').focus()
    },
    code3 (val) {
      console.log(val)
      document.getElementById('code4').focus()
    },
    code4 (val) {
      this.mobileCode = this.code1 + this.code2 + this.code3 + this.code4
      this.checkCode()
      console.log(val)
    }
  },
  components: {}
}
</script>

<style>
  body {
    background: #FFFFFF;
  }
</style>
