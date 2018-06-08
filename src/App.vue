<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>

#app {
  height: 100%;
  font-family: 'PingFang-SC-Medium', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  padding-bottom: 2.5rem;
  box-sizing: border-box;
}
#app > div{
  height: 100%;
}
</style>
