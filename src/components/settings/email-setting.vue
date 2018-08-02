<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        设置邮箱
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div class="settings-form">
      <ul>
        <li>
          <div>
            <input type="text" name="邮箱" v-model="email" v-validate="'required|email'" placeholder="请填写邮箱账号"/>
          </div>
          <i v-show="errors.has('邮箱')" class="fa fa-warning"></i>
          <span v-show="errors.has('邮箱')" class="help is-danger">{{ errors.first('邮箱') }}</span>
        </li>
        <li>
          <div>
            <input type="text" name="验证码" v-validate="'required'" v-model="code" class="has-button" placeholder="请输入邮箱验证码"/>
            <button v-if="!disabled1" @click="getCode()">获取</button>
            <button v-if="disabled1" class="disabled">{{time}}s后重新发送</button>
          </div>
          <i v-show="errors.has('验证码')" class="fa fa-warning"></i>
          <span v-show="errors.has('验证码')" class="help is-danger">请填写验证码</span>
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'email-setting',
  data () {
    return {
      hasEmail: false,
      disabled1: false,
      code: '',
      email: '',
      time: 59
    }
  },
  methods: {
    getCode () {
      axios.post('api/email/sendNew', {
        'email': this.email,
        'channel': 0
      }).then((response) => {
        if (response.data.status == 0) {
          this.setTimeMethods()
          this.$vux.toast.show({
            type: 'success',
            text: response.data.msg
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.data.msg
          })
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let self = this
          axios.post('api/user/initEmail', {
            'email': this.email,
            'code': this.code
          }).then((response) => {
            if (response.data.status == 0) {
              this.$vux.toast.show({
                type: 'success',
                text: response.data.msg,
                onHide () {
                  self.$router.replace('/safety')
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg
              })
            }
          }).catch((response) => {
            this.errorMsg()
          })
          return
        }
        console.log('Correct them errors!')
      })
    },
    setTimeMethods () {
      var self = this
      var setTime = null
      self.time = 59
      self.disabled1 = !self.disabled1
      setTime = setInterval(move, 1000)
      function move () {
        if (self.time > 0) {
          --self.time
        } else {
          self.disabled1 = !self.disabled1
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
  }
}
</script>

<style scoped>

</style>
