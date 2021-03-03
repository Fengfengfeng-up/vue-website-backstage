<template>
  <div style="width: auto; height: 100px">
    <el-image
      v-if="/[jpg | png | peng]$/i.test(row[column.prop])"
      :src="row[column.prop]"
      style="width: auto; height: 100%"
      fit="contain"
      :preview-src-list="[row[column.prop]]"
    >
      <div slot="error">
        <i class="el-icon-picture-outline" />
      </div></el-image>
    <video v-else-if="/\.mp4$/i.test(row[column.prop])" autoplay style="width: 100%; height: 100%;" :src="row[column.prop]" />
    <audio v-else :src="row[column.prop]" />
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: () => []
    },
    column: {
      type: Object,
      default: () => []
    },
    index: {
      type: Number,
      default: 0
    }
  }
}
</script>
<style lang="scss" scoped></style>
