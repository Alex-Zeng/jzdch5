<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
        <div>
          修改绑定手机
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <div class="settings-form" v-show="showModel0">
        <ul>
          <li>
            <div>
              <input type="text" name="oldCode" v-validate="'required'" minlength="4" maxlength="4" v-model="oldCode" class="has-button" placeholder="请输入短信验证码"/>
              <button v-if="!disabled1" @click="getCode('api/code/oldPhoneSend',1)">获取</button>
              <button v-if="disabled1" class="disabled">{{time}}s后重新发送</button>
            </div>
            <i v-show="errors.has('oldCode')" class="fa fa-warning"></i>
            <span v-show="errors.has('oldCode')" class="help is-danger">请填写验证码</span>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="next">下一步</button>
      </div>
      <div class="settings-form" v-show="showModel1">
        <ul>
          <li>
            <div>
              <input type="text" name="手机号" v-model="phone" v-validate="'required|phone'" placeholder="请输入手机号码"/>
            </div>
            <i v-show="errors.has('手机号')" class="fa fa-warning"></i>
            <span v-show="errors.has('手机号')" class="help is-danger">{{ errors.first('手机号') }}</span>
          </li>
          <li>
            <div>
              <input title="验证码" name="验证码" v-model="verificationCode" v-validate="'required|verificationCode'" type="text" maxlength="4" class="has-button" placeholder="请输入右侧验证码"/>
              <img class="img-code" @click="getImgCode" :src="imgCodeSrc">
            </div>
            <i v-show="errors.has('验证码')" class="fa fa-warning"></i>
            <span v-show="errors.has('验证码')" class="help is-danger">{{ errors.first('验证码') }}</span>
          </li>
          <li>
            <div>
              <input type="text" name="newCode" v-model="newCode" v-validate="'required'" class="has-button" placeholder="请输入短信验证码"/>
              <button v-if="!disabled2" @click="getCode('api/code/newPhoneSend',2)">获取</button>
              <button v-if="disabled2" class="disabled">{{time}}s后重新发送</button>
            </div>
            <i v-show="errors.has('newCode')" class="fa fa-warning"></i>
            <span v-show="errors.has('newCode')" class="help is-danger">请填写验证码</span>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="submit">下一步</button>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'phone',
  data () {
    return {
      mobileCode: '',
      disabled1: false,
      disabled2: false,
      oldCode: '',
      phone: '',
      newCode: '',
      id: '',
      imgCodeSrc: '',
      verificationCode: '',
      time: 59,
      showModel0: true,
      showModel1: false,
      showModel2: false,
      showModel3: false
    }
  },
  methods: {
    getCode (url, i) {
      if (i === 1) {
        this.disabled1 = !this.disabled1
      }
      if (i === 2) {
        this.disabled2 = !this.disabled2
      }
      this.setTimeMethods(i)
      axios.get(url).then((response) => {
        if (response.data.status === 0) {
        }
      }).catch((resposne) => {
        this.errorMsg()
      })
    },
    next () {
      this.$validator.attach('oldCode', 'required')
      this.$validator.validate('oldCode', this.oldCode).then((result) => {
        if (result) {
          axios.post('api/code/oldPhoneValid', {
            'code': this.oldCode
          }).then((response) => {
            if (response.data.status === 0) {
              this.showModel0 = false
              this.showModel1 = true
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
          }).catch((resposne) => {
            this.errorMsg()
          })
          return
        }
        console.log('Correct them errors!')
      })
    },
    getImgCode () {
      axios.get('api/captcha/img').then((response) => {
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
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/user/bind', {
            'phone': this.phone,
            'code': this.verificationCode,
            'id': this.id,
            'oldCode': this.oldCode,
            'newCode': this.newCode
          }).then((response) => {
            let self = this
            if (response.data.status === 0) {
              this.$vux.toast.show({
                type: 'warn',
                text: '修改成功',
                onShow () {
                  console.log('Plugin: I\'m showing')
                },
                onHide () {
                  self.$router.push('/safety')
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
          }).catch((resposne) => {
            this.errorMsg()
          })
          return
        }
        console.log('Correct them errors!')
      })
    },
    setTimeMethods (i) {
      var self = this
      var setTime = null
      setTime = setInterval(move, 1000)
      function move () {
        if (self.time > 0) {
          --self.time
        } else {
          // _sel.setTimeOut = false
          // _sel.resetCode = true
          if (i === 1) {
            self.disabled1 = !self.disabled1
          }
          if (i === 2) {
            self.disabled2 = !self.disabled2
          }
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
  created () {
    this.getImgCode()
  }
}
</script>

<style scoped>

</style>
