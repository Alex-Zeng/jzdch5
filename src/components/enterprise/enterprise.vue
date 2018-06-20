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
          <input name="mobile" v-model="companyName" v-validate="'required'" type="text" placeholder="请按营业执照填写">
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
          <input name="mobile" v-model="capital" v-validate="'required'" type="text" placeholder="请按营业执照填写">
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
    <div class="enterprise-upload-wrap">
      <label for="">必填项 <span class="text-red">*</span></label>
      <div class="enterprise-upload-list">
        <div class="enterprise-upload-item">
          <uploader title="工商营业执照" id="1" @uploaded="businessUp"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="开户许可证" id="2" @uploaded="businessUp"></uploader>
        </div>
      </div>
      <div class="enterprise-upload-list" style="width: 50%;">
        <div class="enterprise-upload-item">
          <uploader title="企业法人身份证" id="3" @uploaded="businessUp"></uploader>
        </div>
      </div>
    </div>

    <div class="enterprise-upload-wrap">
      <label for="">可选项</label>
      <div class="enterprise-upload-list">
        <div class="enterprise-upload-item">
          <uploader title="组织机构代码证" id="4" @uploaded="businessUp"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="税务登记证" id="5" @uploaded="businessUp"></uploader>
        </div>
      </div>
    </div>

    <div class="enterprise-footer-btn">
      <button type="submit" class="btn btn-primary" @click="submit">提交</button>
    </div>
  </div>
</template>

<script>
import { Datetime, PopupPicker, Group, Cell, Picker, XButton, Divider, XSwitch, XTextarea } from 'vux'
import uploader from '@/components/common/uploader'
// import axios from 'axios'
import '@/assets/css/enterprise.css'
export default {
  name: 'enterprise',
  data () {
    return {
      type: 1,
      agent: 0,
      companyName: '',
      legalName: '',
      capital: 0,
      value1: ['有限责任公司'],
      list1: [['有限责任公司', '股份有限公司', '个体工商户', '合伙企业']],
      business: '',
      permitsAccount: '',
      legalIdentityCard: '',
      agentIdentityCard: '',
      orgStructureCode: '',
      taxRegistrationCert: '',
      attorney: ''
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
    },
    businessUp (url) {
      this.business = url
    },
    submit () {
      // if ()
      // 验证 提交
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
    XTextarea,
    uploader
  }
}
</script>

<style scoped>

</style>
