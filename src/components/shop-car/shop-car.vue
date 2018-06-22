<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        采购清单
      </div>
      <div @click="manageMethods" style="padding-right: 0.5rem">
        {{manage?'管理':'完成'}}
      </div>
    </div>
    <div class="shop-car-container">
      <div v-for="(item, index) in proData" :key="index">
        <div class="shller-title" :key="'list'+index">
          <div>
            <i class="icon iconfont icon-danxuananniu" v-if="!allList[index]"></i>
            <i class="icon iconfont icon-danxuananniu-xuanzhong1" v-if="allList[index]" style="color: #1EB9EE;"></i>
            <input type="checkbox" :value="item.supplierName" @click="selsectAll(index, $event)" v-model="allList[index]">
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
                  <i class="icon iconfont icon-danxuananniu" v-if="!checkedList[index][k]"></i>
                  <i class="icon iconfont icon-danxuananniu-xuanzhong1" v-if="checkedList[index][k]" style="color: #1EB9EE;"></i>
                  <input type="checkbox" name="checkbox" class="input" :value="i.cartId" :data-i="checkedList[index][k]" v-model="checkedList[index][k]" @change="select(i.price*i.quantity, checkedList[index][k], index, k)">
                  <input type="hidden" name="price" :value="i.price*i.quantity">
                </div>
                <div>
                  <img :src="i.icon" alt="">
                  <div>
                    <h3>{{i.title}}</h3>
                    <div class="text-muted">{{i.specificationsInfo}}</div>
                    <span class="text-red">￥ {{i.price}}</span>
                    <inline-x-number width="50px" :min="0" fillable v-model="i.quantity" @on-change="change(i.cartId, i.quantity)"></inline-x-number>
                  </div>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
      </div>
    </div>
    <div class="shop-car-total">
      <div v-if="manage">
        合计：
        <span class="text-red">{{total}}</span>
      </div>
      <div v-if="!manage">
        <i class="icon iconfont icon-danxuananniu" v-if="!all"></i>
        <i class="icon iconfont icon-danxuananniu-xuanzhong1" v-if="all" style="color: #1EB9EE;"></i>
        <input type="checkbox" value="all" v-model="all" @click="manageAll">
      </div>
      <div class="delete-goods" v-if="!manage" @click="deleteMethods">
        删除商品
      </div>
      <div @click="goMethods">
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
      all: false,
      total: 0,
      price: 0,
      price2: 0,
      proData: [],
      manage: true
    }
  },
  methods: {
    onButtonClick (event) {
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken != null) {
        axios.post('api/mall_cart/delete', {
          'ids': [event].join(','),
          '_token': loginToken
        }).then((response) => {
          const {data: {status, msg}} = response
          if (status === 0) {
            this.$vux.toast.show({
              type: 'success',
              text: msg
            })
            this.getLists()
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: msg
            })
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    },
    getLists () {
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken !== null) {
        axios.get('api/mall_cart/index&_token=' + loginToken).then((response) => {
          if (response.data.status === 0) {
            this.proData = response.data.data
            // 动态生成选中数组
            let tempList = []
            const { data } = response.data
            data.forEach((v) => {
              const {list: { length }} = v
              tempList.push(Array(length).fill(false))
            })
            this.allList = Array(data.length).fill(false)
            this.checkedList = tempList
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    },
    change (id, number) {
      var price = 0
      document.getElementsByName('checkbox').forEach(function (item, index) {
        if (item.checked) {
          price += parseInt(document.getElementsByName('price')[index].value)
        }
      })
      this.total = price
      axios.post('api/mall_cart/update', {
        '_token': sessionStorage.getItem('loginToken'),
        'id': id,
        'number': number
      }).then((response) => {
        sessionStorage.removeItem('total')
        sessionStorage.setItem('total', this.total)
      }).catch((response) => {})
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
      this.allList.forEach((v) => {
        this.all = v
      })
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
    manageAll () {
      this.checkedList.forEach((v, k) => {
        this.$set(this.checkedList, k, v.fill(!this.all))
        this.allList.fill(!this.all)
      })
    },
    manageMethods () {
      this.manage = !this.manage
    },
    deleteMethods () {
      let ids = []
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken !== null) {
        this.checkedList.forEach((v, k) => {
          v.forEach((t, d) => {
            if (t) {
              ids.push(this.proData[k].list[d].cartId)
            }
          })
        })
        axios.post('api/mall_cart/delete', {
          'ids': ids.join(','),
          '_token': loginToken
        }).then((response) => {
          const {data: {status, msg}} = response
          if (status === 0) {
            this.$vux.toast.show({
              type: 'success',
              text: msg
            })
            this.getLists()
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: msg
            })
          }
        }).catch((response) => {
        })
      }
    },
    goMethods () {
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken !== null) {
        let ids = []
        this.checkedList.forEach((v, k) => {
          console.log(v)
          console.log(k)
          if (v) {
            v.forEach((t, d) => {
              if (t) {
                ids.push(this.proData[k].list[d].cartId)
              }
            })
          }
        })
        if (ids) {
          axios.get('api/mall_cart/index&_token=' + loginToken + '&ids=' + ids).then((response) => {
            sessionStorage.removeItem('indentLists')
            sessionStorage.setItem('indentLists', JSON.stringify(response.data.data))
            sessionStorage.removeItem('total')
            sessionStorage.setItem('total', this.total)
            this.$router.push('/shop-car/indent')
          }).catch((response) => {})
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择商品',
            onShow () {
              console.log('Plugin: I\'m showing')
            },
            onHide () {
              console.log('Plugin: I\'m hiding')
            }
          })
        }
      }
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
    sessionStorage.removeItem('indentLists')
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
