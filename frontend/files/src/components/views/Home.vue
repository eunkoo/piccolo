<template>
      <v-container   fluid text-xs-center  >
        <v-layout  fill-height justify-center>
            <v-flex  :key="1" xs12 sm6 md4 >
                <p h2 class="text-xs-left">시작</p>
                <datepicker :language="ko" v-model="start_date"  @selected="onSelectedStart" ></datepicker>
            </v-flex>
            <v-flex  :key="2" xs12 sm6 md4>
                <p  h2 class="text-xs-left">종료</p>
                <datepicker :language="ko" v-model="end_date"  @selected="onSelectedEnd" ></datepicker>
            </v-flex>
            <v-flex  :key="3" xs12 sm6 md4 >
                <v-select 
                :items="belong_items"
                v-model="belong_items[cbelong]"
                single-line
                item-text="text"
                item-value="id"
                return-object
                persistent-hint
                @change="changeBelong" 
                ></v-select>
            <td >&nbsp;</td> 
            </v-flex>
        </v-layout>

        <v-layout row wrap>
          <v-flex xs12>
            <v-btn small @click="fillChartData"> load data </v-btn>
          </v-flex>
          <v-flex xs12>
            <line-chart v-if="loaded" 
              class="chart-area ma-1"
              :height="180"
              v-for="dd in zzchartdata"
              :chartdata="dd.ds"
              :chartTitle="dd.title"
              >
            </line-chart>
          </v-flex>
        </v-layout>
      </v-container>
</template>

<script>
import ChartContainer from './ChartContainer.vue'
import {en, ko} from 'vuejs-datepicker/dist/locale'
import Datepicker from 'vuejs-datepicker';
import LineChart from './Chart.vue'
import apiService from '@/Services/ApiService'

export default {
  name: 'Home',
  components: { ChartContainer, Datepicker, LineChart },
  data () {
    return {       
      en:en,
      ko:ko,
      belong_items: [
        { text: '유치부', id: 0 },
        { text: '유초등부', id: 1 },
        { text: '중고등부', id: 2 },
        { text: '청년부', id: 3 },
        { text: '면려회', id: 4 }
      ],
      start_date: this.initDate(),
      end_date:new Date(),
      cbelong:2,
      editedIndex: -1,
      editedItem: {
        id: '',
        title: '',
        day: '',
        place:'',
        belongs:0
      },
      msg: '출결 보고 자료', 

      loaded: false,
      statisticsData: [
        [], [], [], [], []
      ], 

      category: [
        { text: '유치부' }, 
        { text: '유초등부'}, 
        { text: '중고등부'},
        { text: '청년부'},
        { text: '면려회'},
      ],
      zzchartdata: [
        { index: 0, ds: null, title: '유치부 출결' }, 
        { index: 1, ds: null, title: '유초등부 출결' }, 
        { index: 2, ds: null, title: '중고등부 출결' },
        { index: 3, ds: null, title: '청년부 출결' },
        { index: 4, ds: null, title: '면려회 출결' },
      ],

      borderColors: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)'
      ],
    }
  },
  mounted() {
    this.fillChartData();
  },
  methods:{
      initDate(){
        //    return new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        var s = new Date( new Date().setDate(1) )
         s = (s.setMonth(0))
        console.log(`---- initDate -----`);
        console.log(s);
        return new Date(s)

        //    console.log( this.start_date)
      },
    async changeBelong(selectObj) {
        console.log(selectObj.id)
        this.cbelong = selectObj.id
     },
     onSelectedStart(selected){
         this.start_date = selected
     },
     onSelectedEnd(selected){
         this.end_date = selected
     }, 
     getDaysBetweenDates(start, end, dayName) {
      var result = [];
      var days = {sun:0,mon:1,tue:2,wed:3,thu:4,fri:5,sat:6};
      var day = days[dayName.toLowerCase().substr(0,3)];
      // Copy start date
      var current = new Date(start);
      // Shift to next of required days
      current.setDate(current.getDate() + (day - current.getDay() + 7) % 7);
      // While less than end date, add dates to result array
      while (current < end) {
        result.push(new Date(+current));
        current.setDate(current.getDate() + 7);
      }
      return result;  
    },
    fillChartData(){
      let vm = this;
      vm.loaded = false;
      console.log(`fill chart data. period:${vm.start_date}~${vm.end_date}`);

      // start_date ~ end_date 동안의 모든 일요일에 대한 좌표 만들기
      // Get Wednesdays between 15 December, 2016 and 25 February, 2017.
      const alldate = vm.getDaysBetweenDates(vm.start_date, vm.end_date, "Sun");
      alldate.forEach((dd, index) => {
        console.log(dd);
      });

      vm.zzchartdata = [];
      vm.statisticsData.forEach( (items, index) => {
        const res = apiService.fetchGraph(index, vm.start_date, vm.end_date)
        .then(res =>{
          vm.statisticsData[index] = res.data;

          console.log(`received from backend. index: ${index}`);
          console.log(res.data);

          const dateLabels = [];
          const totals = [];
          const mornings = [];
          const noons = [];

          alldate.forEach((dd, index) => {

            var tempMonth = (dd.getMonth()+1);
            var tempDate = (dd.getDate());
            if (tempMonth < 10) tempMonth = '0' + tempMonth;
            if (tempDate < 10) tempDate = '0' + tempDate;

            let target_date = `${dd.getFullYear()}-${tempMonth}-${tempDate}`;

            let found = false;
            res.data.forEach(item => {
              // console.log(`compare two date ${target_date}   and ${item.day}`);

              if (target_date === item.day) {
                console.log(`found day: ${item.day}`);
                dateLabels.push(item.day);
                totals.push(item.totalmember);
                mornings.push(item.totalmorning);
                noons.push(item.totalnoon);

                found = true;
                return;
              }
            });
            if (found == false) {
              console.log(` target_date: ${target_date} data is not exist`);
              dateLabels.push(target_date);
              totals.push(0);
              mornings.push(0);
              noons.push(0);
            }
          });

          // console.log(totals)
          // console.log(mornings)
          // console.log(noons)
          // console.log(dateLabels)

          // console.log(` try fill chart datasets. index:${index}`);
          // console.log(dateLabels);
          // console.log(vm.myChartData[index]);

          vm.zzchartdata.push(  
            {
              title: vm.category[index].text,
              ds : {
                labels: dateLabels, 
                datasets: [
                  {
                    label: `total`,
                    data: totals, 
                    borderWidth: 1, 
                    pointRadius: 3,
                    borderColor: vm.borderColors[0],              
                  },
                  {
                    label: `morning`, 
                    data: mornings, 
                    borderWidth: 1, 
                    pointRadius: 3, 
                    borderColor: vm.borderColors[1],
                  }, 
                  {
                    label: `noon`, 
                    data: noons, 
                    borderWidth: 1, 
                    pointRadius: 3, 
                    borderColor: vm.borderColors[2],
                  }
                ] 
              }
            }
          );

        });
      });
       
      vm.loaded = true;

    }
  }

}
</script>

<style scoped>
.chart-area {
  border: 1px dashed gainsboro;
  background-color: beige;
}

</style>

