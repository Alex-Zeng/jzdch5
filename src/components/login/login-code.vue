<template>
  <div>
    <template v-if="modelShow">
      <div class="login-top">
        <i class="icon iconfont icon-guanbi" onclick="history.go(-1)"></i>
        <router-link to="/login">账号密码登录</router-link>
      </div>
      <form class="form" action="">
        <ul>
          <li>
            <div class="cells">
              <label for="">+86</label>
              <input name="mobile" required v-model="mobile" placeholder="填写手机号码，未注册用户也可直接登录"
                     keyboard="number"/>
            </div>
          </li>
          <li>
            <div class="cells">
              <input title="验证码" name="code" required maxlength="5" v-model="verificationCode" placeholder="请输入右侧验证码"/>
              <img class="img-code" @click="getImgCode" :src="imgCodeSrc">
            </div>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="getMobileCode(1)">下一步</button>
      </form>
    </template>
    <template v-if="!modelShow">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
        <router-link to="/login">账号密码登录</router-link>
      </div>
      <form class="form" action="">
        <div class="text-gray">短信验证码已发送至 {{mobile}}</div>
        <div class="code-input-box" @click="focusInput">
          <input type="number" id="code1" v-model="code1" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code2" v-model="code2" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code3" v-model="code3" oninput="if(value.length>1)value=value.slice(0,1)">
          <input type="number" id="code4" v-model="code4" oninput="if(value.length>1)value=value.slice(0,1)">
        </div>
        <div class="text-gray" v-if="setTimeOut"><span v-text="time"></span>s后重新发送</div>
        <button type="button" class="btn btn-link" @click="getMobileCode(0)" v-if="resetCode">重新发送验证码</button>
      </form>
    </template>
  </div>
</template>
<script>

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
      this.$http.get('api/captcha/img', this.mobile).then((response) => {
        console.log(response)
        if (response.data.status === 0) {
          this.imgCodeSrc = response.data.data.src + '?' + new Date().getTime()
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
      }, (response) => {
        // 响应错误回调
        this.errorMsg()
      })
    },
    getMobileCode (val) {
      this.$http.post('api/code/loginSend', {
        'phone': this.mobile,
        'code': val
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
      }, (response) => {
        // 响应错误回调
        console.log('error')
        this.errorMsg()
      })
    },
    checkCode () {
      this.$http.post('api/login/phone', {
        'phone': this.mobile,
        'code': this.mobileCode
      }).then((response) => {
        if (response.data.status === 0) {
          console.log(this.mobileCode)
          localStorage.setItem('loginToken', response.data.data)
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
      }, (response) => {
        // 响应错误回调
        console.log('error')
        this.errorMsg()
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
