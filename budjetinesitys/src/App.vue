<template>
  <div>
    <FetchData ref="fetchDataComponent" @data-loaded="onDataLoaded"></FetchData>
    <LoanData :data="dataAsNameAndValues" :debtByYear="debtByYear" v-if="dataAsNameAndValues"/>
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
import { convertCsvDataToSankeyData, convertCSVDataToNameValuePair } from './utils/dataConverter';

export default {
  name: "App",
  components: {LoanData, FetchData, SankeyMain, SankeyControls, DataHistogram },
  data: () => ({
    data: null,
    dataAsNameAndValues: null,
    edgeToRemove: null,
    csvData: {},
    debtByYear:  {},
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