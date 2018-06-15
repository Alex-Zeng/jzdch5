<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, Icon, Checklist, CheckIcon } from 'vux'
import '@/assets/css/shop-car.css'
export default {
  name: 'shop-car-template',
  data () {
    return {}
  },
  methods: {},
  created () {},
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    InlineXNumber,
    Icon,
    Checklist,
    CheckIcon
  }
}
</script>

<style scoped>

</style>
