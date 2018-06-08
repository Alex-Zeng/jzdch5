<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        <a href="javascript:;" style="margin-right: 1rem;">图片</a>
        <a href="javascript:;" @click.prevent="custormAnchor('goods-detail')">详情</a>
      </div>
      <div>
        <i class="icon iconfont icon-fenxiang" style="padding-right: 0;"></i>
        <i class="icon iconfont icon-xiaoxi"></i>
      </div>
    </div>
    <div class="header-detail">
      <swiper :show-desc-mask="false" dots-position="center" height="18.75rem" :list="goodsData.imgList"></swiper>
    </div>
    <div class="goods-title-box">
      <h3>{{goodsData.title}}</h3>
      <span class="text-red">￥ {{goodsData.price}}</span>
    </div>
    <div class="goods-seller">
      <div class="text-blue">
        <img :src="goodsData.supplierLogo" alt="Logo">
        金晶科技
      </div>
      <div style="border-right: none;" :class="{ 'text-blue': isActive }" @click="collectMethod"><i class="icon iconfont icon-shoucang1"></i>&nbsp;收藏</div>
    </div>
    <div class="select-rule" @click="shawdow = !shawdow">
      <span>请选择规格分类</span>
      <i class="icon iconfont icon-youdanjiantou"></i>
    </div>
    <div id="goods-detail"  class="detail-title">
      商品详情
    </div>
    <div style="background: #FFFFFF;padding: 0.5rem;padding-bottom: 4rem;word-wrap: break-word;" v-html="goodsData.detail">
    </div>
    <div class="detail-shop-car footer-nav">
      <div>
        <span style="vertical-align: top;line-height: 2;">数量&nbsp;</span>
        <inline-x-number :min="0" width="2.6rem"></inline-x-number>
      </div>
      <router-link to="/shop-card">
        <i class="icon iconfont icon-gouwuche2">
          <badge :text="showCarNum" v-if="badge"></badge>
        </i>
        <div>采购清单</div>
      </router-link>
      <div @click="showCarMethod">加入清单</div>
    </div>
    <div class="shadow-box" v-if="shawdow" @click="shawdowMethod"></div>
    <div class="goods-guige" v-if="shawdow">
      <h3>请选择规格</h3>
      <ul>
        <li v-for="(item, index) in option" :key="index">
          <a href="javascript:;" @click="tabsort(index)" :class="{ active: iscur == index }">{{item.name}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {Group, Cell, Swiper, SwiperItem, InlineXNumber} from 'vux'
import '@/assets/css/detail.css'
export default {
  name: 'detail',
  data () {
    return {
      shawdow: false,
      isActive: true,
      active: false,
      badge: false,
      iscur: 0,
      showCarNum: 0,
      goodsData: {},
      option: [
        {
          'id': 12,
          'name': '规格一'
        },
        {
          'id': 13,
          'name': '规格一'
        },
        {
          'id': 14,
          'name': '规格一'
        },
        {
          'id': 15,
          'name': '规格一'
        }
      ]
    }
  },
  methods: {
    showDetai () {
      axios.get('api/goods/get&id=' + this.$route.params.id).then((response) => {
        if (response.data.status === 0) {
          this.goodsData = response.data.data
        }
      }).catch()
    },
    custormAnchor (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName)
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    },
    tabsort (index) {
      this.iscur = index
    },
    selectGuige (event) {
      console.log(event)
    },
    shawdowMethod (event) {
      event.stopPropagation()
      event.preventDefault()
      this.shawdow = false
      return false
    },
    showCarMethod () {
      var num = document.getElementsByClassName('vux-number-input')[0].value
      num = parseInt(num)
      if (num > 0) {
        this.showCarNum += num
        axios.post('api/mall_cart/add', {
          'id': this.$route.params.id,
          'number': this.showCarNum
        }).then((response) => {
          if (response.data.status === 0) {
            alert('成功')
          }
        }).catch((response) => {})
      }
    },
    collectMethod () {
      if (this.isActive === false) {
        axios.post('api/goods/addFavorite', {
          'goodsId': this.$route.params.id
        }).then((response) => {
          if (response.data.status === 0) {
            this.$vux.toast.show({
              type: 'success',
              text: '收藏成功',
              onShow () {
                console.log('Plugin: I\'m showing')
                this.isActive = true
              },
              onHide () {
                console.log('Plugin: I\'m hiding')
              }
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.data.msg,
              onShow () {
                console.log('Plugin: I\'m showing')
                this.isActive = false
              },
              onHide () {
                console.log('Plugin: I\'m hiding')
              }
            })
          }
        }).catch((response) => {
          this.errorMsg()
        })
      } else {
        axios.post('api/goods/removeFavorite', {
          'goodsId': this.$route.params.id
        }).then((response) => {
          if (response.data.status === 0) {
            this.$vux.toast.show({
              type: 'success',
              text: '收藏成功',
              onShow () {
                console.log('Plugin: I\'m showing')
              },
              onHide () {
                console.log('Plugin: I\'m hiding')
              }
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.data.msg,
              onShow () {
                console.log('Plugin: I\'m showing')
              },
              onHide () {
                console.log('Plugin: I\'m hiding')
              }
            })
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    }
  },
  created () {
    axios.get('api/mall_cart/getNumber').then((response) => {
      console.log(response)
    }).catch((response) => {

    })
  },
  mounted () {
    this.showDetai()
  },
  watch: {
    showCarNum (val) {
      if (val > 0) {
        this.badge = true
      } else {
        this.badge = false
      }
      console.log(val)
    }
  },
  components: {
    Group, Cell, Swiper, SwiperItem, InlineXNumber
  }
}
</script>

<style scoped>

</style>
