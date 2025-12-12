<template>
   <div class="main-app">
    <!-- 主应用导航栏：切换主应用页面/激活子应用 -->
    <nav class="main-nav">
      <router-link to="/">主应用首页</router-link>
      <router-link to="/vue-app">Vue 子应用</router-link> <!-- 激活 Vue 子应用 -->
      <router-link to="/react-app">React 子应用</router-link> <!-- 激活 React 子应用 -->
    </nav>

    <!-- 主应用自身路由视图 -->
    <div class="main-content">
      <router-view />
      <h1>{{ $translate('greeting.hello') }}</h1>
    </div>

    <!-- 子应用挂载容器：qiankun 会将子应用渲染到这里 -->
    <div id="micro-app-container" class="micro-container"></div>
  </div>
</template>

<style lang="less" scoped>
.main-app {
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}
.main-nav {
  margin-bottom: 20px;
  a {
    margin-right: 20px;
    text-decoration: none;
    color: #2c3e50;
    font-weight: 500;
    &.router-link-active {
      color: #42b983; // Vue Router 激活态颜色
    }
  }
}
.main-content {
  margin-bottom: 20px;
  padding: 20px;
  border: 1px solid #eee;
}
.micro-container {
  padding: 20px;
  border: 1px solid #eee;
}
</style>
