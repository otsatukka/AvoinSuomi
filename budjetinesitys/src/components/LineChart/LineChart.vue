<template>
  <div>
    <h2>{{title}}</h2>
    <div id="chart" ref="linechart">
    </div>
  </div>
</template>
  
  <script>
import * as d3 from 'd3';
  
  export default {
    name: 'BKTLineChart',
    props: {
      data: Object,
      title: String
    },
    data: () => ({
        width: 800,
        height: 400,
        margins: { top: 20, right: 50, bottom: 30, left: 50 }
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
      const x = d3.scaleTime()
        .domain(d3.extent(this.data, d => d.year))
        .range([0, this.width]);

      const y = d3.scaleLinear()
        .domain(d3.extent(this.data, d => d.value))
        .range([this.height, 0]);

        
      // Add X axis
      svg.append('g')
        .attr('transform', `translate(0,${this.height})`)
        .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%Y-%m')));

      // Add Y axis
      svg.append('g')
        .call(d3.axisLeft(y).tickFormat(d => parseFloat(d)));

      // Add the line
      svg.append('path')
        .datum(this.data)
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1.5)
        .attr('d', d3.line()
          .x(d => x(d.year))
          .y(d => y(d.value))
        );
    
      // Add labels if needed
      // svg.append('text')
      //   .attr('x', (this.width / 2))
      //   .attr('y', 0 - (this.margins.top / 2))
      //   .attr('text-anchor', 'middle')
      //   .style('font-size', '16px')
      //   .text('Interest Expenses Over Years');
      
      const hallitukset = [
            {"pääministeri": "Vanhanen", "vuosi": new Date(2007, 5)}, // January 2007
            {"pääministeri": "Kiviniemi", "vuosi": new Date(2010, 5)}, // January 2010
            {"pääministeri": "Katainen", "vuosi": new Date(2011, 5)}, // January 2011
            {"pääministeri": "Stubb", "vuosi": new Date(2014, 5)}, // January 2014
            {"pääministeri": "Sipilä", "vuosi": new Date(2015, 4 )}, // January 2015
            {"pääministeri": "Marin", "vuosi": new Date(2019, 5)}, // January 2019
            {"pääministeri": "Orpo", "vuosi": new Date(2023, 5)} // January 2023
        ];
        let count = 0;
        hallitukset.forEach(hallitus => {
            const xPos = x(hallitus.vuosi); // Directly use the time scale with the Date object

            svg.append("line")
              .attr("x1", xPos + 1)
              .attr("y1", 0)
              .attr("x2", xPos + 1)
              .attr("y2", this.height)
              .attr("stroke", "green")
              .attr("stroke-width", 2);

            svg.append("text")
              .attr("x", xPos + 1)
              .attr("y", count % 2 === 0 ? 20 : 0)
              .style('font-size', '16px')
              .text(hallitus.pääministeri);
            count++;
        });
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