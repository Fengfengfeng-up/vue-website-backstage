<template>
  <div class="md-editor">
    <mavon-editor
      ref="md"
      :value="value"
      style="height: 100%"
      v-bind="props"
      v-on="$listeners"
      @imgAdd="ImgAdd"
      @imgDel="ImgDel"
    />
  </div>
</template>
<script>
import { mavonEditor } from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import toolbars from './toolbars'
// import { upload } from '@/api/upload'
import uploadToQiniu from '@/utils/qiniu'
export default {
  components: {
    mavonEditor
  },
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      props: {
        toolbars, // 工具栏配置项
        toolbarsBackground: '#eee', // 工具栏背景颜色
        previewBackground: '#fbfbfb', // 预览框背景颜色
        // subfield: true, // true： 双栏(编辑预览同屏)， false： 单栏(编辑预览分屏)
        placeholder: 'Never give up！'
      }
    }
  },
  methods: {
    // 上传图片接口pos 表示第几个图片
    async ImgAdd(pos, file) {
      // var formdata = new FormData()
      // formdata.append('file', file)

      uploadToQiniu(file, (res) => {
        this.$refs.md.$img2Url(pos, res.url)
      })
      // upload(formdata)
      //   .then(res => {
      //     this.$refs.md.$img2Url(pos, res.url) // 调用$img2Url方法即可替换地址
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    ImgDel() {
      console.log('ImgDel') // 删除相应的图片
    }
  }
}
</script>
<style>
.md-editor {
  margin: 30px auto 0;
  width: 90%;
  height: 600px;
}
</style>
