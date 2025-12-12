<template>
  <div class="home">
    <h2>主应用首页</h2>
    <p>这是一个基于 Vue 3 的 qiankun 主应用</p>
    <p>点击导航栏的子应用可以加载子应用</p>
  </div>
  <img src="https://picsum.photos/800/400" alt="测试图片" />
  <button>点击测试 INP</button>
  <input type="text" placeholder="输入测试 INP" />
</template>
<script>
// window.addEventListener('error', args => {
//   console.log('error event:', args);
//   return true
// }, true) // 捕获阶段处理错误

// window.addEventListener('unhandledrejection', e => {
//   throw e.reason
// })

// const asyncFunc = () => new Promise(resolve => {
//   error // 未定义变量，模拟错误
// })
// setTimeout(async() => {
//   await asyncFunc()
// })

// // fixme 不生效？
// window.addEventListener('pageShow', (event) => {
//   console.log('from home');
//   requestAnimationFrame(() => {
//     console.log('test===========：', performance.now() - event.timeStamp);
//   })
// }, true)
</script>
<style scoped>
.home {
  text-align: center;
  margin-top: 2rem;
}
</style>
