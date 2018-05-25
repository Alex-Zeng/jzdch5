<template>
  <div>
    <search-view></search-view>
    <div class="goods-class">
      <div class="sub-nav"></div>
    </div>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
import FooterNav from '../common/footer-nav'

export default {
  name: 'goods-class',
  components: {
    FooterNav
  }
}
</script>

<style scoped>

</style>
