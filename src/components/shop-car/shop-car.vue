<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        采购清单
      </div>
      <div style="padding-right: 0.5rem">
        管理
      </div>
    </div>
    <div class="shop-car-container">
      <div class="shller-title">
        <check-icon :value.sync="demo1">
          <i class="icon iconfont icon-daifukuan"></i> 广东津晶电器有限责任公司
        </check-icon>
      </div>
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="(item, index) in lists" :key="index">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('delete')" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="shop-car-content">
            <check-icon :value.sync="demo2">
            </check-icon>
            <div>
              <img :src="item.icon" alt="">
              <div>
                <h3>{{item.title}}</h3>
                <div class="text-muted">产品规格描述</div>
                <span class="text-red">￥ {{item.price}}</span>
                <inline-x-number width="50px" :min="0"></inline-x-number>
              </div>
            </div>

          </div>
        </swipeout-item>
      </swipeout>
    </div>
    <div class="shop-car-total">
      <div>
        合计：
        <span class="text-red">88.88</span>
      </div>
      <div>
        去结算
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, CheckIcon } from 'vux'
import '@/assets/css/shop-car.css'
export default {
  name: 'shop-car',
  data () {
    return {
      demo1: false,
      demo2: false,
      demo3: false,
      lists: [
        {
          'goodsId': 10,
          'cartId': 62,
          'price': '20.00',
          'title': '测试压缩机',
          'icon': 'http:\/\/192.168.3.101\/program\/mall\/img_thumb\/2018_04\/23\/1524475233_0_6137.jpg',
          'quantity': 136
        },
        {
          'goodsId': 12,
          'cartId': 64,
          'price': '30.00',
          'title': '插头系列-KJ-126(美式极性插)',
          'icon': 'http:\/\/192.168.3.101\/program\/mall\/img_thumb\/2018_04\/24\/1524535351_0_9369.jpg',
          'quantity': 132
        }
      ]
    }
  },
  methods: {
    onButtonClick (type) {
      alert('on button click ' + type)
    },
    handleEvents (type) {
      console.log('event: ', type)
    },
    getLists () {
      axios.get('api/mall_cart/index&_token=' + sessionStorage.getItem('loginToken')).then((response) => {
        if (response.data.status === 0) {

        }
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
  created () {
    this.getLists()
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    InlineXNumber,
    CheckIcon
  }
}
</script>

<style scoped>

</style>
