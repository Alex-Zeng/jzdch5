<template>
  <div class="enterprise">
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        企业认证
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <div v-show="data.status" class="enterprise-msg">
      <div v-if="data.status == 2">
        您的审核信息已通过
      </div>
      <div v-else>
        <div v-if="data.status == 1">
          工作人员努力审核中，请耐心等待
        </div>
        <div v-if="data.status == 3">
          <div>抱歉，审核未通过</div>
          <div>拒绝原因：{{data.refuseReason}}</div>
        </div>

      </div>
    </div>
    <div class="enterprise-title">
      企业基本信息
    </div>
    <ul class="form">
      <li>
        <i :class="{'is-danger': errors.has('name')}"></i>
        <div class="cells">
          <label for="">企业名称 <span class="text-red">*</span></label>
          <input name="mobile" v-model="data.companyName" v-validate="'required'" :disabled="data.status == 1" type="text" placeholder="请按营业执照填写">
        </div>
      </li>
      <li>
        <i :class="{'is-danger': errors.has('mobile')}"></i>
        <div class="cells">
          <label for="">法人代表 <span class="text-red">*</span></label>
          <input name="mobile" v-model="data.representative" v-validate="'required'" type="text" placeholder="请按营业执照填写" :disabled="data.status == 1">
        </div>
      </li>
      <li>
        <group>
          <popup-picker title="注册类型 <span class='text-red'>*</span>" :data="list1" v-model="data.property" @on-show="onShow" @on-hide="onHide" @on-change="onChange" v-validate="'required'" placeholder="请按营业执照填写"></popup-picker>
        </group>
      </li>
      <li>
        <i :class="{'is-danger': errors.has('mobile')}"></i>
        <div class="cells">
          <label for="">注册资本 <span class="text-red">*</span></label>
          <input name="mobile" v-model="data.capital" v-validate="'required'" type="text" placeholder="请按营业执照填写" :disabled="data.status == 1">
          <span style="font-size: 0.7rem;">万元</span>&emsp;
        </div>
      </li>
      <li>
        <i :class="{'is-danger': errors.has('mobile')}"></i>
        <div class="cells">
          <label for="">住所 <span class="text-red">*</span>&emsp;&emsp;</label>
          <input name="address" v-model="data.address" v-validate="'required'" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')" type="text" placeholder="请按营业执照填写" :disabled="data.status == 1">
        </div>
      </li>
    </ul>
    <div class="enterprise-title">
      证件影像资料上传
    </div>
    <div class="enterprise-upload-wrap">
      <label for="">必填项 <span class="text-red">*</span></label>
      <div class="enterprise-upload-list">
        <div class="enterprise-upload-item">
          <uploader title="工商营业执照" id="1" v-model="data.business" :defaultPath="data.businessPath" :disabled="data.status == 1"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="开户许可证" id="2" v-model="data.permitsAccount" :defaultPath="data.permitsAccountPath" :disabled="data.status == 1"></uploader>
        </div>
      </div>
      <div class="enterprise-upload-list">
        <div class="enterprise-upload-item">
          <uploader title="企业法人身份证" id="4" v-model="data.legalIdentityCard" :defaultPath="data.legalIdentityCardPath" :disabled="data.status == 1"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="代办人身份证" id="5" v-model="data.agentIdentityCard" :defaultPath="data.agentIdentityCardPath" v-show="data.agent == 1" :disabled="data.status == 1"></uploader>
        </div>
      </div>
      <div class="enterprise-upload-list" style="width: 50%;" v-show="data.agent == 1">
        <div class="enterprise-upload-item">
          <uploader title="授权委托书" id="6" v-model="data.attorney" :defaultPath="data.attorneyPath" :disabled="data.status == 1"></uploader>
        </div>
      </div>
    </div>
    <div class="enterprise-upload-wrap">
      <label for="">可选项</label>
      <div class="enterprise-upload-list">
        <div class="enterprise-upload-item">
          <uploader title="组织机构代码证" id="7" v-model="data.orgStructureCode" :defaultPath="data.orgStructureCodePath" :disabled="data.status == 1"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="税务登记证" id="8" v-model="data.taxRegistrationCert" :defaultPath="data.taxRegistrationCertPath" :disabled="data.status == 1"></uploader>
        </div>
      </div>
    </div>
    <div class="enterprise-footer-btn">
      <button type="submit" class="btn" v-if="data.status == 1" disabled="true">提交</button>
      <button type="submit" class="btn btn-primary" @click="submit" v-else>提交</button>
    </div>
  </div>
</template>

<script>
import { Datetime, PopupPicker, Group, Cell, Picker, XButton, Divider, XSwitch, XTextarea } from 'vux'
import uploader from '@/components/common/uploader'
import axios from 'axios'
import '@/assets/css/enterprise.css'
export default {
  name: 'enterprise',
  data () {
    return {
      list1: [['有限责任公司', '股份有限公司', '个体工商户', '合伙企业']],
      data: {
        type: sessionStorage.getItem('userType') || 1,
        agent: sessionStorage.getItem('agent') || 0,
        companyName: '',
        address: '',
        representative: '',
        capital: 0,
        property: ['有限责任公司'],
        business: '',
        permitsAccount: '',
        legalIdentityCard: '',
        agentIdentityCard: '',
        orgStructureCode: '',
        taxRegistrationCert: '',
        attorney: '',
        businessPath: '',
        permitsAccountPath: '',
        legalIdentityCardPath: '',
        agentIdentityCardPath: '',
        orgStructureCodePath: '',
        taxRegistrationCertPath: '',
        attorneyPath: '',
        status: 0
      }
    }
  },
  created () {
    window.scrollTo(0, 0)
  },
  mounted () {
    this.check()
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
    back () {
      window.history.go(-1)
    },
    async check () {
      // 检查审核状态
      const {data: {data}} = await axios.get('api/user/getCertification')
      this.data = {...data, property: [data.property], type: sessionStorage.getItem('userType') || 1, agent: sessionStorage.getItem('agent') || 0}
    },
    async submit () {
      const token = sessionStorage.getItem('loginToken')
      const {companyName, representative, capital, property, business, permitsAccount, legalIdentityCard, address, orgStructureCode, agentIdentityCard, attorney, taxRegistrationCert} = this.data
      if (this.data.agent === 1) {
        if (!agentIdentityCard || !attorney) {
          this.$vux.toast.show({
            type: 'warn',
            text: '请填写必填字段'
          })
          return
        }
      }
      if (!companyName || !representative || !capital || !property || !business || !permitsAccount || !legalIdentityCard) {
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写必填字段'
        })
        return
      }
      if (token) {
        const {data: {status, msg}} = await axios.post('api/user/certification', {
          type: this.data.type,
          agent: this.data.agent,
          companyName,
          representative,
          capital,
          property: ['有限责任公司', '股份有限公司', '个体工商户', '合伙企业'].indexOf(property[0]),
          business,
          address,
          permitsAccount,
          legalIdentityCard,
          agentIdentityCard,
          orgStructureCode,
          attorney,
          taxRegistrationCert,
          _token: token
        })
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
        }
      }
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
