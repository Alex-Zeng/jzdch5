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
      <div v-for="(item, index) in proData" :key="index">
        <div class="shller-title" :key="'list'+index">
          <div>
            <input type="checkbox" :value="item.supplierName" @click="selsectAll('box'+index, $event)">
            <!--<icon type="circle" v-if="!checked"></icon>-->
            <!--<icon type="success" v-if="checked"></icon>-->
          </div>
          <div>{{item.supplierName}}</div>
        </div>
        <div :id="'box'+index">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="i in item.list" :key="i.cartId">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick(i.cartId)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="shop-car-content">
              <div>
                <!--<icon type="circle"></icon>-->
                <input type="checkbox" name="checkbox" class="input" :value="i.cartId" @change="select(i.price*i.quantity, $event)">
                <input type="hidden" name="price" :value="i.price*i.quantity">
              </div>
              <div>
                <img :src="i.icon" alt="">
                <div>
                  <h3>{{i.title}}</h3>
                  <div class="text-muted">{{i.specificationsInfo}}</div>
                  <span class="text-red">￥ {{i.price}}</span>
                  <inline-x-number width="50px" :min="0" v-model="i.quantity" @on-change="change(i.price*i.quantity)"></inline-x-number>
                </div>
              </div>
            </div>
          </swipeout-item>
        </swipeout>
        </div>
      </div>
    </div>
    <div class="shop-car-total">
      <div>
        合计：
        <span class="text-red">{{total}}</span>
      </div>
      <div>
        去结算
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, Icon, Checklist, CheckIcon } from 'vux'
import '@/assets/css/shop-car.css'
export default {
  name: 'shop-car',
  data () {
    return {
      checked: false,
      total: 0,
      price: 0,
      price2: 0,
      proData: []
    }
  },
  methods: {
    onButtonClick (event) {
      axios.post('api/mall_cart/delete', {
        'ids': [event]
      }).then((response) => {}).catch((response) => {})
    },
    getLists () {
      let loginToken = sessionStorage.getItem('loginToken')
      console.log(loginToken)
      if (loginToken !== null) {
        axios.get('api/mall_cart/index&_token=' + loginToken).then((response) => {
          if (response.data.status === 0) {
            this.proData = response.data.data
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    },
    change (val) {
      var price = 0
      document.getElementsByName('checkbox').forEach(function (item, index) {
        if (item.checked) {
          price += parseInt(document.getElementsByName('price')[index].value)
        }
      })
      this.total = price
    },
    select (val, event) {
      if (event.target.checked) {
        this.price = val
      } else {
        this.price = -val
      }
      this.total += this.price
    },
    selsectAll (obj, event) {
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
    Icon,
    Checklist,
    CheckIcon
  }
}
</script>

<style scoped>

</style>
