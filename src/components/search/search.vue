<template>
  <div>
    <SearchNav  @isLogFn = "lisLogFn"></SearchNav>
    <template>
      <div class="search-lists-header">
        <i :class="{'icon iconfont icon-fangge1':isA,'icon iconfont icon-liebiao':!isA}" @click="toggle()"></i>
        <i class="icon iconfont icon-jiagepaixu1" @click="sortMethod"></i>
      </div>
      <div class="mescroll" id="mescroll">
        <!--展示上拉加载的数据列表-->
        <ul  id="dataList" v-if="showList" class="search-lists"  v-cloak>
          <li v-for="(item, index) in goodsLists" :key="index">
            <router-link :to="'/detail/'+item.id">
              <img :src="item.url" alt="">
              <div>
                <h3>{{item.title}}</h3>
                <div class="text-red">
                  ￥ {{item.min_price}}{{item.max_price===item.min_price?'':' ~ ￥'+item.max_price}}
                </div>
              </div>
            </router-link>
          </li>
        </ul>
        <ul v-if="!showList" class="goods-lists" style="padding-top: 2.8rem;">
          <li v-for="(item, index) in goodsLists" :key="index">
            <router-link :to="'/detail/'+item.id">
              <img :src="item.url" alt=""/>
              <div class="goods-title">
                {{item.title}}
              </div>
              <div class="goods-price text-red">
                ￥ {{item.min_price}}{{item.max_price=item.min_price?'':' ~ ￥'+item.max_price}}
              </div>
            </router-link>
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script>
import SearchNav from '../common/search-nav'
import 'mescroll.js/mescroll.min.css'
require('../../assets/css/search.css')
export default {
  name: 'search',
  data () {
    return {
      isA: true,
      showList: true,
      mySort: 'asc',
      goodsLists: []
    }
  },
  methods: {
    searchHistory (index) {
      this.historyLists[index].isActive = !this.historyLists[index].isActive
    },
    toggle () {
      this.isA = !this.isA
      this.showList = !this.showList
    },
    submit () {
    },
    sortMethod () {
      if (this.mySort === 'asc') {
        this.mySort = 'desc'
      } else {
        this.mySort = 'asc'
      }
    },
    lisLogFn (data) {
      console.log(data)
      this.goodsLists = data
    }
  },
  mounted () {
    this.lisLogFn()
  },
  components: {
    SearchNav
  }
}
</script>

<style scoped>

</style>
