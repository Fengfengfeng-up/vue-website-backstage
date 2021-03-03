<template>
  <div class="tag-list">
    <f-table
      title="标签"
      max-height="400"
      :options="options"
      @change="$store.dispatch('tag/getTags')"
    />
  </div>
</template>

<script>
import FTable from '@/components/FTable'
import { createTag, updateTag, deleteTag, getTagList } from '@/api/tag'
export default {
  components: { FTable },
  data() {
    return {
      options: {
        btnSize: 'small',
        btnWidth: '300',
        btnAlign: 'center',
        columnAlign: 'center',
        checkBtn: false,
        formProps: {
          labelWidth: '80px'
        },
        api: {
          list: getTagList,
          create: createTag,
          update: updateTag,
          delete: deleteTag
        },
        column: [
          {
            prop: 'id',
            label: 'ID'
          },
          {
            prop: 'name',
            label: '名称',
            rules: { required: true, message: '请输入标签名称' }
          },
          {
            prop: 'parentTag',
            label: '父级标签',
            formatter: (row, column, cellValue, index) => {
              // 表格里的数据转换
              return row.parentTag ? row.parentTag.name : '无'
            },
            transform: form => {
              // 表单里的数据转换
              return form.parentTag.id
            },
            type: 'select',
            options: () => this.$store.state.tag.tags,
            selectProps: {
              label: 'name',
              value: 'id',
              placeholder: '请选择父级标签',
              disabled: form => {
                console.log(!!form.name)
                return !!form.name
              }
            },
            rules: { required: false }
          },
          {
            prop: 'createAt',
            label: '创建日期',
            formatter: (row, column, cellValue, index) => {
              return this.$parseTime(cellValue)
            }
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.tag-list {
  padding: 30px;
}
</style>
