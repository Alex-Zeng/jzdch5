<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        安全设置
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <group>
      <cell is-link :value="phone" link="/safety/phone-change">
          <span slot="title">
              <i class="icon iconfont icon-bianji"></i>
              <span style="vertical-align:middle;">绑定手机</span>
          </span>
      </cell>
      <cell is-link :value="password" :link="passwordLink">
        <span slot="title">
            <i class="icon iconfont icon-bianji"></i>
            <span style="vertical-align:middle;">登录密码</span>
        </span>
      </cell>
      <cell is-link :value="email" :link="emailLink">
        <span slot="title">
            <i class="icon iconfont icon-bianji"></i>
            <span style="vertical-align:middle;">电子邮箱</span>
        </span>
      </cell>
    </group>
  </div>
</template>

<script>
import axios from 'axios'
import {Cell, CellBox, Group, Checklist, XButton} from 'vux'
export default {
  name: 'safety',
  data () {
    return {
      phone: '15010825542',
      password: '',
      email: 'yangxu@jizhongdiancai.com',
      passwordLink: null,
      emailLink: null
    }
  },
  methods: {
    getInfo () {
      axios.get('api/user/getProfile').then((response) => {
        if (response.data.status === 0) {
          this.phone = response.data.data.phone
          this.email = response.data.data.email
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
            text: '网络可能有点问题'
          })
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    initialize () {
      axios.get('api/user/getPasswordStatus').then((response) => {
        if (response.data.status === 0) {
          if (response.data.data.password === 0) {
            this.passwordLink = '/safety/password-setting'
          } else if (response.data.data.password === 1) {
            this.passwordLink = '/safety/password-change'
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
      axios.get('api/user/getEmailStatus').then((response) => {
        if (response.data.data.email === 0) {
          this.emailLink = '/safety/email-setting'
        } else if (response.data.data.email === 1) {
          this.emailLink = '/safety/email-change'
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
    this.getInfo()
    this.initialize()
  },
  components: {
    Cell,
    CellBox,
    Group,
    Checklist,
    XButton
  }
}
</script>

<style scoped>

</style>
