<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        设置密码
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div class="settings-form" v-if="!hasPassword">
      <ul>
        <li>
          <div>
            <input :type="typePassword" name="password" v-validate="'required|verificationPassword'" v-model="password" minlength="6" maxlength="20" placeholder="密码为6-20位字母及数字的组合"/>
            <i :class="[isTure1 ? 'icon-mimabukejian': 'icon-mimakejian', 'icon iconfont']" @click="togglePassword(1)"></i>
          </div>
          <i v-show="errors.has('密码')" class="fa fa-warning"></i>
          <span v-show="errors.has('密码')" class="help is-danger">{{ errors.first('密码') }}</span>
        </li>
        <li>
          <div>
            <input :type="typeConfirmPassword" name="confirmPassword" v-validate="'required|verificationPassword|confirmed:password'" v-model="confirmPassword" minlength="6" maxlength="20" placeholder="请再次输入"/>
            <i :class="[isTure2 ? 'icon-mimabukejian': 'icon-mimakejian', 'icon iconfont']" @click="togglePassword(2)"></i>
          </div>
          <i v-show="errors.has('确认密码')" class="fa fa-warning"></i>
          <span v-show="errors.has('确认密码')" class="help is-danger">{{ errors.first('确认密码') }}</span>
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="submit">下一步</button>
    </div>
    <div class="settings-form" v-if="hasPassword">
      <ul>
        <li>
          <div>
            <input :type="typePassword" name="oldPassword" v-model="oldPassword" v-validate="'required'" minlength="6" maxlength="20" placeholder="请输入旧密码"/>
            <i :class="[isTure1 ? 'icon-mimabukejian': 'icon-mimakejian', 'icon iconfont']" @click="togglePassword(1)"></i>
          </div>
          <i v-show="errors.has('旧密码')" class="fa fa-warning"></i>
          <span v-show="errors.has('旧密码')" class="help is-danger">{{ errors.first('旧密码') }}</span>
        </li>
        <li>
          <div>
            <input :type="typeConfirmPassword" name="newPassword" v-validate="'required|verificationPassword'" minlength="6" maxlength="20" placeholder="密码为6-20位字母及数字的组合"/>
            <i :class="[isTure2 ? 'icon-mimabukejian': 'icon-mimakejian', 'icon iconfont']" @click="togglePassword(2)"></i>
          </div>
          <i v-show="errors.has('新密码')" class="fa fa-warning"></i>
          <span v-show="errors.has('新密码')" class="help is-danger">{{ errors.first('新密码') }}</span>
        </li>
      </ul>
      <button type="button" class="btn btn-primary" @click="submitNewpassword">下一步</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'passdword',
  data () {
    return {
      typePassword: 'password',
      typeConfirmPassword: 'password',
      password: '',
      confirmPassword: '',
      oldPassword: '',
      newPassword: '',
      isTure1: true,
      isTure2: true,
      hasPassword: true
    }
  },
  methods: {
    initialize () {
      axios.get('api/user/getPasswordStatus').then((response) => {
        if (response.data.status === 0) {
          if (response.data.data.password === 0) {
            this.hasPassword = false
          } else if (response.data.data.password === 1) {
            this.hasPassword = true
          }
        } else if (response.data.status === -2) {
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未登录，是否去登录？',
            onCancel () {},
            onConfirm () {
              self.$router.push('/loginByCode')
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
    },
    submit () {
      this.$validator.attach('密码', 'required|verificationPassword')
      this.$validator.attach('确认密码', 'required|verificationPassword|confirmed:password')
      this.$validator.validateAll({'密码': this.password, '确认密码': this.confirmPassword}).then((result) => {
        if (result) {
          axios.post('api/user/initPasswordd', {
            'password': this.password,
            'confirmPassword': this.confirmPassword
          }).then((response) => {
            if (response.data.status === 0) {} else {
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
    submitNewpassword () {
      this.$validator.attach('旧密码', 'required')
      this.$validator.attach('新密码', 'required|verificationPassword')
      this.$validator.validateAll({'旧密码': this.oldPassword, '新密码': this.newPassword}).then((result) => {
        if (result) {
          axios.post('api/user/updatePassword', {
            'oldPassword': this.oldPassword,
            'newPassword': this.newPassword
          }).then((response) => {
            if (response.data.status === 0) {} else {
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
