<template>
  <div>
    <router-view @children-selected="getSelected" :lists="lists"></router-view>
  </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, Icon, Checklist, CheckIcon } from 'vux'
import '@/assets/css/shop-car.css'
export default {
  name: 'shop-car-template',
  data () {
    return {
      lists: [],
      num: 654
    }
  },
  methods: {
    getSelected (data) {
      this.lists = data
      console.log(this.lists)
    }
  },
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
