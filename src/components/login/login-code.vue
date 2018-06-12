<template>
  <div style="background: #FFFFFF;">
    <template v-if="modelShow">
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
    <template v-if="!modelShow">
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
        <button type="button" class="btn btn-link" v-if="resetCode">重新发送验证码</button>
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
      verificationCode: '',
      modelShow: true,
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
            'codeValid': val
          }).then((response) => {
            if (response.data.status === 0) {
              console.log(response)
              this.modelShow = false
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
