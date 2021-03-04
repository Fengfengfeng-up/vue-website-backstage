<template>
  <div class="blog-list">
    <f-table
      ref="table"
      title="博客"
      max-height="400"
      :options="options"
      :custom-edit="editBlog"
      :custom-check="checkBlog"
      :custom-add="createBlog"
    >
      <template #operation="{scope}">
        <el-button
          size="small"
          plain
          type="warning"
          @click="updateBlog(scope.row)"
        >{{ releaseBtn(scope.row.status) }}</el-button>
      </template>
    </f-table>
  </div>
</template>

<script>
import FTable from '@/components/FTable'
import { getBlogList, updateBlog, deleteBlog } from '@/api/blog'
import { getTagList } from '@/api/tag'
export default {
  components: { FTable },
  data() {
    return {
      options: {
        search: 'search',
        btnSize: 'small',
        filter: 'status',
        filterOptions: () => {
          return [
            {
              label: '草稿',
              value: 0
            },
            {
              label: '已完成',
              value: 1
            },
            {
              label: '已发布',
              value: 2
            }
          ]
        },
        api: {
          list: getBlogList,
          delete: deleteBlog
        },
        column: [
          {
            prop: 'id',
            label: 'ID'
          },
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'intro',
            label: '简介'
          },
          {
            prop: 'tags',
            label: '标签',
            formatter: (row, column, cellValue, index) => {
              return cellValue.name
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
                value: 'id'
              }
            },
            options: () => this.tags,
            rules: { required: true, message: '请选择标签' }
          },
          // {
          //   prop: 'likes',
          //   label: '点赞'
          // },
          // {
          //   prop: 'visits',
          //   label: '阅读'
          // },
          {
            prop: 'comments',
            label: '评论',
            formatter: (row, column, cellValue, index) => {
              return cellValue.length
            }
          },
          {
            prop: 'author',
            label: '作者',
            formatter: (row, column, cellValue, index) => {
              return cellValue.name
            }
          },
          {
            prop: 'createAt',
            label: '写作日期',
            formatter: (row, column, cellValue, index) => {
              return this.$parseTime(cellValue)
            }
          },
          {
            prop: 'status',
            label: '状态',
            formatter: (row, column, cellValue, index) => {
              const statusArr = ['草稿', '已完成', '已发布']
              return statusArr[cellValue]
            },
            style: {
              component: 'tag',
              size: 'medium',
              effect: 'plain',
              type: (row, column, cellValue, index) => {
                const arr = ['info', 'warning', 'danger']
                return arr[cellValue]
              }
            },
            type: 'radio',
            options: [
              {
                label: '草稿',
                value: 0
              },
              {
                label: '已完成',
                value: 1
              },
              {
                label: '已发布',
                value: 2
              }
            ],
            rules: { required: true, message: '请选择状态' }
          }
        ]
      }
    }
  },
  created() {
    this.getTagList()
  },
  methods: {
    releaseBtn(status) {
      const map = ['已完成', '发布', '取消发布']
      return map[status]
    },
    createBlog() {
      this.$router.push('/writting/blog')
    },
    checkBlog() {},
    editBlog({ row }) {
      this.$router.push({ path: '/writting/blog', query: { id: row.id }})
    },
    updateBlog(row) {
      const status = row.status === 0 ? 1 : row.status === 1 ? 2 : 1
      updateBlog(row.id, { status })
        .then(res => {
          this.$notify({
            type: 'success',
            title: '成功',
            message: '更新成功！'
          })
          this.$refs.table.getResource()
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTagList() {
      getTagList()
        .then(res => {
          this.tags = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.blog-list {
  padding: 30px;
}
</style>
