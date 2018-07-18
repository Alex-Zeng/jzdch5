<template>
  <div class="search"><input type="text" placeholder="搜索您想要的商品" readonly @click="$router.push('/search')"/><a @click="$router.push('/message')"><i class="icon iconfont icon-xiaoxi"><badge :text="message < 99?message: '99+'" v-if="message > 0? true:false" ></badge></i></a></div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'header-message',
  data () {
    return {
      message: ''
    }
  },
  methods: {
    messageNumber () {
      axios.get('api/user/messageNumber').then((response) => {
        if (response.data.status === 0) {
          this.message = response.data.data.total
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
      })
    }
  },
  created () {
    this.messageNumber()
  }
}
</script>

<style scoped>

</style>
