<template>
  <h2>Tulot</h2>
  <div id="histogram" ref="incomehistogram"></div>
  <h2>Menot</h2>
  <div id="expenditurehistogram" ref="expenditurehistogram"></div>
</template>

<script>
import * as d3 from 'd3';

export default {
name: 'DataHistogram',
props: {
  data: Object
},
data: () => ({
  width: 3680,
  height: 400,
  margins: {top: 20, right: 20, bottom: 651, left: 100}
}),
mounted() {
  if (this.$refs.incomehistogram) {
    this.createHistogram();
  } else {
    console.error('Ref "incomehistogram" not found');
  }
},
methods: {
  createComponent(svg, inputData) {
    const sortedData = [...inputData].sort((a, b) => b.value - a.value);
    // X scale
    const x = d3.scaleBand()
      .range([0, this.width])
      .domain(sortedData.map(d => d.name))
      .padding(0.1);

    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(sortedData, d => d.value) || 0])
      .range([this.height, 0]);

    // Append rectangles for the bar chart
    svg.selectAll(".bar")
      .data(sortedData)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.value))
      .attr("height", d => this.height - y(d.value))
      .attr("fill", "steelblue");

    // Add X axis
    const xAxis = svg.append("g")
      .attr("transform", `translate(0,${this.height})`)
      .call(d3.axisBottom(x));

    // Rotate x-axis labels
    xAxis.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-90)");

    // Add Y axis
    svg.append("g")
      .call(d3.axisLeft(y));
  },
  createHistogram() {
    const svg = d3.select(this.$refs.incomehistogram).html("").append("svg")
      .attr("width", this.width + this.margins.left + this.margins.right)
      .attr("height", this.height + this.margins.top + this.margins.bottom)
      .append("g")
      .attr("transform", `translate(${this.margins.left},${this.margins.top})`);

    const data = this.data.incomeDataOutput; // Assuming this is your data array

    if (!data || data.length === 0) {
      console.error("No data available to create histogram");
      return;
    }

    this.createComponent(svg, data);

    const svgexp = d3.select(this.$refs.expenditurehistogram).html("").append("svg")
      .attr("width", this.width + this.margins.left + this.margins.right)
      .attr("height", this.height + this.margins.top + this.margins.bottom)
      .append("g")
      .attr("transform", `translate(${this.margins.left},${this.margins.top})`);

    const expdata = this.data.expenditureDataOutput; // Assuming this is your data array

    if (!expdata || expdata.length === 0) {
      console.error("No expenditure data available to create histogram");
      return;
    }

    this.createComponent(svgexp, expdata);
  }
},
watch: {
  data: {
    deep: true,
    immediate: true,
    handler(data) {
      if (!data) return;
      this.createHistogram();
    }
  }
}
};
</script>

<style>
.bar {
fill: steelblue;
}
</style>