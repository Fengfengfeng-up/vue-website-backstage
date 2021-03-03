<template>
  <div class="filter" :class="size">
    <el-select
      :value="value"
      v-bind="$attrs"
      clearable
      @change="filter"
    >
      <el-option
        v-for="item in $attrs.options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    size: {
      type: String,
      default: 'small'
    }
  },
  data() {
    return {
      value: ''
    }
  },
  methods: {
    filter(value) {
      this.value = value
      if (this.timer) clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.$emit('filter', value)
      }, 300)
    }
  }
}
</script>

<style lang="scss" scoped>
$medium: 50px;
$small: 40px;
$mini: 35px;

.filter {
  ::v-deep .el-input__inner {
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.13);
  }
  &.medium ::v-deep .el-input__inner {
    width: $medium * 3.2;
    height: $medium;
    line-height: $medium;
    border-radius: $medium / 2;
  }
  &.small ::v-deep .el-input__inner {
    width: $small * 3.2;
    height: $small;
    line-height: $small;
    border-radius: $small / 2;
  }
  &.mini ::v-deep .el-input__inner {
    width: $mini * 3.2;
    height: $mini;
    line-height: $mini;
    border-radius: $mini / 2;
  }

  ::v-deep input::-webkit-input-placeholder {
    color: #999;
  }
}
</style>
