<script>
const { Line } = require( 'vue-chartjs')
 module.exports ={
  extends: Line,
  props: {
    chartdata: {
      type: Object,
      default: null
    },
    chartTitle: {
      type: String, 
      default: 'chart title',
    }
  },
  mounted () {
    this.options = {
      title: {
        display: true, 
        text: this.chartTitle,
        fontSize: 15,
      },
      legend: {
        display: true, 
        position: 'right', 
      },
      responsive: true,
      maintainAspectRatio: false,
      scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true, 
              autoSkip: true, 

            },
            gridLines: {
              display: true
            }
          }],
          xAxes: [ {
            ticks: {
              autoSkip: true,
              autoSkipPadding: 20,
              maxRotation: 10,
              minRotation: 0,
              labelOffset: 0,
              callback: function(value, index, values) {
                
                let words = value.split('-');
                if ((index % 10) == 0 ){
                  return [ words[0], `${words[1]}-${words[2]}`];
                }
                return [`${words[1]}-${words[2]}`];
              }
            },
            gridLines: {
              display: false
            }
          }]
        },
    };
    this.renderChart(this.chartdata, this.options)
  }
}
</script>
