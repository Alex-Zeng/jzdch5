<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        我的订单
      </div>
      <div @click="showSelect">{{getState(this.state)}}
        <i class="icon iconfont icon-xiala" style="padding-right: 1rem;font-size: 0.4rem !important;">
      </i>
      </div>
    </div>
    <div v-show="show" class="menu-wrap">
      <ul class="menu-list">
        <li class="menu-item" @click="state=-1,show=false">全部</li>
        <li class="menu-item" @click="state=0,show=false">待核价</li>
      </ul>
      <ul class="menu-list">
        <li class="menu-item" @click="state=1,show=false">待签约</li>
        <li class="menu-item" @click="state=3,show=false">待发货</li>
      </ul>
      <ul class="menu-list">
        <li class="menu-item" @click="state=6,show=false">待收货</li>
        <li class="menu-item" @click="state=9,show=false">账期中</li>
      </ul>
      <ul class="menu-list">
        <li class="menu-item" @click="state=13,show=false">交易完成</li>
        <li class="menu-item" @click="state=8,show=false">售后处理</li>
      </ul>
    </div>

    <div class="mescroll" id="mescroll">
      <div class="order-wrap"  v-show="!show">
        <div class="order-card" v-for="i in list" :key="i.id">
          <div class="indent-title">
            {{i.companyName}}
          </div>
          <div class="orderNo">订单号：{{i.out_id}} <span>状态：{{i.service_type === 1? '待售后':getState(i.groupId, i.state)}}</span></div>
          <div>
            <div class="order-item" v-for="(good, key) in i.goods" :key="key">
              <div slot="content" class="indent-content">
                <img :src="good.icon" alt="">
                <div class="indent-info">
                  <h3><router-link to="/">{{good.title}}</router-link></h3>
                  <div class="text-muted">商品规格&emsp;{{good.specifications_info}}</div>
                  <div class="text-muted" >物料编号&emsp;{{good.specifications_no}}</div>
                  <div class="text-muted" >物料规格&emsp;{{good.specifications_name}}</div>
                  <div class="text-muted">数量&emsp;{{good.quantity}}&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">{{good.price}}元</span></div>
                  <input type="hidden">
                </div>
              </div>
            </div>
          </div>
          <div class="order-action">
            <div class="order-button" @click="gotoDetail(i.out_id)">查看详情</div>
            <div class="order-button" v-if="(i.state ===1 || i.state === 0)&&i.groupId===4" @click="cancle(i.out_id)">取消交易</div>
            <div class="order-button" v-if="(i.state ===6 && (i.service_type ===0 || i.service_type ===2))&&i.groupId===4" @click="receipt(i.out_id)">确定收货</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea, XButton } from 'vux'
import '@/assets/css/order.css'
import MeScroll from '../../../static/js/mescroll.min.js'
import 'mescroll.js/mescroll.min.css'
export default {
  name: 'notice-detail',
  watch: {
    state: function () {
      setTimeout(() => {
        var self = this
        self.mescroll.resetUpScroll(true)
      }, 300)
    }
  },
  data () {
    return {
      list: [],
      show: false,
      state: -1,
      mescroll: null
    }
  },
  created () {
    window.scrollTo(0, 0)
  },
  mounted () {
    var _sel = this
    _sel.mescroll = new MeScroll('mescroll', {
      up: {
        /* 上拉加载的配置参数 */
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
    })
  },
  methods: {
    upCallback: function (page) {
      // 联网加载数据
      var self = this
      this.getListDataFromNet(page.num, page.size, self.state, function (curPageData, totalSize) {
        // curPageData = [] // 打开本行注释,可演示列表无任何数据empty的配置
        if (page.num === 1) self.list = []
        // 更新列表数据
        self.list = self.list.concat(curPageData)
        self.mescroll.endBySize(curPageData.length, totalSize) // 必传参数(当前页的数据个数, 总数据量)
      }, function () {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        self.mescroll.endErr()
      })
    },
    receipt (no) {
      this.$vux.confirm.show({
        title: '提示',
        content: '请确认是否收到货物',
        onCancel: () => {},
        onConfirm: () => {
          this.$vux.loading.show(
            {
              text: '提交中...'
            }
          )
          axios.post('api/order/receipt', {no}).then((response) => {
            this.$vux.loading.hide()
            const {msg, status} = response.data
            if (status !== 0) {
              this.$vux.toast.show({
                type: 'warn',
                text: msg
              })
            } else {
              this.$vux.toast.show({
                type: 'success',
                text: msg
              })
              setTimeout(() => {
                var self = this
                self.mescroll.resetUpScroll(true)
              }, 300)
            }
          }).catch((response) => {
            this.errorMsg()
            this.$vux.loading.hide()
          })
        }
      })
    },
    cancle (no) {
      this.$vux.confirm.show({
        title: '提示',
        content: '此操作会取消当前订单，请确定',
        onCancel: () => {},
        onConfirm: () => {
          this.$vux.loading.show(
            {
              text: '提交中...'
            }
          )
          axios.post('api/order/cancel', {no}).then((response) => {
            this.$vux.loading.hide()
            const {msg, status} = response.data
            if (status !== 0) {
              this.$vux.toast.show({
                type: 'warn',
                text: msg
              })
            } else {
              this.$vux.toast.show({
                type: 'success',
                text: msg
              })
              setTimeout(() => {
                var self = this
                self.mescroll.resetUpScroll(true)
              }, 300)
            }
          }).catch((response) => {
            this.errorMsg()
            this.$vux.loading.hide()
          })
        }
      })
    },
    getListDataFromNet (pageNum, pageSize, state, successCallback, errorCallback) {
      let self = this
      // 延时一秒,模拟联网
      setTimeout(function () {
        axios.post('api/order/getList', {
          'pageNumber': pageNum,
          'pageSize': pageSize,
          'status': state
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
              text: response.data.msg
            })
          }
        }).catch((response) => {
          // 响应错误回调
          self.errorMsg()
          errorCallback && errorCallback()// 失败回调
        })
      }, 200)
    },
    showSelect () {
      this.show = true
    },
    gotoDetail (no) {
      this.$router.push('/order-detail/' + no)
    },
    getState (group, state) {
      if (group === 4) {
        switch (state) {
          case 0:
            return '待核价'
          case 1:
            return '待签约'
          case 2:
            return '待采购商打款'
          case 3:
            return '待发货'
          case 4:
            return '订单关闭'
          case 6:
            return '待收货'
          case 7:
            return '待质检'
          case 8:
            return '问题确认中'
          // 4:待打款 5:待采购商打款
          case 9:
          case 10:
            return '待打款'
          // 4:交易完成 5:待收款
          case 11:
            return '交易完成'
          case 13:
            return '交易完成'
        }
      } else if (group === 5) {
        switch (state) {
          case 0:
            return '待核价'
          case 1:
            return '待签约'
          case 2:
            return '待采购商打款'
          case 3:
            return '待发货'
          case 4:
            return '订单关闭'
          case 6:
            return '待收货'
          case 7:
            return '待质检'
          case 8:
            return '问题确认中'
          // 4:待打款 5:待采购商打款
          case 9:
          case 10:
            return '待采购商打款'
          // 4:交易完成 5:待收款
          case 11:
            return '待收款'
          case 13:
            return '交易完成'
        }
      } else {
        switch (state) {
          case -1:
            return '全部'
          case 0:
            return '待核价'
          case 1:
            return '待签约'
          case 2:
            return '待采购商打款'
          case 3:
            return '待发货'
          case 4:
            return '订单关闭'
          case 6:
            return '待收货'
          case 7:
            return '待质检'
          case 8:
            return '问题确认中'
          case 9:
            return '账期中'
          case 10:
            return '逾期中'
          case 11:
            return '待打款至供应商'
          case 13:
            return '交易完成'
        }
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
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Group,
    Datetime,
    XTextarea,
    XButton
  }
}
</script>

<style scoped>
.menu-wrap{
  margin-top: 4.8rem;
}

.menu-list{
  display: flex;
  width: 100%;
}
.menu-list .menu-item{
  flex: 1;
  flex-basis: 50%;
  text-align: center;
  margin: .8rem 1.2rem;
  padding: 0.2rem 0;
  line-height: 1.8;
  background-color: #5fcaed;
  color: #ffffff;
  border-radius: 0.28rem;
  font-size: 0.8rem;
}
</style>
