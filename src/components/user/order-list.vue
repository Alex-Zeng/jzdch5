<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        我的订单
      </div>
      <div @click="showSelect">全部<i class="icon iconfont icon-xiala-" style="padding-right: 1rem;font-size: 0.45rem !important;">
      </i></div>
    </div>
    <div v-show="show" class="menu-wrap">
      <ul class="menu-list">
        <li class="item" @click="state=-1">全部</li>
        <li class="item" @click="state=0">待核价</li>
      </ul>
      <ul class="menu-list">
        <li class="item" @click="state=1">待签约</li>
        <li class="item" @click="state=3">待发货</li>
      </ul>
      <ul class="menu-list">
        <li class="item" @click="state=6">待收货</li>
        <li class="item" @click="state=9">账期中</li>
      </ul>
      <ul class="menu-list">
        <li class="item" @click="state=13">交易完成</li>
        <li class="item" @click="state=8">售后处理</li>
      </ul>
    </div>

    <div class="order-wrap" v-show="!show">
      <div class="order-card" v-for="i in list" :key="i.id">
        <div class="indent-title">
          {{i.companyName}}
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
  </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea, XButton } from 'vux'
import '@/assets/css/order.css'
export default {
  name: 'notice-detail',
  data () {
    return {
      list: [],
      show: false,
      state: -1
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    showSelect () {
      this.show = true
    },
    gotoDetail (no) {
      this.$router.push('/order-detail/' + no)
    },
    getList () {
      axios.post('api/order/getList', {state: this.state}).then((response) => {
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
    XButton
  }
}
</script>

<style scoped>
.menu-wrap{
  margin-top: 4.8rem;
}

.menu-list{
  display: flex;
  width: 100%;
}
.menu-list .item{
  flex: 1;
  flex-basis: 50%;
  text-align: center;
  margin: .8rem 1.2rem;
  padding: 0.2rem 0;
  line-height: 1.8;
  background-color: #5fcaed;
  color: #ffffff;
  border-radius: 0.28rem;
  font-size: 0.8rem;
}
</style>
