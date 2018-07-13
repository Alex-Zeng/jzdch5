<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        采购清单
      </div>
      <div v-if="proData.length === 0">&emsp;&emsp;&emsp;</div>
      <div @click="manageMethods" v-if="proData.length > 0" style="padding-right: 0.5rem">
        {{manage?'管理':'完成'}}
      </div>
    </div>
    <div class="shop-car-container">
      <div v-if="proData.length === 0" class="temp-box">
        <img class="temp-img" src="@/assets/images/temp-img-2.png" alt="">
        <h3>您还没有采购的商品</h3>
        <p class="text-muted">去添加试试吧</p>
        <button @click="$router.replace('/')">快速采购</button>
      </div>
      <div v-for="(item, index) in proData" :key="index">
        <div class="shller-title" :key="'list'+index">
          <div>
            <i class="icon iconfont icon-danxuananniu" v-if="!allList[index]"></i>
            <i class="icon iconfont icon-xuanzhong" v-if="allList[index]" style="color: #1EB9EE;"></i>
            <input type="checkbox" :value="item.supplierName" @click="selsectAll(index, $event)" v-model="allList[index]">
          </div>
          &emsp;<i class="icon iconfont icon-shangdian text-blue"></i>&emsp;
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
                  <i class="icon iconfont icon-xuanzhong" v-if="checkedList[index][k]" style="color: #1EB9EE;"></i>
                  <input type="checkbox" name="checkbox" class="input" :value="i.cartId" :data-i="checkedList[index][k]" v-model="checkedList[index][k]" @change="select(i.price*i.quantity, checkedList[index][k], index, k)">
                  <input type="hidden" name="price" :value="i.price*i.quantity">
                </div>
                <div>
                  <img :src="i.icon" alt="">
                  <div>
                    <h3><router-link :to="'/detail/'+i.goodsId">{{i.title}}</router-link></h3>
                    <div class="text-muted">{{i.specificationsInfo}}</div>
                    <span class="text-red">￥ {{i.price}}</span>
                    <inline-x-number width="50px" :min="1" fillable v-model="i.quantity" @on-change="change(i.cartId, i.quantity)"></inline-x-number>
                  </div>
                </div>
              </div>
            </swipeout-item>
          </swipeout>
        </div>
      </div>
    </div>
    <div class="shop-car-total"  v-if="proData.length > 0">
      <div v-if="manage">
        合计：
        <span class="text-red">{{total.toFixed(2)}}元</span>
      </div>
      <div v-if="!manage">
        <i class="icon iconfont icon-danxuananniu" v-if="!all"></i>
        <i class="icon iconfont icon-xuanzhong" v-if="all" style="color: #1EB9EE;"></i>
        <input type="checkbox" value="all" v-model="all" @click="manageAll">全选
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
      let self = this
      if (loginToken != null) {
        axios.post('api/mall_cart/delete', {
          'ids': [event].join(',')
        }).then((response) => {
          const {data: {status, msg}} = response
          if (status === 0) {
            this.$vux.toast.show({
              type: 'success',
              isShowMask: true,
              text: msg,
              onShow () {
                self.getLists()
              },
              onHide () {
                // 计算价格，重新遍历
                self.total = 0
                self.checkedList.forEach((v, index) => {
                  v.forEach((t, k) => {
                    if (t) {
                      const {price, quantity} = (self.proData)[index].list[k]
                      self.total += (price * quantity)
                    }
                  })
                })
              }
            })
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
        axios.get('api/mall_cart/index').then((response) => {
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
    manageMethods () {
      this.manage = !this.manage
    },
    deleteMethods () {
      let self = this
      let loginToken = sessionStorage.getItem('loginToken')
      let ids = []
      self.checkedList.forEach((v, k) => {
        v.forEach((t, d) => {
          if (t) {
            ids.push(self.proData[k].list[d].cartId)
          }
        })
      })
      if (loginToken !== null) {
        if (ids.length > 0) {
          this.$vux.confirm.show({
            title: '提示',
            content: '确定删除？',
            onCancel () {},
            onConfirm () {
              axios.post('api/mall_cart/delete', {
                'ids': ids.join(','),
                '_token': loginToken
              }).then((response) => {
                const {data: {status, msg}} = response
                if (status === 0) {
                  self.$vux.toast.show({
                    type: 'success',
                    text: msg
                  })
                  self.getLists()
                } else {
                  self.$vux.toast.show({
                    type: 'warn',
                    text: msg
                  })
                }
              }).catch((response) => {
              })
            }
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择要删除的商品'
          })
        }
      }
    },
    goMethods () {
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken !== null) {
        let ids = []
        this.checkedList.forEach((v, k) => {
          if (v) {
            v.forEach((t, d) => {
              if (t) {
                ids.push(this.proData[k].list[d].cartId)
              }
            })
          }
        })
        if (this.allList.length === 0) {
          this.$vux.toast.show({
            type: 'warn',
            text: '购物清单为空<br>请先添加商品'
          })
          return false
        }
        if (ids.length > 0) {
          axios.get('api/mall_cart/index&ids=' + ids).then((response) => {
            sessionStorage.removeItem('indentLists')
            sessionStorage.setItem('indentLists', JSON.stringify(response.data.data))
            sessionStorage.removeItem('total')
            sessionStorage.setItem('total', this.total)
            this.$router.push('/shop-car/indent')
          }).catch((response) => {})
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: '请选择商品'
          })
        }
      }
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
      })
    }
  },
  created () {
    window.scrollTo(0, 0)
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
