<template>
  <div id="app" class="mescroll-touch">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (oldVal.name === 'search') {
          localStorage.removeItem('searchId')
        }
        if (localStorage.getItem('loginToken') === null) {
          document.cookie = '_token='
        }
      },
      // 深度观察监听
      deep: true
    }
  }
}

</script>

<style>

#app {
  height: 100%;
  font-family: 'PingFang-SC-Medium', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*padding-bottom: 2.5rem;*/
  box-sizing: border-box;
}
#app > div{
  height: 100%;
  box-sizing: border-box;
  padding-top: 2.2rem;
}
</style>
