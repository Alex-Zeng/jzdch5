<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        消息中心
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <tab :line-width=2 active-color='#5FCAED' v-model="index">
      <tab-item class="vux-center" :selected="selectedDeafult === item" v-for="(item, index) in list2" @click="selectedDeafult = item" :key="index">{{item}}</tab-item>
    </tab>
    <swiper v-model="index" :show-dots="false">
      <swiper-item>
        <div class="tab-swiper vux-center">111 Container</div>
      </swiper-item>
      <swiper-item>
        <div class="tab-swiper vux-center">2322 Container</div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Tab, TabItem, Sticky, Swiper, SwiperItem } from 'vux'
import MeScroll from '../../../static/js/mescroll.min.js'
import 'mescroll.js/mescroll.min.css'
export default {
  name: 'message',
  data () {
    return {
      selectedDeafult: '我的消息',
      list2: ['我的消息', '公告'],
      index: 0
    }
  },
  components: {
    MeScroll,
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem
  }
}
</script>

<style scoped>

</style>
