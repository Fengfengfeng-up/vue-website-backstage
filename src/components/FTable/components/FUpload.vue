<template>
  <el-upload
    ref="upload"
    drag
    :before-upload="beforeUpload"
    :limit="1"
    action=""
    :on-success="handleSuccess"
    :on-preview="handlePreview"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :before-remove="beforeRemove"
    :file-list="fileList"
    :http-request="httpRequest"
    v-bind="$attrs"
  >
    <template v-if="!crud.form[prop]">
      <i class="el-icon-upload" />
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </template>
    <f-file v-else :row="crud.form" :column="{ prop }" />
    <template slot="tip">
      <slot />
    </template>
  </el-upload>
</template>

<script>
import FFile from './FFile'
import uploadToQiniu from '@/utils/qiniu'
// import { upload } from '@/api/upload'
export default {
  inject: ['crud'],
  components: { FFile },
  props: {
    prop: {
      type: String,
      default: ''
    }
  },
  computed: {
    fileList() {
      const value = this.crud.form[this.prop]
      return value
        ? [
          {
            name: value.slice(value.lastIndexOf('/') + 1),
            url: value
          }
        ]
        : []
    }
  },
  methods: {
    httpRequest({ file }) {
      uploadToQiniu(file, res => {
        this.$set(this.crud.form, this.prop, res.url)
        this.$message.success('上传成功！')
      })
    },
    beforeUpload({ type, size }) {
      if (type.indexOf('image') > -1 && size / 1024 / 1024 > 2) {
        this.$message.warning('图片大小已超过最大限度2M.')
        return false
      } else {
        if (Object.prototype.hasOwnProperty.call(this.crud.form, 'fileType')) {
          this.$set(this.crud.form, 'fileType', type)
        }
      }
    },
    handleSuccess(file) {
      this.$set(this.crud.form, this.prop, file.url)
    },
    handleRemove(file, fileList) {
      if (Object.prototype.hasOwnProperty.call(this.crud.form, 'fileType')) {
        this.$set(this.crud.form, 'fileType', '')
      }
      this.$set(this.crud.form, this.prop, '')
    },
    handlePreview(file) {
      console.log(file)
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `当前限制选择 3 个文件，本次选择了 ${
          files.length
        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      )
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  }
}
</script>

<style></style>
