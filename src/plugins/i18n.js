export default {
  install: (app, options) => {
    // 注册一个全局可用的$translate()方法
    app.config.globalProperties.$translate = (key) => {
      // 获取options对象的深层属性
      // 使用key作为索引
      return key.split('.').reduce((o, i) => {
        return o ? o[i] : undefined
      }, options)
    }
  }
}