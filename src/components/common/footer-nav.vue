<template>
  <div class="footer-nav">
    <router-link to="/" tag="a">
      <i class="icon iconfont icon-shouye1"></i>
      <div>首页</div>
    </router-link>
    <router-link to="/goods-class" tag="a">
      <i class="icon iconfont icon-fenlei2"></i>
      <div>分类</div>
    </router-link>
    <router-link v-if="shopCard" to="/shop-car" tag="a">
      <i class="icon iconfont icon-gouwuche2">
        <badge :text="total" v-if="total"></badge>
      </i>
      <div>采购清单</div>
    </router-link>
    <router-link to="/user" tag="a">
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
      shopCard: false,
      total: ''
    }
  },
  methods: {
  },
  created () {
    axios.get('api/user/getGroup').then((response) => {
      sessionStorage.removeItem('groupId')
      sessionStorage.setItem('groupId', response.data.data.groupId)
      if (response.data.status === 0 && response.data.data.groupId === 4) {
        axios.get('api/mall_cart/getNumber').then((response) => {
          if (response.data.status === -2) {
            this.shopCard = false
          } else if (response.data.status === 0) {
            this.total = response.data.data.total
            this.shopCard = true
          } else {
            this.shopCard = false
          }
        }).catch((response) => {
        })
      }
    }).catch((response) => {
    })
  },
  mounted () {}
}
</script>

<style scoped>

</style>
