<template>
  <div class="container">
      <p>{{getTitle(belong)}}</p>
    <line-chart
        ref="ch"
      v-if="loaded"
      :chartdata="chartdata"
      :options="options"/>
  </div>
</template>

<script>
const LineChart = require( './Chart.vue')
const apiService = require( '@/Services/ApiService')
module.exports = {
    props:{belong : Number, start : Date, end:Date},
  name: 'LineChartContainer',
  components: { LineChart },
  data: () => ({
    events: [],
     loading:false,
    avetotal:0,
    avemornings:0,
    avenoons:0,
    loaded: false,
    chartdata: null,
    options : {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            yAxes: [{
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: true
              }
            }],
            xAxes: [ {
              gridLines: {
                display: false
              }
            }]
          },
    },
    gradient: null,
      gradient2: null
  }),
  methods:{
      async getGraphDate(belong,start,end){
          console.log('getGraphDate '+belong+", "+start+", "+end)
          
        const response = await apiService.fetchGraph({belongs:belong,start:start,end:end})
        this.events = response.data
        // let ret = []
        let totals=[]
        let mornings=[]
        let noons=[]
        let labels = []
        // console.log(this.events )
        let len = this.events.length;
        // if(type === 0){
            this.events.forEach(ele => {
                // console.log(ele.totalmember )
                // this.avetotal += ele.totalmember
                // this.avemornings += ele.totalmorning
                // this.avenoons+= ele.totalnoon
                totals.push(ele.totalmember ===null ? 0 : ele.totalmember)
                mornings.push(ele.totalmorning===null ? 0: ele.totalmorning)
                noons.push(ele.totalnoon === null ? 0: ele.totalnoon)
                labels.push(ele.day)
            });
            // this.avetotal/=len;
            // this.avemornings/=len;
            // this.avenoons/=len;
            this.chartdata.datasets[0].data = totals
            this.chartdata.datasets[1].data = mornings
            this.chartdata.datasets[2].data = noons

            this.chartdata.labels = labels
            // console.log(this.totals)
            // console.log( this.chartdata)
            // console.log(this.chartdata.datasets[1].data )
            // console.log(this.chartdata.datasets[2].data )
            this.$refs.ch.renderChart(this.chartdata, this.options)
            
      },
      getTitle(belong){
          console.log(belong)
          this.getGraphDate(belong,this.start,this.end)
          if(belong === 0)  return '유치부 출결 그래프'
          if(belong === 1)  return '유초등부 출결 그래프'
          if(belong === 2)  return '중고등부 출결 그래프'
          if(belong === 3)  return '청년부 출결 그래프'
          if(belong === 4)  return '면려회 출결 그래프'
        // return '재적 평균 : '+this.avetotal+" 오전 평균 : "+this.avemornings+" 오후 평균 : "+this.avenoons
      }
  },
  async mounted () {

    this.loaded = false
      try {
        this.getGraphDate(this.belong,this.start,this.end)
    //    this.chartdata[0].data = [100,21,22]
            this.chartdata = {
                // labels: ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'],
                datasets: [ 
                    { label: '재적 인원',
                        borderColor: '#0538CF',
                        pointBackgroundColor: 'white',
                        borderWidth: 1,
                        pointBorderColor: 'white',
                        // backgroundColor: 'blue',
                        data: this.totals//재적
                    } ,
                    { label: '오전 출석',
                        borderColor: '#FC2525',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'white',
                        borderWidth: 1,
                        // backgroundColor: 'green',
                        data: this.mornings//오전
                    }  ,
                    { label: '오후 출석',
                        borderColor: '#05CBE1',
                        pointBackgroundColor: 'white',
                        pointBorderColor: 'white',
                        borderWidth: 1,
                        // backgroundColor: 'green',
                        data: this.noons//오후
                    } 
                    ]
            }

        this.loaded = true
      } catch (e) {
        console.error(e)
      }
  }
}
</script>