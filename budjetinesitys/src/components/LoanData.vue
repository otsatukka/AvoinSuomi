<template>
    <div>
        <h1>Laina</h1>
        <h3>Suomi:</h3>
        <p>Lainaa otetaan vuonna 2025 {{ (lainanmäärä/1000000000).toFixed(2) }} miljardia €</p>
        <p>Lainan hoitokulut vuonna {{viimeisinvuosiHoitokuluissa}} {{(lainahoitokulut/1000000000).toFixed(2)}} miljardia €</p>
        <p>Laina oli vuonna {{viimeisinvuosi}} {{(lainaeuroissa/1000000000).toFixed(2)}} miljardia €</p>
        <p>Laina oli vuonna {{viimeisinvuosi}} {{(lainaperBKT).toFixed(2)}}% BKTsta</p>
        <p>Laina oli vuonna {{viimeisinvuosi}} {{(lainaperhlö).toFixed(2)}} € per asukas</p>
        <p>Suomalaisen keskimääräinen kuukausiansio {{(keskimääräinenpalkka).toFixed(2)}} €/kk</p>
        <p>Suomalaisia on {{(väestönmäärä/1000000).toFixed(2)}} miljoonaa </p>

        <h3>Ruotsi:</h3>
        <p>Laina vuonna 2024 {{ (1126287000000/11.47/1000000000).toFixed(2)}} miljardia €  (krunun kurssi 11,47 per euro)</p>
        <p>Laina oli vuonna 2024 18% BKTsta</p>
        <p>Laina oli vuonna 2024 {{ (1126287000000/10850000/11.47).toFixed(2)}} € per asukas</p>
        <p>Ruotsalaisia on 10,85 miljoonaa </p>
        <p>Ruotsia koskeva data on haettu käsin <a href="https://www.riksgalden.se/en/statistics/statistics-regarding-swedens-central-government-debt/"> sivulta</a></p>

    </div>
  </template>
  
  <script>
  
  export default {
  name: 'LoanData',
  props: {
    data: Object,
    debtByYear: Object,
    debtManagementByYear: Object,
    keskimääräinenpalkka: Number,
    väestönmäärä: Number
  },
  data: () => ({
    lainanmäärä: 0,
    lainahoitokulut: 0,
    lainaeuroissa: 0,
    lainaperhlö: 0,
    lainaperBKT: 0,
    viimeisinvuosi: 0,
    viimeisinvuosiHoitokuluissa: 0
  }),
  mounted() {
      this.LookForLoanData();
  },
  methods: {
    LookForLoanData() {
        this.lainaeuroissa = this.debtByYear.slice(-1)[0].debtInEuro
        this.lainaperhlö = this.debtByYear.slice(-1)[0].debtPerCapita
        this.lainaperBKT = this.debtByYear.slice(-1)[0].percentOfGdp
        this.viimeisinvuosi = this.debtByYear.slice(-1)[0].year
        this.lainahoitokulut = this.debtManagementByYear.slice(-1)[0].interestExpenses
        this.viimeisinvuosiHoitokuluissa = this.debtManagementByYear.slice(-1)[0].year
        this.lainanmäärä = this.data.incomeDataOutput.find(d=>d.name === "Nettolainanotto ja velanhallinta").value
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