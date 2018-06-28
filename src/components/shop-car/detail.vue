<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
        <div>
          &emsp;
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <div class="success-info">
        <i class="icon iconfont icon-chenggong"></i>
        <p>订单已经替提交成功</p>
        <p>工作人员会尽快与您联系</p>
      </div>
      <div class="indent-detail">
        <ul>
          <li v-for="(item, index) in detail" :key="index">
            <div class="indent-detail-order">
              <p><span>订单号</span>{{item.orderNo}}</p>
              <p><span>交货期</span>{{item.date}}</p>
            </div>
            <div class="indent-detail-seller indent-title">
              {{item.supplierName}}
            </div>
            <div class="indent-content" v-for="i in item.goods" :key="i.goods_id">
              <img :src="i.icon" alt="">
              <div class="indent-info">
                <h3><router-link :to="'/detail/'+i.goods_id">{{i.title}}</router-link></h3>
                <div class="text-muted" v-if="i.specificationsInfo">商品规格 {{i.specificationsInfo}}</div>
                <div class="text-muted" v-if="i.no">物料编号&emsp;{{i.no}}</div>
                <div class="text-muted" v-if="i.requirement">物料规格&emsp;{{i.requirement}}</div>
                <div class="text-muted">
                  数量&emsp;{{i.quantity}}&emsp;&emsp;&emsp;&emsp;单价&emsp;
                  <span class="text-red">{{i.price}}元</span>
                </div>
              </div>
            </div>
            <div class="indent-remark">
              <span>备注：</span>
              <div>{{item.remark}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="shop-car-total">
        <div>
          总金额：
          <span class="text-red">{{total}}</span>
        </div>
        <div @click="$router.push('/')">
          返回首页
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      total: '',
      detail: []
    }
  },
  created () {
    this.detail = JSON.parse(sessionStorage.getItem('indent-detail'))
    this.total = sessionStorage.getItem('total')
    this.total = parseFloat(this.total).toFixed(2)
  }
}
</script>

<style scoped>

</style>
