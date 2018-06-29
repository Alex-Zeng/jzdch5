<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        设置中心
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <group>
      <cell is-link>
          <span slot="title"  @click="selectMethods">
                <span style="vertical-align:middle;">我是企业法人&emsp;&emsp;&emsp;&emsp;&emsp;</span>
          </span>
      </cell>
      <cell is-link>
          <span slot="title"  @click="selectMethods">
              <span style="vertical-align:middle;">我是委托代理人&emsp;&emsp;&emsp;&emsp;&emsp;</span>
          </span>
      </cell>
    </group>
    <div class="select-confirm" v-if="show">
      <div class="select-confirm-content">
        <div>
          <div class="select-confirm-title">请选择您认证的企业类型：</div>
          <div class="select-confirm-checkbox">
            <div>
              <label>
                <i class="icon iconfont icon-danxuananniu" v-if="selectItem==0?false:true"></i>
                <i class="icon iconfont icon-danxuananniu-xuanzhong1" v-if="selectItem==0?true:false" style="color: #1EB9EE;"></i>
                <input type="radio" name="name" v-show="false" v-model="selectItem" value="0">供应商
              </label>
            </div>
            <div>
              <label>
                <i class="icon iconfont icon-danxuananniu" v-if="selectItem==1?false:true"></i>
                <i class="icon iconfont icon-danxuananniu-xuanzhong1" v-if="selectItem==1?true:false" style="color: #1EB9EE;"></i>
                <input type="radio" name="name" v-show="false" v-model="selectItem" value="1">采购商
              </label>
            </div>
          </div>
          <div class="select-confirm-button">
            <button @click="$router.push('/enterprise')">确定</button>
            <button @click="cancel">取消</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {Cell, CellBox, Group, Checklist, XButton} from 'vux'
import '@/assets/css/settings.css'
export default {
  name: 'select-enterprise',
  data () {
    return {
      checklist001: '',
      commonList: ['供应商', '采购商'],
      selectItem: 0,
      show: false
    }
  },
  methods: {
    change (val, label) {
      console.log('change', val, label)
    },
    selectMethods () {
      this.show = true
    },
    cancel () {
      this.show = false
    }
  },
  components: {
    Cell,
    CellBox,
    Group,
    Checklist,
    XButton
  }
}
</script>

<style scoped>

</style>
