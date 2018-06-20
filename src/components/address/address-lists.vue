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
      <li>
        <div>
          <h3><span class="name">张三</span>18802020905 <span class="tag"> 公司</span></h3>
          <div class="text-muted">
            广东省-广州市-海珠区-昌岗中路166号5楼505、
            506室
          </div>
        </div>
        <div class="address-btn">
          <div>
            <i class="icon iconfont icon-danxuananniu" v-if="!defaultAddress"></i>
            <i class="icon iconfont icon-danxuananniu-xuanzhong1" v-if="defaultAddress" style="color: #1EB9EE;"></i>
            <label class="text-muted"><input type="checkbox" :value="2" v-model="defaultAddress">设为默认</label>
          </div>
          <div>
            <span class="text-muted">
              <i class="icon iconfont icon-bianji"></i>
              编辑
            </span>&nbsp;
            <span class="text-muted">
              <i class="icon iconfont icon-shanchu1"></i>
              删除
            </span>
          </div>
        </div>
      </li>
      <li>
        <div>
          <h3><span class="name">张三</span>18802020905 <span class="tag"> 公司</span></h3>
          <div class="text-muted">
            广东省-广州市-海珠区-昌岗中路166号5楼505、
            506室
          </div>
        </div>
        <div class="address-btn">
          <div>
            <i class="icon iconfont icon-danxuananniu" v-if="!defaultAddress"></i>
            <i class="icon iconfont icon-danxuananniu-xuanzhong1" v-if="defaultAddress" style="color: #1EB9EE;"></i>
            <label class="text-muted"><input type="checkbox" :value="2" v-model="defaultAddress">设为默认</label>
          </div>
          <div>
            <span class="text-muted">
              <i class="icon iconfont icon-bianji"></i>
              编辑
            </span>&nbsp;
            <span class="text-muted">
              <i class="icon iconfont icon-shanchu1"></i>
              删除
            </span>
          </div>
        </div>
      </li>
    </ul>
    <div class="address-footer">
      新增地址
    </div>
  </div>
</template>

<script>
import '@/assets/css/address.css'
export default {
  name: 'address-lists',
  data () {
    return {
      defaultAddress: true
    }
  }
}
</script>

<style scoped>

</style>
