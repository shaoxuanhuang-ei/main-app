<template>
  <div id="app">
   <nav class="navbar">
      <h1>主应用(Vue 3)</h1>
      <ul>
        <li><router-link to="/">首页</router-link></li>
        <li><router-link to="/react-app">React子应用</router-link></li>
      </ul>
   </nav>
   <main>
    <!-- 主应用自身的路由视图（如首页内容） -->
    <router-view />
    
    <!-- 子应用挂载容器：qiankun 会将子应用渲染到这里 -->
    <div id="micro-app-container"></div>
   </main>
  </div>
</template>

<style>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #333;
  color: white;
}

.navbar ul {
  display: flex;
  list-style: none;
  gap: 1rem;
}

.navbar a {
  color: white;
  text-decoration: none;
}

.navbar a:hover {
  text-decoration: underline;
}

main {
  padding: 2rem;
}
</style>
