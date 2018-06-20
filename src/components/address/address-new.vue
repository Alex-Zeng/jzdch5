<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
        <div>
          新建收货地址
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <form class="form" @submit.prevent="getMobileCode(1)">
        <ul>
          <li>
            <i :class="{'is-danger': errors.has('userName')}"></i>
            <div class="cells">
              <label for="">收货人</label>
              <input name="mobile" v-model="userName" v-validate="'required'" type="text" placeholder="请输入收货人姓名">
            </div>
          </li>
          <li>
            <i :class="{'is-danger': errors.has('mobile')}"></i>
            <div class="cells">
              <label for="">联系方式</label>
              <input name="mobile" v-model="mobile" v-validate="'required|phone'" type="text" placeholder="填写手机号码，未注册用户也可直接登录">
            </div>
          </li>
          <li>
          </li>
        </ul>
        <x-address @on-hide="logHide" @on-show="logShow" :title="title" v-model="value" :list="addressData" @on-shadow-change="onShadowChange" placeholder="请选择地址" inline-desc="可以设置placeholder" :show.sync="showAddress"></x-address>

        <button type="submit" class="btn btn-primary">下一步</button>
      </form>
    </div>
</template>

<script>
import { XAddress, ChinaAddressV2Data } from 'vux'
import axios from 'axios'
export default {
  name: 'address-new',
  data () {
    return {
      userName: '',
      mobile: '',
      defaultValue: '',
      list: [{key: 'gd', value: '广东'}, {key: 'gx', value: '广西'}],
    }
  },
  methods: {
    addressNew () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/code/registerSend', {
            'phone': this.mobile
          }).then((response) => {
            if (response.data.status === 0) {
              console.log(response)
              this.model1Show = false
              this.model2Show = true
              this.time = 60
              this.setTimeOut = true
              this.resetCode = false
              this.setTimeMethods()
              // 响应成功回调
              console.log('success')
              setTimeout(function () {
                document.getElementById('code1').focus()
              }, 50)
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
            this.errorMsg()
          })
          return
        }
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写手机号或图片验证码',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      })
    }
  },
  components: { XAddress, ChinaAddressV2Data }
}
</script>

<style scoped>

</style>
