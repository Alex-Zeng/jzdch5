<template>
  <div class="upload-item-content">
    <div v-if="!disabled">
      <input :id="'img'+id" style="visibility: hidden;height: 0; width: 1px;" type="file" @change="upload"/>
      <span>{{title}}</span>
      <div class="upload-plus" @click="open" v-show="!value">
        +
      </div>
      <div v-show="value" @click="open">
        <img width="100%" :src="path||defaultPath" alt="" onerror="this.src='./static/images/temp-img.png'">
      </div>
      <XProgress :percent="count" :show-cancel="false" v-show="isProgress"></XProgress>
    </div>
    <div v-else>
      <input :id="'img'+id" style="visibility: hidden;height: 0; width: 1px;" type="file" @change="upload"/>
      <span>{{title}}</span>
      <div class="upload-plus" style="color: #cccccc;" v-show="!value">
        +
      </div>
      <div v-show="value">
        <img width="100%" :src="path||defaultPath" alt="" onerror="this.src='./static/images/temp-img.png'">
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { XProgress } from 'vux'
export default {
  name: 'uploader',
  props: {
    defaultPath: String,
    title: String,
    id: String,
    disabled: Boolean,
    value: String,
    type: String
  },
  components: {
    XProgress
  },
  data () {
    return {
      count: 0,
      isProgress: false,
      path: ''
    }
  },
  updated () {
    if (this.imgurl) {
      this.url = this.imgurl
    }
  },
  methods: {
    open () {
      document.getElementById(`img${this.id}`).click()
    },
    async upload () {
      let totalM = 0
      let fd = new FormData()
      fd.append('type', this.type || 'certification ')
      fd.append('image', document.getElementById(`img${this.id}`).files[0])
      this.isProgress = true
      let config = {
        onUploadProgress: progressEvent => {
          console.log(progressEvent.total)
          totalM = (progressEvent.total / 1024) / 1024
          console.log(totalM)
          let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
          this.count = complete
        }
      }
      if (totalM > 8) {
        this.$vux.toast.show({
          type: 'warn',
          text: '上传文件不能大于8M'
        })
        return false
      } else {
        const { data } = await axios.post('api/image_upload/index', fd, config)
        const {data: { filename }, status, path} = data
        setTimeout(() => {
          this.isProgress = false
        }, 200)
        if (status == 0) {
          this.$emit('input', filename)
          this.$emit('change', filename)
          this.path = path
        }
      }
    }
  }
}
</script>

<style scoped>
  .upload-item-content{
    border: 1px solid #ccc;
    border-radius: 0.2rem;
    height: 100%;
    overflow: hidden;
  }
  .upload-item-content span{
    font-size: 0.7rem;
    line-height: 3;
  }

  .upload-plus{
    font-size: 2.4rem;
  }

</style>
