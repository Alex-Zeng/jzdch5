<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
        <div>
          修改绑定手机
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <div class="settings-form">
        <ul>
          <li>
            <div>
              <input type="text" name="oldCode" v-validate="'required'" v-model="oldCode" class="has-button" placeholder="请输入短信验证码"/>
              <button v-if="!disabled" @click="getCode">获取</button>
              <button v-if="disabled" class="disabled">{{time}}s后重新发送</button>
            </div>
            <i v-show="errors.has('oldCode')" class="fa fa-warning"></i>
            <span v-show="errors.has('oldCode')" class="help is-danger">请填写验证码</span>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="next">下一步</button>
      </div>
      <div class="settings-form">
        <ul>
          <li>
            <div>
              <input type="text" name="phone" v-validate="'required|phone'" v-model="phone" class="has-button" placeholder="请输入短信验证码"/>
            </div>
          </li>
          <li>
            <div>
              <input type="text" name="oldCode" v-validate="'required'" v-model="oldCode" class="has-button" placeholder="请输入短信验证码"/>
              <button v-if="!disabled" @click="getCode">获取</button>
              <button v-if="disabled" class="disabled">{{time}}s后重新发送</button>
            </div>
            <i v-show="errors.has('oldCode')" class="fa fa-warning"></i>
            <span v-show="errors.has('oldCode')" class="help is-danger">请填写验证码</span>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="next">下一步</button>
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
      disabled: false,
      oldCode: '',
      time: 59
    }
  },
  methods: {
    getCode () {
      this.disabled = !this.disabled
      this.setTimeMethods()
      axios.get('api/code/oldPhoneSend').then((response) => {
        if (response.data.status === 0) {
        }
      }).catch((resposne) => {
        this.errorMsg()
      })
    },
    next () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/code/oldPhoneValid', {
            'code': this.oldCode
          }).then((response) => {
            if (response.data.status === 0) {
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
    setTimeMethods () {
      var self = this
      var setTime = null
      setTime = setInterval(move, 1000)
      function move () {
        if (self.time > 0) {
          --self.time
        } else {
          // _sel.setTimeOut = false
          // _sel.resetCode = true
          self.disabled = !self.disabled
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
  }
}
</script>

<style scoped>

</style>
