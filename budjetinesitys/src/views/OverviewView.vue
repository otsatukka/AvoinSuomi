<template>
    <div class="overview-view">
      <h1>Budjetin yleiskuva</h1>
      
      <div v-if="dataStore.isLoading" class="loading">
        Lataa dataa...
      </div>
      
      <div v-else-if="!dataStore.isLoaded" class="no-data">
        Lataa dataa ensin kotisivulta.
      </div>
      
      <div v-else>
        <LoanData 
          :data="dataStore.nameValueData" 
          :debtByYear="dataStore.debtByYear" 
          :debtManagementByYear="dataStore.debtManagementByYear" 
          :keskimääräinenpalkka="dataStore.keskimääräinenpalkka" 
          :väestönmäärä="dataStore.väestönmäärä" 
          v-if="dataStore.nameValueData"
        />
      </div>
    </div>
  </template>
  
  <script>
  import LoanData from '../components/LoanData.vue'
  import { useDataStore } from '../stores/dataStore'
  
  export default {
    name: 'OverviewView',
    components: { LoanData },
    setup() {
      const dataStore = useDataStore()
      
      return {
        dataStore
      }
    }
  }
  </script>
  
  <style scoped>
  .overview-view {
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


