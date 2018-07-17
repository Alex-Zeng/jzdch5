<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        我的订单
      </div>
      <div>&emsp;</div>
    </div>
    <div class="service-result" v-show="showResult">
      <div>
        <div>尊敬的用户</div>
        <div>您的售后申请（订单号:{{$route.params.no}}）</div>
        <span>已经提交成功；我们将尽快为您处理，请耐心等待。</span>
        <button type="button" class="btn btn-primary" @click="showResult=false">返回订单</button>
      </div>
    </div>
    <div class="orderImgWrap" v-show="showImgWrap" @click="showImgWrap=false">
      <img :src="data.payImg" alt="" onerror="this.src='./static/images/temp-img.png'">
    </div>
    <div v-show="!showResult">

      <div class="select-confirm" v-if="selectShow" style="z-index: 99">
        <div class="select-confirm-content">
          <div>
            <div class="select-confirm-title">请选择您需要服务的类型：</div>
            <div class="select-confirm-checkbox">
              <div>
                <label>
                  <i class="icon iconfont icon-danxuananniu" v-if="selectItem!=1"></i>
                  <i class="icon iconfont icon-xuanzhong" v-if="selectItem==1" style="color: #1EB9EE;"></i>
                  <input type="radio" name="name" v-show="false" v-model="selectItem" value="1">退货
                </label>
              </div>
              <div>
                <label>
                  <i class="icon iconfont icon-danxuananniu" v-if="selectItem!=2"></i>
                  <i class="icon iconfont icon-xuanzhong" v-if="selectItem==2" style="color: #1EB9EE;"></i>
                  <input type="radio" name="name" v-show="false" v-model="selectItem" value="2">换货
                </label>
              </div>
              <div>
                <label>
                  <i class="icon iconfont icon-danxuananniu" v-if="selectItem!=3"></i>
                  <i class="icon iconfont icon-xuanzhong" v-if="selectItem==3" style="color: #1EB9EE;"></i>
                  <input type="radio" name="name" v-show="false" v-model="selectItem" value="3">维修
                </label>
              </div>
            </div>
            <div class="select-confirm-button">
              <button @click="submitService">确定</button>
              <button @click="cancelSelect">取消</button>
            </div>
          </div>
        </div>
      </div>

      <div class="order-wrap" v-cloak>
        <div class="order-card">
          <div class="indent-title" style="font-size: 0.75rem; padding: 0.28rem 0.5rem; height: auto;border-top: 0;">
            <i class="icon iconfont icon-shangdian text-blue"></i>
            {{data.companyName}}
          </div>
          <div class="orderNo">订单号：{{data.orderNo}} <span>{{data.serviceType === 1? '售后处理中': data.serviceType === 2? '售后完成': getState(data.state)}}</span></div>
          <div class="indent-content order-item" v-for="(good, key) in data.goods" :key="key">
            <img :src="good.icon" alt="" onerror="this.src='./static/images/temp-img.png'">
            <div class="indent-info">
              <b class="title">{{good.title}}</b>
              <div class="text-muted info-item">
                <span class="label" style="flex-basis: 100%">
                  {{good.s_info}}
                </span>
              </div>
              <div class="text-muted info-item" >
                <span class="label">
                  物料编号
                </span>
                <span class="value">
                  {{good.specifications_no}}
                </span>
              </div>
              <div class="text-muted info-item" >
                <span class="label">
                  物料规格
                </span>
                <span class="value">
                  {{good.specifications_name}}
                </span>
              </div>
              <div class="text-muted info-item">
                <span class="label">数量</span>
                <span class="value">{{good.quantity}}</span>
              </div>
              <div class="text-muted info-item">
                <div class="label">
                  单价
                </div>
                <div class="value" style="margin-right:auto;">
                  <span class="text-red">{{good.price}}元</span>
                </div>
                <div class="order-button" style="margin-top: -0.12rem;"
                     v-if="(data.state===6 || data.state === 13 || data.state === 9 || data.state===10  || data.state===11)&&(good.service_type===0 || good.service_type===2)&&(data.groupId===4)"
                     @click="selectShow=true, goodsId = good.id">售后申请</div>
              </div>
            </div>
          </div>
          <div class="detail-money"><span>总价：<span class="text-red">{{data.money}}元</span></span><span v-if="data.money !== data.goods_money">（原价:{{data.goods_money}}元）</span></div>
        </div>

        <div class="order-card addr">
          <b style="margin-right: 0.25rem;">{{data.name}}</b><b>{{data.phone}}</b>
          <div class="detail">{{data.address}}</div>
        </div>

        <div class="order-card info">
          <div class="item">
            <span class="label">下单时间</span><span class="value">{{data.time}}</span>
          </div>
          <div class="item">
            <span class="label">支付方式</span><span class="value">{{data.payMethod}}</span>
          </div>
          <div v-if="data.payNumber || data.payDate || data.payImg">
            <div class="line"></div>
            <div class="item" v-if="data.payNumber">
              <span class="label">流水号</span>
              <span class="value">{{data.payNumber}}</span>
            </div>
            <div class="item" v-if="data.payDate">
              <span class="label">汇款日期</span>
              <span class="value">{{data.payDate}}</span>
            </div>
            <div class="item" v-if="data.payImg" @click="showImgWrap=true">
              <span class="label">汇款凭证</span>
              <div class="value">
                <img style="width: 4.5rem" :src="data.payImg" alt="" onerror="this.src='./static/images/temp-img.png'">
              </div>
            </div>
          </div>
          <div class="line">
          </div>
          <div class="item">
            <span class="label">交货期</span><span class="value">{{data.date}}</span>
          </div>

          <div class="item">
            <span class="label">备注</span><div class="value">{{data.remark}}</div>
          </div>
          <div class="line"></div>
          <div v-if="data.groupId === 5 && data.state === 3">
            <div class="item"><b style="color: #222222;">填写发货信息</b></div>
            <Group>
              <XInput title="运单号" v-model="expressForm.expressCode" text-align="right"></XInput>
              <XInput title="物流公司" v-model="expressForm.express" text-align="right"></XInput>
              <datetime v-model="expressForm.sendDate" title="发货日期"></datetime>
              <datetime title="预计到达" v-model="expressForm.estimatedDate"></datetime>
            </Group>
            <div class="item">
              <button type="button" class="btn btn-primary" @click="submitExpress">提交</button>
            </div>
          </div>
          <div v-if="(data.groupId === 4 && data.state <= 3) || (!data.expressCode || !data.express)">
            <div class="order-tips">
              <div><img src="../../assets/images/empty_box.png" alt="" style="background-color: #fff;"></div>
              <div>暂无物流信息</div>
            </div>
          </div>
          <div v-if="(data.state > 3) && (data.expressCode && data.express)">
            <div class="item">
              <span class="label">运单号</span><span class="value">{{data.expressCode}}</span>
            </div>
            <div class="item">
              <span class="label">物流公司</span><span class="value">{{data.express}}</span>
            </div>
            <div class="item">
              <span class="label">发货日期</span><span class="value">{{data.sendDate}}</span>
            </div>
            <div class="item">
              <span class="label">预计到达</span><span class="value">{{data.estimatedDate}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import service from '@/service'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XButton, XInput } from 'vux'
import '@/assets/css/order.css'
export default {
  name: 'order-detail',
  data () {
    return {
      data: {},
      infoBody: [],
      expressForm: {
        express: '',
        expressCode: '',
        sendDate: '',
        estimatedDate: ''
      },
      selectItem: '3',
      selectShow: false,
      showResult: false,
      goodsId: -1,
      showImgWrap: false
    }
  },
  mounted () {
    this.getDetail()
  },
  methods: {

    cancelSelect () {
      this.selectShow = false
    },
    async submitService () {
      this.selectShow = false
      this.$vux.loading.show(
        {
          text: '提交中...'
        }
      )
      const {params: { no }} = this.$route
      const {msg, status} = await service.post('api/order/service', {no, type: this.selectItem, goodsId: this.goodsId})
      this.$vux.loading.hide()
      if (status !== 0) {
        this.$vux.toast.show({
          type: 'warn',
          text: msg
        })
      } else {
        this.getDetail()
        this.showResult = true
        this.$vux.toast.show({
          type: 'success',
          text: msg
        })
      }
    },
    submitExpress () {
      if (!this.expressForm.express || !this.expressForm.expressCode) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写物流信息'
        })
        return
      }
      if (!this.expressForm.sendDate) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请确定发货日期'
        })
        return
      }
      if (!this.expressForm.estimatedDate) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请确定预计到达时间'
        })
        return
      }
      this.$vux.confirm.show({
        title: '提示',
        content: '是否仔细核对物流信息后？',
        onCancel () {},
        onConfirm: async () => {
          this.$vux.loading.show(
            {
              text: '提交中...'
            }
          )
          const {params: { no }} = this.$route
          try {
            const {msg, status} = await service.post('api/order/delivery', {...this.expressForm, no})
            if (status !== 0) {
              this.$vux.toast.show({

                type: 'warn',
                text: msg
              })
            } else {
              this.getDetail()
              this.$vux.toast.show({
                type: 'success',
                text: msg
              })
            }
          } catch (e) {
            this.errorMsg()
          } finally {
            this.$vux.loading.hide()
          }
        }
      })
    },
    getState (state) {
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
          result = '待打款至供应商'
          break
        case 13:
          result = '交易完成'
          break
      }
      return result
    },
    async getDetail () {
      const {params: { no }} = this.$route
      try {
        const {data} = await service.post('api/order/detail', {no})
        this.data = data
        if (this.data.remark.length > 75) {
          this.data.remark = this.data.remark.substring(0, 72) + '...'
        }
      } catch (e) {
        this.errorMsg()
      }
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
      })
    }
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Group,
    Datetime,
    XButton,
    XInput
  }
}
</script>

<style scoped>

</style>
