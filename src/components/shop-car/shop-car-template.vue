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
    if (sessionStorage.getItem('loginToken') === null) {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>

</style>
