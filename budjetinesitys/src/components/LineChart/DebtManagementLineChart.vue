<template>
    <div id="chart" ref="linechart">
    </div>
  </template>
  
  <script>
import * as d3 from 'd3';
  
  export default {
    name: 'LineChart',
    props: {
      data: Object
    },
    data: () => ({
        width: 800,
        height: 400,
        margins: { top: 20, right: 20, bottom: 30, left: 50 }
    }),
    mounted() {
      if (this.$refs.linechart) {
        this.drawChart();
      } else {
        console.error('Ref "linechart" not found');
      }
    },
    methods: {
      drawChart() {
        const svg = d3.select(this.$refs.linechart).html("").append("svg")
          .attr('width', this.width + this.margins.left + this.margins.right)
          .attr('height', this.height + this.margins.top + this.margins.bottom)
          .append('g')
          .attr('transform', `translate(${this.margins.left},${this.margins.top})`);
  
        // Define scales
        const x = d3.scaleLinear()
          .domain(d3.extent(this.data, d => d.year))
          .range([0, this.width]);
  
        const y = d3.scaleLinear()
          .domain([0, d3.max(this.data, d => d.year<=2003 ? d.interestExpenses/6: d.interestExpenses)])
          .range([this.height, 0]);
  
        // Add X axis
        svg.append('g')
          .attr('transform', `translate(0,${this.height})`)
          .call(d3.axisBottom(x).tickFormat(d3.format('d')));
  
        // Add Y axis
        svg.append('g')
          .call(d3.axisLeft(y).tickFormat(d => parseFloat(d / 1e6).toFixed(1) + 'M'));
  
        // Add the line
        svg.append('path')
          .datum(this.data)
          .attr('fill', 'none')
          .attr('stroke', 'steelblue')
          .attr('stroke-width', 1.5)
          .attr('d', d3.line()
            .x(d => x(d.year))
            .y(d => y(d.year<=2003 ? d.interestExpenses/6: d.interestExpenses))
          );
  
        // Add labels if needed
        // svg.append('text')
        //   .attr('x', (this.width / 2))
        //   .attr('y', 0 - (this.margins.top / 2))
        //   .attr('text-anchor', 'middle')
        //   .style('font-size', '16px')
        //   .text('Interest Expenses Over Years');
            // Add vertical line for percentile
        const hallitukset = [
              {"pääministeri": "Vanhanen", "vuosi": 2007},
              {"pääministeri": "Kiviniemi", "vuosi": 2010},
              {"pääministeri": "Katainen", "vuosi": 2011},
              {"pääministeri": "Stubb", "vuosi": 2014},
              {"pääministeri": "Sipilä", "vuosi": 2015},
              {"pääministeri": "Marin", "vuosi": 2019},
              {"pääministeri": "Orpo", "vuosi": 2023}
            ]
        let count = 0
        hallitukset.forEach(hallitus=>
        {
            svg.append("line")
              .attr("x1", 1 + x(this.data.find(d => d.year === hallitus.vuosi)?.year))
              .attr("y1", 0)
              .attr("x2", 1 + x(this.data.find(d => d.year === hallitus.vuosi)?.year))
              .attr("y2", this.height)
              .attr("stroke", "green")
              .attr("stroke-width", 2);

              svg.append("text")
              .attr("x", 1 + x(this.data.find(d => d.year === hallitus.vuosi)?.year))
              .attr("y", count%2 === 0 ? 20 : 0)
              .style('font-size', '16px')
              .text(hallitus.pääministeri);
              count++;
        })
      }
    },
    watch: {
    data: {
        deep: true,
        immediate: true,
        handler(data) {
        if (!data) return;
        this.drawChart();
        }
    }
  }
  };
  </script>
  
  <style scoped>
  #chart svg {
    background-color: #f4f4f4;
  }
  </style>