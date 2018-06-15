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
            <!--{{checkedList[index]}}-->
            <input type="checkbox" :value="item.supplierName" @click="selsectAll(index, $event)" v-model="allList[index]">
            <!--<icon type="circle" v-if="!checked"></icon>-->
            <!--<icon type="success" v-if="checked"></icon>-->
          </div>
          <div>{{item.supplierName}}</div>
        </div>
        <div :id="'box'+index">
        <swipeout>
          <swipeout-item transition-mode="follow" v-for="(i, k) in item.list" :key="i.cartId">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick(i.cartId)" type="warn">删除</swipeout-button>
            </div>
            <div slot="content" class="shop-car-content">
              <div>
                <!--<icon type="circle"></icon>-->
                <input type="checkbox" name="checkbox" class="input" :value="i.cartId" v-model="checkedList[index][k]" @change="select(i.price*i.quantity, checkedList[index][k], index, k)">
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
      checkedList: [],
      allList: [],
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
            // 动态生成选中数组
            let tempList = []
            response.data.data.forEach((v) => {
              let temp = new Array(v.list.length)
              temp.fill(false)
              tempList.push(temp)
              this.allList.push(false)
            })
            this.checkedList = tempList
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
    select (val, isChecked, index, k) {
      if (isChecked) {
        this.price = val
      } else {
        this.price = -val
      }
      this.total += this.price
      let newAll = this.allList
      newAll[index] = !(this.checkedList[index].includes(false))
      this.allList = newAll
    },
    selsectAll (index, event) {
      // 填充
      let list = this.checkedList[index]
      list.fill(event.target.checked)
      this.$set(this.checkedList, index, list)
      // 计算价格，重新遍历
      this.total = 0
      this.checkedList.forEach((v, index) => {
        v.forEach((t, k) => {
          if (t) {
            const {price, quantity} = (this.proData)[index].list[k]
            this.total += (price * quantity)
          }
        })
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
    Icon,
    Checklist,
    CheckIcon
  }
}
</script>

<style scoped>

</style>
