<template>
  <div>
    <router-view/>
  </div>
</template>

<script>
import '@/assets/css/shop-car.css'
export default {
  name: 'shop-car-template',
  created () {
    window.scrollTo(0, 0)
    if (sessionStorage.getItem('loginToken') === null) {
      this.$router.push('/loginByCode')
    }
  }
}
</script>

<style scoped>

</style>
