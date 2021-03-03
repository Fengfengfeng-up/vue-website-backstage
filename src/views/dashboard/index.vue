<template>
  <div class="dashboard-container">
    <image-layout :img-height="300" :list="resouceList" />
  </div>
</template>

<script>
import ImageLayout from './components/ImageLayout'
import { getCatList } from '@/api/cat'
export default {
  name: 'Dashboard',
  components: { ImageLayout },
  data() {
    return {
      resouceList: []
    }
  },
  created() {
    this.getResource()
  },
  methods: {
    getResource() {
      getCatList()
        .then((res) => {
          this.resouceList = res.data
            .slice(0, 20)
            .filter((item) => /[jpg | png | jpeg]/i.test(item.file))
            .map((item) => ({ url: item.file }))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
}
</style>
