<template>
  <div class="other-settings">
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        其他设置
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <group>
      <x-input title='联系人姓名' text-align="right" v-model="name" placeholder="未设置"></x-input>
    </group>
    <group>
      <x-input title='公司固话' text-align="right" v-model="phone" placeholder="未设置"></x-input>
    </group>
    <group>
      <x-input title='公司固话' type="file" text-align="right" v-model="phone" placeholder="未设置"></x-input>
    </group>
  </div>
</template>

<script>
import axios from 'axios'
import {Cell, CellBox, Group, Checklist, XButton, XInput} from 'vux'
export default {
  name: 'other',
  data () {
    return {
      phone: '',
      name: '',
      logo: ''

    }
  },
  methods: {
    getInfo () {
      axios.get('api/user/getProfile').then((response) => {
        if (response.data.status === 0) {
          this.phone = response.data.data.tel
          this.name = response.data.data.contact
          this.logo = response.data.data.path
        } else if (response.data.status === -2) {
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未登录，是否去登录？',
            onCancel () {},
            onConfirm () {
              self.$router.push('/loginByCode')
            }
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: '网络可能有点问题'
          })
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题',
        onShow () {
          console.log('Plugin: I\'m showing')
        },
        onHide () {
          console.log('Plugin: I\'m hiding')
        }
      })
    }
  },
  created () {
    this.getInfo()
  },
  components: {
    Cell,
    CellBox,
    Group,
    Checklist,
    XButton,
    XInput
  }
}
</script>

<style scoped>

</style>
