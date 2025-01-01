<template>
    <div id="fetch-data-component">
      <button @click="fetchData">Hae budjettidata</button>
      <div v-if="Object.keys(csvData).length">
        <h2>Haettu data:</h2>
        <ul>
          <li v-for="(file, name) in csvData" :key="name">{{ name }} - {{ file.length }} rows</li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import Papa from 'papaparse';
  
  export default {
    name: 'FetchData',
    data() {
      return {
        csvData: {} // Dictionary to store link name and parsed CSV data
      };
    },
    methods: {
        async fetchData() {
  try {
    const htmlResponse = await axios.get('/proxy', {
      params: { 
        url: 'https://budjetti.vm.fi/indox/opendata/2025/tae/hallituksenEsitys/2025-tae-hallituksenEsitys.html'
      }
    });
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlResponse.data, 'text/html');
    const csvLinks = Array.from(doc.querySelectorAll('a.ospl'));
    let initially =0;
    for (const link of csvLinks) {
      const linkName = link.textContent.trim();
      const csvUrl = 'https://budjetti.vm.fi' + link.getAttribute('href');
      //console.log('Fetching CSV:', csvUrl);
      
      // Now fetch each CSV through the proxy

      if (initially<150 || initially == 6 || initially == 7){ 
        
     
        const csvResponse = await axios.get('/proxy', {
      params: { 
        url: csvUrl
      },
      responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
    });

    const decoder = new TextDecoder('utf-8');
    const text = decoder.decode(new Uint8Array(csvResponse.data));
    
    Papa.parse(text, {
      header: true,
      complete: results => {
        this.csvData[linkName] = results.data;
      }
    });
    }
    initially++;
    }
    this.$emit('data-loaded');
  } catch (error) {
    console.error('Error fetching or parsing CSV:', error);
  }
}
    }
  };
  </script>
  
  <style scoped>
  #fetch-data-component {
    /* Add your styles here */
  }
  </style>