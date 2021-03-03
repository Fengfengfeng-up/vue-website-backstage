/**
 * 动态引入文件
 * @param {Funtion} context 由require.context模块上下文返回的函数
 * @param {string|Array} ignore 需要过滤的文件
 * @returns {Array}
 */
const importAll = (context, ignore) => {
  const fileMap = {}

  context.keys().map(fileName => {
    // 获取文件的命名
    const name = fileName
      .split('/')
      .pop()
      .replace(/\.\w+$/, '')

    // 获取组件配置
    const fileConfig = context(fileName)

    // 若该文件是通过"export default"导出的，优先使用".default"，否则退回到使用模块的根
    fileMap[name] = fileConfig.default || fileConfig
  })

  if (ignore) {
    // 去除过滤文件
    const ignoreArr = Array.isArray(ignore) ? ignore : [ignore]
    for (const i in ignoreArr) {
      delete fileMap[ignoreArr[i]]
    }
  }

  return fileMap
}

export default importAll
