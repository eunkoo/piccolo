<template>
 <v-sheet height="400">
    <v-calendar
      ref="calendar"
      :now="start_day"
      :value="start_day"
      :events="eventsMap"
      color="primary"
      type="week"
    >
      <!-- the events at the top (all-day) -->
      <template slot="dayHeader" slot-scope="{ date }">
        <template v-for="event in eventsMap[date]">
          <div
            v-if="!event.time"
            :key="event.title"
            class="my-event"
            @click="open(event)"
            v-html="event.title"
          ></div>
        </template>
      </template>

      <!-- the events at the bottom (timed) -->
      <template slot="dayBody" slot-scope="{ date, timeToY, minutesToPixels }">
        <template v-for="event in eventsMap[date]">
          <!-- timed events -->
          <div
            v-if="event.time"
            :key="event.title"
            :style="{ top: timeToY(event.time) + 'px', height: minutesToPixels(event.duration) + 'px' }"
            class="my-event with-time"
            @click="open(event)"
            v-html="event.title"
          ></div>
        </template>
      </template>
    </v-calendar>
  </v-sheet>
</template>


<script>
const apiService = require( "@/Services/ApiService");
// const Vue = require( "vue");
require('../../assets/css/eventdayspan.css').default

module.exports = {
  name: "eventdayspan",
  props : {start_day:String , end_day : String , cal_type:String},
  computed: {
      // convert the list of events into a map of lists keyed by date
      eventsMap () {
        const map = {}
        this.schedules.forEach(e => {
          (map[e.start] = map[e.start] || [])
             .push(e)
          })
        console.log(map)
        return map
      },
    },
 data(){
   return{
      // schedules: [
      //   {
      //     title: 'Weekly Meeting',
      //     start: '2019-08-27',
      //     end: '2019-08-28',
      //     color: 'blue',
      //     time : '09:00',
      //     duration: 145
      //   },
      //   {
      //     title: 'Thomas\' Birthday',
      //     start: '2019-08-25',
      //     end: '2019-08-26',
      //     color: 'blue',
      //   },
      //   {
      //     title: 'Mash Potatoes',
      //     start: '2019-08-30',
      //     end: '2019-08-31',
      //     color: 'blue',
      //     // duration: 180
      //   }
      // ],
     
    schedules: [],
    // eIndex: 0,
    color: ["#3F51B5", "#4CAF50", "#2196F3", "#1976d2", "#4CAF50"],
    editedItem: {
        id: -1,
        eid: -1,
        mid: -1,
        belongs: -1,
        title: "",
        start: new Date().toISOString().slice(0,10),
        end: new Date().toISOString().slice(0,10),
        time: "09:00",
        duration: 90,
        color: "aaaaaa",
        link:"www.google.com"
      },

    // type: "day",
    // start: start_day,
    // end: end_day,
    typeOptions: [
      { text: "Day", value: "day" },
      { text: "4 Day", value: "4day" },
      { text: "Week", value: "week" },
      { text: "Month", value: "month" },
      { text: "Custom Daily", value: "custom-daily" },
      { text: "Custom Weekly", value: "custom-weekly" }
    ]
   }
  },
  mounted() {
    console.log('day span loaded')
    this.$refs.calendar.scrollToTime('08:00')
  },
  methods: {
   
    async getSchedules(sch) {
      console.log(this.start_day+" ~ "+this.end_day+" : "+sch.eid)
      this.loading = true;
      await apiService.fetchScheduleForEvent({eid:sch.eid})
      .then(res =>{
        console.log(res.data);
        if(!res.data || res.data.length==0){
          this.addSchedule(sch)
        }else{
          this.schedules = res.data;
        }
      })
      .catch(err =>{
        console.log(err);
      });
      
      console.log(this.schedules)
      this.loading = false;
      return this.schedules
    },
    open (event) {
        alert(event.title)
      },
    async addSchedule(sch){
      await apiService.addSchedule( Object.assign(sch,{color:this.color[sch.belongs] }))
      .then(res => {
          console.log(res.data);
          this.schedules.push( res.data )
      }).catch(err =>{
        console.log(err);
      });
    }
  }
};
</script>
