<template>
  <div>
    <div class="header-nav" style="position: fixed;top: 0;left: 0;width: 100%;z-index: 999;">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        <a href="javascript:;" @click.prevent="custormAnchor('goods-detail')" style="margin-right: 1rem;">图片</a>
        <a href="javascript:;" @click.prevent="custormAnchor('goods-img')">详情</a>
      </div>
      <div>
        <i class="icon iconfont icon-fenxiang" style="padding-right: 0;" @click="shareMethods"></i>
        <i class="icon iconfont icon-xiaoxi" @click="$router.push('/message')"></i>
      </div>
    </div>
    <div id="goods-detail" class="header-detail">
      <swiper :show-desc-mask="false" dots-position="center" height="18.75rem" :list="goodsData.imgList"></swiper>
    </div>
    <div class="goods-title-box">
      <h3>{{goodsData.title}}</h3>
      <span class="text-red" v-if="price">
        {{price}}
      </span>
      <span v-else class="text-red">
        ￥ {{goodsData.min_price === '0.00'?goodsData.price:goodsData.min_price}}{{goodsData.max_price===goodsData.min_price?'':' ~ ￥'+goodsData.max_price}}
      </span>
    </div>
    <div class="goods-seller">
      <div class="text-blue">
        <img :src="goodsData.supplierLogo" alt="Logo" onerror="this.src='./static/images/temp-img.png'">
        {{goodsData.supplier}}
      </div>
      <div style="border-right: none;" :class="{ 'text-blue': isActive }" @click="collectMethod"><i class="icon iconfont icon-shoucang1"></i>&nbsp;收藏</div>
    </div>
    <div class="select-rule" @click="shawdow = !shawdow">
      <span>请选择规格分类</span>
      <i class="icon iconfont icon-youdanjiantou"></i>
    </div>
    <div id="goods-img"  class="detail-title">
      商品详情
    </div>
    <div class="goods-detail" v-html="goodsData.detail">
    </div>
    <div class="detail-shop-car footer-nav" v-if="showCar">
      <div>
        <span class="text-muted" style="vertical-align: top;line-height: 2;">数量&nbsp;</span>
        <inline-x-number :min="1" width="2.6rem" fillable v-model="value"></inline-x-number>
      </div>
      <router-link to="/shop-car">
        <i class="icon iconfont icon-gouwuche2">
          <badge :text="showCarNum" v-if="badge"></badge>
        </i>
        <div>采购清单</div>
      </router-link>
      <div @click="showCarMethod">加入清单</div>
    </div>
    <div class="shadow-box" v-if="shawdow" @click="shawdowMethod"></div>
    <div class="goods-guige" v-if="shawdow">
      <i class="icon iconfont icon-guanbi" @click="shawdowMethod"></i>
      <div v-for="i in goodsData.standard.length" :key="i">
        <h3>{{goodsData.standard[i-1].title}}</h3>
        <ul v-if="goodsData.standard[i-1].title === '规格'">
          <li v-for="(item, index) in goodsData.standard[i-1].list" :key="index">
            <a href="javascript:;" @click="tabsort0(index)" :class="{ active: iscur0 === index}">{{item.color_name}}</a>
            <input type="hidden" class="color" v-model="item.color_id">
          </li>
        </ul>
        <ul v-if="goodsData.standard[i-1].title !== '规格'">
          <li v-for="(item, index) in goodsData.standard[i-1].list" :key="index">
            <a href="javascript:;" @click="tabsort1(index)" :class="{ active: iscur1 === index}">{{item.option_name}}</a>
            <input type="hidden" class="option" v-model="item.option_id">
          </li>
        </ul>
      </div>
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
      isActive: false,
      active: false,
      badge: false,
      price: null,
      iscur0: null,
      iscur1: null,
      showCar: true,
      value: 1,
      optionId: 0,
      colorId: 0,
      showCarNum: 0,
      goodsData: {}
    }
  },
  methods: {
    showDetai () {
      if (sessionStorage.getItem('groupId') === '2' || sessionStorage.getItem('groupId') === '3' || sessionStorage.getItem('groupId') === '5') {
        this.showCar = false
      }
      var self = this
      axios.get('api/goods/get&id=' + this.$route.params.id).then((response) => {
        if (response.data.status === 0) {
          this.goodsData = response.data.data
          if (this.goodsData.isFavorite === 1) {
            this.isActive = true
          } else {
            this.isActive = false
          }
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.data.msg,
            onShow () {},
            onHide () {
              self.$router.go(-1)
            }
          })
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    custormAnchor (anchorName) {
      // 找到锚点
      let anchorElement = document.getElementById(anchorName)
      if (anchorElement) {
        anchorElement.scrollIntoView()
      }
    },
    tabsort0 (index) {
      this.iscur0 = index
      this.colorId = document.getElementsByClassName('color')[index].value
      this.getPrice()
    },
    tabsort1 (index) {
      this.iscur1 = index
      this.optionId = document.getElementsByClassName('option')[index].value
      this.getPrice()
    },
    getPrice () {
      for (let i = 0; i < this.goodsData.standardPrice.length; i++) {
        let colorId = Number(this.colorId)
        let optionId = Number(this.optionId)
        let colorIdI = Number(this.goodsData.standardPrice[i].color_id)
        let optionIdI = Number(this.goodsData.standardPrice[i].option_id)
        if (colorId === colorIdI && optionId === optionIdI) {
          this.price = this.goodsData.standardPrice[i].price
        }
      }
    },
    shawdowMethod (event) {
      event.stopPropagation()
      event.preventDefault()
      this.shawdow = false
      return false
    },
    showCarMethod () {
      axios.get('api/user/getGroup').then((response) => {
        if (response.data.status === 0) {
          sessionStorage.setItem('groupId', response.data.data.groupId)
          if (response.data.data.groupId === 0) {
            let self = this
            this.$vux.confirm.show({
              title: '提示',
              content: '您尚未登录，确定现在去登录？',
              onConfirm () {
                sessionStorage.removeItem('oldUrl')
                sessionStorage.setItem('oldUrl', self.$route.path)
                self.$router.push('/loginByCode')
              }
            })
            return false
          } else if (response.data.data.groupId === 6) {
            let self = this
            this.$vux.confirm.show({
              title: '提示',
              content: '您尚未做企业认证，是否现在去认证？',
              onConfirm () {
                self.$router.push('/settings')
              }
            })
            return false
          } else {
            if (this.goodsData.standard.length === 1) {
              if (this.iscur0 === null && this.iscur1 === null) {
                this.shawdow = true
                this.$vux.toast.show({
                  text: '请选择规格'
                })
                return false
              }
            } else if (this.goodsData.standard.length === 2) {
              if (this.iscur0 === null | this.iscur1 === null) {
                this.shawdow = true
                this.$vux.toast.show({
                  text: '请选择规格'
                })
                return false
              }
            }
            axios.post('api/mall_cart/add', {
              'id': this.$route.params.id,
              'number': this.value,
              'colorId': this.colorId,
              'optionId': this.optionId
            }).then((response) => {
              if (response.data.status === 0) {
                this.$vux.toast.show({
                  type: 'success',
                  text: '添加成功'
                })
                axios.get('api/mall_cart/getNumber').then((response) => {
                  if (response.data.status === 0) {
                    this.showCarNum = response.data.data.total
                  }
                })
              } else {
                this.$vux.toast.show({
                  type: 'warm',
                  text: response.data.msg
                })
              }
            }).catch((response) => {
              this.errorMsg()
            })
          }
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    collectMethod () {
      let self = this
      if (this.isActive === false) {
        axios.post('api/goods/addFavorite', {
          'goodsId': this.$route.params.id
        }).then((response) => {
          if (response.data.status === -2) {
            this.$vux.confirm.show({
              title: '提示',
              content: '您尚未登录，确定现在去登录？',
              onConfirm () {
                sessionStorage.removeItem('oldUrl')
                sessionStorage.setItem('oldUrl', self.$route.path)
                self.$router.push('/loginByCode')
              }
            })
          } else {
            if (response.data.status === 0) {
              this.$vux.toast.show({
                type: 'success',
                text: '收藏成功',
                isShowMask: true,
                onShow () {
                  self.isActive = true
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg
              })
            }
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
              text: '取消成功',
              isShowMask: true,
              onShow () {
                self.isActive = false
              }
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.data.msg
            })
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    },
    shareMethods () {
      // 点击分享按钮
      let title = this.goodsData.title
      let detail = this.goodsData.detail
      let img = this.goodsData.imgList[0].img
      let url = window.location.href
      window.jsb.detail(title, detail, img, url)
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
    axios.get('api/mall_cart/getNumber').then((response) => {
      if (response.data.status === 0) {
        this.showCarNum = response.data.data.total
      }
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
    }
  },
  components: {
    Group, Cell, Swiper, SwiperItem, InlineXNumber
  }
}
</script>

<style scoped>

</style>
