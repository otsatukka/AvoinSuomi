<template>
    <div>
      <div id="sankey-diagram" ref="sankeyDiagram"></div>
    </div>
  </template>
  
  <script>
  import * as d3 from 'd3';
  import { sankey, sankeyLinkHorizontal } from 'd3-sankey';
  
  export default {
    name: 'SankeyDiagram',
    props: {
      csvData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        sankeyData: {
          nodes: [],
          links: []
        }
      };
    },
    mounted() {
  this.updateSankey();
},
    watch: {
    // Use immediate: true to trigger updateSankey when csvData is initially set
    csvData: {
      handler: 'updateSankey',
      immediate: true
    }
  },
    methods: {
        updateSankey() {
      if (Object.keys(this.csvData).length === 0) {
        console.log("No CSV data available for Sankey diagram.");
        return;
      }

      let incomeData = [];
  let expenditureData = [];

  for (const [key, value] of Object.entries(this.csvData)) {
    if (value.length > 0) {
      const firstRow = value[0];
      if (Object.keys(firstRow).some(col => col.toLowerCase().includes('tulomomentin'))) {
        incomeData = incomeData.concat(value);
      } else if (Object.keys(firstRow).some(col => col.toLowerCase().includes('menomomentin'))) {
        expenditureData = expenditureData.concat(value);
      } else {
        console.warn(`CSV file ${key} does not match income or expenditure criteria.`);
      }
    } else {
      console.warn(`CSV file ${key} is empty or has no data.`);
    }
  }


      console.log('Income Data:', incomeData);
      console.log('Expenditure Data:', expenditureData);

      if (incomeData.length === 0 || expenditureData.length === 0) {
        console.log("Missing either income or expenditure data.");
        return;
      }

      const svg = d3.select(this.$refs.sankeyDiagram);
      svg.selectAll("*").remove(); // Clear previous diagram

      // Create nodes for income, "TheState", and expenditure
      const incomeNodes = [...new Set(incomeData.map(d => d['Tulomomentin nimi']))];
      const expenditureNodes = [...new Set(expenditureData.map(d => d['Menomomentin nimi']))];
      const datanodes = [
        ...incomeNodes.map(name => ({ name })),
        { name: "TheState" },
        ...expenditureNodes.map(name => ({ name }))
      ];

      console.log('Nodes:', datanodes);

      // Create links from income to "TheState" and from "TheState" to expenditure
      const links = [
        ...incomeData.map(d => ({
          source: datanodes.findIndex(node => node.name === d['Tulomomentin nimi']),
          target: datanodes.findIndex(node => node.name === "TheState"),
          value: parseInt(d['Määräraha'] || 0)
        })),
        ...expenditureData.map(d => ({
          source: datanodes.findIndex(node => node.name === "TheState"),
          target: datanodes.findIndex(node => node.name === d['Menomomentin nimi']),
          value: parseInt(d['Määräraha'] || 0)
        }))
      ];

      console.log('Links before filtering:', links);


      const nodesWithValues = datanodes.map(node => {
  const incoming = links.filter(l => l.target === node.index).reduce((sum, link) => sum + link.value, 0);
  const outgoing = links.filter(l => l.source === node.index).reduce((sum, link) => sum + link.value, 0);
  return {
    ...node,
    value: Math.max(incoming, outgoing) // or sum them if that fits your data model
  };
});
this.sankeyData = { nodes: nodesWithValues, links:links.filter(link => !isNaN(link.value) && link.value > 0) };


    //   this.sankeyData = { 
    //     nodes: datanodes,
    //     links: links.filter(link => !isNaN(link.value) && link.value > 0)
    //   };

      console.log('Sankey Data after filtering:', this.sankeyData);

      const width = 2000;
      const height = 2000;

      const sankeyGenerator = sankey()
        .nodeWidth(15)
        .nodePadding(10)
        .extent([[1, 1], [width - 1, height - 5]])

        //sankeyGenerator.iterations(32);

      try {
        const { nodes: sankeyNodes, links: sankeyLinks } = sankeyGenerator(this.sankeyData);

        console.log('Sankey Nodes:', sankeyNodes);
        console.log('Sankey Links:', sankeyLinks);

        svg.attr("width", width)
           .attr("height", height)
           .append("g")
           
        // Draw nodes
        svg.append("g")
           .selectAll("rect")
           .data(sankeyNodes)
           .enter().append("rect")
           .attr("x", d => d.x0)
           .attr("y", d => d.y0)
           .attr("width", d => d.x1 - d.x0)
           //.attr("height", d => d.y1 - d.y0)
           .attr("height", d => Math.max(1, d.y1 - d.y0))
           .attr("fill", "steelblue");

        // Draw links
        svg.append("g")
           .selectAll("path")
           .data(sankeyLinks)
           .enter().append("path")
           .attr("d", sankeyLinkHorizontal())
           .attr("stroke", "#000")
           .attr("stroke-width", d => Math.max(1, d.width));

        // Labels for nodes
        svg.append("g")
           .selectAll("text")
           .data(sankeyNodes)
           .enter().append("text")
           .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
           .attr("y", d => (d.y1 + d.y0) / 2)
           .attr("dy", "0.35em")
           .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
           .text(d => d.name);
      } catch (error) {
        console.error("Error in Sankey diagram generation:", error);
      }
    }
    },
  };
  </script>
  
  <style scoped>
  #sankey-diagram {
    width: 2000px;
    height: 2000px;
  }
  </style>