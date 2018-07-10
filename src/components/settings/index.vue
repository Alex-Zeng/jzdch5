<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" @click="back"></i>
        <div>
          设置中心
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <group>
        <cell is-link link="/address-lists">
          <span slot="title">
                <span style="vertical-align:middle;">收货地址管理</span>
            </span>
        </cell>
        <cell v-if="!enterprise" is-link link="/select-enterprise">
          <span slot="title">
              <span style="vertical-align:middle;">企业认证</span>
            </span>
        </cell>
        <cell v-if="enterprise" is-link link="/enterprise">
          <span slot="title">
              <span style="vertical-align:middle;">企业信息变更</span>
            </span>
        </cell>
        <cell is-link link="/safety">
          <span slot="title">
                <span style="vertical-align:middle;">安全设置</span>
            </span>
        </cell>
        <cell is-link link="/other">
          <span slot="title">
              <span style="vertical-align:middle;">其他设置</span>
            </span>
        </cell>
      </group>
      <div class="login-out">
        <button type="button" class="btn btn-primary login-out" @click="loginOut">退出登录</button>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import {Cell, CellBox, Group} from 'vux'
import '@/assets/css/settings.css'
export default {
  name: 'index',
  data () {
    return {
      enterprise: false
    }
  },
  methods: {
    loginOut () {
      document.cookie = '_token='
      sessionStorage.clear()
      this.$router.push('/')
    },
    back () {
      this.$router.replace('/user')
    },
    getCertification () {
      let self = this
      axios.get('api/user/getCertification').then((response) => {
        if (response.data.status === 0) {
          if (response.data.data) {
            const {status, agentIdentityCard, role} = response.data.data
            if (status === '1' || status === '3' || status === '2') {
              this.enterprise = true
              sessionStorage.setItem('userType', role === '采购商' ? 1 : 2)
              sessionStorage.setItem('agent', agentIdentityCard ? 0 : 1)
              sessionStorage.setItem('certStatus', 1)
            }
          }
        } else if (response.data.status === -2) {
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未登录，是否去登录？',
            onCancel () {},
            onConfirm () {
              sessionStorage.removeItem('oldUrl')
              sessionStorage.setItem('oldUrl', self.$route.path)
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
    this.getCertification()
  },
  components: {
    Cell,
    CellBox,
    Group
  }
}
</script>

<style scoped>

</style>
