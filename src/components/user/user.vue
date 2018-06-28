<template>
  <div>
    <div class="user-header">
      <img :src="userMsg.photo" alt="头像">
      <div>{{userMsg.name}}</div>
      <i class="icon iconfont icon-shezhi"></i>
    </div>
    <template v-if="groupId === 5">
      <div class="user-msg">
        <group>
          <cell is-link>
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
              <span style="vertical-align:middle;">购物清单</span>(12)
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
      去认证
    </template>
    <div class="all-indent" v-if="groupId !== 6">查看全部订单<i class="icon iconfont icon-youjiantou"></i></div>
    <div class="footer-ad">
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
      userMsg: {
        'name': '广东律晶电器有限责任公司',
        'photo': require('../../assets/images/bingxiang-icon.png')
      }
    }
  },
  methods: {
    fetchDate () {
      console.log('路由变化')
    },
    loginMethod () {
      let loginToken = sessionStorage.getItem('loginToken')
      if (loginToken === null) {
        this.$router.push('/login')
      } else {
        this.getFavoriteNumber()
      }
    },
    getFavoriteNumber () {
      axios.get('api/user/getFavoriteNumber&_token=' + sessionStorage.getItem('loginToken')).then((response) => {
        if (response.data.status === 0) {
          console.log(response)
          this.favoriteNumber = response.data.data.number
        }
      }).catch()
    }
  },
  created () {
    this.groupId = Number(sessionStorage.getItem('groupId'))
    this.loginMethod()
    this.getFavoriteNumber()
  },
  watch: {
    // 如果路由有变化，会再次执行该方法
    '$route': 'fetchDate'
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
