<template>
  <div>
    <div class="user-header">
      <img :src="userMsg.photo" alt="">
      <div>{{userMsg.name}}</div>
      <i class="icon iconfont icon-shezhi" @click="$router.push('/settings')"></i>
    </div>
    <template v-if="groupId === 5">
      <div class="user-msg">
        <group>
          <cell is-link link="/goods-collect">
            <i class="icon iconfont icon-xingxing text-blue"></i>
            <span slot="title"><span style="vertical-align:middle;">收藏夹</span>({{favoriteNumber}})</span>
          </cell>
        </group>
      </div>
      <div class="user-grid">
        <div class="item">
          <div>昨日成交（笔）</div>
          <span class="text-blue" style="line-height: 2;">{{yesterday}}</span>
        </div>
        <div class="item">
          <div>累计成交（笔）</div>
          <span class="text-blue" style="line-height: 2;">{{total}}</span>
        </div>
        <div class="item">
          <i class="icon iconfont icon-daifahuo">
            <badge v-if="supplier.pending > 0" v-text="supplier.pending"></badge>
          </i>
          <div>待发货</div>
        </div>
        <div class="item">
          <i class="icon iconfont icon-shouhou">
            <badge v-if="supplier.service > 0" v-text="supplier.service"></badge>
          </i>
          <div>售后处理</div>
        </div>
      </div>
    </template>
    <template v-if="groupId === 4">
      <div class="user-msg">
        <group>
          <cell is-link link="/goods-collect">
            <i slot="icon" class="icon iconfont icon-shoucang1 text-blue"></i>
            <span slot="title">
                <span style="vertical-align:middle;">收藏夹</span>({{favoriteNumber}})
            </span>
          </cell>
          <cell is-link link="/shop-car">
            <i slot="icon" class="icon iconfont icon-gouwuche3 text-blue"></i>
            <span slot="title">
              <span style="vertical-align:middle;">购物清单</span>({{number}})
            </span>
          </cell>
        </group>
      </div>
      <router-link to="/order-list/9" tag="div" class="user-grid">
        <div class="item">
          <i class="icon iconfont icon-daifukuan">
            <badge v-if="buyerOrder.pay > 0" v-text="buyerOrder.pay"></badge>
          </i>
          <div>待付款</div>
        </div>
        <router-link to="/order-list/6" tag="div" class="item">
          <i class="icon iconfont icon-daishouhuo">
            <badge v-if="buyerOrder.recieve > 0" v-text="buyerOrder.recieve"></badge>
          </i>
          <div>待收货</div>
        </router-link>
        <router-link to="/order-list/3" tag="div" class="item">
          <i class="icon iconfont icon-daifahuo">
            <badge v-if="buyerOrder.deliver > 0" v-text="buyerOrder.deliver"></badge>
          </i>
          <div>待发货</div>
        </router-link>
        <router-link class="item" to="/order-list/8" tag="div">
          <i class="icon iconfont icon-shouhou">
            <badge v-if="buyerOrder.service > 0" v-text="buyerOrder.service"></badge>
          </i>
          <div>售后处理</div>
        </router-link>
      </router-link>
    </template>
    <template v-if="groupId === 6">
      <div class="visitor-box" @click="$router.push('/settings')">
        <i class="icon iconfont icon-renzheng"></i>
        <p class="text-muted">还没有进行企业验证，快去进行企业验证吧~</p>
        <button class="btn">去认证</button>
      </div>
    </template>
    <div class="all-indent" v-if="groupId !== 6">
      <router-link to="/order-list/-1" tag="div">
        查看全部订单<i class="icon iconfont icon-youjiantou"></i>
      </router-link>
    </div>
    <div class="footer-ad" v-if="groupId !== 6">
      <div>集众金融 急你所需</div>
      <div><a href="javascript:;">申请融资</a></div>
    </div>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
import FooterNav from '../common/footer-nav'
import {Cell, CellBox, Group} from 'vux'
import axios from 'axios'
require('../../assets/css/user.css')
export default {
  name: 'user',
  data () {
    return {
      groupId: null,
      favoriteNumber: '',
      number: '',
      supplier: {
        'yesterday': '0',
        'total': '0',
        'pending': '0',
        'service': '0'
      },
      buyerOrder: {
        'pay': '0',
        'recieve': '0',
        'deliver': '0',
        'service': '0'
      },
      userMsg: {
        'name': '广东律晶电器有限责任公司',
        'photo': require('../../assets/images/bingxiang-icon.png')
      }
    }
  },
  methods: {
    getInfo () {
      axios.get('api/user/getProfile').then((response) => {
        const {status} = response.data
        if (status === 0) {
          this.userMsg.name = response.data.data.username
          this.userMsg.photo = response.data.data.path
        }
      }).catch(() => {
        this.errorMsg()
      })
    },
    getSupplierOrderInfo () {
      axios.get('api/user/getSupplierOrderInfo').then((response) => {
        const {status} = response.data
        if (status === 0) {
          this.supplier.yesterday = response.data.data.yesterday
          this.supplier.total = response.data.data.total
          this.supplier.pending = response.data.data.pending
          this.supplier.service = response.data.data.service
        }
      }).catch(() => {
        this.errorMsg()
      })
    },
    getBuyerOrderInfo () {
      axios.get('api/user/getBuyerOrderInfo').then((response) => {
        const {status} = response.data
        if (status === 0) {
          this.buyerOrder.pay = response.data.data.pay
          this.buyerOrder.recieve = response.data.data.recieve
          this.buyerOrder.deliver = response.data.data.deliver
          this.buyerOrder.service = response.data.data.service
        }
      }).catch(() => {
        this.errorMsg()
      })
    },
    loginMethod () {
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken === null) {
        let self = this
        this.$vux.confirm.show({
          title: '提示',
          content: '您尚未登录，是否去登录？',
          onCancel () {
            self.$router.go(-1)
          },
          onConfirm () {
            sessionStorage.removeItem('oldUrl')
            sessionStorage.setItem('oldUrl', self.$route.path)
            self.$router.push('/loginByCode')
          }
        })
        /* var num = null
          try {
            num = window.jsb.login(window.location.href)
            alert(num)
          } catch (err) {
            if (num === null) {
              this.$router.push('/loginByCode')
            }
          } */
      } else {
        this.getFavoriteNumber()
      }
    },
    getFavoriteNumber () {
      axios.get('api/user/getFavoriteNumber').then((response) => {
        if (response.data.status === 0) {
          this.favoriteNumber = response.data.data.number
        }
      }).catch(() => {
        this.errorMsg()
      })
    },
    getNumber () {
      axios.get('api/mall_cart/getNumber').then((response) => {
        if (response.data.status === 0) {
          this.number = response.data.data.total
        }
      }).catch(() => {
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
    axios.get('api/user/getGroup').then((response) => {
      this.groupId = response.data.data.groupId
      if (this.groupId === 4) {
        this.getBuyerOrderInfo()
      }
      if (this.groupId === 5) {
        this.getSupplierOrderInfo()
      }
    }).catch((response) => {
      this.errorMsg()
    })
    this.loginMethod()
    this.getInfo()
    this.getFavoriteNumber()
    this.getNumber()
  },
  components: {
    FooterNav,
    Group,
    Cell,
    CellBox
  }
}
</script>

<style scoped>
  html, body {
    background: #FFFFFF;
  }
</style>
