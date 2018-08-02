<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        修改邮箱
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div class="settings-form" v-show="showModel0">
      <ul>
        <li>
          <div>
            <input type="text" name="oldCode" v-validate="'required'" v-model="oldCode" maxlength="4" class="has-button" placeholder="请输入邮箱验证码"/>
            <button v-if="!disabled1" @click="sendCode()">获取</button>
            <button v-if="disabled1" class="disabled">{{time1}}s后重新发送</button>
          </div>
          <i v-show="errors.has('oldCode')" class="fa fa-warning"></i>
          <span v-show="errors.has('oldCode')" class="help is-danger">请填写验证码</span>
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="next">下一步</button>
    </div>
    <div class="settings-form" v-if="showModel1">
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
            <input type="text" name="newCode" v-validate="'required'" v-model="newCode" maxlength="4" class="has-button" placeholder="请输入短信验证码"/>
            <button v-if="!disabled2" @click="getCode()">获取</button>
            <button v-if="disabled2" class="disabled">{{time2}}s后重新发送</button>
          </div>
          <i v-show="errors.has('newCode')" class="fa fa-warning"></i>
          <span v-show="errors.has('newCode')" class="help is-danger">请填写验证码</span>
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'email-change',
  data () {
    return {
      hasEmail: false,
      disabled1: false,
      disabled2: false,
      code: '',
      oldCode: '',
      newEmail: '',
      email: '',
      newCode: '',
      id: '',
      imgCodeSrc: '',
      verificationCode: '',
      time1: 59,
      time2: 59,
      showModel0: true,
      showModel1: false,
      showModel2: false,
      showModel3: false
    }
  },
  methods: {
    getCode () {
      axios.post('api/email/sendNew', {
        'email': this.email,
        'channel': 1
      }).then((response) => {
        if (response.data.status == 0) {
          this.setTimeMethods(2)
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
    sendCode () {
      axios.post('api/email/send', {
      }).then((response) => {
        if (response.data.status == 0) {
          this.setTimeMethods(1)
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
    next () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/email/valid', {
            'code': this.oldCode
          }).then((response) => {
            if (response.data.status == 0) {
              this.showModel0 = false
              this.showModel1 = true
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
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let self = this
          axios.post('api/user/updateEmail', {
            'email': this.email,
            'code': this.oldCode,
            'newCode': this.newCode
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
    setTimeMethods (i) {
      var self = this
      if (i == 1) {
        self.time1 = 59
        self.disabled1 = !self.disabled1
        var setTime1 = null
        setTime1 = setInterval(move1, 1000)
      }
      function move1 () {
        if (self.time1 > 0) {
          --self.time1
        } else {
          clearInterval(setTime1)
          self.disabled1 = !self.disabled1
        }
      }
      if (i == 2) {
        self.time2 = 59
        self.disabled2 = !self.disabled2
        var setTime2 = null
        setTime2 = setInterval(move2, 1000)
      }
      function move2 () {
        if (self.time2 > 0) {
          --self.time2
        } else {
          clearInterval(setTime2)
          self.disabled2 = !self.disabled2
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
