<template>
  <el-dialog
    :title="title"
    :show-close="false"
    :visible="dialogVisible"
    width="35%"
  >
    <el-input
      :value="intro"
      style="margin-bottom: 1.5rem"
      placeholder="简介..."
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 3 }"
      show-word-limit
      maxlength="45"
      @input="(v) => $emit('update:intro', v)"
    />

    <el-cascader
      :value="tags"
      :options="tagOptions"
      placeholder="选择标签..."
      :props="cascaderProps"
      filterable
      clearable
      @change="chooseTags"
    />
    <div class="status" style="margin-top: 20px">
      <el-radio
        v-for="item in radios"
        :key="item.lable"
        v-model="status2"
        size="medium"
        :label="item.label"
        border
      >{{ item.text }}</el-radio>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="medium" @click="close">取 消</el-button>
      <el-button size="medium" type="primary" @click="save">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getTagList } from '@/api/tag'

export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: '文章'
    },
    tags: {
      type: Array,
      default: () => [],
      required: true
    },
    status: {
      type: Number,
      default: 0
    },
    intro: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      status2: 0,
      tagOptions: [],
      cascaderProps: {
        emitPath: false,
        multiple: true,
        checkStrictly: true, // 取消父子节点关联，可选择任意一级选项
        children: 'childrenTags',
        label: 'name',
        value: 'id'
      },
      radios: [
        {
          label: 0,
          text: '草稿'
        },
        {
          label: 1,
          text: '已完成'
        },
        {
          label: 2,
          text: '发布'
        }
      ]
    }
  },
  watch: {
    status2(val) {
      this.$emit('update:status', val)
    },
    status(val) {
      this.status2 = val
    }
  },
  created() {
    this.getTagList()
  },
  methods: {
    chooseTags(value) {
      this.$emit('update:tags', value)
    },
    save() {
      if (this.tags.length === 0) {
        this.$message.warning('请先选择标签！')
        return
      }
      this.close()
      this.$emit('save')
    },
    close() {
      this.$emit('update:dialog-visible', false)
    },
    getTagList() {
      getTagList()
        .then((res) => {
          this.tagOptions = res.data
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.status {
  /deep/ .el-radio.el-radio--medium {
    margin-right: 10px;
  }
}
</style>
