<template>
  <div style="padding-bottom: 2.3rem;">
    <div class="search-nav">
      <div :class="[selectBox ,isActive ? activeClass : '']">
        <span  @click="setFocus" v-text="value"></span>
        <ul v-if="select">
          <li v-for="(item, index) in list" :key="index" :id="index" @click="onChange">
            {{item.value}}
          </li>
        </ul>
      </div>
      <div class="input-box">
        <form action="javascript:;">
          <input type="text" v-model="keywords" @keyup="getResult($event)" @focus="getHistory" @blur="onBlur" placeholder="搜索您想要的商品"/>
          <i class="icon iconfont icon-clear clear" v-if="clear" @click="onCancel"></i>
          <a onclick="history.go(-1)"><span>取消</span></a>
        </form>
      </div>
    </div>
    <div v-show="showHistory" class="search-history-box">
      <div class="search-history-header">
        <span>搜索记录</span>
        <i class="icon iconfont icon-shanchu1" @click="confirm"></i>
      </div>
      <ul class="search-history">
        <li v-for="(item, index) in historyLists" :key="item.id" @click="searchHistory(index)">
          <a href="javascript:;">{{item.keyword}}</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { Group, Search, Cell, Selector, CellBox, XButton } from 'vux'
import axios from 'axios'
import MeScroll from '../../../static/js/mescroll.min.js'
export default {
  name: 'search-nav',
  props: ['mySort'],
  data () {
    return {
      loginToken: null,
      select: false,
      selectBox: 'select-box',
      activeClass: 'select-active-box',
      isActive: false,
      clear: false,
      showHistory: false,
      results: [],
      value: '商品',
      type: '0',
      keywords: '',
      list: [{key: '0', value: '商品'}, {key: '1', value: '供货商'}],
      historyLists: [],
      goodsLists: [],
      mescroll: null,
      cateId: ''
    }
  },
  methods: {
    onChange (val) {
      console.log(val.target.id)
      this.select = false
      this.isActive = false
      this.value = val.target.innerText
      this.type = val.target.id
    },
    setFocus () {
      if (this.select === true) {
        this.select = false
        this.isActive = false
      } else {
        this.showHistory = true
        this.select = true
        this.isActive = true
      }
    },
    sortMethods () {
      this.mescroll.resetUpScroll()
    },
    getResult (val) {
      /* this.mescroll.destroy() */
      if (val.keyCode === 13 || val === true) {
        if (val.keyCode === 13) {
          let obj = { 'keyword': this.keywords }
          let allArr = []
          let oldArr = this.historyLists
          oldArr.push(obj)
          for (let i = 0; i < oldArr.length; i++) {
            let flag = true
            for (let j = 0; j < allArr.length; j++) {
              if (oldArr[i].keyword === allArr[j].keyword) {
                flag = false
              }
            }
            if (flag) {
              allArr.push(oldArr[i])
            }
          }
          this.historyLists = allArr
          sessionStorage.setItem('keyword', JSON.stringify(this.historyLists))
        }
        var self = this
        self.mescroll = new MeScroll('mescroll', {
          up: {
            /* 上拉加载的配置参数 */
            auto: true, // 是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
            callback: self.upCallback, // 上拉回调
            // 以下参数可删除,不配置
            isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
            offset: 500,
            clearEmptyId: 'dataList',
            empty: { // 配置列表无任何数据的提示
              warpId: 'dataList',
              // icon: '../res/img/mescroll-empty.png'
              tip: '亲,暂无相关数据哦~',
              btntext: '去逛逛 >',
              btnClick: function () {
                // alert('点击了去逛逛按钮')
                self.$router.push('/')
              }
            }
          }
        })
      }
    },
    onBlur () {
      this.showHistory = false
    },
    onCancel () {
      this.keywords = ''
    },
    getHistory () {
      if (this.loginToken === null) {
        var localKeywords = sessionStorage.getItem('keyword')
        if (localKeywords !== null) {
          this.showHistory = true
          this.historyLists = JSON.parse(localKeywords)
        } else {
          this.showHistory = false
        }
      } else {
        axios.get('api/record/getSearch').then((response) => {
          if (response.data.status === 0) {
            this.showHistory = true
            this.historyLists = response.data.data
          } else {
            this.showHistory = false
          }
        }).catch((response) => {
          this.errorMsg()
        })
      }
    },
    confirm () {
      let self = this
      this.$vux.confirm.show({
        content: '是否确认删除所有历史记录？',
        onCancel () {
        },
        onConfirm () {
          sessionStorage.removeItem('keyword')
          self.historyLists = null
          axios.get('api/record/removeSearch').then((response) => {
            self.$vux.toast.show({
              type: 'success',
              text: '删除成功',
              onShow () {
                console.log('Plugin: I\'m showing')
                self.showHistory = false
              },
              onHide () {
                console.log('Plugin: I\'m hiding')
              }
            })
          }).catch((response) => {})
        }
      })
    },
    searchHistory (index) {
      this.keywords = this.historyLists[index].keyword
      this.getResult(true)
      // var self = this
      // self.mescroll.removeEmpty()
      /* self.mescroll = new MeScroll('mescroll', {
        up: {
          /!* 上拉加载的配置参数 *!/
          auto: true, // 是否在初始化时以上拉加载的方式自动加载第一页数据; 默认false
          callback: self.upCallback, // 上拉回调
          // 以下参数可删除,不配置
          isBounce: false, // 此处禁止ios回弹,解析(务必认真阅读,特别是最后一点): http://www.mescroll.com/qa.html#q10
          // page:{size:8}, //可配置每页8条数据,默认10
          offset: 500,
          empty: { // 配置列表无任何数据的提示
            warpId: 'dataList',
            // icon: '../res/img/mescroll-empty.png'
            tip: '亲,暂无相关数据哦~',
            btntext: '去逛逛 >',
            btnClick: function () {
              // alert('点击了去逛逛按钮')
              self.$router.push('/')
            }
          }
        }
      }) */
    },
    // 上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
    upCallback (page) {
      console.log('联网加载数据')
      // 联网加载数据
      var self = this
      this.getListDataFromNet(page.num, page.size, function (curPageData, totalSize) {
        // self.mescroll.destroy()
        // curPageData = [] // 打开本行注释,可演示列表无任何数据empty的配置
        if (page.num === 1) self.goodsLists = []
        // 更新列表数据
        self.goodsLists = self.goodsLists.concat(curPageData)
        self.mescroll.endBySize(curPageData.length, totalSize) // 必传参数(当前页的数据个数, 总数据量)
        self.$emit('isLogFn', self.goodsLists)
        console.log('传值：')
        console.log(self.goodsLists)
      }, function () {
        // 联网失败的回调,隐藏下拉刷新和上拉加载的状态;
        self.mescroll.endErr()
      })
    },
    getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
      this.onBlur()
      var self = this
      // 延时一秒,模拟联网
      setTimeout(function () {
        axios.post('api/goods/search', {
          'type': self.type,
          'keywords': self.keywords,
          'sort': self.mySort,
          'pageNumber': pageNum,
          'pageSize': pageSize,
          'cateId': self.$route.query.id
        }).then((response) => {
          if (response.data.status === 0) {
            // 响应成功回调
            var data = response.data.data.list
            var total = response.data.data.total
            var listData = []// 模拟分页数据
            for (var i = 0; i < data.length; i++) {
              if (data[i] !== undefined) {
                listData.push(data[i])
              }
            }
            console.log('listData')
            console.log(listData)
            successCallback && successCallback(listData, total)// 成功回调
          } else {
            this.$vux.toast.show({
              type: 'warn',
              text: response.data.msg,
              onShow () {
                console.log('Plugin: I\'m showing')
              },
              onHide () {
                console.log('Plugin: I\'m hiding')
              }
            })
          }
        }).catch((response) => {
          console.log(response)
          // 响应错误回调
          console.log('error')
          // self.errorMsg()
          errorCallback && errorCallback()// 失败回调
        })
      }, 1000)
    }
  },
  mounted () {
    this.loginToken = sessionStorage.getItem('loginToken')
    // this.getHistory()
    var cateId = this.$route.query.id
    if (cateId !== undefined) {
      this.cateId = cateId
      this.getResult(true)
    }
  },
  watch: {
    mySort (val) {
      console.log(val)
    },
    keywords (val) {
      if (val !== '') {
        this.clear = true
      } else {
        this.clear = false
      }
    }
  },
  components: {
    Group, Search, Cell, Selector, CellBox, XButton
  }
}
</script>

<style scoped>

</style>
