import Vue from 'vue'
import VeeValidate, { Validator } from 'vee-validate'
import zh_CN from 'vee-validate/dist/locale/zh_CN'

Vue.use(VeeValidate)
// 提示语汉化
Validator.locale === 'en' ? 'zh_CN' : 'en'
Validator.localize(Validator.locale, {
  messages: zh_CN.messages,
  attributes: {
    loginName: '登录名',
    loginPassword: '密码'
  }
})
Validator.extend('phone', {
  getMessage: (field, [args]) => `请输入正确的手机号码`,
  validate: (value, [args]) =>{
    const reg = /^((13|14|15|17|18)[0-9]{1}\d{8})$/
    return reg.test(value)
  }
})
Validator.extend('verificationCode', {
  getMessage: (field, [args]) => `请输入正确的验证码`,
  validate: (value, [args]) =>{
    const reg = /^[0-9A-Za-z]{4}$/
    return reg.test(value)
  }
})
Validator.extend('verificationPassword', {
  getMessage: (field, [args]) => `请输入4-20位的数字和字母组合`,
  validate: (value, [args]) =>{
    const reg = /(?=.*[a-z])(?=.*[0-9])[A-Za-z0-9]{4,20}/
    return reg.test(value)
  }
})
