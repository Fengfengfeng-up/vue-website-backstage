<template>
  <div class="cat-list">
    <f-table ref="table" title="猫猫" max-height="400" :options="options" />
  </div>
</template>

<script>
import FTable from '@/components/FTable'
import { getCatList, createCat, updateCat, deleteCat } from '@/api/cat'
export default {
  components: { FTable },
  data() {
    return {
      options: {
        dialogWidth: '40%',
        btnSize: 'small',
        btnAlign: 'center',
        columnAlign: 'center',
        filter: 'status',
        formProps: {
          labelWidth: '80px'
        },
        filterOptions: [
          { label: '非公开', value: 1 },
          { label: '公开', value: 2 }
        ],
        api: {
          list: getCatList,
          create: createCat,
          update: updateCat,
          delete: deleteCat
        },
        column: [
          {
            prop: 'id',
            label: 'ID'
          },
          {
            prop: 'title',
            label: '标题',
            default: '默认',
            rules: { required: true, message: '请输入猫猫标题' }
          },
          {
            prop: 'summary',
            label: '描述',
            default: '默认',
            inputProps: {
              type: 'textarea'
            },
            rules: {
              required: true,
              validator: (rule, value, callback) => {
                callback()
              }
            }
          },
          {
            prop: 'file',
            label: '资源',
            type: 'file',
            style: {
              component: 'file'
            },
            rules: { required: true, message: '请上传猫猫资源' }
          },
          {
            prop: 'time',
            label: '拍摄时间',
            type: 'date',
            dateProps: {
              format: 'yyyy.MM.dd',
              valueFormat: 'yyyy.MM.dd'
            },
            rules: { required: true, message: '请选择拍摄时间' }
          },
          {
            prop: 'tags',
            label: '标签',
            minWidth: '150',
            formatter: (row, column, cellValue, index) => {
              return cellValue.name
            },
            transform: (form) => {
              return form['tags'].map(item => item.id)
            },
            style: {
              component: 'tag',
              size: 'medium',
              effect: 'plain'
            },
            type: 'cascader',
            cascaderProps: {
              placeholder: '搜索...',
              filterable: true,
              clearable: true,
              props: {
                multiple: true,
                checkStrictly: true, // 取消父子节点关联，可选择任意一级选项
                children: 'childrenTags',
                label: 'name',
                value: 'id',
                emitPath: false // 扁平化
              }
            },
            options: () => this.$store.state.tag.tags,
            rules: { required: true, message: '请选择标签' }
          },
          {
            prop: 'fileType',
            label: '资源类型',
            tableCell: false,
            rules: { required: true },
            formCell: false
          },
          {
            prop: 'likes',
            label: '点赞'
          },
          {
            prop: 'visits',
            label: '阅读'
          },
          {
            prop: 'comments',
            label: '评论',
            formatter: (row, column, cellValue, index) => cellValue.length
          },
          {
            prop: 'createAt',
            label: '创建日期',
            tableCell: false
          },
          {
            prop: 'status',
            label: '是否公开',
            rules: { required: true },
            formCell: false,
            default: 1,
            style: {
              component: 'switch',
              activeValue: 2,
              inactiveValue: 1,
              tipContent: (row, column, cellValue, index) => {
                return cellValue === 1 ? '非公开' : '公开'
              },
              event: (row, column, cellValue, index) => {
                updateCat(row.id, { status: cellValue })
                  .then(() => {
                    this.$refs.table.getResource()
                    this.$notify({
                      type: 'success',
                      title: '成功',
                      message: `已设置为${cellValue === 1 ? '非公开' : '公开'}`
                    })
                  })
                  .catch(err => {
                    console.log(err)
                  })
              }
            }
          }
        ]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.cat-list {
  padding: 30px;;
}
</style>
