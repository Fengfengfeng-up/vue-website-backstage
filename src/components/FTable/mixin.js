const skips = ['event', 'validator', 'formCell', 'transform', 'formatter'] // 跳过判断的key
// const specs = ['required', 'placeholder', 'clearable', 'disabled'] // 特殊处理的Key

export default {
  methods: {
    checkIsFunction(data, ...params) {
      if (typeof data === 'function') {
        return data(...params)
      } else if (typeof data === 'object') {
        if (Array.isArray(data)) {
          // 数组
          return data.map((item) => this.checkIsFunction(item, ...params))
        } else {
          // 对象
          const cloneDate = Object.assign({}, data)

          for (const key in cloneDate) {
            if (!skips.includes(key)) {
              cloneDate[key] = this.checkIsFunction(cloneDate[key], ...params)
            }
          }

          return cloneDate
        }
      } else {
        return data
      }
    }
  }
}
