<template>
  <div id="app">
    <nav class="main-navigation">
      <router-link to="/">Koti</router-link>
      <router-link to="/overview">Budjetin yleiskuva</router-link>
      <router-link to="/economic-indicators">Taloudelliset indikaattorit</router-link>
      <router-link to="/public-sector">Julkinen sektori</router-link>
      <router-link to="/debt-analysis">Velkaanalyysi</router-link>
      <router-link to="/data-visualization">Datan näyttö</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.main-navigation {
  background-color: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  margin-bottom: 2rem;
}

.main-navigation a {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: #495057;
  border-radius: 0.25rem;
  transition: background-color 0.2s;
}

.main-navigation a:hover {
  background-color: #e9ecef;
}

.main-navigation a.router-link-active {
  background-color: #6c757d;
  color: white;
}
</style>