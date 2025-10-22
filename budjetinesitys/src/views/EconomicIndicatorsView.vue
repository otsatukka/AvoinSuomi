<template>
    <div class="economic-indicators-view">
      <h1>Taloudelliset indikaattorit</h1>
      
      <div v-if="dataStore.isLoading" class="loading">
        Lataa dataa...
      </div>
      
      <div v-else-if="!dataStore.isLoaded" class="no-data">
        Lataa dataa ensin kotisivulta.
      </div>
      
      <div v-else>
        <LineChart 
          :data="dataStore.bktData" 
          title="Bruttokansantuote (euroissa)" 
        />
        <LineChart 
          :data="dataStore.työttömyysData" 
          title="Työttömyysaste (prosentteissa)" 
        />
        <LineChart 
          :data="dataStore.kuluttajaIndeksiData" 
          title="Kuluttajahintaindeksi (prosentteissa)" 
        />
      </div>
    </div>
  </template>
  
  <script>
  import LineChart from '../components/LineChart/LineChart.vue'
  import { useDataStore } from '../stores/dataStore'
  
  export default {
    name: 'EconomicIndicatorsView',
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
  .economic-indicators-view {
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


