<template>
    <div class="home-view">
      <FetchData @data-loaded="onDataLoaded" />
      <OtherContext />
    </div>
  </template>
  
  <script>
  import FetchData from '../components/FetchData.vue'
  import OtherContext from '../components/OtherContext.vue'
  import { useDataStore } from '../stores/dataStore'
  
  export default {
    name: 'HomeView',
    components: { FetchData, OtherContext },
    setup() {
      useDataStore()
      
      const onDataLoaded = () => {
        // Data loading is handled by the store
      }
      
      return {
        onDataLoaded
      }
    }
  }
  </script>
  
  <style scoped>
  .home-view {
    padding: 2rem;
  }
  </style>
