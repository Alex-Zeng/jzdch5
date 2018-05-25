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
    <router-link to="/shop-card">
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
export default {
  name: 'footer-nav'
}
</script>

<style scoped>

</style>
