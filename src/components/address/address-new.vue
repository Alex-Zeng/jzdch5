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
              <div @click="getTag">
                <span class="tag" v-for="(item, index) in tag" :key="item.id"  @click="tabsort(index)" :class="{ active: iscur == index }"> {{item.tag}}</span>
              </div>
              <div style="padding-top: 0.8rem;">
                <span class="tag" style="width: 2em;text-align: center;" v-if="!showInput" @click="editor">+</span>
                <div class="tag-input" v-if="showInput">
                  <input type="text" name="newTag" maxlength="5" v-model="newTag" v-validate="'required'"><button type="button" @click="editor">确定</button>
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
      checkedTag: '公司',
      tag: [],
      newTag: null,
      iscur: 0
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
      console.log(ids, names)
      this.areaId = ids.slice(-1).join()
    },
    logHide (str) {
      console.log('on-hide', str)
    },
    logShow (str) {
      console.log('on-show', str)
    },
    editor () {
      this.showInput = !this.showInput
      if (this.newTag !== null) {
        this.tag.push({'tag': this.newTag})
        axios.post('api/user/addAddressTag', {
          '_token': sessionStorage.getItem('loginToken'),
          'tag': this.newTag
        }).then((response) => {
          if (response.data.status === 0) {
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    },
    getTag (event) {
      this.checkedTag = event.target.innerText
    },
    tabsort (index) {
      this.iscur = index
    },
    getAreaMethods () {
      if (localStorage.getItem('addressData') === null) {
        axios.get('api/index/getArea').then((response) => {
          if (response.data.status === 0) {
            let str = JSON.stringify(response.data.data.list)
            localStorage.setItem('addressData', str)
            this.addressData = JSON.parse(localStorage.getItem('addressData'))
            console.log(this.addressData)
          }
        }).catch((response) => {
          this.errors()
        })
      } else {
        this.addressData = JSON.parse(localStorage.getItem('addressData'))
        console.log(this.addressData)
      }
    },
    getOldTag () {
      axios.get('api/user/getAddressTag&_token=' + sessionStorage.getItem('loginToken')).then((response) => {
        if (response.data.status === 0) {
          this.tag = response.data.data
        }
      }).catch((response) => {
        this.errorMsg()
      })
    },
    addressNew () {
      this.$validator.validateAll().then((result) => {
        if (result) {
          axios.post('api/user/addAddress', {
            '_token': sessionStorage.getItem('loginToken'),
            'name': this.userName,
            'phone': this.mobile,
            'areaId': this.areaId,
            'detail': this.addressDetail,
            'tag': this.checkedTag
          }).then((response) => {
            if (response.data.status === 0) {
              let self = this
              this.$vux.toast.show({
                type: 'success',
                text: response.data.msg,
                onShow () {
                  console.log('Plugin: I\'m showing')
                },
                onHide () {
                  self.$router.push('/address-lists')
                  console.log('Plugin: I\'m hiding')
                }
              })
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
          text: '请填写相关信息',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
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
    if (sessionStorage.getItem('loginToken') === null) {
      this.$router.push('/login')
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
