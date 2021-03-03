<template>
  <div class="article-list">
    <f-table
      ref="table"
      title="文章"
      max-height="400"
      :options="options"
      :custom-edit="editArticle"
      :custom-check="checkArticle"
      :custom-add="createArticle"
    >

      <template #operation="{scope}">
        <el-button
          size="small"
          plain
          type="warning"
          @click="updateArticle(scope.row)"
        >{{ releaseBtn(scope.row.status) }}</el-button>
      </template>
    </f-table>
  </div>
</template>

<script>
import FTable from '@/components/FTable'
import { getArticleList, updateArticle, deleteArticle } from '@/api/article'

export default {
  components: { FTable },
  data() {
    return {
      options: {
        search: 'search',
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
        btnSize: 'small',
        api: {
          list: getArticleList,
          delete: deleteArticle
        },
        column: [
          {
            prop: 'id',
            label: 'ID',
            canEdit: false
          },
          {
            prop: 'title',
            label: '标题'
          },
          {
            prop: 'tags',
            label: '标签',
            formatter: (row, column, cellValue, index) => {
              return cellValue.name
            },
            type: 'array',
            style: {
              component: 'tag',
              size: 'medium',
              effect: 'plain'
            }
          },
          {
            prop: 'likes',
            label: '点赞',
            canEdit: false
          },
          {
            prop: 'visits',
            label: '阅读',
            canEdit: false
          },
          {
            prop: 'comments',
            label: '评论',
            canEdit: false,
            formatter: (row, column, cellValue, index) => {
              return cellValue.length
            }
          },
          {
            prop: 'author',
            label: '作者',
            canEdit: false,
            formatter: (row, column, cellValue, index) => {
              return cellValue.name
            }
          },
          {
            prop: 'createAt',
            label: '写作日期',
            canEdit: false,
            formatter: (row, column, cellValue, index) => {
              return this.$parseTime(cellValue)
            }
          },
          {
            prop: 'status',
            label: '状态',
            canEdit: false,
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
            }
          }
        ]
      }
    }
  },
  methods: {
    releaseBtn(status) {
      const map = ['已完成', '发布', '取消发布']
      return map[status]
    },
    createArticle() {
      this.$router.push('/writting/article')
    },
    checkArticle() {},
    editArticle({ row }) {
      this.$router.push({ path: '/writting/article', query: { id: row.id }})
    },
    updateArticle(row) {
      const status = row.status === 0 ? 1 : row.status === 1 ? 2 : 1
      updateArticle(row.id, { status })
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
    }
  }
}
</script>
<style lang="scss" scoped>
.article-list {
  padding: 30px;
}
</style>
