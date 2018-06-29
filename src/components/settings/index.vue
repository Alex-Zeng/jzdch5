<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
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
        <cell is-link link="/select-enterprise">
          <span slot="title">
              <span style="vertical-align:middle;">企业认证</span>
            </span>
        </cell>
        <cell is-link link="/safety">
          <span slot="title">
                <span style="vertical-align:middle;">安全设置</span>
            </span>
        </cell>
        <cell is-link link="/shop-car">
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
import {Cell, CellBox, Group} from 'vux'
import '@/assets/css/settings.css'
export default {
  name: 'index',
  methods: {
    loginOut () {
      document.cookie = '_token='
      sessionStorage.clear()
      this.$router.push('/')
    }
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
