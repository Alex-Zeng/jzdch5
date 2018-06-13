<template>
  <div class="footer-nav">
    <router-link to="/">
      <i class="icon iconfont icon-shouye1"></i>
      <div>首页</div>
    </router-link>
    <router-link to="/goods-class">
      <i class="icon iconfont icon-fenlei2"></i>
      <div>分类</div>
    </router-link>
    <router-link v-if="shopCard" to="/shop-card">
      <i class="icon iconfont icon-gouwuche2">
        <badge text="9"></badge>
      </i>
      <div>采购清单</div>
    </router-link>
    <router-link to="/user">
      <i class="icon iconfont icon-wode"></i>
      <div>我的</div>
    </router-link>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'footer-nav',
  data () {
    return {
      shopCard: false
    }
  },
  methods: {
  },
  created () {
    let loginToken = sessionStorage.getItem('loginToken')
    if (loginToken !== null) {
      axios.get('api/user/getGroup').then((response) => {
        if (response.data.status === 0) {
          console.log(response.data.status)
          axios.get('api/mall_cart/getNumber').then((response) => {
            console.log(response.data.status)
            if (response.data.status === -2) {
              // this.$router.push('/login')
              this.shopCard = false
            } else if (response.data.status === 0) {
              this.shopCard = true
            } else {
              this.shopCard = false
            }
          }).catch((response) => {
          })
        }
      }).catch((response) => {
      })
    } else {
      this.shopCard = false
    }
  }
}
</script>

<style scoped>

</style>
