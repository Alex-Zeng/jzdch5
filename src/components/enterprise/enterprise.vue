<template>
  <div class="enterprise">
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" @click="back"></i>
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
          <popup-picker title="注册类型 <span class='text-red'>*</span>" :data="list1" v-model="data.property" @on-show="onShow" @on-hide="onHide" @on-change="onChange" v-validate="'required'" placeholder="please select"></popup-picker>
        </group>
      </li>
      <li>
        <i :class="{'is-danger': errors.has('mobile')}"></i>
        <div class="cells">
          <label for="">注册资本 <span class="text-red">*</span></label>
          <input name="mobile" v-model="data.capital" v-validate="'required'" type="text" placeholder="请按营业执照填写" :disabled="data.status == 1">
          <span style="font-size: 0.7rem;">万元&emsp;</span>
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
          <uploader title="工商营业执照" id="1" v-model="data.business" type="certification" :defaultPath="data.businessPath" :disabled="data.status == 1"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="开户许可证" id="2" v-model="data.permitsAccount" type="certification" :defaultPath="data.permitsAccountPath" :disabled="data.status == 1"></uploader>
        </div>
      </div>
      <div class="enterprise-upload-list">
        <div class="enterprise-upload-item">
          <uploader title="企业法人身份证" id="4" v-model="data.legalIdentityCard" type="certification" :defaultPath="data.legalIdentityCardPath" :disabled="data.status == 1"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="代办人身份证" id="5" v-model="data.agentIdentityCard" type="certification" :defaultPath="data.agentIdentityCardPath" v-show="data.agent == 1" :disabled="data.status == 1"></uploader>
        </div>
      </div>
      <div class="enterprise-upload-list" v-show="data.agent == 1">
        <div class="enterprise-upload-item">
          <uploader title="授权委托书" id="6" v-model="data.attorney" type="certification" :defaultPath="data.attorneyPath" :disabled="data.status == 1"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <div class="upload-item-content">
            <span>委托书模板</span>
            <a :href="url">
              <img src="@/assets/images/wtmuban.png" alt="">
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="enterprise-upload-wrap">
      <label for="">可选项</label>
      <div class="enterprise-upload-list">
        <div class="enterprise-upload-item">
          <uploader title="组织机构代码证" id="7" v-model="data.orgStructureCode" type="certification" :defaultPath="data.orgStructureCodePath" :disabled="data.status == 1"></uploader>
        </div>
        <div class="enterprise-upload-item">
          <uploader title="税务登记证" id="8" v-model="data.taxRegistrationCert" type="certification" :defaultPath="data.taxRegistrationCertPath" :disabled="data.status == 1"></uploader>
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
      url: null,
      list1: [['有限责任公司', '股份有限公司', '个体工商户', '合伙企业']],
      data: {
        type: localStorage.getItem('userType') || 1,
        agent: localStorage.getItem('agent') || 0,
        companyName: '',
        address: '',
        representative: '',
        capital: null,
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
    this.getCertificationExt()
  },
  mounted () {
    this.check()
  },
  methods: {
    onChange (val) {
    },
    onShow () {
    },
    onHide (type) {
    },
    onEvent (event) {
    },
    getCertificationExt () {
      axios.get('api/user/getCertificationExt').then((response) => {
        if (response.data.status === 0) {
          this.url = response.data.data.attorney
        }
      }).catch(() => {
        this.$vux.toast.show({
          type: 'warm',
          text: '网络可能有点问题'
        })
      })
    },
    back () {
      const status = this.data
      if (parseInt(status) === 1) {
        this.$router.replace('settings')
      } else {
        this.$router.go(-1)
      }
    },
    async check () {
      // 检查审核状态
      const {data: {data, msg}} = await axios.get('api/user/getCertification')
      if (msg !== '用户未提交认证') {
        this.data = {...data, property: [data.property], type: localStorage.getItem('userType') || 1, agent: localStorage.getItem('agent') || 0}
      }
    },
    async submit () {
      const token = localStorage.getItem('loginToken')
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
          let self = this
          this.$vux.toast.show({
            type: 'success',
            text: msg,
            onHide () {
              self.$router.replace('/settings')
            }
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
