import { defineStore } from 'pinia'
import axios from 'axios'
import Papa from 'papaparse'

export const useDataStore = defineStore('dataStore', {
  state: () => ({
    csvData: {},
    debtByYear: {},
    debtManagementByYear: {},
    väestönmäärä: 0,
    keskimääräinenpalkka: 0,
    bktData: [],
    työttömyysData: [],
    kuluttajaIndeksiData: [],
    työpaikatjulkisellaData: [],
    data: null,
    dataAsNameAndValues: null,
    isLoading: false,
    isLoaded: false
  }),
  
  getters: {
    sankeyData: (state) => state.data,
    nameValueData: (state) => state.dataAsNameAndValues,
    economicIndicators: (state) => ({
      bkt: state.bktData,
      unemployment: state.työttömyysData,
      consumerPriceIndex: state.kuluttajaIndeksiData
    }),
    publicSectorData: (state) => ({
      publicJobs: state.työpaikatjulkisellaData,
      averageSalary: state.keskimääräinenpalkka,
      population: state.väestönmäärä
    }),
    debtData: (state) => ({
      debtByYear: state.debtByYear,
      debtManagement: state.debtManagementByYear
    })
  },
  
  actions: {
    async fetchData() {
      if (this.isLoaded) return
      
      this.isLoading = true
      try {
        // Budget data
        const htmlResponse = await axios.get('/proxy', {
          params: { 
            url: 'https://budjetti.vm.fi/indox/opendata/2025/tae/hallituksenEsitys/2025-tae-hallituksenEsitys.html'
          }
        })
        
        const parser = new DOMParser()
        const doc = parser.parseFromString(htmlResponse.data, 'text/html')
        const csvLinks = Array.from(doc.querySelectorAll('a.ospl'))

        for (const link of csvLinks) {
          const linkName = link.textContent.trim()
          const csvUrl = 'https://budjetti.vm.fi' + link.getAttribute('href')
          const csvResponse = await axios.get('/proxy', {
            params: { url: csvUrl },
            responseType: 'arraybuffer'
          })

          const decoder = new TextDecoder('ISO-8859-1')
          const text = decoder.decode(new Uint8Array(csvResponse.data))
          
          Papa.parse(text, {
            header: true,
            encoding: "ISO-8859-1",
            complete: results => {
              this.csvData[linkName] = results.data
            }
          })
        }

        // Debt data
        const debtResponse = await axios.get('/proxy', {
          params: { url: "https://api.tutkihallintoa.fi/central-government-debt/v1/debt-and-gdp" },
          responseType: 'arraybuffer'
        })
        const decoder = new TextDecoder('utf-8')
        const debtText = decoder.decode(new Uint8Array(debtResponse.data))
        this.debtByYear = JSON.parse(debtText)

        // Debt management data
        const debtManagementResponse = await axios.get('/proxy', {
          params: { url: "https://api.tutkihallintoa.fi/central-government-debt/v1/interest-expenses" },
          responseType: 'arraybuffer'
        })
        const debtManagementText = decoder.decode(new Uint8Array(debtManagementResponse.data))
        this.debtManagementByYear = JSON.parse(debtManagementText)

        // Population data
        const populationResponse = await axios.get('/proxy', {
          params: { url: "https://pxdata.stat.fi:443/PxWeb/sq/1a731775-4a97-43ef-8e7c-dd883ec4c265" },
          responseType: 'arraybuffer'
        })
        const populationText = decoder.decode(new Uint8Array(populationResponse.data))
        const populationJson = JSON.parse(populationText)
        this.väestönmäärä = populationJson.data[0].values[0]

        // Average salary data
        const salaryResponse = await axios.get('/proxy', {
          params: { url: "https://pxdata.stat.fi:443/PxWeb/sq/c2f919e0-b8ad-4d0e-90d0-1e7642b35476" },
          responseType: 'arraybuffer'
        })
        const salaryText = decoder.decode(new Uint8Array(salaryResponse.data))
        const salaryJson = JSON.parse(salaryText)
        const salaryValues = salaryJson.data.filter(item => item.key.includes("SSS")).map(item => parseFloat(item.values[0]))
        this.keskimääräinenpalkka = salaryValues.reduce((acc, val) => acc + val, 0) / salaryValues.length

        // BKT data
        const bktResponse = await axios.get('/proxy', {
          params: { url: "https://pxdata.stat.fi:443/PxWeb/sq/91b90ee2-dbdc-4d29-80f9-72fe6856fd13" },
          responseType: 'arraybuffer'
        })
        const bktText = decoder.decode(new Uint8Array(bktResponse.data))
        const bktJson = JSON.parse(bktText)
        this.bktData = Object.entries(
          bktJson.data
            .filter(item => item.key[0] === "B1GMH")
            .reduce((acc, item) => {
              acc[item.key[1]] = parseFloat(item.values[0])
              return acc
            }, {})
        ).map(([year, value]) => ({ 
          year: new Date(year), 
          value 
        }))

        // Unemployment data
        const unemploymentResponse = await axios.get('/proxy', {
          params: { url: "https://pxdata.stat.fi:443/PxWeb/sq/d98712a4-c3bb-4b34-a65d-d58cf98d272a" },
          responseType: 'arraybuffer'
        })
        const unemploymentText = decoder.decode(new Uint8Array(unemploymentResponse.data))
        const unemploymentJson = JSON.parse(unemploymentText)
        this.työttömyysData = Object.entries(
          unemploymentJson.data.reduce((acc, item) => {
            acc[item.key] = parseFloat(item.values)
            return acc
          }, {})
        ).map(([key, value]) => {
          const year = parseInt(key.slice(0, 4))
          const month = parseInt(key.slice(5, 7)) - 1
          return { 
            year: new Date(year, month), 
            value 
          }
        })

        // Consumer price index
        const cpiResponse = await axios.get('/proxy', {
          params: { url: "https://pxdata.stat.fi:443/PxWeb/sq/9dbc43c7-81ff-493a-8cc0-c50906045b61" },
          responseType: 'arraybuffer'
        })
        const cpiText = decoder.decode(new Uint8Array(cpiResponse.data))
        const cpiJson = JSON.parse(cpiText)
        if (cpiJson.data) {
          this.kuluttajaIndeksiData = Object.entries(
            cpiJson.data.reduce((acc, item) => {
              if (item.key && item.values) {
                acc[item.key] = parseFloat(item.values)
              }
              return acc
            }, {})
          ).map(([key, value]) => {
            const year = parseInt(key.slice(0, 4))
            const month = parseInt(key.slice(5, 7)) - 1
            return { 
              year: new Date(year, month), 
              value 
            }
          })
        }

        // Public sector jobs
        const publicJobsResponse = await axios.get('/proxy', {
          params: { url: "https://pxdata.stat.fi:443/PxWeb/sq/c7d0bfbc-73a2-43f0-96f7-c1bc5ca34b5e" },
          responseType: 'arraybuffer'
        })
        const publicJobsText = decoder.decode(new Uint8Array(publicJobsResponse.data))
        const publicJobsJson = JSON.parse(publicJobsText)
        if (publicJobsJson.data) {
          this.työpaikatjulkisellaData = Object.entries(
            publicJobsJson.data.reduce((acc, item) => {
              if (item.key && item.values) {
                acc[item.key] = parseFloat(item.values)
              }
              return acc
            }, {})
          ).map(([key, value]) => {
            const year = parseInt(key.slice(0, 4))
            const month = parseInt(key.slice(5, 7)) - 1
            return { 
              year: new Date(year, month), 
              value: value * 1000
            }
          })
        }

        // Convert data formats
        const { convertCsvDataToSankeyData, convertCSVDataToNameValuePair } = await import('../utils/dataConverter')
        this.data = convertCsvDataToSankeyData(this.csvData)
        this.dataAsNameAndValues = convertCSVDataToNameValuePair(this.csvData)
        
        this.isLoaded = true
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        this.isLoading = false
      }
    },

    removeEdge(edge) {
      if (!this.data) return
      
      const source = edge.source
      const target = edge.target
      const sourceUsedAnywhere = this.data.links.filter(
        link => link.source.name === source.name || link.target.name === source.name
      ).length > 1
      const targetUsedAnywhere = this.data.links.filter(
        link => link.target.name === source.name || link.target.name === target.name
      ).length > 1
      
      if (!sourceUsedAnywhere) this.data.nodes.splice(edge.source.index, 1)
      if (!targetUsedAnywhere) this.data.nodes.splice(edge.target.index, 1)
      this.data.links.splice(edge.index, 1)
    }
  }
})
