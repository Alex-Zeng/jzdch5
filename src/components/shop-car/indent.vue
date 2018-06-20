<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
        <div>
          确认订单
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <div class="address">
        <div>
          <h3><span class="name">张三</span>18802020905 <span class="tag"> 公司</span></h3>
          <div class="text-muted">
            广东省-广州市-海珠区-昌岗中路166号5楼505、
            506室
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
                  <div class="text-muted">数量&emsp;{{i.quantity}}&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">{{i.price}}</span></div>
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
              @on-hide="log('hide', $event)"></datetime>
          </group>
          <group>
            <x-textarea :max="75" :rows="1" autosize placeholder="填写备注信息"></x-textarea>
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
            <label for="">物料编号&nbsp;</label>
            <input name="" type="text" v-model="editor.no" placeholder="点击设置物料编号，最多30个字">
          </li>
          <li>
            <label for="">规格要求&nbsp;</label>
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
import IndentEditor from '@/components/shop-car/editor'
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea } from 'vux'
import '@/assets/css/indent.css'
export default {
  name: 'indent',
  props: ['lists'],
  data () {
    return {
      value1: '',
      value2: '',
      editor: {},
      k: null,
      index: null,
      editorSHow: false,
      $t: '',
      total: '3010'
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
    next () {
      this.editorSHow = !this.editorSHow
    },
    submit () {
      this.$router.push('/shop-car/detail')
    },
    log (str1, str2 = '') {
      console.log(str1, str2)
    },
    onConfirm (val) {
      console.log('on-confirm arg', val)
      console.log('current value', this.value1)
    },
    change (value) {
      console.log('change', value)
    }
  },
  created () {
  },
  mounted () {
    console.log(this.lists.length)
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
