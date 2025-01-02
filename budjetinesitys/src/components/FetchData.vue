<template>
    <div id="fetch-data-component">
      <h1>Hae hallituksen esitys Suomen 2025 budjetista painamalla alla olevaa <i>Hae sivun data</i>-nappia</h1>
      <h3>Tiedot haetaan budjetti.vm.fi:n avoimen datan <a href="https://budjetti.vm.fi/indox/opendata/2025/tae/hallituksenEsitys/2025-tae-hallituksenEsitys.html">palvelusta</a>. Sekä tutkihallintoa <a href="https://api.tutkihallintoa.fi/central-government-debt/v1/debt-and-gdp">palvelusta</a></h3>
      <button @click="fetchData">Hae sivun data</button>
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
        csvData: {}, // Dictionary to store link name and parsed CSV data
        debtByYear: {}
      };
    },
    methods: {
        async fetchData() {
          try {
            // Eri vaihtoehdot https://budjetti.vm.fi/opendata/opendata-csv.jsp
            const htmlResponse = await axios.get('/proxy', {
              params: { 
                url: 'https://budjetti.vm.fi/indox/opendata/2025/tae/hallituksenEsitys/2025-tae-hallituksenEsitys.html'
              }
            });
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlResponse.data, 'text/html');
            const csvLinks = Array.from(doc.querySelectorAll('a.ospl'));

            for (const link of csvLinks) {
              const linkName = link.textContent.trim();
              const csvUrl = 'https://budjetti.vm.fi' + link.getAttribute('href');
              const csvResponse = await axios.get('/proxy', {
                params: { 
                  url: csvUrl
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });

              const decoder = new TextDecoder('ISO-8859-1');
              const text = decoder.decode(new Uint8Array(csvResponse.data));
              
              Papa.parse(text, {
                header: true,
                encoding: "ISO-8859-1", // Explicitly set encoding
                complete: results => {
                  this.csvData[linkName] = results.data;
                }
              });
            }
            // Get debt data
            const debtResponse = await axios.get('/proxy', {
                params: { 
                  url: "https://api.tutkihallintoa.fi/central-government-debt/v1/debt-and-gdp"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
              const decoder = new TextDecoder('utf-8');
              const text = decoder.decode(new Uint8Array(debtResponse.data));
              // Parse the decoded text as JSON
              const debtData = JSON.parse(text);
              
              // Reduce the array to a dictionary where keys are years and values are debtInEuro
              this.debtByYear = debtData.reduce((acc, item) => {
                  acc[item.year] = item.debtInEuro;
                  return acc;
              }, {});
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