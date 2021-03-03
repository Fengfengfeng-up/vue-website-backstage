<template>
  <div class="blog-container">
    <mavon-editor
      ref="md"
      :value="blog.content"
      @change="handleChange"
      @save="dialogVisible = true"
    />
    <tag
      :status.sync="blog.status"
      :tags.sync="blog.tagIds"
      :dialog-visible.sync="dialogVisible"
      @save="save"
    />
  </div>
</template>

<script>
import MavonEditor from '@/components/MavonEditor'
import Tag from './components/Tag'
import { getBlog, createBlog, updateBlog } from '@/api/blog'

const marked = require('marked')
marked.setOptions({
  renderer: new marked.Renderer(),
  pedantic: false,
  gfm: true,
  breaks: false,
  sanitize: false,
  smartLists: true,
  smartypants: false,
  xhtml: false
})
export default {
  components: { MavonEditor, Tag },
  data() {
    return {
      blog: {
        title: '',
        content: '',
        html: '',
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
          this.getBlog(id)
        }
      }
    }
  },
  methods: {
    save() {
      this.blog.html = marked(this.blog.content)
      if (!this.id) {
        // 创建博客
        createBlog(this.blog)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '博客创建成功！',
              type: 'success'
            })

            this.blog.content = ''
            this.$router.push('/blog/index')
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        // 修改博客
        updateBlog(this.id, this.blog)
          .then(() => {
            this.$notify({
              title: '成功',
              message: '博客修改成功！',
              type: 'success'
            })

            this.blog.content = ''
            this.$router.push('/blog/index')
          })
          .catch(err => {
            console.log(err)
          })
      }
    },
    getBlog(id) {
      // 根据id获取对应博客
      getBlog(id)
        .then(res => {
          const { content, tags, status } = res
          this.blog.content = content
          this.blog.status = status
          this.blog.tagIds = tags ? tags.map(item => item.id) : []
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleChange(md, html) {
      this.blog.content = md
      this.blog.html = html
      this.blog.words = this.getWordsCount(html)
      this.$nextTick(() => {
        const md = this.$refs.md
        if (md) {
          this.blog.title = md.$el.querySelector('h1').innerText
        }
      })
    },
    getWordsCount(html) {
      if (!html) {
        return 0
      }
      const text = html.replace(/(<[^>]+>|<[^>]>|<\/[^>]>)/g, '')
      const words = text.match(/\w+/g)
      const chinese = text.match(/\p{Unified_Ideograph}/gu)
      return (words ? words.length : 0) + (chinese ? chinese.length : 0)
    }
  }
}
</script>
<style lang="scss" scoped></style>
