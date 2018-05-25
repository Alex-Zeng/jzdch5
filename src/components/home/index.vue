<template>
  <div>
    <search-view></search-view>
    <div class="banner">
      <swiper loop :show-desc-mask="false" dots-position="center" height="9.9rem" :list="banners" :show-dots="banners.length > 1? true:false"></swiper>
    </div>
    <div class="main-body">
      <div class="menu-nav-box">
        <swiper :show-desc-mask="false" height="10.5rem" :show-dots="false">
          <swiper-item class="black">
            <div class="menu-nav">
              <template v-for="(item, index) in menunListsFirst">
                <a :href="item.url" :key="index">
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
                <a :href="item.url" :key="index">
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
        <a class="text-muted" href="javascript:;">
          更多&nbsp;<i class="icon iconfont icon-youjiantou"></i>
        </a>
      </div>
      <ul class="goods-lists">
        <li v-for="(item, index) in goodsLists" :key="index">
          <router-link :to="item.url">
            <img src="" alt=""/>
            <div class="goods-title">
              {{item.goodsTitle}}
            </div>
            <div class="goods-price">
              <span class="text-red">￥ {{item.goodsPrice}}</span>
              <span class="text-muted">详情&nbsp;<i class="icon iconfont icon-youjiantou"></i></span>
            </div>
          </router-link>

        </li>
      </ul>
    </div>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
import FooterNav from '../common/footer-nav'
import {Badge, Swiper, SwiperItem} from 'vux'

require('../../assets/css/index.css')

export default {
  name: 'home',
  data () {
    return {
      banners: [{
        url: 'javascript:',
        img: require('../../assets/images/banner.png')
      }, {
        url: 'javascript:',
        img: require('../../assets/images/banner.png')
      }, {
        url: 'javascript:',
        img: require('../../assets/images/banner.png')
      }, {
        url: 'javascript:',
        img: require('../../assets/images/banner.png')
      }],
      menunLists: [
        {'name': '冰箱配件冰箱配件冰箱配件', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '洗衣机配件', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '空调配件', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '消毒柜配件', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '热水器配件', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '原材料', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '金融服务', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '物流服务', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '金融服务', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')},
        {'name': '物流服务', 'url': '', 'img': require('../../assets/images/bingxiang-icon.png')}
      ],
      goodsLists: [
        {'goodsTitle': '上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角', 'img': '', 'goodsPrice': '8.88', 'url': 'javascript:;'},
        {'goodsTitle': '上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角', 'img': '', 'goodsPrice': '8.88', 'url': 'javascript:;'},
        {'goodsTitle': '上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角', 'img': '', 'goodsPrice': '8.88', 'url': 'javascript:;'},
        {'goodsTitle': '上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角', 'img': '', 'goodsPrice': '8.88', 'url': 'javascript:;'},
        {'goodsTitle': '上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角', 'img': '', 'goodsPrice': '8.88', 'url': 'javascript:;'},
        {'goodsTitle': '上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角上诺行护角', 'img': '', 'goodsPrice': '8.88', 'url': 'javascript:;'}

      ]
    }
  },
  methods: {
    menunListsCouter () {
      var len = this.menunLists.length
      var pageNo = (len / 8)
      if (pageNo < 1) {
        this.menunListsFirst = this.menunLists
      } else if (pageNo >= 1 && pageNo <= 2) {
        this.menunListsFirst = this.menunLists.slice(0, 8)
        this.menunListsSecond = this.menunLists.slice(8, 16)
      }
    }
  },
  created () {
    this.menunListsCouter()
  },
  mounted () {
  },
  components: {
    FooterNav, Swiper, SwiperItem, Badge
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*@import url("../../assets/css/index.css");*/
</style>
