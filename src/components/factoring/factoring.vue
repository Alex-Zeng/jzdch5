<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        保理业务申请
      </div>
      <div style="padding-right: 1rem" @click="$router.push('/factoring-lists')">申请记录</div>
    </div>
    <group title="订单信息">
      <!--<popup-picker title="订单号" :data="list1" v-model="value1" @on-show="onShow" @on-hide="onHide" @on-change="onChange" v-validate="'required'" placeholder="please select"></popup-picker>-->
      <popup-picker title="订单号" :data="list1" @on-change="onChange"  v-model="value1"></popup-picker>
      <x-input title="订单金额" disabled v-model="account" text-align="right" placeholder-align="right"></x-input>
    </group>
    <group title="联系方式">
      <x-input title="联系人" v-model="contactUsername" text-align="right" placeholder-align="right" placeholder="请填写联系人姓名或称呼"></x-input>
      <x-input title="联系电话" v-model="contactPhone" text-align="right" placeholder-align="right" placeholder="请填区号+固话/手机号码"></x-input>
    </group>
    <group title="融资信息">
      <x-input title="融资金额" v-model="needAccount" text-align="right" placeholder-align="right" placeholder="请填写融资金额（单位：元）"></x-input>
      <x-input title="户名" v-model="name" text-align="right" placeholder-align="right" placeholder="请填写户名"></x-input>
      <x-input title="对公账号" v-model="bankCorporate" text-align="right" placeholder-align="right" placeholder="请填写对公账号，用于收款"></x-input>
      <x-input title="再次输入" v-model="bankCorporateConfirm" text-align="right" placeholder-align="right" placeholder="再次填写对公账号"></x-input>
      <x-input title="开户支行" v-model="bankAddress"  text-align="right" placeholder-align="right" placeholder="请填写开户支行"></x-input>
    </group>
    <div style="margin: 1rem 0.5rem">
      <button type="button" class="btn btn-primary" @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
import {PopupPicker, Group, Picker, XInput, Alert} from 'vux'
import axios from 'axios'
export default {
  name: 'factoring',
  data () {
    return {
      list1: [],
      value1: [],
      orderList: [],
      orderId: '',
      account: '',
      contactUsername: '',
      contactPhone: '',
      name: '',
      needAccount: '',
      bankCorporate: '',
      bankCorporateConfirm: '',
      bankAddress: ''
    }
  },
  methods: {
    onChange (val) {
      this.orderList.forEach((item, index) => {
        if (item.orderSn === val[0]) {
          this.account = item.account
          this.orderId = item.orderId
        }
      })
    },
    onShow () {
    },
    onHide (type) {
    },
    onEvent (event) {
    },
    getOrderInfo () {
      axios.post('api/Factoring/getOrderInfo').then((response) => {
        console.log(response)
        const {status, data: {orderList}} = response.data
        if (status === 0) {
          this.orderList = orderList
          let selectList = []
          orderList.forEach((item, index) => {
            selectList.push(item.orderSn.toString())
          })
          this.list1.push(selectList)
        }
      })
    },
    getName () {
      axios.post('api/Factoring/getName').then((response) => {
        console.log(response)
        const {status, data: {name}} = response.data
        if (status === 0) {
          this.name = name
        }
      })
    },
    submit () {
      if (this.orderId !== '' && this.contactUsername !== '' && this.contactPhone !== '' && this.needAccount !== '' && this.bankCorporate !== '' && this.bankCorporateConfirm !== '' && this.bankAddress !== '') {
        let self = this
        axios.post('api/Factoring/factoringAdd', {
          'orderId': this.orderId,
          'contactUsername': this.contactUsername,
          'contactPhone': this.contactPhone,
          'needAccount': this.needAccount,
          'bankCorporate': this.bankCorporate,
          'bankCorporateConfirm': this.bankCorporateConfirm,
          'bankAddress': this.bankAddress
        }).then((response) => {
          console.log(response.data.status)
          if (response.data.status === 0) {
            this.$vux.toast.show({
              title: '提交成功',
              type: 'success',
              text: '实际融资金额请以最终放款金额为准',
              onShow () {
              },
              onHide () {
                self.$router.replace('factoring-lists')
              }
            })
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.data.msg
            })
          }
        })
      } else {
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写相关信息'
        })
      }
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
      })
    }
  },
  created () {
    axios.get('api/user/getGroup').then((response) => {
      if (response.data.status === 0) {
        sessionStorage.setItem('groupId', response.data.data.groupId)
        if (response.data.data.groupId === 0) {
          let self = this
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未登录，确定现在去登录？',
            onConfirm () {
              sessionStorage.removeItem('oldUrl')
              sessionStorage.setItem('oldUrl', self.$route.path)
              self.$router.push('/loginByCode')
            },
            onCancel () {
              self.$router.go(-1)
            }
          })
          return false
        } else if (response.data.data.groupId === 6) {
          let self = this
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未做企业认证，是否现在去认证？',
            onConfirm () {
              self.$router.push('/settings')
            }
          })
          return false
        } else {
          this.getOrderInfo()
          this.getName()
        }
      }
    }).catch((response) => {
      this.errorMsg()
    })
  },
  components: {
    PopupPicker,
    Group,
    Picker,
    XInput,
    Alert
  }
}
</script>

<style scoped>

</style>
