<template>
  <div class="tags">
    <el-tag
      v-for="(cellValue, i) in data"
      :key="'' + row.id + column.prop + index + i"
      :type="isFunction(column.style.type, row, column, cellValue, index)"
      :size="isFunction(column.style.size, row, column, cellValue, index)"
      :effect="isFunction(column.style.effect, row, column, cellValue, index)"
    >{{
      column.formatter
        ? column.formatter(row, column, cellValue, index)
        : cellValue
    }}</el-tag>
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
  },
  computed: {
    data() {
      const data = this.row[this.column.prop]
      return Array.isArray(data) ? data : [data]
    }
  },
  methods: {
    isFunction(style, row, column, cellValue, index) {
      return typeof style === 'function'
        ? style(row, column, cellValue, index)
        : style
    }
  }
}
</script>

<style lang="scss" scoped>
.tags {
  ::v-deep .el-tag {
    margin-left: 5px;
    &:nth-child(1) {
      margin-left: 0;
    }
  }
}
</style>
