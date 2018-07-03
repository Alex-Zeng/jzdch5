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
      <cell is-link :value="phone" link="/safety/phone">
          <span slot="title">
              <i class="icon iconfont icon-bianji"></i>
              <span style="vertical-align:middle;">绑定手机</span>
          </span>
      </cell>
      <cell is-link :value="password" link="/safety/password">
        <span slot="title">
            <i class="icon iconfont icon-bianji"></i>
            <span style="vertical-align:middle;">登录密码</span>
        </span>
      </cell>
      <cell is-link :value="email" link="/safety/email">
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
      email: 'yangxu@jizhongdiancai.com'
    }
  },
  methods: {
    getInfo () {
      axios.get('api/user/getInfo').then((response) => {
        if (response.data.status === 0) {
          this.phone = response.data.phone
          this.email = response.data.email
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
