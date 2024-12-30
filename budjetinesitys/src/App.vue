<template>
  <div>
    <FetchData ref="fetchDataComponent" @data-loaded="onDataLoaded"></FetchData>
    <SankeyControls :data="data" @remove-edge="removeEdge" v-if="data"/>
    <SankeyMain v-if="data" :data="data"/>
  </div>
</template>

<script>
import FetchData from './components/FetchData.vue';
import SankeyMain from "./components/SankeyMain.vue";
import SankeyControls from "./components/SankeyControls.vue";
import { convertCsvDataToSankeyData } from './utils/dataConverter';

export default {
  name: "App",
  components: {FetchData, SankeyMain, SankeyControls },
  data: () => ({
    data: null,
    edgeToRemove: null,
    csvData: {},
    csvDataReady: false
  }),
  // async mounted() {
  //   const response = await fetch(
  //     "https://raw.githubusercontent.com/ozlongblack/d3/master/energy.json"
  //   );
    
  //   const monstdata = await response.json();
  //   console.log(monstdata);
  // },
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
        console.log('CSV data loaded:', this.csvData);
        this.csvDataReady = true;
        this.data = convertCsvDataToSankeyData(this.csvData);
       //console.log('Converted Sankey Data:',  this.data);
      }
    }
  }
};
</script>