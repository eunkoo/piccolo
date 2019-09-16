<template>
  <v-row>
    <v-col>
      <v-sheet height="400">
        <v-calendar
          ref="calendar"
          :value="start_day"
          v-model="start_day"
          :events="schedules"
          color="primary"
          :type="cal_type"
          :event-margin-bottom="3"

        >
          <!-- the events at the top (all-day) -->
          <template v-slot:day-header="{ date }">
            <template v-for="e in eventsMap[date]">
              <!-- all day events don't have time -->
              <div
                v-if="!e.time"
                :key="e.title"
                class="my-event "
                 :style="{ backgroundColor: e.color, borderColor:e.color}"
                @click="showEvent($event, e)"
                v-html="e.title"
              ></div>
            </template>
          </template>
          <!-- the events at the bottom (timed) -->
          <template v-slot:day-body="{ date, timeToY, minutesToPixels }">
            <template v-for="e in eventsMap[date]">
              <!-- timed events -->
              <div
                v-if="e.time"
                :key="e.title"
                :style="{ top: timeToY(e.time) + 'px', height: minutesToPixels(e.duration) + 'px' }"
                class="my-event with-time"
                @click="showEvent($event, e)"
                v-html="e.title"
              ></div>
            </template>
          </template>
        </v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          
          max-width="450"
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="editedItem.color"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-toolbar-title v-html="editedItem.title"></v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="editedItem.title"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>


<script>
const apiService = require( "@/Services/ApiService");
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
      selectedElement: null,
      selectedOpen: false,

    // type: "day",
    // start: start_day,
    // end: end_day,
    // typeOptions: [
    //   { text: "Day", value: "day" },
    //   { text: "4 Day", value: "4day" },
    //   { text: "Week", value: "week" },
    //   { text: "Month", value: "month" },
    //   { text: "Custom Daily", value: "custom-daily" },
    //   { text: "Custom Weekly", value: "custom-weekly" }
    // ]
   }
  },
  mounted() {
    console.log('day span loaded')
    this.$refs.calendar.checkChange()
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
    clearData(){
      this.schedules = [];
      this.editedItem = {
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
      };
    },
    // open (event) {
    //     alert(event.title)
    //   },
    async addSchedule(sch){
      console.log(sch);
      await apiService.addSchedule( Object.assign(sch,{color:this.color[sch.belongs] }))
      .then(res => {
          // console.log(res.data);
          this.schedules.push( sch )
      }).catch(err =>{
        console.log(err);
      });
    },

      getEventColor (event) {
        // return  'style=background-color: {{event.color}}'
        
      },

      showEvent (event, e) {
        const open = () => {
          this.editedItem = e
          this.selectedElement = event.target //nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        // nativeEvent.stopPropagation()
      },
      // updateRange ({ start, end }) {
      //   // You could load events from an outside source (like database) now that we have the start and end dates on the calendar
      //   this.start_day = start
      //   this.end_day = end
      // },
  }
};
</script>
