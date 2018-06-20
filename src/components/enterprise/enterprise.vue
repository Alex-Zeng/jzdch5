<template>
  <div class="enterprise">
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        企业认证
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div class="enterprise-title">
      企业基本信息
    </div>
    <ul class="form">
      <li>
        <i :class="{'is-danger': errors.has('name')}"></i>
        <div class="cells">
          <label for="">企业名称 <span class="text-red">*</span></label>
          <input name="mobile" v-model="enterpriseName" v-validate="'required'" type="text" placeholder="请按营业执照填写">
        </div>
      </li>
      <li>
        <i :class="{'is-danger': errors.has('mobile')}"></i>
        <div class="cells">
          <label for="">法人代表 <span class="text-red">*</span></label>
          <input name="mobile" v-model="legalName" v-validate="'required'" type="text" placeholder="请按营业执照填写">
        </div>
      </li>
      <li>
        <group>
          <popup-picker title="注册类型 <span class='text-red'>*</span>" :data="list1" v-model="value1" @on-show="onShow" @on-hide="onHide" @on-change="onChange" v-validate="'required'" placeholder="please select"></popup-picker>
        </group>
      </li>
      <li>
        <i :class="{'is-danger': errors.has('mobile')}"></i>
        <div class="cells">
          <label for="">注册资本 <span class="text-red">*</span></label>
          <input name="mobile" v-model="legalName" v-validate="'required'" type="text" placeholder="请按营业执照填写">
          <span>&emsp;&nbsp;万元</span>
        </div>
      </li>
      <li style="height: auto;">
          住所<x-textarea placeholder="请按营业执照填写" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')"></x-textarea>
      </li>
    </ul>
    <div class="enterprise-title">
      证件影像资料上传
    </div>
    <div class="enterprise-footer-btn">
      <button type="submit" class="btn btn-primary">提交</button>
    </div>
  </div>
</template>

<script>
import { Datetime, PopupPicker, Group, Cell, Picker, XButton, Divider, XSwitch, XTextarea } from 'vux'
import '@/assets/css/enterprise.css'
export default {
  name: 'enterprise',
  data () {
    return {
      enterpriseName: '',
      legalName: '',
      value1: ['iPhone'],
      list1: [['小米', 'iPhone', '华为', '情怀', '三星', '其他', '不告诉你']],
    }
  },
  methods: {
    onChange (val) {
      console.log('val change', val)
    },
    onShow () {
      console.log('on show')
    },
    onHide (type) {
      console.log('on hide', type)
    },
    onEvent (event) {
      console.log('on', event)
    }
  },
  components: {
    PopupPicker,
    Group,
    Picker,
    XButton,
    Divider,
    Cell,
    XSwitch,
    Datetime,
    XTextarea
  }
}
</script>

<style scoped>

</style>
