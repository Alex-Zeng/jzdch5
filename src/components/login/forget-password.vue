<template>
  <div style="background: #FFFFFF;">
    <template v-if="model1Show">
      <div class="login-top">
        <i class="icon iconfont icon-guanbi" onclick="history.go(-1)"></i>
        <!--<router-link to="/login">账号密码登录</router-link>-->
      </div>
      <form class="form" action="">
        <ul>
          <li>
            <div class="text-muted form-title">
              找回密码
            </div>
          </li>
          <li>
            <i :class="{'is-danger': errors.has('mobile')}"></i>
            <div class="cells">
              <label for="">+86</label>
              <input name="mobile" v-model="mobile" v-validate="'required|phone'" placeholder="请输入注册手机号"/>
            </div>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="getImgCode">下一步</button>
      </form>
    </template>
    <template  v-if="model2Show">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
      </div>
      <form action="" class="form">
        <ul>
          <li>
            <div class="text-muted form-title">
              找回密码
            </div>
          </li>
          <li>
            <div class="cells">
              <input title="验证码" name="code" required maxlength="5" v-model="verificationCode" placeholder="请输入右侧验证码"/>
            </div>
            <img class="img-code" @click="getImgCode" :src="imgCodeSrc">
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="getMobileCode(1)">下一步</button>
      </form>
    </template>
    <template v-if="model3Show">
      <div class="login-top">
        <i class="icon iconfont icon-back" @click="back"></i>
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
    <template v-if="model4Show">
      <div class="login-top"></div>
      <form class="form" action="" method="post">
          <input type="text" class="border-input" name="password" minlength="4" maxlength="20" required v-model="password" placeholder="请设置4-20位密码">
          <input type="text" class="border-input" name="confirmPassword" minlength="4" maxlength="20" required v-model="confirmPassword" placeholder="请再次输入密码">
        <button type="button" class="btn btn-primary" @click="submit">提交</button>
      </form>
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
            console.log(response)
            if (response.data.status === 0) {
              this.model2Show = true
              this.model1Show = false
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
          return
        }
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写注册手机号',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      })
    },
    getMobileCode (val) {
      axios.post('api/code/passwordSend', {
        'phone': this.mobile,
        'code': this.verificationCode,
        'codeValid': val,
        'id': this.id
      }).then((response) => {
        if (response.data.status === 0) {
          console.log(response)
          this.model1Show = false
          this.model2Show = false
          this.model3Show = true
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
    },
    checkCode () {
      axios.post('api/password/checkCode', {
        'phone': this.mobile,
        'code': this.mobileCode
      }).then((response) => {
        if (response.data.status === 0) {
          console.log(this.mobileCode)
          this.model1Show = false
          this.model2Show = false
          this.model3Show = false
          this.model4Show = true
          // 响应成功回调
          console.log('success')
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
    },
    submit () {
      var _sel = this
      axios.post('api/password/update', {
        'phone': this.mobile,
        'code': this.mobileCode,
        'password': this.password,
        'confirmPassword': this.confirmPassword
      }).then((response) => {
        if (response.data.status === 0) {
          console.log(response)
          this.$vux.toast.show({
            type: 'success',
            text: '密码修改成功',
            onShow () {
              console.log('Plugin: I\'m showing')
              // 响应成功回调
              console.log('success')
              sessionStorage.clear()
            },
            onHide () {
              console.log('Plugin: I\'m hiding')
              _sel.$router.push('/login')
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
  components: {}
}
</script>

<style>
  body {
    background: #FFFFFF;
  }
</style>
