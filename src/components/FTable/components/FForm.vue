<template>
  <el-form ref="form" :model="form" v-bind="$attrs">
    <template v-for="item in formItems">
      <el-form-item
        v-show="checkIsFunction(item.formCell, form) !== false"
        :key="'form-item-' + item.prop"
        :rules="item.rules"
        :prop="item.prop"
        :label="checkIsFunction(item.label, form)"
        :required="checkIsFunction(item.rules.required, form)"
        :label-width="checkIsFunction(item.labelWidth)"
        :show-message="item.showMessage"
        :size="item.size"
      >
        <slot
          :name="
            'form' + item.prop.replace(item.prop[0], item.prop[0].toUpperCase())
          "
          :data="{ form: form, column: item }"
        >
          <el-input
            v-if="!item.type || item.type === 'input'"
            v-model="form[item.prop]"
            :style="`width: ${item.props && item.props.width}px`"
            :placeholder="item.placeholder || `请输入${item.label}`"
            v-bind="item.props"
          />
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form[item.prop]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            v-bind="item.props"
          >
            <el-option
              v-for="option in checkIsFunction(item.options)"
              :key="option.value"
              :label="option.label || option[item.props.label]"
              :value="option.value || option[item.props.value]"
            />
          </el-select>
          <el-cascader
            v-else-if="item.type === 'cascader'"
            v-model="form[item.prop]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            :options="checkIsFunction(item.options)"
            v-bind="item.props"
          />
          <el-radio-group
            v-else-if="item.type === 'radio'"
            v-model="form[item.prop]"
            :placeholder="item.placeholder || `请选择${item.label}`"
            v-bind="item.props"
          >
            <el-radio
              v-for="(option, i) in checkIsFunction(item.options)"
              :key="option + i"
              v-bind="item.props"
              :label="option.value"
            >{{ item.label }}</el-radio>
          </el-radio-group>
          <f-upload
            v-else-if="item.type === 'upload'"
            v-model="form[item.prop]"
            v-bind="item.props"
          />
          <el-date-picker
            v-else-if="item.type === 'date'"
            v-model="form[item.prop]"
            type="date"
            v-bind="item.props"
            :placeholder="item.placeholder || `请选择${item.label}`"
          />
        </slot>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
import FUpload from './FUpload'
import mixin from './../mixin'
export default {
  components: { FUpload },
  mixins: [mixin],
  props: {
    model: {
      type: Object,
      default: () => {},
      required: true
    },
    formItemList: {
      type: Array,
      default: () => [],
      required: true
    }
  },
  data() {
    return {
      form: {},
      formItems: []
    }
  },
  watch: {
    model: {
      deep: true,
      immediate: true,
      handler(model) {
        this.form = model
        const isEdit = Object.keys(model).every(key => this.form[key] !== '')
        if (isEdit) {
          if (this.timer) clearTimeout(this.timer)
          this.timer = setTimeout(() => {
            this.runTransform()
          }, 500)
          // this.$nextTick(() => {
          //   this.runTransform()
          // })
        }
      }
    },
    form: {
      deep: true,
      handler(form) {
        this.$nextTick(() => {
          // this.$refs.form && this.$refs.form.clearValidate()
        })
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.formItems = this.checkIsFunction(
        this.formItemList.filter(item => item.rules),
        this.form
      )
    },
    validate(callback) {
      this.$emit('update:model', this.form)
      this.runTransform(true)

      this.$refs.form.validate(valid => {
        callback(valid)
      })
    },
    runTransform(after) {
      console.log(this.formItemList)
      const dicts = this.formItemList.filter(item => item.transform)

      console.log(dicts)

      if (dicts.length <= 0) return

      for (let i = 0; i < dicts.length; i++) {
        const prop = dicts[i].prop
        if (Object.hasOwnProperty.call(this.form, prop) && this.form[prop]) {
          console.log('setProp', dicts[i].transform(this.form))
          this.$set(this.form, prop, dicts[i].transform(this.form))
        }
      }

      this.isEdit = true
    }
  }
}
</script>
