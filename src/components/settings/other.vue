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
      <x-input title='联系人姓名' text-align="right" v-model="name" @on-blur="updateInfo ('contact', name)" placeholder="未设置"></x-input>
    </group>
    <group>
      <x-input title='公司固话' text-align="right" v-model="phone" @on-blur="updateInfo ('tel', phone)" placeholder="未设置"></x-input>
    </group>
    <group>
      <uploader title="公司LOGO" id="1" v-model="logo" type="user_icon" :defaultPath="logo" @change="changeTest"></uploader>
    </group>
  </div>
</template>

<script>
import axios from 'axios'
import {Cell, CellBox, Group, Checklist, XButton, XInput} from 'vux'
import uploader from '@/components/common/uploader'
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
    changeTest (s) {
      this.updateInfo('icon', s)
    },
    getInfo () {
      axios.get('api/user/getProfile').then((response) => {
        if (response.data.status === 0) {
          this.phone = response.data.data.tel
          this.name = response.data.data.contact
          this.logo = response.data.data.path
        } else if (response.data.status === -2) {
          let self = this
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未登录，是否去登录？',
            onCancel () {
              self.$router.go(-1)
            },
            onConfirm () {
              localStorage.removeItem('oldUrl')
              localStorage.setItem('oldUrl', self.$route.path)
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
    updateInfo (field, value) {
      axios.post('api/user/profile', {
        'field': field,
        'value': value
      }).then((response) => {
        if (response.data.status === 0) {
        } else if (response.data.status === -2) {
          this.$vux.confirm.show({
            title: '提示',
            content: '您尚未登录，是否去登录？',
            onCancel () {},
            onConfirm () {
              localStorage.setItem('oldUrl', self.$route.path)
              self.$router.push('/loginByCode')
            }
          })
        } else {
          this.$vux.toast.show({
            type: 'warn',
            text: response.data.msg
          })
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    errorMsg () {
      this.$vux.toast.show({
        type: 'warn',
        text: '网络可能有点问题'
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
    XInput,
    uploader
  }
}
</script>

<style scoped>

</style>
