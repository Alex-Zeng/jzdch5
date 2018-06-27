<template>
   <div>
     <div class="header-nav header-nav-fixed">
       <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
       <div>
         收藏夹
       </div>
       <div style="padding-right: 2rem">&emsp;</div>
     </div>
     <div class="search-lists-header"><span style="color: #222222;">默认</span> <span>价格<i class="icon iconfont icon-jiagepaixu1"></i></span></div>
     <div style="margin-top: 5.5rem;border-top: 0.05rem solid #E0E0E0;">
       <swipeout>
         <swipeout-item transition-mode="follow">
           <div slot="right-menu">
             <swipeout-button @click.native="onButtonClick()" type="warn">删除</swipeout-button>
           </div>
           <div slot="content" class="shop-car-content">
             <div>
               <img src="../../assets/logo.png" alt="">
               <div>
                 <h3><router-link to="/detail/12">454545</router-link></h3>
                 <span class="text-red">￥ 454545</span>
                 <div class="text-muted fr">详情 <i class="icon iconfont icon-youjiantou"></i></div>
               </div>
             </div>
           </div>
         </swipeout-item>
       </swipeout>
     </div>
   </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, Icon, Checklist, CheckIcon } from 'vux'
export default {
  name: 'goods-collect',
  methods: {
    onButtonClick () {
      console.log('删除')
    }
  },
  components: {
    Swipeout, SwipeoutItem, SwipeoutButton, InlineXNumber, Icon, Checklist, CheckIcon
  }
}
</script>

<style scoped>

</style>
