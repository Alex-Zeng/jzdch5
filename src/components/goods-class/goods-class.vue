<template>
  <div>
    <headerMessage></headerMessage>
    <div class="goods-class">
      <div class="sub-nav">
        <ul>
          <li v-for="(item, index) in categoryList" :key="index">
            <a href="javascript:;" @click="tabsort(index)" :class="{ active: iscur == index }">{{item.name}}</a>
          </li>
        </ul>
      </div>
      <div class="main-nav">
        <ul>
          <li v-for="(item, index) in categoryListChildren" :key="index">
              <!--<img :src="item.path" alt="" onerror="this.src='./static/images/temp-img.png'">-->
              <h3>{{item.name}}</h3>
            <div v-for="i in item.child" :key="i.id" @click="goSearch(i.id)">
                <img :src="i.path" alt="" onerror="this.src='./static/images/temp-img.png'">
                <h3>{{i.name}}</h3>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <FooterNav></FooterNav>
  </div>
</template>

<script>
import axios from 'axios'
import headerMessage from '../common/header-message'
import FooterNav from '../common/footer-nav'
import '@/assets/css/goods-class.css'
export default {
  name: 'goods-class',
  data () {
    return {
      iscur: 0,
      totalData: [],
      categoryList: [],
      categoryListChildren: []
    }
  },
  methods: {
    getCategoryList () {
      axios.get('api/goods/getCategoryList').then((response) => {
        if (response.data.status === 0) {
          let data = response.data.data
          for (let i = 0; i < data.length; i++) {
            this.categoryList.push({'id': data[i].id, 'name': data[i].name})
          }
          this.totalData = data
          this.categoryListChildren = this.totalData[0].child
        }
      }).catch((response) => {})
    },
    tabsort (index) {
      this.iscur = index
      this.categoryListChildren = this.totalData[index].child
      console.log(this.categoryListChildren)
    },
    initMethods () {
      let id = this.$route.query.id
      let self = this
      setTimeout(function () {
        let navData = self.categoryList
        for (let i = 0; i < navData.length; i++) {
          if (navData[i].id === Number(id)) {
            self.tabsort(i)
          }
        }
      }, 300)
    },
    goSearch (id) {
      sessionStorage.setItem('searchId', id)
      this.$router.push('/search')
    }
  },
  created () {
    window.scrollTo(0, 0)
    this.getCategoryList()
  },
  mounted () {
    this.initMethods()
  },
  components: {
    headerMessage, FooterNav
  }
}
</script>

<style scoped>

</style>
