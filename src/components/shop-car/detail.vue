<template>
    <div>
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-2)"></i>
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
              广东津晶电器有限责任公司
            </div>
            <div class="indent-content">
              <img src="http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526025650_0_7072.jpg" alt="">
              <div class="indent-info">
                <h3>牛牛</h3>
                <div class="text-muted">商品规格</div>
                <div class="text-muted">物料编号&emsp;水电费水电费</div>
                <div data-v-eef590aa="" class="text-muted">物料规格&emsp;是的发放</div>
                <div data-v-eef590aa="" class="text-muted">
                  数量&emsp;2&emsp;&emsp;&emsp;&emsp;单价&emsp;
                  <span class="text-red">300.00元</span>
                </div>
              </div>
            </div>
            <div class="indent-content">
              <img src="http://192.168.3.135:8079/web/public/uploads/goods_thumb/2018_05/11/1526025650_0_7072.jpg" alt="">
              <div class="indent-info">
                <h3>牛牛</h3>
                <div class="text-muted">商品规格</div>
                <div class="text-muted">物料编号&emsp;水电费水电费</div>
                <div data-v-eef590aa="" class="text-muted">物料规格&emsp;是的发放</div>
                <div data-v-eef590aa="" class="text-muted">
                  数量&emsp;2&emsp;&emsp;&emsp;&emsp;单价&emsp;
                  <span class="text-red">300.00元</span>
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
          <span class="text-red">6000</span>
        </div>
        <div>
          提交订单
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'detail',
  data () {
    return {
      detail: []
    }
  }
}
</script>

<style scoped>

</style>
