<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        采购清单
      </div>
      <div style="padding-right: 0.5rem">
        管理
      </div>
    </div>
    <div class="shop-car-container">
      <div class="shller-title">
        <check-icon :value.sync="demo1">
          <i class="icon iconfont icon-daifukuan"></i> 广东津晶电器有限责任公司
        </check-icon>
      </div>
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="i in 3" :key="i">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('delete')" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="shop-car-content">
            <check-icon :value.sync="demo1">
            </check-icon>
            <div>
              <img src="../../assets/images/bingxiang-icon.png" alt="">
              <div>
                <h3>上诺行护角上诺行护角</h3>
                <div class="text-muted">产品规格描述</div>
                <span class="text-red">￥ 88.88</span>
                <inline-x-number width="50px" :min="0"></inline-x-number>
              </div>
            </div>

          </div>
        </swipeout-item>
      </swipeout>
      <div class="shller-title">
        <check-icon :value.sync="demo1">
          <i class="icon iconfont icon-daifukuan"></i> 广东津晶电器有限责任公司
        </check-icon>
      </div>
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="i in 3" :key="i">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('delete')" type="warn">删除</swipeout-button>
          </div>
          <div slot="content" class="shop-car-content">
            <check-icon :value.sync="demo1">
            </check-icon>
            <div>
              <img src="../../assets/images/bingxiang-icon.png" alt="">
              <div>
                <h3>上诺行护角上诺行护角</h3>
                <div class="text-muted">产品规格描述</div>
                <span class="text-red">￥ 88.88</span>
                <inline-x-number width="50px" :min="0"></inline-x-number>
              </div>
            </div>

          </div>
        </swipeout-item>
      </swipeout>
      <div class="shller-title">
        <check-icon :value.sync="demo1">
          <i class="icon iconfont icon-daifukuan"></i> 广东津晶电器有限责任公司
        </check-icon>
      </div>
      <swipeout>
        <swipeout-item transition-mode="follow" v-for="i in 3" :key="i">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('delete')" type="warn">
              <i class="icon iconfont icon-shanchu1"></i>
            </swipeout-button>
          </div>
          <div slot="content" class="shop-car-content">
            <check-icon :value.sync="demo1">
            </check-icon>
            <div>
              <img src="../../assets/images/bingxiang-icon.png" alt="">
              <div>
                <h3>上诺行护角上诺行护角</h3>
                <div class="text-muted">产品规格描述</div>
                <span class="text-red">￥ 88.88</span>
                <inline-x-number width="50px" :min="0"></inline-x-number>
              </div>
            </div>

          </div>
        </swipeout-item>
      </swipeout>
    </div>
    <div class="shop-car-total">
      <div>
        合计：
        <span class="text-red">88.88</span>
      </div>
      <div>
        去结算
      </div>
    </div>
  </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, CheckIcon } from 'vux'
import '@/assets/css/shop-car.css'
export default {
  name: 'shop-car',
  data () {
    return {
      demo1: false
    }
  },
  methods: {
    onButtonClick (type) {
      alert('on button click ' + type)
    },
    handleEvents (type) {
      console.log('event: ', type)
    }
  },
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    InlineXNumber,
    CheckIcon
  }
}
</script>

<style scoped>

</style>
