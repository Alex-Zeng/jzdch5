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
      <span class="text-red" v-if="price">
        {{price}}
      </span>
      <span v-else class="text-red">
        ￥ {{goodsData.min_price}}{{goodsData.max_price===goodsData.min_price?'':' ~ ￥'+goodsData.max_price}}
      </span>
    </div>
    <div class="goods-seller">
      <div class="text-blue">
        <img :src="goodsData.supplierLogo" alt="Logo">
        {{goodsData.supplier}}
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
        <span class="text-muted" style="vertical-align: top;line-height: 2;">数量&nbsp;</span>
        <inline-x-number :min="0" width="2.6rem"></inline-x-number>
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
      <div v-for="i in goodsData.standard.length" :key="i">
        <h3>{{goodsData.standard[i-1].title}}</h3>
        <ul v-if="goodsData.standard[i-1].title === '颜色'">
          <li v-for="(item, index) in goodsData.standard[i-1].list" :key="index">
            <a href="javascript:;" @click="tabsort0(index)" :class="{ active: iscur0 === index}">{{item.color_name}}</a>
            <input type="hidden" class="color" v-model="item.color_id">
          </li>
        </ul>
        <ul v-if="goodsData.standard[i-1].title !== '颜色'">
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
      iscur0: 0,
      iscur1: 0,
      optionId: 0,
      colorId: 0,
      showCarNum: 0,
      goodsData: {}
    }
  },
  methods: {
    showDetai () {
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
        if (this.colorId === this.goodsData.standardPrice[i].color_id && this.optionId === this.goodsData.standardPrice[i].option_id) {
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
      var num = document.getElementsByClassName('vux-number-input')[0].value
      num = parseInt(num)
      if (num > 0) {
        axios.post('api/mall_cart/add', {
          'id': this.$route.params.id,
          'number': num,
          'colorId': this.colorId,
          'optionId': this.optionId,
          '_token': sessionStorage.getItem('loginToken')
        }).then((response) => {
          if (response.data.status === 0) {
          }
        }).catch((response) => {})
      } else {
        this.$vux.toast.show({
          type: 'warn',
          text: '数量为0，无法加入清单',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      }
    },
    collectMethod () {
      if (this.isActive === false) {
        var self = this
        axios.post('api/goods/addFavorite', {
          'goodsId': this.$route.params.id,
          '_token': sessionStorage.getItem('loginToken')
        }).then((response) => {
          if (response.data.status === -2) {
            this.$vux.toast.show({
              type: 'warn',
              text: '请先登录',
              onShow () {
                console.log('Plugin: I\'m showing')
              },
              onHide () {
                self.$router.push('/login')
                console.log('Plugin: I\'m hiding')
              }
            })
          } else {
            if (response.data.status === 0) {
              this.$vux.toast.show({
                type: 'success',
                text: '收藏成功',
                onShow () {
                  console.log('Plugin: I\'m showing')
                  self.isActive = true
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
    axios.get('api/mall_cart/getNumber&_token=' + sessionStorage.getItem('loginToken')).then((response) => {
      console.log(response.data.status)
      if (response.data.status === -2) {
        // this.$router.push('/login')
        this.shopCard = false
        console.log('未登录')
      } else if (response.data.status === 0) {
        this.showCarNum = response.data.data.total
        this.shopCard = true
      } else {
        this.shopCard = false
      }
    }).catch((response) => {
    })
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
