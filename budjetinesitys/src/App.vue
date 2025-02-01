<template>
  <div>
    <FetchData ref="fetchDataComponent" @data-loaded="onDataLoaded"></FetchData>
    <LoanData :data="dataAsNameAndValues" :debtByYear="debtByYear" :debtManagementByYear="debtManagementByYear" :keskimääräinenpalkka="keskimääräinenpalkka" :väestönmäärä="väestönmäärä" v-if="dataAsNameAndValues"/>
    <DebtManagementLineChart :data="debtManagementByYear"  v-if="dataAsNameAndValues"/>
    <LineChart :data="bktData"  :title="'Bruttokansantuote euroissa'" v-if="dataAsNameAndValues" />
    <LineChart :data="työttömyysData" :title="'Työttömyysaste prosenteissa'" v-if="dataAsNameAndValues" />
    <LineChart :data="kuluttajaIndeksiData" :title="'Kuluttajahintaindeksi'" v-if="dataAsNameAndValues" />    
    <LineChart :data="työpaikatjulkisellaData" :title="'Työpaikat julkisella'" v-if="dataAsNameAndValues" />    
    <DataHistogram :data="dataAsNameAndValues" v-if="dataAsNameAndValues"/>
    <h2 v-if="data">Sankey muodossa</h2>
    <SankeyControls :data="data" @remove-edge="removeEdge" v-if="data"/>
    <SankeyMain v-if="data" :data="data"/>
  </div>
</template>

<script>
import FetchData from './components/FetchData.vue';
import SankeyMain from "./components/SankeyMain.vue";
import SankeyControls from "./components/SankeyControls.vue";
import DataHistogram from "./components/Histogram/DataHistogram.vue"
import LoanData from './components/LoanData.vue';
import DebtManagementLineChart from './components/LineChart/DebtManagementLineChart.vue'
import LineChart from './components/LineChart/LineChart.vue'
import { convertCsvDataToSankeyData, convertCSVDataToNameValuePair } from './utils/dataConverter';

export default {
  name: "App",
  components: {LineChart, DebtManagementLineChart, LoanData, FetchData, SankeyMain, SankeyControls, DataHistogram },
  data: () => ({
    data: null,
    dataAsNameAndValues: null,
    edgeToRemove: null,
    csvData: {},
    debtByYear: {},
    debtManagementByYear: {},
    väestönmäärä: 0,
    keskimääräinenpalkka: 0,
    bktData: {},
    työttömyysData: {},
    kuluttajaIndeksiData: {},
    työpaikatjulkisellaData: {}
  }),
  methods: {
    removeEdge(edge) {
      console.log(edge);
      // TODO Remove edge functionality
      const source = edge.source;
      const target = edge.target;
      const sourceUsedAnywhere =
        this.data.links.filter(
          link =>
            link.source.name === source.name || link.target.name === source.name
        ).length > 1;
      const targetUsedAnywhere =
        this.data.links.filter(
          link =>
            link.target.name === source.name || link.target.name === target.name
        ).length > 1;
      if (!sourceUsedAnywhere) this.data.nodes.splice(edge.source.index, 1);
      if (!targetUsedAnywhere) this.data.nodes.splice(edge.target.index, 1);
      this.data.links.splice(edge.index, 1);
    },
    onDataLoaded() {
      if (this.$refs.fetchDataComponent) {
        this.csvData = this.$refs.fetchDataComponent.csvData;
        this.debtByYear = this.$refs.fetchDataComponent.debtByYear;
        this.debtManagementByYear = this.$refs.fetchDataComponent.debtManagementByYear;
        this.väestönmäärä = this.$refs.fetchDataComponent.väestönmäärä;
        this.keskimääräinenpalkka = this.$refs.fetchDataComponent.keskimääräinenpalkka
        this.bktData = this.$refs.fetchDataComponent.bktData
        this.työttömyysData = this.$refs.fetchDataComponent.työttömyysData
        this.kuluttajaIndeksiData = this.$refs.fetchDataComponent.kuluttajaIndeksiData
        this.työpaikatjulkisellaData = this.$refs.fetchDataComponent.työpaikatjulkisellaData
        //console.log('CSV data loaded:', this.csvData);
        this.data = convertCsvDataToSankeyData(this.csvData);
        this.dataAsNameAndValues = convertCSVDataToNameValuePair(this.csvData);
        //console.log('Converted data:', this.dataAsNameAndValues);
        //console.log('Converted Sankey Data:',  this.data);
      }
    }
  }
};
</script>