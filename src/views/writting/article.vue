<template>
  <div class="article-container">
    <tinymce
      v-model="article.content"
      :height="450"
      :width="1200"
      @save="dialogVisible = true"
    />
    <tag
      :status.sync="article.status"
      :tags.sync="article.tagIds"
      :dialog-visible.sync="dialogVisible"
      @save="save"
    />
  </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
import Tag from './components/Tag'
import { getArticle, createArticle, updateArticle } from '@/api/article'
export default {
  components: { Tinymce, Tag },
  data() {
    return {
      article: {
        title: '',
        content: '',
        tagIds: [],
        status: 0
      },
      dialogVisible: false
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  watch: {
    id: {
      immediate: true,
      handler(id) {
        if (id) {
          this.getArticle(id)
        }
      }
    },
    'article.content'(val) {
      const start = val.indexOf('>')
      const end = val.indexOf('<', start)
      const title = val.slice(start + 1, end)
      this.article.title = title
    }
  },
  methods: {
    save() {
      if (this.id) {
        updateArticle(this.id, this.article)
          .then(res => {
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        createArticle(this.article)
          .then(res => {
            this.$notify({
              type: 'success',
              title: '成功',
              message: '保存成功！'
            })
            console.log(res)
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getArticle(id) {
      getArticle(id)
        .then(res => {
          const { content, tags, status } = res
          this.article.content = content
          this.article.status = status
          this.article.tagIds = tags ? tags.map(item => item.id) : []
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.article-container {
  margin-top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
