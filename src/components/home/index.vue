<template>
  <!--滑动区域-->
  <span>
    <div class="mescroll"  id="mescroll" style="padding-top: 2.2rem;">
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
                  <router-link v-if="item.type > 0 && item.type !== 10" :to="{path: '/goods-class', query: {id: item.id }}" :key="index">
                    <img :src="item.img" alt=""/>
                    <div class="text-truncate">
                      {{item.name}}
                    </div>
                  </router-link>
                  <a href="http://h5.jizhongdiancai.com/jzdc-services/finance.html" v-else-if="item.flag === 1" :key="index">
                    <img :src="item.img" alt=""/>
                    <div class="text-truncate">
                      {{item.name}}
                    </div>
                  </a>
                  <a href="http://h5.jizhongdiancai.com/jzdc-services/index.html" v-else-if="item.type === 10" :key="index">
                    <img :src="item.img" alt=""/>
                    <div class="text-truncate">
                      {{item.name}}
                    </div>
                  </a>
                </template>
              </div>
            </swiper-item>
            <swiper-item  v-if="menunListsSecond.length > 0" class="black">
              <div class="menu-nav">
                <template v-for="(item, index) in menunListsSecond">
                  <router-link v-if="item.type > 0 && item.type !== 10" :to="{path: '/goods-class', query: {id: item.id }}" :key="index">
                    <img :src="item.img" alt=""/>
                    <div class="text-truncate">
                      {{item.name}}
                    </div>
                  </router-link>
                  <a href="http://h5.jizhongdiancai.com/jzdc-services/finance.html" v-else-if="item.flag === 1" :key="index">
                    <img :src="item.img" alt=""/>
                    <div class="text-truncate">
                      {{item.name}}
                    </div>
                  </a>
                  <a href="http://h5.jizhongdiancai.com/jzdc-services/index.html" v-else-if="item.type === 10" :key="index">
                    <img :src="item.img" alt=""/>
                    <div class="text-truncate">
                      {{item.name}}
                    </div>
                  </a>
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
      <ul id="dataList" class="goods-lists data-list" v-cloak>
        <li v-for="(item, index) in goodsLists" :key="index">
          <router-link :to="'/detail/'+ item.id">
            <img :src="item.url" alt=""/>
            <div class="goods-title">
              {{item.title}}
            </div>
            <div class="goods-price text-red">
              ￥ {{item.min_price === '0.00'? item.w_price:item.min_price}}{{item.max_price===item.min_price?'':' ~ ￥'+item.max_price}}
            </div>
          </router-link>
        </li>
      </ul>
    </div>
    <FooterNav></FooterNav>
  </span>
</template>

<script>
import headerMessage from '../common/header-message'
import FooterNav from '../common/footer-nav'
import {Badge, Swiper, SwiperItem} from 'vux'
import service from '@/service'
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
    async getBanner () {
      try {
        const {status, msg, data} = await service.post('api/img/banner', {type: this.type})
        if (status === 0) {
          this.banners = data
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: msg
          })
        }
      } catch (e) {
        this.errorMsg()
      }
    },
    async getMenunLists () {
      try {
        const {status, data, msg} = await service.get('api/goods/getCategory')
        if (status === 0) {
          this.menunLists = data
          let len = this.menunLists.length
          let pageNo = (len / 8)
          if (pageNo < 1) {
            this.menunListsFirst = this.menunLists
          } else {
            this.menunListsFirst = this.menunLists.slice(0, 8)
            this.menunListsSecond = this.menunLists.slice(8, 16)
          }
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: msg
          })
        }
      } catch (e) {
        this.errorMsg()
      }
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback: function (page) {
      // 联网加载数据
      var self = this
      this.getListDataFromNet(page.num, page.size, function (curPageData, totalSize) {
        if (page.num === 1) {
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
      setTimeout(async function () {
        try {
          const {status, data: {list, total}, msg} = await service.post('api/goods/getRecommend', {pageNumber: pageNum, pageSize})
          if (status === 0) {
            let listData = []
            for (let i = 0; i < list.length; i++) {
              if (list[i] !== undefined) {
                listData.push(list[i])
              }
              successCallback && successCallback(listData, total)
            }
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: msg
            })
          }
        } catch (e) {
          self.errorMsg()
        }
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
  /*@import url("../../assets/css/index.css");*/
</style>
