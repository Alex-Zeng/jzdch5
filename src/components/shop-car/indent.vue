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
        <div class="indent-title">
          广东律晶电器有限责任公司
          <span class="fr">（左滑商品编辑对应物料信息）</span>
        </div>
        <swipeout>
          <swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('delete')" type="warn"><i class="icon iconfont icon-bianji"></i></swipeout-button>
            </div>
            <div slot="content" class="indent-content">
              <img src="" alt="图片">
              <div class="indent-info">
                <h3>上诺行护角上诺行护角</h3>
                <div class="text-muted">产品规格描述</div>
                <div class="text-muted">物料编号&emsp;9820123452</div>
                <div class="text-muted">物料规格&emsp;ZYEN-986522243 右后护角</div>
                <div class="text-muted">数量&emsp;20台&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">3000</span></div>

              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <swipeout>
          <swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('delete')" type="warn"><i class="icon iconfont icon-bianji"></i></swipeout-button>
            </div>
            <div slot="content" class="indent-content">
              <img src="" alt="图片">
              <div class="indent-info">
                <h3>上诺行护角上诺行护角</h3>
                <div class="text-muted">产品规格描述</div>
                <div class="text-muted">物料编号&emsp;9820123452</div>
                <div class="text-muted">物料规格&emsp;ZYEN-986522243 右后护角</div>
                <div class="text-muted">数量&emsp;20台&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">3000</span></div>

              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <group>
          <datetime
            v-model="value1"
            @on-change="change"
            title="期望交货日期"
            @on-cancel="log('cancel')"
            @on-confirm="onConfirm"
            @on-hide="log('hide', $event)"></datetime>
        </group>
        <group>
          <x-textarea :max="75" :rows="1" autosize placeholder="填写备注信息"></x-textarea>
        </group>

        <div class="indent-title">
          广东律晶电器有限责任公司
          <span class="fr">（左滑商品编辑对应物料信息）</span>
        </div>
        <swipeout>
          <swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('delete')" type="warn"><i class="icon iconfont icon-bianji"></i></swipeout-button>
            </div>
            <div slot="content" class="indent-content">
              <img src="" alt="图片">
              <div class="indent-info">
                <h3>上诺行护角上诺行护角</h3>
                <div class="text-muted">产品规格描述</div>
                <div class="text-muted">物料编号&emsp;9820123452</div>
                <div class="text-muted">物料规格&emsp;ZYEN-986522243 右后护角</div>
                <div class="text-muted">数量&emsp;20台&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">3000</span></div>

              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <swipeout>
          <swipeout-item @on-close="handleEvents('on-close')" @on-open="handleEvents('on-open')" transition-mode="follow">
            <div slot="right-menu">
              <swipeout-button @click.native="onButtonClick('delete')" type="warn"><i class="icon iconfont icon-bianji"></i></swipeout-button>
            </div>
            <div slot="content" class="indent-content">
              <img src="" alt="图片">
              <div class="indent-info">
                <h3>上诺行护角上诺行护角</h3>
                <div class="text-muted">产品规格描述</div>
                <div class="text-muted">物料编号&emsp;9820123452</div>
                <div class="text-muted">物料规格&emsp;ZYEN-986522243 右后护角</div>
                <div class="text-muted">数量&emsp;20台&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">3000</span></div>

              </div>
            </div>
          </swipeout-item>
        </swipeout>
        <group>
          <datetime
            v-model="value2"
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
      <div class="shop-car-total">
        <div>
          总金额：
          <span class="text-red">{{total}}</span>
        </div>
        <div>
          提交订单
        </div>
      </div>
    </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, Group, Datetime, XTextarea } from 'vux'
import '@/assets/css/indent.css'
export default {
  name: 'indent',
  data () {
    return {
      value1: '',
      value2: '',
      $t: '',
      total: '302210'
    }
  },
  methods: {
    onButtonClick (type) {
      alert('on button click ' + type)
    },
    handleEvents (type) {
      console.log('event: ', type)
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
