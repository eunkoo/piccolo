<template>
  <v-layout wrap>
    <v-flex xs12 class="mb-3">
<!-- 
     <td sm4 xs4 class="text-sm-left text-xs-center">
      <v-btn fab small @click="$refs.calendar.prev()">
        <v-icon  large dark >chevron_left</v-icon>
      </v-btn>
    </td>

    <td sm4 xs4 class="text-xs-center">
      <h2> {{start_day}}  </h2>
    </td>

    <td sm4 xs4 class="text-sm-right text-xs-center">
      <v-btn fab small @click="$refs.calendar.next()">
        <v-icon large dark>chevron_right</v-icon>
      </v-btn>
    </td> -->
    
      

      <v-sheet height="500">
        <v-calendar ref="calendar" v-model="start_day" :type="cal_type" :end="end_day" color="primary">
            <template v-slot:dayBody="{ date, timeToY, minutesToPixels }">
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
    </v-flex>


  </v-layout>
</template>

<script>
import apiService from "@/Services/ApiService";
import Vue from "vue";

export default {
  name: "eventdayspan",
  props : {start_day:String , end_day : String , cal_type:String, eid:Number},
  computed: {
      // convert the list of events into a map of lists keyed by date
      eventsMap () {
        const map = {}
        this.schedules.forEach(e => (map[e.date] = map[e.date] || []).push(e))
        return map
      }
    },
  data: () => ({
    readOnly: false,
    schedules: [],
    // eIndex: 0,
    color: ["#3F51B5", "#4CAF50", "#2196F3", "#1976d2", "#4CAF50"],
    editedItem: {
        id: "",
        eid: "",
        mid: "",
        title: "",
        date: new Date().toISOString().slice(0,10),
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
  }),
  mounted() {
    console.log('day span loaded')
    console.log(this.start_day)
    console.log(this.end_day)
  },
  methods: {
    async getSchedules(eid) {
      this.loading = true;
      const response = await apiService.fetchSchedule(eid);
      this.schedules = response.data;
 
      this.loading = false;
    },
    //  async getevents () {
    //     const response = await apiService.fetchEvents()
    //     this.events = response.data

    // },
  }
};
</script>

<style>
body,
html,
#app,
#dayspan {
  font-family: Roboto, sans-serif !important;
  width: 100%;
  height: 100%;
}
.v-btn--flat,
.v-text-field--solo .v-input__slot {
  background-color: #f5f5f5 !important;
  margin-bottom: 8px !important;
}
</style>