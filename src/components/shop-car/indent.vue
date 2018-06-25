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
          <h3><span class="name">{{address.name}}</span>{{address.phone}} <span class="tag"> {{address.tag}}</span></h3>
          <div class="text-muted">
            {{address.areaName}} {{address.detail}}
          </div>
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
                  <h3>{{i.title}}</h3>
                  <div class="text-muted">{{i.specificationsInfo}}</div>
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
          <img src="" alt="图片">
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
import IndentEditor from '@/components/shop-car/editor'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea } from 'vux'
import '@/assets/css/indent.css'
export default {
  name: 'indent',
  data () {
    return {
      value1: '',
      value2: '',
      address: {},
      editor: {},
      k: null,
      index: null,
      receiverId: '',
      lists: [],
      detail:
        [{"supplierName":"我是供应商","list":[{"goodsId":38,"cartId":110,"price":"300.00","title":"牛牛","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526025650_0_7072.jpg","quantity":2,"specificationsInfo":"","no":"牛牛XX1122","requirement":"规格要求1"},{"goodsId":36,"cartId":125,"price":"100.00","title":"太阳啊","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526024345_0_5379.jpg","quantity":7,"specificationsInfo":"","no":"太阳XX22","requirement":"规格要求2"},{"goodsId":39,"cartId":126,"price":"2.00","title":"手术室","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526025678_0_8400.jpg","quantity":4,"specificationsInfo":"","no":"手术室XX","requirement":"无要求"}],"date":"2018-06-24","remark":"晚点发货"},{"supplierName":"集众电采供应商","list":[{"goodsId":19,"cartId":111,"price":"0.00","title":"空调压板450","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_04/24/1524561780_0_5704.png","quantity":1,"specificationsInfo":"","no":"空调编号88","requirement":"省电的就可以"}],"date":"2018-06-23","remark":"尽快发货"}],
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
        this.address = response.data.data.list[index]
        this.receiverId = response.data.data.list[index].id
      }).catch((response) => {
        this.errorMsg()
      })
    },
    next () {
      this.editorSHow = !this.editorSHow
    },
    submit () {
      axios.post('api/order/make&tt=1', {
        'receiverId': 126,
        'detail': [{"supplierName":"我是供应商","list":[{"goodsId":38,"cartId":110,"price":"300.00","title":"牛牛","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526025650_0_7072.jpg","quantity":2,"specificationsInfo":"","no":"牛牛XX1122","requirement":"规格要求1"},{"goodsId":36,"cartId":125,"price":"100.00","title":"太阳啊","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526024345_0_5379.jpg","quantity":7,"specificationsInfo":"","no":"太阳XX22","requirement":"规格要求2"},{"goodsId":39,"cartId":126,"price":"2.00","title":"手术室","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526025678_0_8400.jpg","quantity":4,"specificationsInfo":"","no":"手术室XX","requirement":"无要求"}],"date":"2018-06-24","remark":"晚点发货"},{"supplierName":"集众电采供应商","list":[{"goodsId":19,"cartId":111,"price":"0.00","title":"空调压板450","icon":"http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_04/24/1524561780_0_5704.png","quantity":1,"specificationsInfo":"","no":"空调编号88","requirement":"省电的就可以"}],"date":"2018-06-23","remark":"尽快发货"}]
      }).then((response) => {
        if (response.data.status === 0) {
          sessionStorage.setItem('indent-detail', response.data.data())
          this.$router.push('/shop-car/detail')
        }
      }).catch((response) => {
        this.errorMsg()
      })
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
    sessionStorage.removeItem('indent-detail')
    let index = sessionStorage.getItem('selectAddressIndex')
    if (index === null) {
      this.getLists(0)
    } else {
      this.getLists(index)
    }
    this.total = sessionStorage.getItem('total')
    this.lists = JSON.parse(sessionStorage.getItem('indentLists'))
    this.lists.forEach((v) => {
      v.date = ''
      v.remark = ''
      v.goods = v.list
      delete v.list
    })
  },
  mounted () {
  },
  components: {
    IndentEditor,
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
