<template>
    <div id="fetch-data-component">
      <h1>Hae hallituksen esitys Suomen 2025 budjetista painamalla alla olevaa <i>Hae sivun data</i>-nappia</h1>
      <h3>Tiedot haetaan budjetti.vm.fi:n avoimen datan <a href="https://budjetti.vm.fi/indox/opendata/2025/tae/hallituksenEsitys/2025-tae-hallituksenEsitys.html">palvelusta</a>. Sekä tutkihallintoa <a href="https://api.tutkihallintoa.fi/central-government-debt/v1/debt-and-gdp">palvelusta</a>. Sekä tilastokeskuksen avoimesta rajapinnasta.</h3>
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
        debtByYear: {},
        debtManagementByYear: {},
        väestönmäärä: 0,
        keskimääräinenpalkka: 0,
        bktData: {},
        työttömyysData: {},
        kuluttajaIndeksiData: {},
        työpaikatjulkisellaData: {}
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
              this.debtByYear = JSON.parse(text);

              // Get debt management data
              const debtManagementResponse = await axios.get('/proxy', {
                params: { 
                  url: "https://api.tutkihallintoa.fi/central-government-debt/v1/interest-expenses"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
              const debtManagementText = decoder.decode(new Uint8Array(debtManagementResponse.data));
              // Parse the decoded text as JSON
              this.debtManagementByYear = JSON.parse(debtManagementText);
              


              // Get väestönmäärärdata
              const väestönmäärähaku = await axios.get('/proxy', {
                params: { 
                  url: "https://pxdata.stat.fi:443/PxWeb/sq/1a731775-4a97-43ef-8e7c-dd883ec4c265"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
            
              const väestönmääräText = decoder.decode(new Uint8Array(väestönmäärähaku.data));

              let jsonObject = JSON.parse(väestönmääräText);
              this.väestönmäärä = jsonObject.data[0].values[0];
        

              // Keskimääräinen palkka
              const keskimaarainenpalkkaHaku = await axios.get('/proxy', {
                params: { 
                  url: "https://pxdata.stat.fi:443/PxWeb/sq/c2f919e0-b8ad-4d0e-90d0-1e7642b35476"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
              const keskimäärinenpalkkaText = decoder.decode(new Uint8Array(keskimaarainenpalkkaHaku.data));
              jsonObject = JSON.parse(keskimäärinenpalkkaText);
              let values = jsonObject.data.filter(item => item.key.includes("SSS")).map(item => parseFloat(item.values[0]));

              // Calculate the average
              let sum = values.reduce((acc, val) => acc + val, 0);
              this.keskimääräinenpalkka = sum / values.length;

              //BKT
              const bktHaku = await axios.get('/proxy', {
                params: { 
                  //url: "https://pxdata.stat.fi:443/PxWeb/sq/77a91487-11bd-4163-91f6-2be9d435ddb4"
                  url: "https://pxdata.stat.fi:443/PxWeb/sq/91b90ee2-dbdc-4d29-80f9-72fe6856fd13"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
              const bktText = decoder.decode(new Uint8Array(bktHaku.data));
              jsonObject = JSON.parse(bktText);
              this.bktData = Object.entries(
                          jsonObject.data
                            .filter(item => item.key[0] === "B1GMH")
                            .reduce((acc, item) => {
                              acc[item.key[1]] = parseFloat(item.values[0]);
                              return acc;
                            }, {})
                        ).map(([year, value]) => ({ 
                          year: new Date(year), 
                          value 
                        }));

                       // console.log(this.bktData)

             //Työttömyys
              const työttömyysHaku = await axios.get('/proxy', {
                params: { 
                  url: "https://pxdata.stat.fi:443/PxWeb/sq/d98712a4-c3bb-4b34-a65d-d58cf98d272a"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
              const työttömyysText = decoder.decode(new Uint8Array(työttömyysHaku.data));
              jsonObject = JSON.parse(työttömyysText);
              this.työttömyysData = Object.entries(
                        jsonObject.data
                          .reduce((acc, item) => {
                            acc[item.key] = parseFloat(item.values);
                            return acc;
                          }, {})
                      ).map(([key, value]) => {
                        const year = parseInt(key.slice(0, 4));
                        const month = parseInt(key.slice(5, 7)) - 1; // Month is zero-indexed in JavaScript Date
                        return { 
                          year: new Date(year, month), 
                          value 
                        };
                      });
                        
              //Kuluttajahintaindeksi
              const kuluttajahintaIndeksiHaku = await axios.get('/proxy', {
                params: { 
                  url: "https://pxdata.stat.fi:443/PxWeb/sq/9dbc43c7-81ff-493a-8cc0-c50906045b61"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
              const kuluttajahintaindeksiText = decoder.decode(new Uint8Array(kuluttajahintaIndeksiHaku.data));
              jsonObject = JSON.parse(kuluttajahintaindeksiText);    
              if (jsonObject.data) {
                  this.kuluttajaIndeksiData = Object.entries(
                      jsonObject.data
                          .reduce((acc, item) => {
                              // Ensure 'item' has 'key' and 'values' properties
                              if (item.key && item.values) {
                                  acc[item.key] = parseFloat(item.values);
                              }
                              return acc;
                          }, {})
                  ).map(([key, value]) => {
                      const year = parseInt(key.slice(0, 4));
                      const month = parseInt(key.slice(5, 7)) - 1; 
                      return { 
                          year: new Date(year, month), 
                          value 
                      };
                  });
              } else {
                  console.error("Data is undefined or not available");
              }  
              
              //Julkinen sektori työpaikat
              const työpaikatjulkisellaHaku = await axios.get('/proxy', {
                params: { 
                  url: "https://pxdata.stat.fi:443/PxWeb/sq/c7d0bfbc-73a2-43f0-96f7-c1bc5ca34b5e"
                },
                responseType: 'arraybuffer' // Ensure the response is an ArrayBuffer
              });
              const työpaikatjulkisellaText = decoder.decode(new Uint8Array(työpaikatjulkisellaHaku.data));
              jsonObject = JSON.parse(työpaikatjulkisellaText);    
              if (jsonObject.data) {
                  this.työpaikatjulkisellaData = Object.entries(
                      jsonObject.data
                          .reduce((acc, item) => {
                              // Ensure 'item' has 'key' and 'values' properties
                              if (item.key && item.values) {
                                  acc[item.key] = parseFloat(item.values);
                              }
                              return acc;
                          }, {})
                  ).map(([key, value]) => {
                      const year = parseInt(key.slice(0, 4));
                      const month = parseInt(key.slice(5, 7)) - 1; 
                      return { 
                          year: new Date(year, month), 
                          value: value*1000
                      };
                  });
              } else {
                  console.error("Data is undefined or not available");
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