<template>
  <div>
    <div class="user-header">
      <img :src="userMsg.photo" alt="头像">
      <div>{{userMsg.name}}</div>
    </div>
    <div class="user-msg">
      <group>
        <cell is-link>
          <i slot="icon" class="icon iconfont icon-xingxing text-blue"></i>
          <span slot="title"><span style="vertical-align:middle;">消息</span>(15)</span>
        </cell>
        <cell is-link>
          <i slot="icon" class="icon iconfont icon-gouwuche text-blue"></i>
          <span slot="title"><span style="vertical-align:middle;">购物清单</span>(12)</span>
        </cell>
      </group>
    </div>
    <div class="user-grid">
      <div class="item">
        <i class="icon iconfont icon-gouwuche2">
          <badge text="9"></badge>
        </i>
        <div>采购清单</div>
      </div>
      <div class="item">
        <i class="icon iconfont icon-gouwuche2">
          <badge text="9"></badge>
        </i>
        <div>采购清单</div>
      </div>
      <div class="item">
        <i class="icon iconfont icon-gouwuche2">
          <badge text="9"></badge>
        </i>
        <div>采购清单</div>
      </div>
      <div class="item">
        <i class="icon iconfont icon-gouwuche2">
          <badge text="9"></badge>
        </i>
        <div>采购清单</div>
      </div>
    </div>
    <FooterNav></FooterNav>
  </div>
</template>

<script>import FooterNav from '../common/footer-nav'
import {Cell, CellBox, Group} from 'vux'

require('../../assets/css/user.css')
export default {
  name: 'user',
  data () {
    return {
      loginToken: '',
      userMsg: {
        'name': '广东律晶电器有限责任公司',
        'photo': require('../../assets/images/bingxiang-icon.png')
      }
    }
  },
  methods: {
    fetchDate () {
    }
  },
  created () {
    /* if (this.loginToken === '') {
      this.$router.push('/login')
    } */
    this.fetchDate()
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
