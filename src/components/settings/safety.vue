<template>
  <div>
    <div class="header-nav">
      <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
      <div>
        安全设置
      </div>
      <div style="padding-right: 2rem">&emsp;</div>
    </div>
    <group>
      <cell is-link :value="phone" link="/safety/phone">
          <span slot="title">
              <i class="icon iconfont icon-bianji"></i>
              <span style="vertical-align:middle;">绑定手机</span>
          </span>
      </cell>
      <cell is-link :value="password">
        <span slot="title">
            <i class="icon iconfont icon-bianji"></i>
            <span style="vertical-align:middle;">登录密码</span>
        </span>
      </cell>
      <cell is-link :value="email" link="/safety/email">
        <span slot="title">
            <i class="icon iconfont icon-bianji"></i>
            <span style="vertical-align:middle;">电子邮箱</span>
        </span>
      </cell>
    </group>
  </div>
</template>

<script>
import {Cell, CellBox, Group, Checklist, XButton} from 'vux'
export default {
  name: 'safety',
  data () {
    return {
      phone: '15010825542',
      password: '',
      email: 'yangxu@jizhongdiancai.com'
    }
  },
  components: {
    Cell,
    CellBox,
    Group,
    Checklist,
    XButton
  }
}
</script>

<style scoped>

</style>
