<template>
  <v-row>
    <v-col>
      <v-sheet height="600">
        <v-calendar
        locale="ko"
          ref="calendar"
          :value="start_day"
          :events="schedules"
          color="primary"
          :type="cal_type"
          @mouseenter:event="mouseOnEvent=true"
          @mouseleave:event="mouseOnEvent=false"
          @click:event ="editEvent"

          @mousedown:time="timeMouseDown"
          @mousemove:time="timeMouseMove"
          @mouseup:time="timeMouseUp($event)"

          :event-color="getEventColor"
          >
 
        </v-calendar>
        <v-dialog
        persistent
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
              <v-toolbar-title v-html="editedItem.name"></v-toolbar-title>
              <div class="flex-grow-1"></div>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

               <v-menu>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn icon
                      v-on="on"
                    >
                    <v-icon>mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item >
                      <v-list-item-title>이동</v-list-item-title>
                    </v-list-item>
                    <v-list-item >
                      <v-list-item-title>첨부</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="removeEvent">
                      <v-list-item-title>삭제</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
            </v-toolbar>
            <v-card-text>
              <span v-html="editedItem.start"></span>
            <br>
              <span v-html="editedItem.end"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="cancelEvent"
              >
                취소
              </v-btn>
               <v-btn
                text
                color="pramary"
                @click="saveEvent"
              >
                저장
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
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

    },
 data(){
   return{
     mouseOnEvent:false,
    schedules: [],
    // eIndex: 0,
    color: ["#3F51B5", "#4CAF50", "#2196F3", "#1976d2", "#4CAF50"],
    isEdit : false,
    editedItem: {
        id: -1,
        eid: -1,
        mid: -1,
        belongs: -1,
        name: "",
        start:"",// new Date().toISOString().slice(0,10),
        end: "",//new Date().toISOString().slice(0,10),
        // time: "09:00",
        // duration: 90,
        // color: "aaaaaa",
        // link:"www.google.com"
         resetContent: function (){
           this.start = "";
           this.end = "";
           this.name = ""; 
        },
      },
      selectedElement: null,
      selectedOpen: false,
      isMouseDown : false,
      currentEvent : null
   }
  },
  mounted() {
    console.log('Schedule detail loaded')
    this.$refs.calendar.checkChange()
    this.$refs.calendar.scrollToTime('08:00')
  },
  methods: {

    getEventColor (event) {
        return this.color[event.belongs]
        // return event.color
      },
    viewDay ({ date }) {
        this.focus = date
      },
    timeMouseUp( {hour, minute,date, year}){
      if(this.isMouseDown == false ) return
      minute = Math.round(minute/10)*10
      if(minute==60){
        minute = 0;
        hour++;
      }
      console.log("timeMouseUp : " + date+" "+hour+":"+minute)
      this.editedItem.end = date+" "+hour+":"+minute;
      this.isMouseDown = false;
      this.showEvent(  this.editedItem )

    },
    timeMouseMove({hour, minute, date, year}){
      if(this.isMouseDown == false  ) return;
      // console.log("timeMouseMove time : " + date+" "+time)
      this.editedItem.end = date+" "+hour+":"+minute

    },
    timeMouseDown({ date, year, hour, minute}){
      if(!this.currentEvent ) return
      if(this.mouseOnEvent) return
      minute = Math.round(minute/10)*10
      if(minute==60){
        minute = 0;
        hour++;
      }
      console.log("dayMouseDown time : " + date+" "+hour+":"+minute)
      var temp = JSON.parse(JSON.stringify(this.editedItem));
      this.editedItem = Object.assign( temp, { eid:this.currentEvent.eid, 
                                                      belongs:this.currentEvent.belongs,  
                                                      start:date+" "+hour+":"+minute, 
                                                      end: date+" "+hour+":"+minute,  
                                                      name:"새 일정", 
                                                      color:"pink" }) 
      this.editedItem = JSON.parse(JSON.stringify(temp));
      this.schedules.push( this.editedItem )
      this.isMouseDown = true;
    },
    async getSchedules( items, current ) {
      // console.log(this.start_day+" ~ "+this.end_day+" : "+current.eid)
      console.log(items)
      this.loading = true;
      await apiService.fetchScheduleForEvent({eid:current.eid})
      .then(res =>{
        console.log(res.data);
        this.currentEvent = Object.assign( current );
        // console.log(this.currentEvent)
        this.schedules = items.concat(res.data)

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
      this.currentEvent = null;
      this.editedItem = {
        eid: -1,
        mid: -1,
        belongs: -1,
        name: "",
        start: new Date().toISOString().slice(0,10),
        end: new Date().toISOString().slice(0,10),
        // time: "09:00",
        // duration: 90,
        color: "",
        link:""
      };
    },
    // open (event) {
    //     alert(event.title)
    //   },

      showEvent ( e ) {
        console.log("showEvent");
        const open = () => {
          this. isEdit = false;
          this.editedItem = e
          this.selectedElement = event != undefined ? event.target : this.$refs.calendar //nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

      },
      editEvent({ nativeEvent, event }){
        console.log("editEvent");
        const open = () => {
          this. isEdit = true;
          this.editedItem = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }
      },
      cancelEvent(){
          this.selectedOpen = false
            if(!this.isEdit){ // newItem
              var index = this.schedules.indexOf(this.editedItem);
              this.schedules.splice(index, 1);
              
            }
            // this.editedItem.resetContent
      },
      
      async saveEvent(){
        this.selectedOpen = false
        if(!this.isEdit){  // newItem
        await apiService.addSchedule( Object.assign(this.editedItem,{color:this.color[this.currentEvent.belongs] }))
          .then(res => {
            this.editedItem.resetContent
          }).catch(err =>{
            console.log(err);
          });

        }else{
          await apiService.updateSchedule( this.editedItem )
          .then(res => {
              this.editedItem.resetContent
          }).catch(err =>{
            console.log(err);
          });
        }
      },
      removeEvent(){
         console.log("removeEvent "+this.editedItem.id);
          this.selectedOpen = false
          apiService.deleteSchedule(this.editedItem.id).then(
            res =>{
              this.editedItem.resetContent
                var index = this.schedules.indexOf(this.editedItem);
                this.schedules.splice(index, 1);
            }
          ).catch(e=>{
               console.log(e)
          })
      },

  }
};
</script>
