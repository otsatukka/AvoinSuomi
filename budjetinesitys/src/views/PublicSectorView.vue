<template>
    <div class="public-sector-view">
      <h1>Julkinen sektori</h1>
      
      <div v-if="dataStore.isLoading" class="loading">
        Lataa dataa...
      </div>
      
      <div v-else-if="!dataStore.isLoaded" class="no-data">
        Lataa dataa ensin kotisivulta.
      </div>
      
      <div v-else>
        <div class="metrics">
          <div class="metric">
            <h3>Väestö</h3>
            <p>{{ dataStore.väestönmäärä.toLocaleString() }}</p>
          </div>
          <div class="metric">
            <h3>Keskimääräinen palkka</h3>
            <p>{{ dataStore.keskimääräinenpalkka.toFixed(2) }} €</p>
          </div>
        </div>
        
        <LineChart 
          :data="dataStore.työpaikatjulkisellaData" 
          title="Julkisella olevat työpaikat" 
        />
      </div>
    </div>
  </template>
  
  <script>
  import LineChart from '../components/LineChart/LineChart.vue'
  import { useDataStore } from '../stores/dataStore'
  
  export default {
    name: 'PublicSectorView',
    components: { LineChart },
    setup() {
      const dataStore = useDataStore()
      
      return {
        dataStore
      }
    }
  }
  </script>
  
  <style scoped>
  .public-sector-view {
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
  
  .metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .metric {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    text-align: center;
  }
  
  .metric h3 {
    margin: 0 0 0.5rem 0;
    color: #495057;
  }
  
  .metric p {
    margin: 0;
    font-size: 1.5rem;
    font-weight: bold;
    color: #007bff;
  }
  </style>