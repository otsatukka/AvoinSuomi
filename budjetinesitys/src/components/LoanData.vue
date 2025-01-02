<template>
    <div>
        <h1>Laina</h1>
        <p>Lainaa otetaan vuonna 2025 {{ (lainanmäärä/1000000000).toFixed(2) }} miljardia €</p>
        <p>Sen hoitokulut ovat {{ (lainahoitokulut/1000000000).toFixed(2) }}  miljardia €</p>
        <p>Laina oli vuonna 2023 {{(debtByYear[2023]/1000000000).toFixed(2)}} miljardia €</p>
    </div>
  </template>
  
  <script>
  
  export default {
  name: 'LoanData',
  props: {
    data: Object,
    debtByYear: Object
  },
  data: () => ({
    lainanmäärä: 0,
    lainahoitokulut: 0
  }),
  mounted() {
      this.LookForLoanData();
  },
  methods: {
    LookForLoanData() {
        this.lainanmäärä = this.data.incomeDataOutput.find(d=>d.name === "Nettolainanotto ja velanhallinta").value
        this.lainahoitokulut = this.data.expenditureDataOutput.find(d=>d.name === "Valtionvelan korko").value
    }
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(data) {
        if (!data) return;
        this.LookForLoanData();
      }
    },

  }
  };
  </script>
  
  <style>
  .bar {
  fill: steelblue;
  }
  </style>