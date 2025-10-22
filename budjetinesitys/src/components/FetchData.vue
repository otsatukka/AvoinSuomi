<template>
  <div id="fetch-data-component">
    <h1>Hae hallituksen esitys Suomen 2025 budjetista painamalla alla olevaa <i>Hae sivun data</i>-nappia</h1>
    <h3>Tiedot haetaan budjetti.vm.fi:n avoimen datan <a href="https://budjetti.vm.fi/indox/opendata/2025/tae/hallituksenEsitys/2025-tae-hallituksenEsitys.html">palvelusta</a>. Sekä tutkihallintoa <a href="https://api.tutkihallintoa.fi/central-government-debt/v1/debt-and-gdp">palvelusta</a>. Sekä tilastokeskuksen avoimesta rajapinnasta.</h3>
    <button @click="fetchData" :disabled="dataStore.isLoading">
      {{ dataStore.isLoading ? 'Lataa...' : 'Hae sivun data' }}
    </button>
    <div v-if="Object.keys(dataStore.csvData).length && !dataStore.isLoading">
      <h2>Haettu data:</h2>
      <ul>
        <li v-for="(file, name) in dataStore.csvData" :key="name">{{ name }} - {{ file.length }} rows</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useDataStore } from '../stores/dataStore'

export default {
  name: 'FetchData',
  setup() {
    const dataStore = useDataStore()
    
    const fetchData = async () => {
      await dataStore.fetchData()
    }
    
    return {
      dataStore,
      fetchData
    }
  }
}
</script>

<style scoped>
#fetch-data-component {
  /* Add your styles here */
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>