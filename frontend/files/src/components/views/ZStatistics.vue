<template>
  <v-container fluid text-xs-left pa-0>
    <v-layout row wrap>
      <h2>statistics page</h2>
    </v-layout>


    <v-layout fill-height justify-center>
      <v-flex xs3>
        <v-menu
          ref="menuBeginDate"
          v-model="menuBeginDate"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="start_date"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="200px"
        >
          <v-text-field
            slot="activator"
            v-model="start_date"
            label="조회 시작 일자"
            prepend-icon="event"
            readonly
            hint="please select a date to start the query"
            persistent-hint
          ></v-text-field>
          <v-date-picker
            v-model="start_date"
            :show-current="true"
            @input="$refs.menuBeginDate.save(start_date)"
          ></v-date-picker>
        </v-menu>
      </v-flex>
      <v-flex xs3>
        <v-menu
          ref="menuEndDate"
          v-model="menuEndDate"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="end_date"
          lazy
          transition="scale-transition"
          offset-y
          full-width
          min-width="200px"
        >
          <v-text-field
            slot="activator"
            v-model="end_date"
            label="조회 종료 일자"
            prepend-icon="event"
            readonly
            hint="Please select a last date for your search"
            persistent-hint
          ></v-text-field>
          <v-date-picker
            v-model="end_date"
            :show-current="true"
            @input="$refs.menuEndDate.save(end_date)"
          ></v-date-picker>
        </v-menu>
      </v-flex>

      <v-flex xs6>
        <v-select
          v-model="selectedCategory"
          :items="category"
          attach
          chips
          label="category"
          multiple
          hint="pick your favorite category"
          persistent-hint
        ></v-select>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs12>
        <v-btn small @click="fillChartData">load data</v-btn>
      </v-flex>
      <v-flex xs12 v-for="dd in zzchartdata" :key="dd.name">
        <line-chart
          v-if="selectedCategory.includes(dd.name)"
          class="chart-area ma-1"
          :height="180"
          :chartdata="dd.ds"
          :chartTitle="dd.title"
        ></line-chart>
      </v-flex>
      
    </v-layout>


    <v-layout row wrap>
      <v-flex xs12> 
        <v-btn small color="info" class="ma-0" @click="getStatisticsAttendance">
          출석 통계
        </v-btn>
        <v-btn small color="info" class="ma-0" @click="getStatisticsParagraph">
          암송 통계
        </v-btn>
        <v-btn small color="info" class="ma-0" @click="getStatisticsBible"> 
          성경 통계
        </v-btn>
      </v-flex>
          <!-- 부서 (유치부:0, 유초등부:1, 중고등부:2, 청년부:3) -->
                <v-flex xs4 pa-1 ma-0>
                  <v-select 
                    color="blue"
                    hide-details
                    dense
                    v-model="belong" 
                    :items="[0,1,2,3,4]"
                    attach 
                    label="부서"                    
                    persistent-hint > 
                    <template slot="item" slot-scope="props">
                      {{ descBelong[props.item] }}
                    </template>                
                    <template slot="selection" slot-scope="props">
                      {{ descBelong[props.item] }}
                    </template>
                  </v-select>
                </v-flex>

    </v-layout>

    <v-layout row wrap class="ma-2 elevation-5" text-xs-center>
      <v-flex xs4 class="pa-1">
        <span class="subheading blue--text"> 출석 통계 </span>
        <template v-for="(item, index) in statisticsAttendance">
          <v-layout row wrap :key="index" class="z-row">
            <v-flex xs3>
              {{ index == 0 ? "없음" : `${index}회` }}
            </v-flex>
            <v-flex xs9 text-xs-left>
              {{ item.join(', ') }}
            </v-flex>
          </v-layout>
        </template>
      </v-flex>

      <!-- 암송 통계  -->
      <v-flex xs4 class="pa-1">
        <span class="subheading blue--text"> 암송 통계 </span>
        <template v-for="(item, index) in statisticsParagraph">
          <v-layout row wrap :key="index" class="z-row">
            <v-flex xs3>
              {{ index == 0 ? "없음" : `${index}회` }}
            </v-flex>
            <v-flex xs9 text-xs-left>
              {{ item.join(', ') }}
            </v-flex>
          </v-layout>
        </template>
      </v-flex>

      <!-- 성경 통계  -->
      <v-flex xs4 class="pa-1">
        <span class="subheading blue--text"> 성경 통계 </span>
        <template v-for="(item, index) in statisticsBible" >
          <v-layout row wrap :key="index" class="z-row">
            <v-flex xs3>
              {{ index == 0 ? "읽지 않음" : `${index}장 읽음` }}
            </v-flex>
            <v-flex xs9 text-xs-left>
              {{ item.join(', ') }}
            </v-flex>
          </v-layout>
        </template>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ChartContainer from "./ChartContainer.vue";
import { en, ko } from "vuejs-datepicker/dist/locale";
import Datepicker from "vuejs-datepicker";
import LineChart from "./Chart.vue";
import apiService from "@/Services/ApiService";

export default {
  name: "Home",
  components: { ChartContainer, Datepicker, LineChart },
  data() {
    return {
      en: en,
      ko: ko,
      belong_items: [
        { text: "유치부", id: 0 },
        { text: "유초등부", id: 1 },
        { text: "중고등부", id: 2 },
        { text: "청년부", id: 3 },
        { text: "면려회", id: 4 }
      ],
      // start_date: '',
      // end_date: '',
      start_date: this.initDate()
        .toISOString()
        .substr(0, 10),
      end_date: new Date().toISOString().substr(0, 10),
      // start_date: this.initDate(),
      // end_date:new Date(),
      cbelong: 2,
      editedIndex: -1,
      editedItem: {
        id: "",
        title: "",
        day: "",
        place: "",
        belongs: 0
      },
      msg: "출결 보고 자료",

      loaded: false,

      category: ["유치부", "유초등부", "중고등부", "청년부", "면려회"],
      zzchartdata: [
        { name: "유치부", ds: null, title: "유치부 출결" },
        { name: "유초등부", ds: null, title: "유초등부 출결" },
        { name: "중고등부", ds: null, title: "중고등부 출결" },
        { name: "청년부", ds: null, title: "청년부 출결" },
        { name: "면려회", ds: null, title: "면려회 출결" }
      ],
      selectedCategory: ["중고등부", "청년부"],

      borderColors: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
        "rgba(75, 192, 192, 1)",
        "rgba(153, 102, 255, 1)",
        "rgba(255, 159, 64, 1)"
      ],
      bgColors: [
        "rgba(255, 99, 132, 0.1)",
        "rgba(54, 162, 235, 0.1)",
        "rgba(255, 206, 86, 0.1)",
        "rgba(75, 192, 192, 0.1)",
        "rgba(153, 102, 255, 0.1)",
        "rgba(255, 159, 64, 0.1)"
      ],
      menuBeginDate: false,
      menuEndDate: false, 



      statisticsAttendance: {},
      statisticsParagraph: {}, 
      statisticsBible: {},

      descBelong: ['유치부', '유초등부', '중고등부', '청년부', '면려회'],
      belong: 2,
      dsBelong: { name: "유치부", ds: null, title: "유치부 출결" },

    };
  },
  mounted() {
    this.fillChartData();
    this.getStatisticsAttendance();
    this.getStatisticsParagraph();
    this.getStatisticsBible();
  },
  methods: {

    getStatisticsAttendance() {
      console.log('request statistics-attendance');
      console.log(`  start_date:${this.start_date}  end_date:${this.end_date}`);
      apiService.reqStatisticsAttendance({
        date_from: this.start_date, 
        date_to: this.end_date, 
        belong: 2,
      })
      .then((res) => {
        console.log(res);
        this.statisticsAttendance = {};

        res.data.forEach(row => {
          if (this.statisticsAttendance[row.att] ){
            this.statisticsAttendance[row.att].push(row.name);
          } else {
            this.statisticsAttendance[row.att] = [row.name];
          }
        });
        console.log(this.statisticsAttendance);
      })
      .catch((err) => {
        console.log(err);
      })   
    },

    getStatisticsParagraph() {
      console.log('request statistics-paragraph');
      apiService.reqStatisticsParagraph({
        date_from: this.start_date, 
        date_to: this.end_date, 
        belong: 2,
      })
      .then((res) => {
        console.log(res);
        this.statisticsParagraph = {};

        res.data.forEach(row => {
          if (this.statisticsParagraph[row.att] ) {
            this.statisticsParagraph[row.att].push(row.name);
          } else {
            this.statisticsParagraph[row.att] = [row.name];
          }
        });
        console.log(this.statisticsParagraph);
      })
      .catch((err) => {
        console.log(err);
      })
    }, 

    getStatisticsBible() {
      console.log('request statistics-bible');
      apiService.reqStatisticsBible({
        date_from: this.start_date, 
        date_to: this.end_date, 
        belong: 2,
      })
      .then((res) => {
        console.log(res);
        this.statisticsBible = {};

        res.data.forEach(row => {
          if (this.statisticsBible[row.att]) {
            this.statisticsBible[row.att].push(row.name);
          } else {
            this.statisticsBible[row.att] = [row.name];
          }
        });
        console.log(this.statisticsBible);
      })
      .catch((err) => {
        console.log(err);
      })
    },

    initDate() {
      //    return new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      var s = new Date(new Date().setDate(1));
      s = s.setMonth(0);
      console.log(`---- initDate -----`);
      console.log(s);
      return new Date(s);
      //    console.log( this.start_date)
    },
    async changeBelong(selectObj) {
      console.log(selectObj.id);
      this.cbelong = selectObj.id;
    },
    onSelectedStart(selected) {
      this.start_date = selected;
    },
    onSelectedEnd(selected) {
      this.end_date = selected;
    },
    getDaysBetweenDates(start, end, dayName) {
      var result = [];
      var days = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
      var day = days[dayName.toLowerCase().substr(0, 3)];
      // Copy start date
      var current = new Date(start);
      // Shift to next of required days
      current.setDate(current.getDate() + ((day - current.getDay() + 7) % 7));
      // While less than end date, add dates to result array
      while (current < end) {
        result.push(new Date(+current));
        current.setDate(current.getDate() + 7);
      }
      return result;
    },
    async fillChartData() {
      let vm = this;
      vm.loaded = false;
      console.log(`fill chart data. period:${vm.start_date}~${vm.end_date}`);

      // start_date ~ end_date 동안의 모든 일요일에 대한 좌표 만들기
      // Get Wednesdays between 15 December, 2016 and 25 February, 2017.
      const alldate = vm.getDaysBetweenDates(
        new Date(vm.start_date),
        new Date(vm.end_date),
        "Sun"
      );
      vm.zzchartdata = [];
      for (let index = 0; index < vm.category.length; index += 1) {
        // console.log(`통계 데이터 요청. ${vm.category[index].text} index:${index}`);
        let res = await apiService.fetchGraph(
          index,
          vm.start_date,
          vm.end_date
        );

        // console.log(`received from backend. index: ${index}`);
        // console.log(res.data);

        const dateLabels = [];
        const totals = [];
        const mornings = [];
        const noons = [];

        alldate.forEach((dd, index) => {
          var tempMonth = dd.getMonth() + 1;
          var tempDate = dd.getDate();
          if (tempMonth < 10) tempMonth = "0" + tempMonth;
          if (tempDate < 10) tempDate = "0" + tempDate;

          let target_date = `${dd.getFullYear()}-${tempMonth}-${tempDate}`;
          let found = false;
          res.data.forEach(item => {
            // console.log(`compare two date ${target_date}   and ${item.day}`);
            if (target_date === item.day) {
              // console.log(`found day: ${item.day}`);
              dateLabels.push(item.day);
              totals.push(item.totalmember);
              mornings.push(item.totalmorning);
              noons.push(item.totalnoon);
              found = true;
              return;
            }
          });
          if (found == false) {
            // console.log(` target_date: ${target_date} data is not exist`);
            dateLabels.push(target_date);
            totals.push(0);
            mornings.push(0);
            noons.push(0);
          }
        });

        const mychartdata = {
          name: vm.category[index],
          title: vm.category[index],
          ds: {
            labels: dateLabels,
            datasets: [
              {
                label: `정원`,
                data: totals,
                borderWidth: 1,
                pointRadius: 3,
                borderColor: vm.borderColors[0],
                backgroundColor: vm.bgColors[0]
              },
              {
                label: `오전출석`,
                data: mornings,
                borderWidth: 1,
                pointRadius: 3,
                borderColor: vm.borderColors[4],
                backgroundColor: vm.bgColors[4]
              },
              {
                label: `오후출석`,
                data: noons,
                borderWidth: 1,
                pointRadius: 3,
                borderColor: vm.borderColors[1],
                backgroundColor: vm.bgColors[1]
              }
            ]
          }
        };
        vm.zzchartdata.push(mychartdata);
      }

      vm.loaded = true;
    }
  }
};
</script>

<style scoped>
.chart-area {
  border: 1px dashed gainsboro;
  background-color: beige;
}


.z-row {
  border: 1px dashed gainsboro;
}

</style>

