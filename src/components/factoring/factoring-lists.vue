<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        申请记录
      </div>
      <div style="padding-right: 1rem">&emsp;</div>
    </div>
    <table>
      <tr>
        <th>
          申请时间
        </th>
        <th>
          订单号
        </th>
        <th>
          申请金额
        </th>
      </tr>
      <tr v-for="(item, index) in factoringList" :key="index">
        <td>{{item.dataTime}}</td>
        <td>{{item.orderSn}}</td>
        <td>{{item.needAccount}}</td>
      </tr>
    </table>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'factoring-lists',
  data () {
    return {
      factoringList: []
    }
  },
  methods: {
    getLists () {
      axios.post('api/Factoring/getFactoringList').then((response) => {
        const {status, data: {factoringList}} = response.data
        if (status == 0) {
          this.factoringList = factoringList
        }
      })
    }
  },
  created () {
    this.getLists()
  }
}
</script>

<style scoped>
  table{
    width: 100%;
    line-height: 25px;
    text-align: center;
    border-collapse: collapse;
    font-size: 0.7rem;
    margin-top: 0.5rem;
  }
  table,table tr th, table tr td {
    border: 1px solid #CCCCCC;
  }

</style>
