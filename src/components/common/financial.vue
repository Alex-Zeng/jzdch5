<template>
  <div class="container"  v-if="childFinancial">
    <template v-if="success">
      <form class="form" @submit.prevent="getMobileCode(1)">
        <h3 class="text-blue">请填写并确认您的联系方式</h3>
        <ul>
          <li>
            <i :class="{'is-danger': errors.has('mobile')}"></i>
            <div class="cells">
              <label for="">&emsp;姓名</label>
              <input name="mobile" v-model="userName" v-validate="'required'" type="text" placeholder="请输入您的姓名">
            </div>
          </li>
          <li>
            <i :class="{'is-danger': errors.has('mobile')}"></i>
            <div class="cells">
              <label for="">手机号</label>
              <input name="mobile" v-model="mobile" v-validate="'required|phone'" type="text" placeholder="请输入您的手机号">
            </div>
          </li>
          <li>
            <checker v-model="sex" radio-required default-item-class="item-default" selected-item-class="item-selected">
              <checker-item value="男">先生</checker-item>
              <checker-item value="女">女士</checker-item>
            </checker>
          </li>
        </ul>
        <button type="button" class="btn btn-primary" @click="submit">下一步</button>
      </form>
    </template>
    <template v-if="!success">
      <div class="text-blue success">
        <div>感谢{{userName}}{{sex='男'?'先生':'女士'}}</div>
        您的金融服务已提交成功
        <br/>
        稍后将有工作人员与您联系
      </div>
      <button type="button" class="btn btn-primary" @click="goHome">返回首页</button>
    </template>
  </div>
</template>

<script>
import axios from 'axios'
import {Checker, CheckerItem} from 'vux'
export default {
  name: 'financial',
  data () {
    return {
      success: true,
      userName: '',
      mobile: '',
      sex: '男'
    }
  },
  props: ['childFinancial'],
  methods: {
    submit () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/service/finance', {
            'phone': this.mobile,
            'name': this.userName,
            'sex': this.sex
          }).then((response) => {
            if (response.data.status === 0) {
              this.success = !this.success
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
          text: '请填写手机号或姓名',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      })
    },
    goHome () {
      this.$emit('childEvent', false)
    }
  },
  mounted () {
  },
  created () {
    this.$watch('childFinancial', function (newValue, oldValue) {
      this.financial = this.childFinancial
      console.log('childFinancial:' + this.childFinancial)
    })
  },
  components: {
    Checker, CheckerItem
  }
}
</script>

<style scoped>
  .container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 2;
    padding: 1rem;
  }
  .text-blue{
    padding-top: 6.4rem;
    padding-bottom: 2.4rem;
    font-size: 0.9rem;
    text-align: center;
  }
  .item-default{
    text-align: center;
    width: 3.5rem;
    height: 1.3rem;
    line-height: 1.3rem;
    border-radius: 0.25rem;
    background: #E1E1E1;
  }
  .item-selected{
    background: #5FCAED;
  }
  .vux-checker-box{
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 2rem;
    font-size: 0.65rem;
    color: #FFFFFF;
  }
  .success{
    text-align: left;
  }
  .success > div:first-child{
    padding-bottom: 0.5rem;
  }
</style>
