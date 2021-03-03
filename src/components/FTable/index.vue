<template>
  <div class="crud">
    <div class="tool">
      <div class="tool-title">搜索筛选</div>
      <div class="tool-items">
        <f-filter
          v-if="tableProps.filter"
          :options="isFunction(tableProps.filterOptions)"
          :size="tableProps.filterSize || 'medium'"
          :placeholder="tableProps.filterPlaceholder || '分类'"
          @filter="filterResource"
        />
        <f-search
          v-if="tableProps.search !== false"
          :class="{ gutter: tableProps.filter }"
          :size="tableProps.searchSize || 'medium'"
          :placeholder="tableProps.searchPlaceholder"
          @search="searchResource"
        />
        <el-button
          v-if="tableProps.addBtn !== false"
          :class="{
            gutter: tableProps.search !== false || tableProps.search !== false
          }"
          v-bind="addBtnProps"
          @click.stop="addResource"
        >{{ addBtnProps.text }}</el-button>
      </div>
    </div>
    <div class="table-title">{{ title + "列表" }}</div>
    <el-table
      v-loading="listLoading"
      element-loading-text="加载中"
      fit
      highlight-current-row
      :data="tableData || data"
      v-bind="tableProps"
    >
      <template v-for="(c, index) in column">
        <el-table-column
          v-if="c.tableCell !== false"
          :key="c.prop"
          :align="c.align || tableProps.columnAlign || 'center'"
          v-bind="c"
        >
          <template slot-scope="scope">
            <slot
              :name="
                'table' + c.prop.replace(c.prop[0], c.prop[0].toUpperCase())
              "
              :data="{ row: scope.row, column: scope.row[c.prop] }"
            >
              <!-- no style -->
              <template v-if="!c.style">
                {{
                  c.formatter
                    ? c.formatter(scope.row, c, scope.row[c.prop], index)
                    : scope.row[c.prop]
                }}
              </template>

              <!-- file -->
              <f-file
                v-else-if="c.style.component === 'file'"
                :row="scope.row"
                :column="c"
                :index="index"
              />

              <!-- tag -->
              <f-tag
                v-else-if="c.style.component === 'tag'"
                :row="scope.row"
                :column="c"
                :index="index"
              />

              <!-- switch -->
              <el-tooltip
                v-else-if="c.style.component === 'switch'"
                :content="
                  c.style.tipContent(scope.row, c, scope.row[c.prop], index)
                "
                placement="top"
              >
                <el-switch
                  v-model="scope.row[c.prop]"
                  v-bind="c.style"
                  active-color="#13ce66"
                  inactive-color:="#ff4949"
                  @change="
                    c.style.event(scope.row, c, scope.row[c.prop], index)
                  "
                />
              </el-tooltip>
            </slot>
          </template>
        </el-table-column>
      </template>

      <el-table-column
        class="operations"
        label="操作"
        min-width="250"
        :align="tableProps.btnAlign"
        :header-align="tableProps.btnHeaderAlign || 'center'"
      >
        <template slot-scope="scope">
          <el-button
            v-for="item in operations"
            :key="item.text"
            :size="options.btnSize || 'mini'"
            :type="item.type"
            :round="options.btnRound"
            :plain="options.btnPlain"
            @click="item.handler(scope)"
          >{{ item.text }}</el-button>
          <slot name="operation" :scope="scope" />
        </template>
      </el-table-column>
    </el-table>
    <slot name="dialog">
      <el-dialog
        modal
        top="10vh"
        :width="options.dialogWidth || '30%'"
        :title="resourceId ? '编辑' : '新增' + title"
        :visible.sync="formVisible"
      >
        <!-- <f-form ref="form" :model.sync="form" v-bind="formProps" :form-item-list="formItems" /> -->
        <el-form ref="form" :model="form" v-bind="formProps">
          <template v-for="c in formItems">
            <el-form-item
              v-show="isFunction(c.formCell, form) !== false"
              :key="'form-item-' + c.prop"
              :rules="c.rules"
              :label="c.label"
              :prop="c.prop"
              :label-width="c.labelWidth"
              :show-message="c.showMessage"
              :size="c.size"
            >
              <slot
                :name="
                  'form' + c.prop.replace(c.prop[0], c.prop[0].toUpperCase())
                "
                :data="{ form, column: c }"
              >
                <el-input
                  v-if="!c.type || c.type === 'input'"
                  v-model="form[c.prop]"
                  :style="`width: ${c.inputProps && c.inputProps.width}px`"
                  :placeholder="
                    c.inputProps && c.inputProps.placeholder
                      ? c.inputProps.placeholder
                      : `请输入${c.label}`
                  "
                  v-bind="c.inputProps"
                />
                <el-select
                  v-else-if="c.type === 'select'"
                  v-model="form[c.prop]"
                  :placeholder="`请选择${c.label}`"
                  v-bind="c.selectProps"
                >
                  <el-option
                    v-for="item in c.options"
                    :key="item.value"
                    :label="item.label || item[c.selectProps.label]"
                    :value="item.value || item[c.selectProps.value]"
                  />
                </el-select>
                <el-cascader
                  v-else-if="c.type === 'cascader'"
                  v-model="form[c.prop]"
                  :placeholder="`请选择${c.label}`"
                  :options="c.options"
                  v-bind="c.cascaderProps"
                />
                <el-radio-group
                  v-else-if="c.type === 'radio'"
                  v-model="form[c.prop]"
                  :placeholder="`请选择${c.label}`"
                  v-bind="c.radioGroupProps"
                >
                  <el-radio
                    v-for="(item, i) in c.options"
                    :key="item + i"
                    v-bind="c.radioProps"
                    :label="item.value"
                  >{{ item.label }}</el-radio>
                </el-radio-group>
                <f-upload
                  v-else-if="c.type === 'file'"
                  :prop="c.prop"
                  v-bind="c.uploadProps"
                >
                  <slot name="uploadTip" />
                </f-upload>
                <el-date-picker
                  v-else-if="c.type === 'date'"
                  v-model="form[c.prop]"
                  type="date"
                  v-bind="c.dateProps"
                  placeholder="选择日期"
                />
              </slot>
            </el-form-item>
          </template>
        </el-form>
        <slot name="dialogFooter">
          <div slot="footer" class="dialog-footer">
            <el-button
              size="medium"
              type="primary"
              @click="save"
            >保 存</el-button>
          </div>
        </slot>
      </el-dialog>
    </slot>
    <f-pagination
      :total="total"
      :page.sync="listQuery.page"
      :size.sync="listQuery.size"
      @pagination="getResource"
    />
  </div>
</template>

<script>
const context = require.context('./components', false, /.vue$/)
const compos = context.keys().reduce((sum, fileName) => {
  const name = fileName
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')

  sum[name] = context(fileName).default
  return sum
}, {})

export default {
  provide() {
    return {
      crud: this
    }
  },
  components: { ...compos },
  inheritAttrs: false,
  props: {
    title: {
      type: String,
      required: true,
      default: ''
    },
    options: {
      type: Object,
      required: true,
      default: () => {}
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      listQuery: {
        page: 1,
        size: 10
      },
      total: 0,
      listLoading: true,
      tableData: null,
      form: {},
      operations: null,
      formVisible: false,
      resourceId: '',
      formItems: []
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler() {
        this.$emit('change')
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 分解options
      const {
        addBtnType,
        addBtnSize,
        addBtnText,
        btnRound,
        formProps,
        column,
        api,
        ...props
      } = this.options

      this.tableProps = Object.freeze(Object.assign(props, this.$attrs)) // 表格属性
      this.column = Object.freeze(column) // 列属性
      this.api = api // 数据接口

      // 新增按钮属性
      this.addBtnProps = Object.freeze({
        type: addBtnType || 'primary',
        size: addBtnSize || 'medium',
        text: addBtnText || `新增${this.title}`,
        round: btnRound
      })

      // 操作按钮
      const operations = [
        {
          text: this.options.checkBtnText || '查看',
          type: 'info',
          show: this.options.checkBtn !== false,
          handler: this.$attrs['custom-check'] || this.checkResource
        },
        {
          text: this.options.editBtnText || '编辑',
          type: 'primary',
          show: this.options.editBtn !== false,
          handler: this.$attrs['custom-edit'] || this.editResource
        },
        {
          type: 'danger',
          text: this.options.delBtnText || '删除',
          show: this.options.delBtn !== false,
          handler: this.$attrs['custom-del'] || this.deleteResource
        }
      ]

      this.operations = Object.freeze(operations.filter(item => item.show))

      // 获取数据
      this.getResource()

      // 表单属性
      const formPropsSeted = {
        labelWidth: '75px',
        labelPosition: 'left'
        // hideRequiredAsterisk: true,
      }

      this.formProps = Object.freeze(
        Object.assign({}, formPropsSeted, formProps || {})
      )

      // form model
      for (const i in column) {
        if (column[i].rules) {
          this.$set(this.form, [column[i].prop], '')
        }
      }
    },
    addResource() {
      if (this.$attrs['custom-add']) {
        this.$attrs['custom-add']()
        return
      }
      this.resourceId = ''

      const formItems = this.column.filter(item => item.rules)
      for (const i in formItems) {
        this.$set(
          this.form,
          [formItems[i].prop],
          formItems[i].default === undefined
            ? ''
            : this.isFunction(formItems[i].default, this.form)
        )
      }

      this.$nextTick(() => {
        this.$refs.form && this.$refs.form.clearValidate()
      })

      this.formItems = this.isFunction(formItems)
      this.formVisible = true
    },
    editResource({ row, column, $index }) {
      for (const key in this.form) {
        this.$set(this.form, key, row[key])
      }

      this.runTransform('before')

      // this.formItems = this.column.filter(item => item.rules)

      this.formItems = this.isFunction(
        this.column.filter(item => item.rules),
        row,
        column,
        row[column.prop],
        $index
      )

      this.formVisible = true
      this.resourceId = row.id
    },
    checkResource({ row }) {
      // ...
    },
    filterResource(value) {
      this.$set(this.listQuery, this.tableProps.filter, value)
      this.getResource()
    },
    searchResource(value) {
      this.$set(this.listQuery, this.tableProps.search, value)
      this.getResource()
    },
    getResource() {
      this.api
        .list(this.listQuery)
        .then(res => {
          this.tableData = res.data
          this.total = res.total

          this.listLoading = false
        })
        .catch(err => {
          console.log(err)
        })
    },
    deleteResource({ row }) {
      this.$confirm(`此操作将永久删除该${this.title}, 是否继续?`).then(() => {
        this.api
          .delete(row.id)
          .then(() => {
            this.getResource()
            this.$notify({
              type: 'success',
              title: '成功',
              message: '删除成功！'
            })
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    createResource() {
      this.api
        .create(this.form)
        .then(res => {
          if (res) {
            this.getResource()
            this.$notify({
              type: 'success',
              title: '成功',
              message: '新增成功！',
              duration: 3000
            })
          }
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: '失败',
            message: err.message
          })
        })
        .finally(() => {
          this.formVisible = false
        })
    },
    updateResource() {
      this.api
        .update(this.resourceId, this.form)
        .then(res => {
          if (res) {
            this.getResource()
            this.$notify({
              type: 'success',
              title: '成功',
              message: '更新成功！',
              duration: 3000
            })
          }
        })
        .catch(err => {
          this.$notify({
            type: 'error',
            title: '失败',
            message: err.message
          })
        })
        .finally(() => {
          this.formVisible = false
        })
    },
    runTransform(when) {
      const dicts = this.formItems.filter(
        item =>
          item.transform &&
          (when === 'after' ? item.transformAfter : !item.transformAfter)
      )

      if (dicts.length <= 0) return

      for (let i = 0; i < dicts.length; i++) {
        const prop = dicts[i].prop
        if (Object.hasOwnProperty.call(this.form, prop) && this.form[prop]) {
          this.$set(this.form, prop, dicts[i].transform(this.form))
        }
      }
    },
    save() {
      this.runTransform('after')

      this.$refs.form.validate(valid => {
        if (valid) {
          this.resourceId ? this.updateResource() : this.createResource()
        }
      })
    },
    isFunction(data, row, column, cellValue, $index) {
      const params = Array.prototype.slice.call(arguments).slice(1)

      if (typeof data === 'function') {
        return data(...params)
      } else if (typeof data === 'object') {
        const skips = [
          'event',
          'validator',
          'formCell',
          'transform',
          'formatter',
          'tipContent'
        ] // 跳过判断的key

        const specs = ['required', 'placeholder', 'clearable', 'disabled'] // 特殊处理的Key

        if (Array.isArray(data)) {
          // 遍历数组
          return data.map(item => this.isFunction(item, ...params))
        } else {
          // 遍历对象
          const map = Object.assign({}, data)

          for (const key in map) {
            if (skips.includes(key)) continue

            if (specs.includes(key)) {
              map[key] = this.isFunction(map[key], this.form)
              continue
            }

            map[key] = this.isFunction(map[key], ...params)
          }
          return map
        }
      } else {
        return data
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.crud {
  .tool {
    &-title {
      font-weight: bold;
      font-size: 20px;
      color: #010101;
    }
    &-items {
      display: flex;
      align-items: center;
      margin: 20px 0;

      .gutter {
        margin-left: 20px;
      }

      ::v-deep .el-button {
        width: 180px;
        height: 50px;
        letter-spacing: 1px;
        background: #645cff;
        box-shadow: 0px 1px 3px 0px rgba(0, 0, 0, 0.13);
        border-radius: 25px;
      }
    }
  }

  .table-title {
    @extend .tool-title;
    padding-bottom: 20px;
  }

  ::v-deep .el-table {
    .el-button.is-plain {
      background-color: #fff;
      &.el-button--primary {
        &:hover,
        &:focus {
          color: #409eff;
        }
      }
      &.el-button--danger {
        &:hover,
        &:focus {
          color: #f56c6c;
        }
      }
      &.el-button--success {
        &:hover,
        &:focus {
          color: #67c23a;
        }
      }
      &.el-button--warning {
        &:hover,
        &:focus {
          color: #e6a23c;
        }
      }
    }
  }
  ::v-deep .el-dialog {
    max-width: 50%;
    padding: 10px;
    border-radius: 0.625rem;
    .el-dialog__body {
      padding: 20px;
    }

    .el-dialog__footer {
      text-align: center;
      .el-button {
        width: 90%;
        padding: 14px 0;
        font-size: 15px;
        border-radius: 6px;
        line-height: unset;
        background-color: #645cff;
      }
    }

    .el-dialog__title {
      font-size: 20px;
      color: #010101;
      font-weight: bold;
    }

    .el-form {
      padding: 0 20px 0 10px;
      max-height: 50vh;
      overflow: auto;

      .el-form-item__label {
        color: #010101;
      }

      textarea,
      input {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #f7f7f7;
        &::placeholder {
          color: #999;
        }
      }

      .el-input__count .el-input__count-inner,
      .el-textarea .el-input__count {
        background: transparent;
      }
    }
  }
}
</style>
