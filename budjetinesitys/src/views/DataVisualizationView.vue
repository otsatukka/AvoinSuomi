<template>
    <div class="data-visualization-view">
      <h1>Datan näyttö</h1>
      
      <div v-if="dataStore.isLoading" class="loading">
        Lataa dataa...
      </div>
      
      <div v-else-if="!dataStore.isLoaded" class="no-data">
        Lataa dataa ensin kotisivulta.
      </div>
      
      <div v-else>
        <DataHistogram :data="dataStore.nameValueData" v-if="dataStore.nameValueData" />
        
        <h2>Sankey muodossa</h2>
        <SankeyControls :data="dataStore.sankeyData" @remove-edge="handleRemoveEdge" v-if="dataStore.sankeyData" />
        <SankeyMain v-if="dataStore.sankeyData" :data="dataStore.sankeyData" />
      </div>
    </div>
  </template>
  
  <script>
  import DataHistogram from '../components/Histogram/DataHistogram.vue'
  import SankeyControls from '../components/SankeyControls.vue'
  import SankeyMain from '../components/SankeyMain.vue'
  import { useDataStore } from '../stores/dataStore'
  
  export default {
    name: 'DataVisualizationView',
    components: { DataHistogram, SankeyControls, SankeyMain },
    setup() {
      const dataStore = useDataStore()
      
      const handleRemoveEdge = (edge) => {
        dataStore.removeEdge(edge)
      }
      
      return {
        dataStore,
        handleRemoveEdge
      }
    }
  }
  </script>
  
  <style scoped>
  .data-visualization-view {
    padding: 2rem;
  }
  
  .loading, .no-data {
    text-align: center;
    padding: 2rem;
    font-size: 1.2rem;
  }
  
  .no-data {
    color: #dc3545;
  }
  </style>