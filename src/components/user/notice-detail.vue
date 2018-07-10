<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        公告详情
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div class="notice-detail">
      <h3>{{detail.title}}</h3>
      <div v-html="detail.content">
      </div>
      <p class="footer">集众电采</p>
      <p class="footer">{{detail.release_time}}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'notice-detail',
  data () {
    return {
      detail: null
    }
  },
  mounted () {
  },
  created () {
    axios.get('api/user/getNoticeInfo&id=' + this.$route.params.id).then((response) => {
      this.detail = response.data.data
    }).catch((response) => {
      this.errorMsg()
    })
  },
  errorMsg () {
    this.$vux.toast.show({
      type: 'warn',
      text: '网络可能有点问题',
      onShow () {
        console.log('Plugin: I\'m showing')
      },
      onHide () {
        console.log('Plugin: I\'m hiding')
      }
    })
  }
}
</script>

<style scoped>

</style>
