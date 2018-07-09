<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        设置邮箱
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div class="settings-form" v-show="showModel0">
      <template v-if="hasEmail">
        <ul>
          <li>
            <div>
              <input type="text" name="email" v-model="email" v-validate="'required|email'" placeholder="请填写邮箱账号"/>
            </div>
            <i v-show="errors.has('邮箱')" class="fa fa-warning"></i>
            <span v-show="errors.has('邮箱')" class="help is-danger">{{ errors.first('邮箱') }}</span>
          </li>
          <li>
            <div>
              <input type="text" name="code" v-validate="'required'" v-model="code" class="has-button" placeholder="请输入短信验证码"/>
              <button v-if="!disabled1" @click="getCode(hasEmail? 0:1)">获取</button>
              <button v-if="disabled1" class="disabled">{{time}}s后重新发送</button>
            </div>
            <i v-show="errors.has('验证码')" class="fa fa-warning"></i>
            <span v-show="errors.has('验证码')" class="help is-danger">请填写验证码</span>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="submitInit">提交</button>
      </template>
      <template v-if="!hasEmail">
      <ul>
        <li>
          <div>
            <input type="text" name="oldCode" v-validate="'required'" v-model="oldCode" class="has-button" placeholder="请输入短信验证码b"/>
            <button v-if="!disabled1" @click="sendCode()">获取</button>
            <button v-if="disabled1" class="disabled">{{time}}s后重新发送</button>
          </div>
          <i v-show="errors.has('oldCode')" class="fa fa-warning"></i>
          <span v-show="errors.has('oldCode')" class="help is-danger">请填写验证码</span>
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="next">下一步</button>
      </template>
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
            <input type="text" name="newCode" v-validate="'required'" v-model="newCode" class="has-button" placeholder="请输入短信验证码"/>
            <button v-if="!disabled1" @click="getCode(hasEmail? 0:1)">获取</button>
            <button v-if="disabled1" class="disabled">{{time}}s后重新发送</button>
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
  name: 'email',
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
      time: 59,
      showModel0: true,
      showModel1: false,
      showModel2: false,
      showModel3: false
    }
  },
  methods: {
    initialize () {
      axios.get('api/user/getEmailStatus').then((response) => {
        if (response.data.data.email === 0) {
          this.hasEmail = true
        } else if (response.data.data.email === 1) {
          this.hasEmail = false
        } else {
          this.errorMsg()
        }
      })
    },
    getCode (val) {
      this.$validator.attach('邮箱', 'required|email')
      this.$validator.validate('邮箱', this.email).then((result) => {
        if (result) {
          axios.post('api/email/sendNew', {
            'email': this.email,
            'channel': val
          }).then((response) => {
            if (response.data.status === 0) {
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
          return
        }
        console.log('Correct them errors!')
      })
    },
    sendCode () {
      axios.post('api/email/send', {
      }).then((response) => {
        if (response.data.status === 0) {
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
            if (response.data.status === 0) {
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
    submitInit () {
      this.$validator.attach('邮箱', 'required|email')
      this.$validator.attach('验证码', 'required')
      this.$validator.validateAll({'邮箱': this.email, '验证码': this.code}).then((result) => {
        if (result) {
          let self = this
          axios.post('api/user/initEmail', {
            'email': this.email,
            'code': this.code
          }).then((response) => {
            if (response.data.data.email === 0) {
              this.$vux.toast.show({
                type: 'success',
                text: response.data.msg,
                onHide () {
                  self.$router.push('/safety')
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
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let self = this
          axios.post('api/user/updateEmail', {
            'email': this.email,
            'code': this.oldCode,
            'newCode': this.newCode
          }).then((response) => {
            if (response.data.status === 0) {
              this.$vux.toast.show({
                type: 'success',
                text: response.data.msg
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg,
                onHide () {
                  console.log('Plugin: I\'m hiding')
                  self.$router.push('/safety')
                }
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
    this.initialize()
  }
}
</script>

<style scoped>

</style>
