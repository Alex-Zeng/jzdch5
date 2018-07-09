<template>
  <div>
    <div class="user-header">
      <img :src="userMsg.photo" alt="头像">
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
          <i class="icon iconfont icon-daifukuan">
            <badge text="9"></badge>
          </i>
          <div>代付款</div>
        </div>
        <div class="item">
          <i class="icon iconfont icon-daishouhuo">
            <badge text="9"></badge>
          </i>
          <div>待收货</div>
        </div>
        <div class="item">
          <i class="icon iconfont icon-daifahuo">
            <badge text="9"></badge>
          </i>
          <div>待发货</div>
        </div>
        <div class="item">
          <i class="icon iconfont icon-shouhou">
            <badge text="9"></badge>
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
      <div class="user-grid">
        <div class="item">
          <i class="icon iconfont icon-daifukuan">
            <badge text="9"></badge>
          </i>
          <div>代付款</div>
        </div>
        <div class="item">
          <i class="icon iconfont icon-daishouhuo">
            <badge text="9"></badge>
          </i>
          <div>待收货</div>
        </div>
        <div class="item">
          <i class="icon iconfont icon-daifahuo">
            <badge text="9"></badge>
          </i>
          <div>待发货</div>
        </div>
        <div class="item">
          <i class="icon iconfont icon-shouhou">
            <badge text="9"></badge>
          </i>
          <div>售后处理</div>
        </div>
      </div>
    </template>
    <template v-if="groupId === 6">
      <div class="visitor-box" @click="$router.push('/settings')">
        <img src="@/assets/images/qurenzheng.png" alt="去认证">
        <p class="text-muted">还没有进行企业验证，快去进行企业验证吧~</p>
        <button class="btn">去认证</button>
      </div>
    </template>
    <div class="all-indent" v-if="groupId !== 6">查看全部订单<i class="icon iconfont icon-youjiantou"></i></div>
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
      userMsg: {
        'name': '',
        'photo': ''
      }
    }
  },
  methods: {
    loginMethod () {
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken === null) {
        let self = this
        this.$vux.confirm.show({
          title: '提示',
          content: '您尚未登录，是否去登录？',
          onCancel () {},
          onConfirm () {
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
      }).catch()
    },
    getNumber () {
      axios.get('api/mall_cart/getNumber').then((response) => {
        if (response.data.status === 0) {
          this.number = response.data.data.total
        }
      }).catch()
    }
  },
  created () {
    this.groupId = Number(sessionStorage.getItem('groupId'))
    this.loginMethod()
    this.getFavoriteNumber()
    this.getNumber()
  },
  mounted () {
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
