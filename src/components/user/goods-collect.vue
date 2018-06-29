<template>
   <div>
     <div class="header-nav header-nav-fixed">
       <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
       <div>
         收藏夹
       </div>
       <div style="padding-right: 2rem">&emsp;</div>
     </div>
     <div class="search-lists-header"><span style="color: #222222;">默认</span> <span @click="sortMethods">价格<i class="icon iconfont icon-jiagepaixu1"></i></span></div>
     <div  class="mescroll" id="mescroll" style="padding-top: 5.5rem;border-top: 0.05rem solid #E0E0E0;">
       <div id="favoriteList" v-cloak>
         <!--展示上拉加载的数据列表-->
         <div v-for="(item, index) in favoriteList" :key="index">
           <swipeout>
             <swipeout-item transition-mode="follow">
               <div slot="right-menu">
                 <swipeout-button @click.native="onButtonClick(item.id, index)" type="warn">删除</swipeout-button>
               </div>
               <div slot="content" class="shop-car-content"  @click="$router.push('/detail/'+item.id)">
                 <div>
                   <img :src="item.icon" alt="图片">
                   <div>
                     <h3>{{item.title}}</h3>
                     <span class="text-red">￥ {{item.w_price}}</span>
                     <div class="text-muted fr">详情 <i class="icon iconfont icon-youjiantou"></i></div>
                   </div>
                 </div>
               </div>
             </swipeout-item>
           </swipeout>
         </div>
       </div>
     </div>
   </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, Icon, Checklist, CheckIcon } from 'vux'
import MeScroll from '../../../static/js/mescroll.min.js'
import 'mescroll.js/mescroll.min.css'
export default {
  name: 'goods-collect',
  data () {
    return {
      favoriteList: [],
      mySort: 'asc'
    }
  },
  methods: {
    onButtonClick (id, index) {
      let self = this
      console.log('删除')
      axios.post('api/goods/removeFavorite', {
        'goodsId': id
      }).then((response) => {
        console.log(index)
        self.favoriteList.splice(index, 1)
      }).catch((response) => {})
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback: function (page) {
      console.log('联网加载数据')
      // 联网加载数据
      var self = this
      this.getListDataFromNet(page.num, page.size, function (curPageData, totalSize) {
        // curPageData = [] // 打开本行注释,可演示列表无任何数据empty的配置
        if (page.num === 1) self.favoriteList = []
        // 更新列表数据
        self.favoriteList = self.favoriteList.concat(curPageData)
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
        axios.post('api/user/getFavoriteList', {
          'pageNumber': pageNum,
          'pageSize': pageSize,
          'field': 'price',
          'sort': self.mySort
        }).then((response) => {
          if (response.data.status === 0) {
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
            self.$vux.toast.show({
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
          // 响应错误回调
          console.log('error')
          self.errorMsg()
          errorCallback && errorCallback()// 失败回调
        })
      }, 1000)
    },
    sortMethods () {
      if (this.mySort === 'asc') {
        this.mySort = 'desc'
        sessionStorage.setItem('searchSort', 'desc')
      } else {
        this.mySort = 'asc'
        sessionStorage.setItem('searchSort', 'asc')
      }
      console.log(this.mySort)
      this.mescroll.resetUpScroll()
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
    window.scrollTo(0, 0)
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
          warpId: 'favoriteList',
          // icon: '../res/img/mescroll-empty.png',
          tip: '亲,暂无相关数据哦~',
          btntext: '去逛逛 >',
          btnClick: function () {
            self.$router.push('/')
          }
        }
      }
    })
  },
  components: {
    Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, Icon, Checklist, CheckIcon
  }
}
</script>

<style scoped>

</style>
