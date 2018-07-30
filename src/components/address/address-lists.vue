<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        收货地址管理
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <ul class="address-lists">
      <li v-for="(item, index) in lists" :key="index">
        <div  @click="selectAddress(index)">
          <h3><span class="name">{{item.name}}</span>{{item.phone}} <span class="tag" v-if="item.tag"> {{item.tag}}</span></h3>
          <div class="text-muted">{{item.areaName}} {{item.detail}}</div>
        </div>
        <div class="address-btn">
          <div>
            <i class="icon iconfont icon-danxuananniu" v-if="!item.is_default"></i>
            <i class="icon iconfont icon-xuanzhong" v-if="item.is_default" style="color: #1EB9EE;"></i>
            <label class="text-muted">
              <input type="radio" name="is_default" :value="item.id" v-model="item.is_default" @click="setDefault(item.id)">设为默认
            </label>
          </div>
          <div>
            <span class="text-muted" @click="editorAddress(item.id, index)">
              <i class="icon iconfont icon-bianji"></i>
              编辑
            </span>&nbsp;
            <span class="text-muted" @click="deleteAddress(item.id, index)">
              <i class="icon iconfont icon-shanchu1"></i>
              删除
            </span>
          </div>
        </div>
      </li>
    </ul>
    <router-link class="address-footer" to="/address-new">
      新增地址
    </router-link>
  </div>
</template>

<script>
import axios from 'axios'
import '@/assets/css/address.css'
export default {
  name: 'address-lists',
  data () {
    return {
      defaultAddress: true,
      lists: []
    }
  },
  methods: {
    getLists () {
      axios.get('api/user/getAddressList').then((response) => {
        this.lists = response.data.data.list
      }).catch((response) => {
        this.errorMsg()
      })
    },
    editorAddress (id, index) {
      localStorage.removeItem('editorAdd')
      let tagert = this.lists[index]
      localStorage.setItem('editorAdd', JSON.stringify(tagert))
      this.$router.push('/address-editor')
    },
    deleteAddress (id, index) {
      let self = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确定删除？',
        onCancel () {},
        onConfirm () {
          axios.post('api/user/removeAddress', {
            'id': id
          }).then((response) => {
            self.lists.splice(index, 1)
          }).catch((response) => {
            self.errorMsg()
          })
        }
      })
    },
    selectAddress (index) {
      localStorage.setItem('selectAddressIndex', index)
      this.$router.push('/shop-car/indent')
      return false
    },
    setDefault (id) {
      axios.post('api/user/setDefaultAddress', {
        'id': id
      }).then((response) => {
        if (response.data.status === 0) {
          this.getLists()
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
    if (localStorage.getItem('loginToken') === null) {
      this.$router.push('/loginByCode')
    }
    this.getLists()
  }
}
</script>

<style scoped>

</style>
