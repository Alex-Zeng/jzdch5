<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        我的订单
      </div>
      <div>&emsp;</div>
    </div>
    <div class="order-wrap">
      <div class="order-card" v-for="i in list" :key="i.id">
        <div class="indent-title">
          {{i.supplier}}
        </div>
        <swipeout>
          <swipeout-item transition-mode="follow" class="order-item" v-for="(good, key) in i.goods" :key="key">
            <div slot="right-menu">
              <swipeout-button type="warn"><i class="icon iconfont icon-bianji"></i></swipeout-button>
            </div>
            <div slot="content" class="indent-content">
              <img :src="good.icon" alt="">
              <div class="indent-info">
                <h3><router-link to="/">{{good.title}}</router-link></h3>
                <div class="text-muted">商品规格&emsp;{{good.specifications_info}}</div>
                <div class="text-muted" >物料编号&emsp;{{good.specifications_no}}</div>
                <div class="text-muted" >物料规格&emsp;{{good.specifications_name}}</div>
                <div class="text-muted">数量&emsp;{{good.quantity}}&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">{{good.price}}元</span></div>
                <input type="hidden">
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <div class="order-action">
          <div class="order-button" @click="gotoDetail(i.out_id)">查看详情</div>
          <div class="order-button">取消交易</div>
        </div>
      </div>
    </div>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea, XButton } from 'vux'
import FooterNav from '../common/footer-nav'
import '@/assets/css/order.css'
export default {
  name: 'notice-detail',
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    gotoDetail (no) {
      this.$router.push('/order-detail/' + no)
    },
    getList () {
      axios.post('api/order/getList').then((response) => {
        this.list = response.data.data.list
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
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Group,
    Datetime,
    XTextarea,
    XButton,
    FooterNav
  }
}
</script>

<style scoped>

</style>
