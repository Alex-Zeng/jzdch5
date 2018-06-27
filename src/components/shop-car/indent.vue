<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
        <div>
          确认订单
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <div class="address" @click="$router.push('/address-lists')">
        <div>
          <template v-if="address">
          <h3><span class="name">{{address.name}}</span>{{address.phone}} <span class="tag"> {{address.tag}}</span></h3>
          <div class="text-muted">
            {{address.areaName}} {{address.detail}}
          </div>
          </template>
          <template v-if="!address">请添加收货地址</template>
        </div>
        <i class="icon iconfont icon-youdanjiantou"></i>
      </div>
      <div class="indent-list">
        <div v-for="(item, index) in lists" :key="index">
          <div class="indent-title">
            {{item.supplierName}}
            <span class="fr">（左滑商品编辑对应物料信息）</span>
          </div>
          <swipeout v-for="(i, k) in item.list" :key="i.goodsId">
            <swipeout-item transition-mode="follow">
              <div slot="right-menu">
                <swipeout-button @click.native="onButtonClick(k, index)" type="warn"><i class="icon iconfont icon-bianji"></i></swipeout-button>
              </div>
              <div slot="content" class="indent-content">
                <img :src="i.icon" alt="">
                <div class="indent-info">
                  <h3><router-link :to="'/detail/'+i.goodsId">{{i.title}}</router-link></h3>
                  <div class="text-muted" v-if="i.specificationsInfo">商品规格 {{i.specificationsInfo}}</div>
                  <div class="text-muted" v-if="i.no">物料编号&emsp;{{i.no}}</div>
                  <div class="text-muted" v-if="i.requirement">物料规格&emsp;{{i.requirement}}</div>
                  <div class="text-muted">数量&emsp;{{i.quantity}}&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">{{i.price}}元</span></div>
                  <input type="hidden" :value="i.quantity*(i.price)">
                </div>
              </div>
            </swipeout-item>
          </swipeout>
          <group>
            <datetime
              @on-change="change"
              title="期望交货日期"
              @on-cancel="log('cancel')"
              @on-confirm="onConfirm"
              @on-hide="log('hide', $event)" v-model="item.date"></datetime>
          </group>
          <group>
            <x-textarea :max="75" :rows="1" v-model="item.remark" autosize placeholder="填写备注信息"></x-textarea>
          </group>
        </div>
      </div>
      <div class="shop-car-total">
        <div>
          总金额：
          <span class="text-red">{{total}}</span>
        </div>
        <div @click="submit">
          提交订单
        </div>
      </div>
      <div  v-if="editorSHow" class="editor-container">
        <div class="header-nav">
          <i class="icon iconfont icon-back" style="padding-right: 1rem;" @click="cancelEditor"></i>
          <div>
            物料编辑
          </div>
          <div style="padding-right: 2rem">&emsp;</div>
        </div>
        <div class="indent-content" style="margin-top: 0.5rem;">
          <img :src="editor.icon" alt="图片">
          <div class="indent-info">
            <h3>{{editor.title}}</h3>
            <div class="text-muted">{{editor.specificationsInfo}}</div>
            <div class="text-muted">物料编号&emsp;{{editor.no}}</div>
            <div class="text-muted">物料规格&emsp;{{editor.requirement}}</div>
            <div class="text-muted">数量&emsp;{{editor.quantity}}&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">{{editor.price}}</span></div>
          </div>
        </div>
        <ul class="editor">
          <li>
            <label>物料编号&nbsp;</label>
            <input name="" type="text" v-model="editor.no" placeholder="点击设置物料编号，最多30个字">
          </li>
          <li>
            <label>规格要求&nbsp;</label>
            <input name="" type="text" v-model="editor.requirement" placeholder="点击设置规格要求，最多40个字">
          </li>
          <li style="padding: 0 1rem;">
            <button type="submit" class="btn btn-primary" @click="next">下一步</button>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import axios from 'axios'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea } from 'vux'
import '@/assets/css/indent.css'
export default {
  name: 'indent',
  data () {
    return {
      value1: '',
      value2: '',
      address: null,
      editor: {},
      k: null,
      index: null,
      receiverId: '',
      lists: [],
      detail: [],
      editorSHow: false,
      total: 0
    }
  },
  methods: {
    onButtonClick (k, index) {
      let editor = this.lists
      this.editor = editor[index].list[k]
      this.k = k
      this.index = index
      this.editorSHow = true
    },
    cancelEditor () {
      this.editor.no = null
      this.editor.requirement = null
      this.editorSHow = !this.editorSHow
    },
    getLists (index) {
      axios.get('api/user/getAddressList&_token=' + sessionStorage.getItem('loginToken')).then((response) => {
        if (response.data.status === 0) {
          if (response.data.data.list.length > 0) {
            this.address = response.data.data.list[index]
            this.receiverId = response.data.data.list[index].id
          } else {
          }
        }
      }).catch((response) => {
        console.log(response)
        this.errorMsg()
      })
    },
    next () {
      this.editorSHow = !this.editorSHow
    },
    submit () {
      if (this.address !== null) {
        let self = this
        this.$vux.confirm.show({
          title: '提示',
          content: '是否已正确填写相关信息？',
          onCancel () {},
          onConfirm () {
            axios.post('api/order/make', {
              '_token': sessionStorage.getItem('loginToken'),
              'receiverId': self.receiverId,
              'detail': JSON.stringify(self.lists)
            }).then((response) => {
              if (response.data.status === 0) {
                sessionStorage.setItem('indent-detail', JSON.stringify(response.data.data))
                sessionStorage.removeItem('indentLists')
                self.$router.push('/shop-car/detail')
              }
            }).catch((response) => {
              this.errorMsg()
            })
          }
        })
      } else {
        this.$vux.toast.show({
          type: 'warn',
          text: '请添加收货地址',
          onShow () {
            console.log('Plugin: I\'m showing')
          },
          onHide () {
            console.log('Plugin: I\'m hiding')
          }
        })
      }
    },
    log (str1, str2 = '') {
      console.log(str1, str2)
    },
    onConfirm (val) {
      console.log('on-confirm arg', val)
    },
    change (value, index) {
      console.log('change', value, index)
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
    window.scrollTo(0, 0)
    sessionStorage.removeItem('indent-detail')
    let index = sessionStorage.getItem('selectAddressIndex')
    if (index === null) {
      this.getLists(0)
    } else {
      this.getLists(index)
    }
    this.total = sessionStorage.getItem('total')
    this.lists = JSON.parse(sessionStorage.getItem('indentLists'))
    if (sessionStorage.getItem('indentLists') === null) {
      this.$router.push('/')
    } else {
      this.lists.forEach((v) => {
        v.date = ''
        v.remark = ''
      })
    }
  },
  mounted () {
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Group,
    Datetime,
    XTextarea
  }
}
</script>

<style scoped>

</style>
