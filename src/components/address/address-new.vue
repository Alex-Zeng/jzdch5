<template>
  <div class="address-new">
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
            <label for="">收货人&emsp;</label>
            <input name="userName" v-model="userName" v-validate="'required'" type="text" placeholder="请输入收货人姓名">
          </div>
        </li>
        <li>
          <i :class="{'is-danger': errors.has('mobile')}"></i>
          <div class="cells">
            <label for="">联系方式</label>
            <input name="mobile" v-model="mobile" v-validate="'required|phone'" type="text" placeholder="请输入您的手机号码">
          </div>
        </li>
        <li>
          <group>
            <x-address @on-hide="logHide" @on-show="logShow" title="所在地址" v-model="value" :list="addressData" @on-shadow-change="onShadowChange" placeholder="请选择您所在的地区" :show.sync="showAddress"></x-address>
          </group>
        </li>
        <li>
          <i :class="{'is-danger': errors.has('addressDetail')}"></i>
          <div class="cells">
            <label for="">详细地址</label>
            <input name="addressDetail" v-model="addressDetail" v-validate="'required'" type="text" placeholder="请输入您的详细地址">
          </div>
        </li>
        <li>
          <i :class="{'is-danger': errors.has('newTag')}"></i>
          <div class="cells">
            <label for="" style="align-self: flex-start;">设置标签</label>
            <div class="address-tag-box">
              <div>
                <span class="tag" v-for="(item, index) in tag" :key="item.id"  @click="tabsort(index)" :class="{ active: iscur == index }"> {{item.tag}} <i class="icon iconfont icon-Qqingchu" v-if="deleteShow" @click="deteleTag(index, item.id)"></i></span>
              </div>
              <div>
                <div v-if="!showInput">
                  <span class="tag" style="width: 2em;text-align: center;" @click="editor">+</span>
                  <span class="tag fr" @click="deleteShow = !deleteShow" v-if="tag.length > 0"><i class="icon iconfont icon-bianji"></i>编辑</span>
                </div>
                <div class="tag-input" v-if="showInput">
                  <input type="text" name="newTag" v-model="newTag" v-validate="'required'"><button type="button" @click="editor">确定</button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </form>
    <div class="address-footer" @click="addressNew">
      保存
    </div>
  </div>
</template>

<script>
import {Group, XAddress} from 'vux'
import axios from 'axios'
export default {
  name: 'address-new',
  data () {
    return {
      value: [],
      addressData: [],
      showAddress: false,
      userName: '',
      mobile: '',
      areaId: '',
      addressDetail: '',
      showInput: false,
      checkedTag: '',
      tag: [],
      newTag: null,
      iscur: null,
      deleteShow: false
    }
  },
  methods: {
    doShowAddress () {
      this.showAddress = true
      setTimeout(() => {
        this.showAddress = false
      }, 2000)
    },
    onShadowChange (ids, names) {
      this.areaId = ids.slice(-1).join()
    },
    logHide (str) {
    },
    logShow (str) {
    },
    editor () {
      this.showInput = !this.showInput
      if (this.newTag !== null) {
        axios.post('api/user/addAddressTag', {
          'tag': this.newTag
        }).then((response) => {
          if (response.data.status == 0) {
            this.getOldTag()
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    },
    tabsort (index) {
      this.iscur = index
      this.checkedTag = this.tag[index].tag
    },
    deteleTag (index, id) {
      let self = this
      this.$vux.confirm.show({
        title: '提示',
        content: '确定删除？',
        onCancel () {},
        onConfirm () {
          axios.post('api/user/removeAddressTag', {
            'id': id
          }).then((response) => {
            const {status} = response.data
            if (status == 0) {
              self.getOldTag()
            } else if (status == -2) {
              self.$vux.confirm.show({
                title: '提示',
                content: '您尚未登录，是否去登录？',
                onCancel () {},
                onConfirm () {
                  localStorage.removeItem('oldUrl')
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
          }).catch(() => {
            self.errorMsg()
          })
        }
      })
    },
    getAreaMethods () {
      if (localStorage.getItem('addressData') == null) {
        axios.get('api/index/getArea').then((response) => {
          if (response.data.status == 0) {
            let str = JSON.stringify(response.data.data.list)
            localStorage.setItem('addressData', str)
            this.addressData = JSON.parse(localStorage.getItem('addressData'))
          }
        }).catch((response) => {
          this.errors()
        })
      } else {
        this.addressData = JSON.parse(localStorage.getItem('addressData'))
      }
    },
    getOldTag () {
      axios.get('api/user/getAddressTag').then((response) => {
        if (response.data.status == 0) {
          let self = this
          this.tag = response.data.data
          this.tag.forEach(function (currentValue, index, arr) {
            if (currentValue.tag == self.activeTag) {
              self.iscur = index
            }
          })
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    addressNew () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/user/addAddress', {
            '_token': localStorage.getItem('loginToken'),
            'name': this.userName,
            'phone': this.mobile,
            'areaId': this.areaId,
            'detail': this.addressDetail,
            'tag': this.checkedTag
          }).then((response) => {
            if (response.data.status == 0) {
              let self = this
              this.$vux.toast.show({
                type: 'success',
                text: response.data.msg,
                onHide () {
                  self.$router.replace('/address-lists')
                }
              })
            } else {
              this.$vux.toast.show({
                type: 'warn',
                text: response.data.msg
              })
            }
          }).catch((response) => {
            // 响应错误回调
            this.errorMsg()
          })
          return
        }
        this.$vux.toast.show({
          type: 'warn',
          text: '请填写相关信息'
        })
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
    if (localStorage.getItem('loginToken') == null) {
      this.$router.push('/loginByCode')
    }
    this.getOldTag()
    this.getAreaMethods()
  },
  mounted () {
  },
  components: {
    Group, XAddress
  }
}
</script>

<style scoped>

</style>
