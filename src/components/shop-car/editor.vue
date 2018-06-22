<template>
    <div class="editor-container">
      <div class="header-nav">
        <i class="icon iconfont icon-back" style="padding-right: 1rem;" onclick="history.go(-1)"></i>
        <div>
          物料编辑
        </div>
        <div style="padding-right: 2rem">&emsp;</div>
      </div>
      <div class="indent-content" style="margin-top: 0.5rem;">
        <img src="" alt="图片">
        <div class="indent-info">
          <h3>{{editor.title}}</h3>
          <div class="text-muted">产品规格描述</div>
          <div class="text-muted">物料编号&emsp;9820123452</div>
          <div class="text-muted">物料规格&emsp;ZYEN-986522243 右后护角</div>
          <div class="text-muted">数量&emsp;20台&emsp;&emsp;&emsp;&emsp;单价&emsp;<span class="text-red">{{editor.price}}</span></div>
        </div>
      </div>
      <ul class="editor">
        <li>
          <label for="">物料编号&nbsp;</label>
          <input name="" type="text" placeholder="点击设置物料编号，最多30个字">
        </li>
        <li>
          <label for="">规格要求&nbsp;</label>
          <input name="" type="text" placeholder="点击设置规格要求，最多40个字">
        </li>
        <li style="padding: 0 1rem;">
          <button type="submit" class="btn btn-primary">下一步</button>
        </li>
      </ul>
    </div>
</template>
<script>
export default {
  name: 'editor',
  created () {
  }
}
</script>
<style scoped>

</style>
