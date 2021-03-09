<template>
  <div class="search" :class="size">
    <el-input
      v-model="searchValue"
      :placeholder="placeholder"
      @input="search"
    />
    <div class="search-icon">
      <i class="el-icon-search" />
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    size: {
      type: String,
      default: 'small'
    },
    placeholder: {
      type: String,
      default: '搜索...'
    }
  },
  data() {
    return {
      searchValue: ''
    }
  },
  methods: {
    search(value) {
      if (this.timer) clearTimeout(this.timer)

      this.timer = setTimeout(() => {
        this.$emit('search', value)
      }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
$medium: 50px;
$small: 40px;
$mini: 35px;

.search {
  position: relative;
  ::v-deep .el-input__inner {
    box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.13);
  }

  &.medium {
    ::v-deep .el-input__inner {
      width: $medium * 4.5;
      height: $medium;
      line-height: $medium;
      border-radius: $medium / 2;
      padding: 0 $medium / 2.5;
    }

    .search-icon {
      width: $medium;
      font-size: 25px;
    }
  }
  &.small {
    ::v-deep .el-input__inner {
      width: $small * 4.5;
      height: $small;
      line-height: $small;
      border-radius: $small / 2;
      padding: 0 $small / 2.5;
    }
    .search-icon {
      width: $small;
      font-size: 23px;
    }
  }
  &.mini {
    ::v-deep .el-input__inner {
      width: $mini * 4.5;
      height: $mini;
      line-height: $mini;
      border-radius: $mini / 2;
      padding: 0 $mini / 2.5;
    }
    .search-icon {
      width: $mini;
      font-size: 20px;
    }
  }

  ::v-deep input::-webkit-input-placeholder {
    color: #999;
  }

  .search-icon {
    height: 100%;
    border-radius: 50%;
    background-color: #e99210;
    // background-color: #304156bb;
    color: #fff;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    right: -1px;
    cursor: pointer;
  }
}
</style>
