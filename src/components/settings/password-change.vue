<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        修改密码
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div class="settings-form">
      <ul>
        <li>
          <div>
            <input :type="typePassword" name="旧密码" v-model="oldPassword" v-validate="'required'"  placeholder="请输入旧密码"/>
          </div>
          <i v-show="errors.has('旧密码')" class="fa fa-warning"></i>
          <span v-show="errors.has('旧密码')" class="help is-danger">{{ errors.first('旧密码') }}</span>
          <i :class="[isTure1 ? 'icon-mimabukejian': 'icon-mimakejian', 'icon iconfont']" @click="togglePassword(1)"></i>
        </li>
        <li>
          <div>
            <input :type="typeConfirmPassword" name="新密码" v-model="newPassword" v-validate="'required|verificationPassword'" placeholder="密码为6-20位字母及数字的组合"/>
          </div>
          <i v-show="errors.has('新密码')" class="fa fa-warning"></i>
          <span v-show="errors.has('新密码')" class="help is-danger">{{ errors.first('新密码') }}</span>
          <i :class="[isTure2 ? 'icon-mimabukejian': 'icon-mimakejian', 'icon iconfont']" @click="togglePassword(2)"></i>
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="submit">下一步</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'passdword-change',
  data () {
    return {
      typePassword: 'password',
      typeConfirmPassword: 'password',
      oldPassword: '',
      newPassword: '',
      isTure1: true,
      isTure2: true
    }
  },
  methods: {
    togglePassword (i) {
      if (i === 1) {
        if (this.typePassword === 'password') {
          this.typePassword = 'text'
          this.isTure1 = false
        } else {
          this.typePassword = 'password'
          this.isTure1 = true
        }
      }
      if (i === 2) {
        if (this.typeConfirmPassword === 'password') {
          this.typeConfirmPassword = 'text'
          this.isTure2 = false
        } else {
          this.typeConfirmPassword = 'password'
          this.isTure2 = true
        }
      }
    },
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          let self = this
          axios.post('api/user/updatePassword', {
            'oldPassword': this.oldPassword,
            'newPassword': this.newPassword
          }).then((response) => {
            if (response.data.status === 0) {
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
          // return
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
  }
}
</script>

<style scoped>

</style>
