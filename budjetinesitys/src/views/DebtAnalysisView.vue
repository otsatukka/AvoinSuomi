<template>
    <div class="debt-analysis-view">
      <h1>Debt Analysis</h1>
      
      <div v-if="dataStore.isLoading" class="loading">
        Lataa dataa...
      </div>
      
      <div v-else-if="!dataStore.isLoaded" class="no-data">
        Lataa dataa ensin kotisivulta.
      </div>
      
      <div v-else>
        <DebtManagementLineChart :data="dataStore.debtManagementByYear" />
      </div>
    </div>
  </template>
  
  <script>
  import DebtManagementLineChart from '../components/LineChart/DebtManagementLineChart.vue'
  import { useDataStore } from '../stores/dataStore'
  
  export default {
    name: 'DebtAnalysisView',
    components: { DebtManagementLineChart },
    setup() {
      const dataStore = useDataStore()
      
      return {
        dataStore
      }
    }
  }
  </script>
  
  <style scoped>
  .debt-analysis-view {
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