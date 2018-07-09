<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        我的订单
      </div>
      <div>&emsp;</div>
    </div>
    <div class="order-wrap" v-cloak>
      <div class="order-card">
        <div class="indent-title">
          {{data.companyName}}
        </div>
        <div class="orderNo">订单号：{{data.orderNo}} <span>状态：{{getState(data.state)}}</span></div>
        <div slot="content" class="indent-content" v-for="(good, key) in data.goods" :key="key">
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
      </div>

      <div class="order-card addr">
        <b style="margin-right: 0.25rem;">{{data.name}}</b><b>{{data.phone}}</b>
        <div class="detail">{{data.address}}</div>
      </div>

      <div class="order-card info">
        <div class="item">
          <span class="label">下单时间</span><span class="value">{{data.time}}</span>
        </div>
        <div class="item">
          <span class="label">支付方式</span><span class="value">{{data.payMethod}}</span>
        </div>
        <div class="line">
        </div>
        <div class="item">
          <span class="label">交货期</span><span class="value">{{data.date}}</span>
        </div>

        <div class="item">
          <span class="label">备注</span><span class="value">{{data.remark}}</span>
        </div>
        <div class="line"></div>
        <div v-if="data.groupId === 5">
          <div class="item"><b style="color: #222222;">填写发货信息</b></div>
          <Group>
            <XInput title="运单号"></XInput>
            <XInput title="物流公司"></XInput>
            <XInput title="发货日期"></XInput>
            <XInput title="预计到达"></XInput>
          </Group>
          <div class="item">
            <button type="button" class="btn btn-primary">提交</button>
          </div>
        </div>
        <div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XButton, XInput } from 'vux'
import '@/assets/css/order.css'
export default {
  name: 'notice-detail',
  data () {
    return {
      data: {},
      infoBody: []
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {
    getState (state) {
      switch (state) {
        case 0:
          return '待核价'
        case 1:
          return '待签约'
        case 2:
          return '待采购商打款'
        case 3:
          return '待发货'
        case 4:
          return '订单关闭'
        case 6:
          return '待收货'
        case 7:
          return '待质检'
        case 8:
          return '问题确认中'
        case 9:
          return '账期中'
        case 10:
          return '逾期中'
        case 11:
          return '待打款至供应商'
        case 13:
          return '交易完成'
      }
    },
    getDetail () {
      const {params: { no }} = this.$route
      axios.post('api/order/detail', {no}).then((response) => {
        this.data = response.data.data
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
    XButton,
    XInput
  }
}
</script>

<style scoped>

</style>
