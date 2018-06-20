<template>
  <div class="upload-item-content">
    <input :id="'img'+id" style="visibility: hidden;height: 0; width: 1px;" type="file" @change="upload"/>
    <span>{{title}}</span>
    <div class="upload-plus" @click="open" v-show="!showImg">
      +
    </div>
    <div v-show="showImg" @click="open">
      <img width="100%" :src="url" alt="">
    </div>
    <XProgress :percent="progress" :show-cancel="false" v-show="isProgress"></XProgress>
  </div>
</template>

<script>
import axios from 'axios'
import { XProgress } from 'vux'
export default {
  name: 'uploader',
  props: {
    successCb: Function,
    prgCb: Function,
    title: String,
    id: String,
    value: String
  },
  components: {
    XProgress
  },
  data () {
    return {
      progress: 0,
      isProgress: false,
      showImg: false,
      url: ''
    }
  },
  methods: {
    open () {
      document.getElementById(`img${this.id}`).click()
    },
    async upload () {
      let fd = new FormData()
      fd.append('type', 'certification')
      fd.append('image', document.getElementById(`img${this.id}`).files[0])
      this.isProgress = true
      let config = {
        onUploadProgress: progressEvent => {
          let complete = (progressEvent.loaded / progressEvent.total * 100 | 0)
          this.progress = complete
        }
      }
      const { data } = await axios.post('api/image_upload/index', fd, config)
      const {data: { filename }, status} = data
      setTimeout(() => {
        this.isProgress = false
      }, 200)
      if (status === 0) {
        this.$emit('uploaded', filename)
        this.showImg = true
        this.url = filename
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
