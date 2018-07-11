<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        消息中心
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <tab :line-width=2 active-color='#5FCAED' v-model="index">
      <tab-item class="vux-center" :selected="selectedDeafult === item" v-for="(item, index) in list2" @click="selectedDeafult = item" @on-item-click="onItemClick" :key="index" :i="index">{{item}}</tab-item>
    </tab>
    <div  v-show="index === 0" id="mescroll" class="mescroll message-lists" style="padding-bottom: 6rem;">
      <swipeout v-for="(item, index) in MessageList" :key="index">
        <p class="text-muted release-time" style="font-size: 0.6rem;">{{item.release_time}}</p>
        <swipeout-item transition-mode="follow">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick(item.id, index)" type="warn"><i class="icon iconfont icon-shanchu1"></i></swipeout-button>
          </div>
          <div slot="content" class="indent-content">
            <img :src="item.icon" alt="">
            <div class="indent-info">
              <h3>{{item.title}}</h3>
              <div class="text-muted">{{item.content}}</div>
              <div class="text-muted">{{item.orderNo}}</div>
            </div>
          </div>
        </swipeout-item>
      </swipeout>
    </div>
    <div  v-show="index === 1" id="mescroll1" class="mescroll" style="padding-bottom: 6rem;">
      <ul class="notice-list">
        <li v-for="(item, index) in NoticeList" :key="index">
          <p class="text-muted release-time" style="font-size: 0.6rem;">{{item.release_time}}</p>
          <div class="notice-content" @click="noticeDetail(item.id)">
            <h3>{{item.title}}</h3>
            <div>{{item.summary}}</div>
            <div><span>查看详情</span> <i class="icon iconfont icon-youjiantou"></i></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Tab, TabItem, Sticky, Swiper, SwiperItem, Swipeout, SwipeoutItem, SwipeoutButton } from 'vux'
import axios from 'axios'
import MeScroll from '../../../static/js/mescroll.min.js'
import 'mescroll.js/mescroll.min.css'
import '@/assets/css/message.css'
export default {
  name: 'message',
  data () {
    return {
      selectedDeafult: '我的消息',
      list2: ['我的消息', '公告'],
      index: 0,
      mescroll: null,
      mescroll1: null,
      url: ['api/user/getMessageList', 'api/user/getNoticeList'],
      MessageList: [],
      NoticeList: []
    }
  },
  methods: {
    onButtonClick (id, index) {
      axios.post('api/user/removeMessage', {
        'id': id
      }).then((response) => {
        this.MessageList.splice(index, 1)
      }).catch((response) => {})
    },
    onItemClick (index) {
      console.log('on item click:', index)
      sessionStorage.setItem('indexTag', index)
    },
    noticeDetail (id) {
      this.$router.push('/message/notice-detail/' + id)
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback: function (page) {
      console.log('联网加载数据')
      // 联网加载数据
      var self = this
      this.getListDataFromNet(page.num, page.size, function (curPageData, totalSize) {
        // curPageData = [] // 打开本行注释,可演示列表无任何数据empty的配置
        if (page.num === 1) self.MessageList = []
        // 更新列表数据
        self.MessageList = self.MessageList.concat(curPageData)
        self.mescroll.endBySize(curPageData.length, totalSize) // 必传参数(当前页的数据个数, 总数据量)
      }, function () {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        self.mescroll.endErr()
      })
    },
    getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
      let self = this
      axios.post(self.url[0], {
        'pageNumber': pageNum,
        'pageSize': pageSize
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
        } else if (response.data.status === -2) {
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未登录，是否去登录？',
            onCancel () {},
            onConfirm () {
              sessionStorage.removeItem('oldUrl')
              sessionStorage.setItem('oldUrl', self.$route.path)
              self.$router.push('/loginByCode')
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
        // 响应错误回调
        console.log('error')
        self.errorMsg()
        errorCallback && errorCallback()// 失败回调
      })
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback1: function (page) {
      console.log('联网加载数据')
      // 联网加载数据
      var self = this
      this.getListDataFromNet1(page.num, page.size, function (curPageData, totalSize) {
        // curPageData = [] // 打开本行注释,可演示列表无任何数据empty的配置
        if (page.num === 1) self.NoticeList = []
        // 更新列表数据
        self.NoticeList = self.NoticeList.concat(curPageData)
        self.mescroll1.endBySize(curPageData.length, totalSize) // 必传参数(当前页的数据个数, 总数据量)
      }, function () {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        self.mescroll1.endErr()
      })
    },
    getListDataFromNet1 (pageNum, pageSize, successCallback, errorCallback) {
      let self = this
      // 延时一秒,模拟联网
      setTimeout(function () {
        axios.post(self.url[1], {
          'pageNumber': pageNum,
          'pageSize': pageSize
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
          // 响应错误回调
          console.log('error')
          self.errorMsg()
          errorCallback && errorCallback()// 失败回调
        })
      }, 1000)
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
  mounted () {
    let self = this
    /* 创建MeScroll对象 */
    // 创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
    self.mescroll = new MeScroll('mescroll', {
      // 上拉加载的配置项
      up: {
        callback: self.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
        isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
        empty: {
          warpId: null,
          // icon: '../res/img/mescroll-empty.png', // 图标,默认null
          tip: '暂无相关数据~', // 提示
          btntext: '去逛逛 >', // 按钮,默认""
          btnClick: function () { // 点击按钮的回调,默认null
            alert('点击了按钮,具体逻辑自行实现')
          }
        }
      }
    })
    self.mescroll1 = new MeScroll('mescroll1', {
      // 上拉加载的配置项
      up: {
        callback: self.upCallback1, // 上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
        isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
        empty: {
          warpId: null,
          // icon: '../res/img/mescroll-empty.png', // 图标,默认null
          tip: '暂无相关数据~', // 提示
          btntext: '去逛逛 >', // 按钮,默认""
          btnClick: function () { // 点击按钮的回调,默认null
            alert('点击了按钮,具体逻辑自行实现')
          }
        }
      }
    })
  },
  created () {
    this.selectedDeafult = sessionStorage.getItem('selectedDeafult')
    sessionStorage.removeItem('selectedDeafult')
  },
  components: { Tab, TabItem, Sticky, Swiper, SwiperItem, Swipeout, SwipeoutItem, SwipeoutButton }
}
</script>

<style scoped>

</style>
