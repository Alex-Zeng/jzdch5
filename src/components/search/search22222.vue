<template>
  <div>
    <SearchNav  @isLogFn = "lisLogFn"></SearchNav>

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
  created () {
    window.scrollTo(0, 0)
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
