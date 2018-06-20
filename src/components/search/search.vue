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
      sort: null,
      historyLists: [
        {'val': '冰箱', 'id': '1', 'isActive': false},
        {'val': '空调', 'id': '2', 'isActive': false},
        {'val': '洗衣机', 'id': '3', 'isActive': false},
        {'val': '热水器', 'id': '4', 'isActive': false},
        {'val': '消毒柜', 'id': '5', 'isActive': false},
        {'val': '美的洗衣机', 'id': '6', 'isActive': false},
        {'val': '美的冰箱', 'id': '7', 'isActive': false}
      ],
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
      if (this.sort === 'asc') {
        this.sort = 'desc'
      } else {
        this.sort = 'asc'
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
