<template>
  <!--滑动区域-->
  <div class="mescroll"  id="mescroll" style="padding-bottom: 2rem">
    <headerMessage></headerMessage>
    <div class="banner">
      <swiper loop :show-desc-mask="false" dots-position="center" height="9.9rem" :list="banners" :show-dots="banners.length > 1? true:false"></swiper>
    </div>
    <div class="main-body">
      <div class="menu-nav-box">
        <swiper :show-desc-mask="false" height="10.5rem" :show-dots="false">
          <swiper-item class="black">
            <div class="menu-nav">
              <template v-for="(item, index) in menunListsFirst">
                <router-link v-if="item.type > 0" :to="{path: '/goods-class', query: {id: item.type }}" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </router-link>
                <a href="./assets/jzdc-services/finance.html" v-else-if="item.flag.toString() == '1'" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </a>
                <a href="./static/jzdc-services/index.html" v-else-if="item.flag.toString() == '2'" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </a>
                <router-link v-else-if="item.flag.toString() == '3'" :to="{path: '/factoring'}" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </router-link>
              </template>
            </div>
          </swiper-item>
          <swiper-item  v-if="menunListsSecond.length > 0" class="black">
            <div class="menu-nav">
              <template v-for="(item, index) in menunListsSecond">
                <router-link v-if="item.type > 0" :to="{path: '/goods-class', query: {id: item.type }}" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </router-link>
                <a href="./static/jzdc-services/finance.html" v-else-if="item.flag.toString() == '1'" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </a>
                <a href="./static/jzdc-services/index.html" v-else-if="item.flag.toString() == '2'" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </a>
                <router-link v-else-if="item.flag.toString() == '3'" :to="{path: '/factoring'}" :key="index">
                  <img :src="item.img" alt="" onerror="this.src='./static/images/temp-img.png'"/>
                  <div class="text-truncate">
                    {{item.name}}
                  </div>
                </router-link>
              </template>
            </div>
          </swiper-item>
        </swiper>
      </div>
      <div class="floor floor-recommend">
        <span>商品推荐</span>
        <router-link to="/goods-class" class="text-muted">
          更多&nbsp;<i class="icon iconfont icon-youjiantou"></i>
        </router-link >
      </div>
    </div>
    <!--展示上拉加载的数据列表-->
    <ul id="dataList" class="goods-lists data-list" v-cloak>
      <li v-for="(item, index) in goodsLists" :key="index">
        <router-link :to="'/detail/'+ item.id">
          <img :src="item.url" onerror="this.src='./static/images/temp-img.png'" alt=""/>
          <div class="goods-title">
            {{item.title}}
          </div>
          <div class="goods-price text-red">
            ￥ {{item.min_price == '0.00'? item.w_price:item.min_price}}{{item.max_price==item.min_price?'':' ~ ￥'+item.max_price}}
          </div>
        </router-link>
      </li>
    </ul>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
import headerMessage from '../common/header-message'
import FooterNav from '../common/footer-nav'
import {Badge, Swiper, SwiperItem} from 'vux'
import axios from 'axios'
import MeScroll from '../../../static/js/mescroll.min.js'
import 'mescroll.js/mescroll.min.css'

require('../../assets/css/index.css')

export default {
  name: 'home',
  data () {
    return {
      financial: false,
      type: 2,
      banners: [],
      menunLists: [],
      menunListsFirst: [],
      menunListsSecond: [],
      mescroll: null,
      goodsLists: []
    }
  },
  methods: {
    menunListsCouter () {},
    getBanner () {
      if (/MicroMessenger/i.test(navigator.userAgent)) {
        this.type = 3
      } else {
        this.type = 2
      }
      axios.post('api/img/banner', {
        'type': this.type
      }).then((response) => {
        if (response.data.status == 0) {
          this.banners = response.data.data
          // 响应成功回调
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.data.msg
          })
        }
      }).catch((response) => {
        // 响应错误回调
        this.errorMsg()
      })
    },
    getMenunLists () {
      axios.get('api/goods/getCategory').then((response) => {
        if (response.data.status == 0) {
          this.menunLists = response.data.data
          // 响应成功回调
          var len = this.menunLists.length
          var pageNo = (len / 8)
          if (pageNo < 1) {
            this.menunListsFirst = this.menunLists
          } else if (pageNo >= 1 && pageNo <= 2) {
            this.menunListsFirst = this.menunLists.slice(0, 8)
            this.menunListsSecond = this.menunLists.slice(8, 16)
          }
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.data.msg
          })
        }
      }).catch((response) => {
        // 响应错误回调
        this.errorMsg()
      })
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback: function (page) {
      // 联网加载数据
      var self = this
      this.getListDataFromNet(page.num, page.size, function (curPageData, totalSize) {
        if (page.num == 1) {
          self.goodsLists = []
        }
        // 更新列表数据
        self.goodsLists = self.goodsLists.concat(curPageData)
        self.mescroll.endBySize(curPageData.length, totalSize) // 必传参数(当前页的数据个数, 总数据量)
      }, function () {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        self.mescroll.endErr()
      })
    },
    getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
      let self = this
      // 延时一秒,模拟联网
      setTimeout(function () {
        axios.post('api/goods/getRecommend', {
          'pageNumber': pageNum,
          'pageSize': pageSize
        }).then((response) => {
          if (response.data.status == 0) {
            // 响应成功回调
            var data = response.data.data.list
            var total = response.data.data.total
            var listData = []// 模拟分页数据
            for (var i = 0; i < data.length; i++) {
              if (data[i] !== undefined) {
                listData.push(data[i])
              }
            }
            successCallback && successCallback(listData, total)// 成功回调
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.data.msg
            })
          }
        }).catch((response) => {
          // 响应错误回调
          self.errorMsg()
          errorCallback && errorCallback()// 失败回调
        })
      }, 1000)
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
    this.getBanner()
    this.getMenunLists()
    this.menunListsCouter()
  },
  mounted () {
    var self = this
    self.mescroll = new MeScroll('mescroll', {
      up: {
        /* 上拉加载的配置参数 */
        auto: true, // 是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
        callback: self.upCallback, // 上拉回调
        // 以下参数可删除,不配置
        isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
        // page:{size:8}, //可配置每页8条数据,默认10
        offset: 500,
        empty: { // 配置列表无任何数据的提示
          warpId: null,
          // icon: '../res/img/mescroll-empty.png'
          tip: '亲,暂无相关数据哦~',
          btntext: '去逛逛 >',
          btnClick: function () {
          }
        }
      }
    })
  },
  components: {
    headerMessage, FooterNav, Swiper, SwiperItem, Badge
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
