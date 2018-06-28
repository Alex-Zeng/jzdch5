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
    <swiper v-model="index" :show-dots="false">
      <swiper-item>
        <div class="tab-swiper vux-center">
          <div id="mescroll0" class="mescroll">
            <ul id="dataList0" class="data-list">
              <li v-for="(item, index) in MessageList" :key="index">
                  <p class="pd-name">{{item.title}}</p>
                  <p class="pd-price">200.00 元</p>
                  <p class="pd-sold">已售50件</p>
              </li>
            </ul>
          </div>
        </div>
      </swiper-item>
      <swiper-item>
        <div class="tab-swiper vux-center">
          <div id="mescroll1" class="mescroll">
            <ul id="dataList1" class="data-list">
              <li v-for="(item, index) in NoticeList" :key="index">
                <p class="pd-name">{{item.title}}</p>
                <p class="pd-price">200.00 元</p>
                <p class="pd-sold">已售50件</p>
              </li>
            </ul>
          </div>
        </div>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
import { Tab, TabItem, Sticky, Swiper, SwiperItem } from 'vux'
import axios from 'axios'
import MeScroll from '../../../static/js/mescroll.min.js'
import 'mescroll.js/mescroll.min.css'
export default {
  name: 'message',
  data () {
    return {
      selectedDeafult: '我的消息',
      list2: ['我的消息', '公告'],
      index: 0,
      mescroll: null,
      url: ['api/user/getMessageList', 'api/user/getNoticeList'],
      MessageList: [],
      NoticeList: [],
      dataList0: [],
      dataList1: [],
      goodsLists: []
    }
  },
  methods: {
    onItemClick (index) {
      console.log('on item click:', index)
      sessionStorage.setItem('indexTag', index)
      this.mescroll.destroy()
      this.initMescroll('mescroll' + index, 'dataList' + index)
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page) {
      // 联网加载数据
      var self = this
      if (Number(sessionStorage.getItem('indexTag')) === 0) {
        this.getListDataFromNet(page.num, page.size, function (curPageData, totalSize) {
          // curPageData = [] // 打开本行注释,可演示列表无任何数据empty的配置
          if (page.num === 1) self.MessageList = []
          // 更新列表数据
          self.MessageList = self.MessageList.concat(curPageData)
          self.mescroll.endBySize(curPageData.length, totalSize) // 必传参数(当前页的数据个数, 总数据量)
          console.log(self.MessageList)
          console.log(self.NoticeList)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      } else {
        this.getListDataFromNetNotice(page.num, page.size, function (curPageData, totalSize) {
          // curPageData = [] // 打开本行注释,可演示列表无任何数据empty的配置
          if (page.num === 1) self.NoticeList = []
          // 更新列表数据
          self.NoticeList = self.NoticeList.concat(curPageData)
          self.mescroll.endBySize(curPageData.length, totalSize) // 必传参数(当前页的数据个数, 总数据量)
          console.log(self.MessageList)
          console.log(self.NoticeList)
        }, function () {
          // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
          self.mescroll.endErr()
        })
      }
    },
    getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
      let self = this
      // 延时一秒,模拟联网
      setTimeout(function () {
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
    getListDataFromNetNotice (pageNum, pageSize, successCallback, errorCallback) {
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
    initMescroll (mescrollId, clearEmptyId) {
      let self = this
      /* 创建MeScroll对象 */
      // 创建MeScroll对象,内部已默认开启下拉刷新,自动执行up.callback,刷新列表数据;
      self.mescroll = new MeScroll(mescrollId, {
        // 上拉加载的配置项
        up: {
          callback: self.upCallback, // 上拉回调,此处可简写; 相当于 callback: function (page) { getListData(page); }
          isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          noMoreSize: 4, // 如果列表已无数据,可设置列表的总数量要大于半页才显示无更多数据;避免列表数据过少(比如只有一条数据),显示无更多数据会不好看; 默认5
          empty: {
            icon: '../res/img/mescroll-empty.png', // 图标,默认null
            tip: '暂无相关数据~', // 提示
            btntext: '去逛逛 >', // 按钮,默认""
            btnClick: function () { // 点击按钮的回调,默认null
              alert('点击了按钮,具体逻辑自行实现')
            }
          },
          clearEmptyId: clearEmptyId // 相当于同时设置了clearId和empty.warpId; 简化写法;默认null
        }
      })
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
    this.initMescroll('mescroll0', 'dataList0', 0)
    /* var _sel = this
    _sel.mescroll = new MeScroll('mescroll', {
      up: {
        /!* 上拉加载的配置参数 *!/
        auto: true, // 是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
        callback: _sel.upCallback, // 上拉回调
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
            alert('点击了去逛逛按钮')
          }
        }
      }
    }) */
  },
  components: {
    MeScroll,
    Tab,
    TabItem,
    Sticky,
    Swiper,
    SwiperItem
  }
}
</script>

<style scoped>

</style>
