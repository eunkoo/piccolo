<template>
  <v-container fluid text-xs-left pa-3>

    <v-row fluid>
      <v-col cols="3">
              
        <v-menu
          ref="menuBeginDate"
          v-model="menuBeginDate"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="start_date"
          transition="scale-transition"
          offset-y
          full-width
          min-width="200px"
        >
         <template v-slot:activator="{ on }">
            <v-text-field
             v-on="on"
            v-model="start_date"
            label="조회 시작 일자"
            prepend-icon="event"
            readonly
            hint="please select a date to start the query"
            persistent-hint
          ></v-text-field>
         </template>
          <v-date-picker
            locale="ko-kr"
            no-title
            class="mydatepicker"
            v-model="start_date"
            :show-current="true"
            @input="$refs.menuBeginDate.save(start_date)"
          ></v-date-picker>
         
        </v-menu>
      </v-col>

      <v-col cols="3">
        <v-menu
          ref="menuEndDate"
          v-model="menuEndDate"
          :close-on-content-click="false"
          :nudge-right="40"
          :return-value.sync="end_date"
          transition="scale-transition"
          offset-y
          full-width
          min-width="200px"
        >
        <template v-slot:activator="{ on }">
          <v-text-field
            v-on="on"
            v-model="end_date"
            label="조회 종료 일자"
            prepend-icon="event"
            readonly
            hint="Please select a last date for your search"
            persistent-hint
          ></v-text-field>
          </template>
          <v-date-picker
            locale="ko-kr"
            no-title
            class="mydatepicker"
            v-model="end_date"
            :show-current="true"
            @input="$refs.menuEndDate.save(end_date)"
          ></v-date-picker>
        </v-menu>
      </v-col>
    </v-row>

    <v-row >
      <h2>출결 그래프</h2>
    </v-row>

    <v-row >
      <v-col cols="6">
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
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn small @click="fillChartData"> 데이터 불러오기 </v-btn>
      </v-col>

      <v-col cols="12" 
        v-for="dd in zzchartdata" 
        :key="dd.name" 
        class="pa-0">

        <line-chart
          v-if="selectedCategory.includes(dd.name)"
          class="chart-area ma-1"
          :height="180"
          :chartdata="dd.ds"
          :chartTitle="dd.title"
        ></line-chart>
      </v-col>
    </v-row>


    <v-row>
      <v-col cols="12">
        <h2>통계 차트</h2>
      </v-col>
      <v-col cols="12">
        <v-row xs4 pa-1 ma-0>
          <v-select
            color="blue"
            hide-details
            dense
            v-model="cbelong"
            :items="[0,1,2,3,4]"
            attach
            label="부서"
            persistent-hint
            @change="changeBelong"
          >
            <template slot="item" slot-scope="props">{{ descBelong[props.item] }}</template>
            <template slot="selection" slot-scope="props">{{ descBelong[props.item] }}</template>
          </v-select>
        </v-row>
      </v-col>
    </v-row>
    <v-row >
      <v-col cols="12">
        <v-btn small @click="fetchStatisticData">load data</v-btn>
      </v-col>
    </v-row>

    <v-row no-gutters class='ma-0 pa-0'>
      <v-col cols="3" class="pa-1">
        <span class="subheading blue--text"> 오전 출석 통계 </span>
        <v-simple-table dense class="elevation-3">
          <thead>
            <tr> 
              <th> 누적 </th>
              <th> 이름 </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in statisticsMornigns" :key="index">
              <td class="caption px-1"> {{ `${index}\/${no_date}` }} </td>
              <td class="caption"> {{ item.join(', ') }} </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>

      <v-col cols="3" class="pa-1">
        <span class="subheading blue--text"> 오후 출석 통계 </span>
        <v-simple-table dense class="elevation-3">
          <thead>
            <tr>
              <th> 누적 </th>
              <th> 이름 </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in statisticsNoons" :key="index">
              <td class="caption px-1"> {{ `${index}\/${no_date}` }} </td>
              <td class="caption"> {{ item.join(', ') }} </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>

      <v-col cols="3" class="pa-1">
        <span class="subheading blue--text"> 암송 통계 </span> 
        <v-simple-table dense class="elevation-3">
          <thead>
            <tr>
              <th> 누적 </th>
              <th> 이름 </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in statisticsParagraph" :key="index">
              <td class="caption px-1"> {{ index == 0 ? "없음" : `${index}회` }} </td>
              <td class="caption"> {{ item.join(', ') }} </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>

      <v-col cols="3" class="pa-1">
        <span class="subheading blue--text"> 성경 통계 </span>
        <v-simple-table dense class="elevation-3">
          <thead>
            <tr>
              <th> 누적 </th>
              <th> 이름 </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in statisticsBible" :key="index">
              <td class="caption px-1"> {{ index == 0 ? "읽지 않음" : `${index}장 읽음` }} </td>
              <td class="caption"> {{ item.join(', ') }} </td>
            </tr>
          </tbody>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const ChartContainer = require( "./ChartContainer.vue").default;
// const { en, ko } = require( "vuejs-datepicker/dist/locale").default;
import {en, ko} from 'vuejs-datepicker/dist/locale'
const Datepicker = require( "vuejs-datepicker").default;
const LineChart = require( "./Chart.vue").default;
const apiService = require( "@/Services/ApiService");
require(  '../../assets/css/zstatistics.css') .default

module.exports= {
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
      no_date: 0,
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
      selectedCategory: ["중고등부", "유치부"],

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

      statisticsMornigns: {},
      statisticsNoons: {},
      statisticsParagraph: {},
      statisticsBible: {},

      descBelong: ["유치부", "유초등부", "중고등부", "청년부", "면려회"],
      // belong: 2,
      dsBelong: { name: "유치부", ds: null, title: "유치부 출결" }
    };
  },
  mounted() {
    this.fillChartData();
    this.getStatisticsAttendance();
    this.getStatisticsParagraph();
    this.getStatisticsBible();
  },
  methods: {
    // week_no(dt) {
    //   var tdt = new Date(dt.valueOf());
    //   var dayn = (dt.getDay() + 6) % 7;
    //   tdt.setDate(tdt.getDate() - dayn + 3);
    //   var firstThursday = tdt.valueOf();
    //   tdt.setMonth(0, 1);
    //   if (tdt.getDay() !== 4) {
    //     tdt.setMonth(0, 1 + ((4 - tdt.getDay() + 7) % 7));
    //   }
    //   return 1 + Math.ceil((firstThursday - tdt) / 604800000);
    // },

    getStatisticsAttendance() {
      console.log("request statistics-attendance");
      console.log(`  start_date:${this.start_date}  end_date:${this.end_date}`);
      apiService
        .reqStatisticsAttendance({
          date_from: this.start_date,
          date_to: this.end_date,
          belong: this.cbelong
        })
        .then(res => {
          // console.log(res);
          this.statisticsMornigns = {};
          this.statisticsNoons = {};
          res.data.forEach(row => {
            if(row.mornings!=null ){
                if ( this.statisticsMornigns[row.mornings]) {
                  this.statisticsMornigns[row.mornings].push(row.name);
                } else {
                  this.statisticsMornigns[row.mornings] = [row.name];
                }
            }
            if(row.noons != null){
                 if (row.noons!=null && this.statisticsNoons[row.noons]) {
                  this.statisticsNoons[row.noons].push(row.name);
                } else {
                  this.statisticsNoons[row.noons] = [row.name];
                }
            }
          });

          // console.log(this.statisticsMornigns);
          // console.log(this.statisticsNoons);
        })
        .catch(err => {
          console.log(err);
        });
    },

    getStatisticsParagraph() {
      console.log("request statistics-paragraph");
      apiService
        .reqStatisticsParagraph({
          date_from: this.start_date,
          date_to: this.end_date,
          belong: this.cbelong
        })
        .then(res => {
          // console.log(res);
          this.statisticsParagraph = {};

          res.data.forEach(row => {
            if (this.statisticsParagraph[row.att]) {
              this.statisticsParagraph[row.att].push(row.name);
            } else {
              this.statisticsParagraph[row.att] = [row.name];
            }
          });
          // console.log(this.statisticsParagraph);
        })
        .catch(err => {
          console.log(err);
        });
    },

    getStatisticsBible() {
      console.log("request statistics-bible");
      apiService
        .reqStatisticsBible({
          date_from: this.start_date,
          date_to: this.end_date,
          belong: this.cbelong
        })
        .then(res => {
          // console.log(res);
          this.statisticsBible = {};

          res.data.forEach(row => {
            if (this.statisticsBible[row.att]) {
              this.statisticsBible[row.att].push(row.name);
            } else {
              this.statisticsBible[row.att] = [row.name];
            }
          });
          // console.log(this.statisticsBible);
        })
        .catch(err => {
          console.log(err);
        });
    },

    initDate() {
      //    return new Date(new Date().setFullYear(new Date().getFullYear() - 1))
      var s = new Date(new Date().setDate(1));
      s = s.setMonth(0);
      // console.log(`---- initDate -----`);
      // console.log(s);
      return new Date(s);
      //    console.log( this.start_date)
    },
    async fetchStatisticData(){
        const alldate = this.getDaysBetweenDates(
        new Date(this.start_date),
        new Date(this.end_date),
        "Sun"
      );
      this.no_date = alldate.length+1;
      this.getStatisticsAttendance();
      this.getStatisticsParagraph();
      this.getStatisticsBible();
    },
    async changeBelong(selectObj) {
      console.log(selectObj.id);
      this.getStatisticsAttendance();
      this.getStatisticsParagraph();
      this.getStatisticsBible();
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
      // console.log(`fill chart data. period:${vm.start_date}~${vm.end_date}`);

      // start_date ~ end_date 동안의 모든 일요일에 대한 좌표 만들기
      // Get Wednesdays between 15 December, 2016 and 25 February, 2017.
      const alldate = vm.getDaysBetweenDates(
        new Date(vm.start_date),
        new Date(vm.end_date),
        "Sun"
      );
      this.no_date = alldate.length+1;
      vm.zzchartdata = [];
      for (let index = 0; index < vm.category.length; index += 1) {
        // console.log(`통계 데이터 요청. ${vm.category[index].text} index:${index}`);
        let res = await apiService.fetchGraph(
          { belongs:index,
          start:vm.start_date,
          end:vm.end_date}
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
.zguide {
  border: 1px dashed dodgerblue;  
}
</style>

