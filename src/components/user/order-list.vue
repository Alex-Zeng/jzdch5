<template>
  <div>
    <div class="header-nav">
      <router-link class="icon iconfont icon-back" style="padding-right: 1rem;" tag="i" to="/user"></router-link>
      <div>
        我的订单
      </div>
      <div @click="showSelect">
        {{menuRaw[state] || '全部'}}
        <i class="icon iconfont icon-xiala" :class="{'icon-order-active': show}" style="font-size: 0.4rem !important;">
      </i>
      </div>
    </div>
    <div v-show="show" class="menu-wrap">
      <ul class="menu-list" @click="show=false" v-for="(item, key) in menu" :key="'menu'+key">
        <router-link :to="`/order-list/${link.key}`"  class="menu-item" tag="li" v-for="(link, childkey) in item" :key="'menu'+key+childkey">{{link.value}}</router-link>
        <li class="menu-item-empty" v-if="item.length < 2"></li>
      </ul>
    </div>

    <div class="mescroll"  id="order-mescroll" v-show="!show">
      <div class="order-wrap">
        <div class="order-card" v-for="(i, wkey) in list" :key="wkey">
          <div class="indent-title" style="font-size: 0.75rem; padding: 0.28rem 0.5rem; height: auto;border-top: 0;">
            <i class="icon iconfont icon-shangdian text-blue"></i>
            {{i.companyName}}
          </div>
          <div class="orderNo">订单号：{{i.out_id}} <span>{{parseInt(i.service_type) == 1? '售后处理中': parseInt(i.service_type) == 2 && parseInt(state) == 6? '售后完成': getState(i.state, parseInt(i.groupId))}}</span></div>
          <div>
            <div class="order-item" v-for="(good, key) in i.goods" :key="wkey+key">
              <div slot="content" class="indent-content">
                <img :src="good.icon" alt="">
                <div class="indent-info">
                  <h3 class="title"><router-link to="/">{{good.title}}</router-link></h3>
                  <div class="info-item">{{good.s_info}}</div>
                  <div class="info-item">
                    <span class="label">
                      物料编号
                    </span>
                    <span class="value">
                      {{good.specifications_no}}
                    </span>
                  </div>
                  <div class="info-item">
                    <span class="label">
                      物料规格
                    </span>
                    <span class="value">
                      {{good.specifications_name}}
                    </span>
                  </div>
                  <div class="info-item">
                    <div class="info-item" style="margin-right: 0.8rem;">
                      <span class="sm-label">
                        数量
                      </span>
                      <span class="value">{{good.quantity}}</span>
                    </div>
                    <div class="info-item">
                      <span class="sm-label">单价</span>
                      <span class="text-red">{{good.price}}元</span></div>
                    </div>
                  <input type="hidden">
                </div>
              </div>
            </div>
          </div>
          <div class="detail-money"><span>总价：<span class="text-red">{{i.money}}元</span></span><span v-if="i.money !== i.goods_money">（原价:{{i.goods_money}}元）</span></div>
          <div class="order-action">
            <div style="margin-right: auto;"></div>
            <div class="order-button" v-if="(parseInt(i.state) ==1 || parseInt(i.state) == 0)&&parseInt(i.groupId)==4" @click="cancle(i.out_id)">取消交易</div>
            <div class="order-button" v-if="(parseInt(i.state) ==6 && (parseInt(i.service_type) ==0 || i.service_type ==2))&&parseInt(i.groupId)==4" @click="receipt(i.out_id)">确定收货</div>
            <div class="order-button" @click="gotoDetail(i.out_id)">查看详情</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/service'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea, XButton } from 'vux'
import '@/assets/css/order.css'
import MeScroll from '../../../static/js/mescroll.min.js'
import 'mescroll.js/mescroll.min.css'

export default {
  name: 'order-list',
  watch: {
    $route: function (val) {
      const {params: {type}} = val
      this.show = false
      this.state = type * 1
      this.mescroll.resetUpScroll(true)
    }
  },
  data () {
    return {
      list: [],
      show: false,
      state: 1,
      mescroll: null,
      menu: [],
      menuRaw: {}
    }
  },
  created () {
    window.scrollTo(0, 0)
  },
  mounted () {
    const {params: {type}} = this.$route
    this.state = type * 1
    var self = this
    self.mescroll = new MeScroll('order-mescroll', {
      up: {
        /* 上拉加载的配置参数 */
        use: true,
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
    this.showStatusList()
  },
  methods: {
    upCallback: function (page) {
      var self = this
      this.getListDataFromNet(page.num, page.size, self.state, function (curPageData, totalSize) {
        if (page.num == 1) self.list = []
        // 更新列表数据
        self.list = self.list.concat(curPageData)
        self.mescroll.endBySize(curPageData.length, totalSize)
      }, function () {
        self.mescroll.endErr()
      })
    },
    receipt (no) {
      this.$vux.confirm.show({
        title: '提示',
        content: '请确认是否收到货物',
        onCancel: () => {},
        onConfirm: async () => {
          this.$vux.loading.show(
            {
              text: '提交中...'
            }
          )
          const {msg, status} = await service.post('api/order/receipt', {no})
          this.$vux.loading.hide()
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
              this.mescroll.resetUpScroll(true)
            }, 300)
          }
        }
      })
    },
    cancle (no) {
      this.$vux.confirm.show({
        title: '提示',
        content: '此操作会取消当前订单，请确定',
        onCancel: () => {},
        onConfirm: async () => {
          this.$vux.loading.show(
            {
              text: '提交中...'
            }
          )
          const {msg, status} = await service.post('api/order/cancel', {no})
          this.$vux.loading.hide()
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
              this.mescroll.resetUpScroll(true)
            }, 300)
          }
        }
      })
    },
    getListDataFromNet (pageNum, pageSize, state, successCallback, errorCallback) {
      setTimeout(async () => {
        const {data: {list, total}, status, msg} = await service.post('api/order/getList', {
          'pageNumber': pageNum,
          'pageSize': pageSize,
          'status': state
        })
        if (status == 0) {
          let listData = []// 模拟分页数据
          for (let i = 0; i < list.length; i++) {
            if (list[i] !== undefined) {
              listData.push(list[i])
            }
          }
          successCallback && successCallback(listData, total)
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: msg
          })
          errorCallback && errorCallback()
        }
      }, 200)
    },
    showSelect () {
      this.show = !this.show
    },
    gotoDetail (no) {
      this.$router.push('/order-detail/' + no + '/' + this.state)
    },
    getState (state, group) {
      let result = ''
      switch (state) {
        case -1:
          result = '全部'
          break
        case 0:
          result = '待核价'
          break
        case 1:
          result = '待签约'
          break
        case 2:
          result = '待采购商打款'
          break
        case 3:
          result = '待发货'
          break
        case 4:
          result = '订单关闭'
          break
        case 6:
          result = '待收货'
          break
        case 7:
          result = '待质检'
          break
        case 8:
          result = '售后处理'
          break
        case 9:
          result = '账期中'
          break
        case 10:
          result = '逾期中'
          break
        case 11:
          result = (group == 4 ? '交易完成' : '待结算')
          break
        case 13:
          result = '交易完成'
          break
      }
      return result
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
      })
    },
    async showStatusList () {
      try {
        const {status, data, msg} = await service.get('api/order/showStatusList')
        if (status == 0) {
          let keys = Object.keys(data)
          let values = Object.values(data)
          this.menuRaw = data
          for (let i = 0; i < keys.length; i += 2) {
            let temp = []
            if (i + 1 >= keys.length) {
              temp.push({key: keys[i], value: values[i]})
            } else {
              temp.push({key: keys[i], value: values[i]}, {key: keys[i + 1], value: values[i + 1]})
            }
            this.menu.push(temp)
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
.menu-list .menu-item-empty{
  flex: 1;
  flex-basis: 50%;
  margin: .8rem 1.2rem;
  padding: 0.2rem 0;
}
</style>
